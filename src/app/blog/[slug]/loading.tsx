import { Sk } from '@/components/ui/Skeleton';

// Skeleton cho trang bai viet. Khop dung luoi 3 cot 2/7/3 cua trang that
// (rail trai: quay lai + share, giua: noi dung, phai: muc luc) de khi noi dung
// do vao thi khong bi nhay bo cuc.
export default function Loading() {
    return (
        <div className="min-h-screen bg-page pb-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="hidden lg:flex lg:col-span-2 flex-col gap-3">
                        <Sk className="h-9 w-24 rounded-xl" />
                        <Sk className="h-9 w-9 rounded-full" />
                        <Sk className="h-9 w-9 rounded-full" />
                    </div>

                    <div className="col-span-1 lg:col-span-7">
                        <Sk className="h-6 w-28 mb-4 rounded-full" />
                        <Sk className="h-10 w-full mb-2" />
                        <Sk className="h-10 w-4/5 mb-6" />
                        <div className="flex gap-4 mb-8">
                            <Sk className="h-4 w-28" />
                            <Sk className="h-4 w-24" />
                            <Sk className="h-4 w-20" />
                        </div>
                        <Sk className="aspect-[16/9] w-full rounded-2xl mb-10" />

                        <div className="max-w-[55ch] space-y-3">
                            <Sk className="h-5 w-full" />
                            <Sk className="h-5 w-full" />
                            <Sk className="h-5 w-11/12" />
                            <Sk className="h-5 w-3/4" />
                            <Sk className="h-8 w-2/5 mt-8" />
                            <Sk className="h-5 w-full" />
                            <Sk className="h-5 w-full" />
                            <Sk className="h-5 w-5/6" />
                            <Sk className="h-32 w-full rounded-xl mt-6" />
                            <Sk className="h-5 w-full mt-6" />
                            <Sk className="h-5 w-4/5" />
                        </div>
                    </div>

                    <div className="col-span-1 lg:col-span-3">
                        <div className="rounded-2xl border border-line bg-card p-5">
                            <Sk className="h-5 w-24 mb-4" />
                            <div className="space-y-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <Sk key={i} className={i % 3 === 2 ? "h-4 w-3/5" : "h-4"} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
