import { Sk, SkPostGrid } from '@/components/ui/Skeleton';

// Skeleton cho trang chu. Khop khung: hero -> o thong ke -> luoi bai viet.
export default function Loading() {
    return (
        <div className="min-h-screen bg-page">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
                <Sk className="h-7 w-56 mx-auto mb-6 rounded-full" />
                <Sk className="h-11 w-full max-w-2xl mx-auto mb-3" />
                <Sk className="h-11 w-3/5 max-w-lg mx-auto mb-6" />
                <Sk className="h-5 w-full max-w-xl mx-auto mb-2" />
                <Sk className="h-5 w-2/3 max-w-md mx-auto mb-8" />
                <div className="flex justify-center gap-3 mb-12">
                    <Sk className="h-11 w-44 rounded-xl" />
                    <Sk className="h-11 w-32 rounded-xl" />
                </div>
                <div className="flex justify-center gap-12">
                    <div>
                        <Sk className="h-8 w-16 mx-auto mb-2" />
                        <Sk className="h-3 w-14 mx-auto" />
                    </div>
                    <div>
                        <Sk className="h-8 w-16 mx-auto mb-2" />
                        <Sk className="h-3 w-14 mx-auto" />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <Sk className="aspect-[16/7] w-full rounded-2xl mb-16" />
                <div className="flex items-center justify-between mb-6">
                    <Sk className="h-8 w-52" />
                    <Sk className="h-9 w-28" />
                </div>
                <SkPostGrid count={6} />
            </div>
        </div>
    );
}
