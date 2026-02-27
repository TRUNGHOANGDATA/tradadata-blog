import Link from 'next/link';
import type { Category } from '@/types';

interface CategoryCardProps {
    category: Category;
    postCount?: number;
}

export function CategoryCard({ category, postCount = 0 }: CategoryCardProps) {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="group block p-5 rounded-2xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 hover:border-transparent hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            style={{
                '--hover-color': category.color,
            } as React.CSSProperties}
        >
            <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-3 transition-transform duration-300 group-hover:scale-110"
                style={{ backgroundColor: `${category.color}15` }}
            >
                {category.icon}
            </div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                {category.name}
            </h3>
            {category.description && (
                <p className="text-sm text-surface-500 dark:text-surface-300 line-clamp-2 mb-2">{category.description}</p>
            )}
            <span className="text-xs text-surface-400 dark:text-surface-400">
                {postCount} bài viết
            </span>
        </Link>
    );
}
