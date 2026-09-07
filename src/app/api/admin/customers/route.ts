import { NextResponse } from 'next/server';
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

        // Fetch orders
        const { data: orders, error: ordersError } = await supabaseAdmin
            .from('orders')
            .select('email, full_name, phone, amount, status, created_at')
            .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        // Fetch all profiles (includes manually created accounts)
        const { data: profiles, error: profilesError } = await supabaseAdmin
            .from('profiles')
            .select('email, full_name, phone, created_at, is_subscribed')
            .order('created_at', { ascending: false });

        if (profilesError) throw profilesError;

        // Build customers map — start with profiles
        // Khai kieu that thay vi `any`: truoc day `customer.total_orders += 1` khong
        // duoc kiem gi ca, va `customersMap.get()` tra ve co the undefined cung bi bo qua.
        type BanGhiKhach = {
            email: string;
            full_name: string;
            phone: string;
            total_orders: number;
            total_spent: number;
            last_order_at: string | null;
            is_subscribed: boolean;
            created_at: string | null;
        };
        const customersMap = new Map<string, BanGhiKhach>();

        // Add profiles first (so manually added users appear)
        (profiles || []).forEach(profile => {
            if (!profile.email) return;
            const email = profile.email.toLowerCase();
            customersMap.set(email, {
                email,
                full_name: profile.full_name || '',
                phone: profile.phone || '',
                total_orders: 0,
                total_spent: 0,
                last_order_at: null,
                is_subscribed: profile.is_subscribed || false,
                created_at: profile.created_at,
            });
        });

        // Merge order data on top
        (orders || []).forEach(order => {
            const email = order.email.toLowerCase();
            if (!customersMap.has(email)) {
                customersMap.set(email, {
                    email,
                    full_name: order.full_name,
                    phone: order.phone,
                    total_orders: 0,
                    total_spent: 0,
                    last_order_at: order.created_at,
                    is_subscribed: false,
                    created_at: order.created_at,
                });
            }

            const customer = customersMap.get(email);
            // Ngay tren vua `set` neu chua co, nen den day chac chan ton tai —
            // nhung van phai chan de TypeScript khong phai doan.
            if (!customer) return;
            customer.total_orders += 1;

            // Update name/phone from order if profile didn't have it
            if (!customer.full_name && order.full_name) {
                customer.full_name = order.full_name;
            }
            if (!customer.phone && order.phone) {
                customer.phone = order.phone;
            }

            // Set last_order_at (orders are sorted desc, first = newest)
            if (!customer.last_order_at) {
                customer.last_order_at = order.created_at;
            }

            // Only count paid orders for total spent
            if (order.status === 'paid') {
                customer.total_spent += order.amount;
            }
        });

        const customers = Array.from(customersMap.values());

        return NextResponse.json({ customers });
    } catch (error) {
        console.error('Error fetching customers:', error);
        return NextResponse.json({ error: loiThanhChu(error) }, { status: 500 });
    }
}
