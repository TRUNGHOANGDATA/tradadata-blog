import { NextResponse } from 'next/server';
import type { SanPhamNhung } from '@/types';
import { loiThanhChu } from '@/lib/errors';
import { auth } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/server';

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!supabaseAdmin) {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const fromDate = searchParams.get('from');
        const toDate = searchParams.get('to');

        // Fetch all paid + pending orders
        const { data: orders, error } = await supabaseAdmin
            .from('orders')
            .select('id, amount, original_amount, coupon_code, status, paid_at, created_at, product_id, full_name, email, order_code, products(name)');

        if (error) throw error;

        let totalRevenue = 0;
        let monthlyRevenue = 0;
        let periodRevenue = 0;
        let pendingOrders = 0;
        let totalDiscount = 0;
        let couponsUsedCount = 0;
        const couponMap: Record<string, { code: string; count: number; discount: number }> = {};
        const dailyMap: Record<string, { revenue: number; orders: number }> = {};
        const productMap: Record<string, { name: string; revenue: number; count: number }> = {};
        const recentPaid: {
            order_code: string;
            full_name: string | null;
            email: string;
            amount: number;
            paid_at: string | null;
            product_name: string;
            coupon_code: string | null;
        }[] = [];

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

        // Build last 30 days skeleton
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().slice(0, 10);
            dailyMap[key] = { revenue: 0, orders: 0 };
        }

        orders.forEach(order => {
            if (order.status === 'pending') {
                pendingOrders++;
            } else if (order.status === 'paid' && order.paid_at) {
                totalRevenue += order.amount;

                if (order.paid_at >= startOfMonth) {
                    monthlyRevenue += order.amount;
                }

                if (fromDate && toDate) {
                    const orderDate = new Date(order.paid_at).toISOString();
                    const toDateObj = new Date(toDate);
                    toDateObj.setHours(23, 59, 59, 999);
                    if (orderDate >= new Date(fromDate).toISOString() && orderDate <= toDateObj.toISOString()) {
                        periodRevenue += order.amount;
                    }
                }

                // Daily chart data
                const dayKey = new Date(order.paid_at).toISOString().slice(0, 10);
                if (dailyMap[dayKey]) {
                    dailyMap[dayKey].revenue += order.amount;
                    dailyMap[dayKey].orders += 1;
                }

                // Product breakdown
                const pName = (order.products as SanPhamNhung)?.name || 'Không rõ';
                if (!productMap[pName]) productMap[pName] = { name: pName, revenue: 0, count: 0 };
                productMap[pName].revenue += order.amount;
                productMap[pName].count += 1;

                // Coupon impact
                if (order.coupon_code && order.original_amount) {
                    const discount = order.original_amount - order.amount;
                    if (discount > 0) {
                        totalDiscount += discount;
                        couponsUsedCount++;
                        if (!couponMap[order.coupon_code]) {
                            couponMap[order.coupon_code] = { code: order.coupon_code, count: 0, discount: 0 };
                        }
                        couponMap[order.coupon_code].count += 1;
                        couponMap[order.coupon_code].discount += discount;
                    }
                }

                // Recent paid orders (collect all, sort later)
                recentPaid.push({
                    order_code: order.order_code,
                    full_name: order.full_name,
                    email: order.email,
                    amount: order.amount,
                    paid_at: order.paid_at,
                    product_name: (order.products as SanPhamNhung)?.name || '',
                    coupon_code: order.coupon_code,
                });
            }
        });

        // Sort recent paid orders and take top 10
        // paid_at co the null (don chua duyet lot vao) -> coi nhu cu nhat, day xuong duoi
        const moc = (v: string | null) => (v ? new Date(v).getTime() : 0);
        recentPaid.sort((a, b) => moc(b.paid_at) - moc(a.paid_at));
        const recentOrders = recentPaid.slice(0, 10);

        // Convert daily map to array
        const dailyRevenue = Object.entries(dailyMap).map(([date, data]) => ({
            date,
            revenue: data.revenue,
            orders: data.orders,
        }));

        // Convert product map to sorted array
        const productBreakdown = Object.values(productMap).sort((a, b) => b.revenue - a.revenue);

        // Top coupons
        const topCoupons = Object.values(couponMap).sort((a, b) => b.count - a.count).slice(0, 5);

        return NextResponse.json({
            stats: {
                totalRevenue,
                monthlyRevenue,
                periodRevenue: (fromDate && toDate) ? periodRevenue : undefined,
                pendingOrders,
            },
            dailyRevenue,
            productBreakdown,
            couponImpact: {
                totalDiscount,
                usedCount: couponsUsedCount,
                topCoupons,
            },
            recentOrders,
        });
    } catch (error) {
        console.error('Error fetching revenue:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
