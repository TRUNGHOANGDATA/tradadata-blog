import { BookOpen, Users, Code, Heart } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';

export default function AboutPage() {
    return (
        <>
            {/* Hero */}
            <section className="bg-gradient-to-b from-brand-50 to-surface-50 dark:from-surface-900 dark:to-surface-950 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold text-fg mb-4">
                        Về {SITE_CONFIG.name}
                    </h1>
                    <p className="text-lg text-surface-600 dark:text-surface-400 leading-relaxed max-w-2xl mx-auto">
                        Nơi chia sẻ kiến thức thực tế về Data, AI và Supply Chain —
                        giúp bạn nâng cao kỹ năng chuyên môn mỗi ngày.
                    </p>
                </div>
            </section>

            {/* Mission */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                        {
                            icon: BookOpen,
                            title: 'Kiến thức thực tế',
                            desc: 'Mỗi bài viết đều dựa trên kinh nghiệm thực tế trong công việc, không lý thuyết suông.',
                        },
                        {
                            icon: Code,
                            title: 'Từ cơ bản đến nâng cao',
                            desc: 'Phù hợp cho cả người mới bắt đầu và chuyên gia, với lộ trình học tập rõ ràng.',
                        },
                        {
                            icon: Users,
                            title: 'Cộng đồng',
                            desc: 'Kết nối với cộng đồng Data & AI tại Việt Nam, cùng nhau học hỏi và phát triển.',
                        },
                        {
                            icon: Heart,
                            title: 'Chia sẻ tận tâm',
                            desc: 'Nội dung được biên soạn kỹ lưỡng, cập nhật thường xuyên với trends mới nhất.',
                        },
                    ].map((item) => (
                        <div key={item.title} className="p-6 rounded-2xl bg-card border border-line">
                            <item.icon className="h-8 w-8 text-brand-600 mb-4" />
                            <h3 className="text-lg font-bold text-fg mb-2">
                                {item.title}
                            </h3>
                            <p className="text-surface-600 dark:text-surface-400 text-sm leading-relaxed">
                                {item.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Topics */}
            <section className="bg-surface-100 dark:bg-surface-900/50 py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold text-fg mb-8 text-center">
                        Chủ đề chính
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { emoji: '📊', name: 'Excel' },
                            { emoji: '🔄', name: 'Power Query' },
                            { emoji: '⚙️', name: 'VBA' },
                            { emoji: '📈', name: 'Power BI' },
                            { emoji: '🗄️', name: 'SQL' },
                            { emoji: '🐍', name: 'Python' },
                            { emoji: '🤖', name: 'AI' },
                            { emoji: '🚛', name: 'Supply Chain' },
                        ].map((topic) => (
                            <div
                                key={topic.name}
                                className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                            >
                                <span className="text-2xl">{topic.emoji}</span>
                                <span className="font-medium text-fg">{topic.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
