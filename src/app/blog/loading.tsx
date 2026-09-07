import { Sk, SkPostGrid } from '@/components/ui/Skeleton';

// Skeleton cho danh sach bai viet: tieu de trang -> hang loc -> luoi the.
export default function Loading() {
    return (
        <div className="min-h-screen bg-page">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Sk className="h-10 w-64 mb-3" />
                <Sk className="h-5 w-full max-w-lg mb-8" />

                <div className="flex flex-wrap gap-2 mb-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Sk key={i} className="h-9 w-24 rounded-xl" />
                    ))}
                </div>

                <SkPostGrid count={9} />
            </div>
        </div>
    );
}
