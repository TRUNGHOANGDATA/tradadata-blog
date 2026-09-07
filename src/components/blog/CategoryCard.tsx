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
            className="group block p-5 rounded-2xl bg-card border border-line hover:border-brand-300 dark:hover:border-brand-700 shadow-e1 hover:shadow-e2 transition-all duration-300 hover:-translate-y-1"
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
            <h3 className="font-semibold text-fg group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors mb-1">
                {category.name}
            </h3>
            {category.description && (
                <p className="text-sm text-fg-muted line-clamp-2 mb-2">{category.description}</p>
            )}
            <span className="text-xs text-fg-subtle">
                {postCount} bài viết
            </span>
        </Link>
    );
}
