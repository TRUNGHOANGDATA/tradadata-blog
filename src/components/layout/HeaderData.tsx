import { Header } from './Header';
import { getCategories, getCategoryPostCounts } from '@/lib/data/categories';
import { getBrandAssets } from '@/lib/data/settings';
import { coLogoRiengChoNenToi, duongDanAnh } from '@/lib/brand';

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
 *
 * `getBrandAssets` cung nam trong so do (tag 'settings'), nen doc logo o day
 * khong pha quy tac tren.
 */
export async function HeaderData() {
    const [categories, counts, brand] = await Promise.all([
        getCategories(),
        getCategoryPostCounts(),
        getBrandAssets(),
    ]);

    return (
        <Header
            categories={categories}
            categoryCounts={counts}
            logoUrl={duongDanAnh('logo', brand)}
            logoToiUrl={coLogoRiengChoNenToi(brand) ? duongDanAnh('logo-toi', brand) : undefined}
        />
    );
}
