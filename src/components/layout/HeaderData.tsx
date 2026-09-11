import { Header } from './Header';
import { getCategories, getCategoryPostCounts } from '@/lib/data/categories';

/**
 * Vo boc SERVER cho Header.
 *
 * Header la Client Component (dung useSession, useState) nen khong tu doc DB duoc.
 * Mega-dropdown "Chu de" can danh sach danh muc + so bai — ca hai deu lay qua ham
 * co `unstable_cache` (`getCategories` tag 'categories', `getCategoryPostCounts`
 * tag 'posts'+'categories'), nen lop layout goc VAN doc tu data cache, khong pha
 * quy tac "layout khong await truy van khong cache".
 *
 * `revalidateTaxonomy()` / publish bai moi se tu lam moi hai cache nay.
 */
export async function HeaderData() {
    const [categories, counts] = await Promise.all([
        getCategories(),
        getCategoryPostCounts(),
    ]);

    return <Header categories={categories} categoryCounts={counts} />;
}
