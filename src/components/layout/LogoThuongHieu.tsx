import Image from 'next/image';

/**
 * Logo dùng chung cho Header và Footer.
 *
 * Dùng `next/image` chứ không phải `<img>` thô như trước: thẻ `<img>` không có
 * `srcset` nên trình duyệt tải nguyên file gốc cho một chỗ hiển thị 44px. Khai
 * `width`/`height` cố định thì Next lấy bậc trong `imageSizes` (48/96) thay vì
 * bậc `deviceSizes` nhỏ nhất là 640 — đúng thứ `next.config.ts` đang cố tránh.
 *
 * Bản cho nền tối chỉ render khi admin thật sự cấu hình một ảnh riêng
 * (`coLogoRiengChoNenToi`). Ảnh thứ hai tốn thêm một lượt tải trên MỌI trang, mà
 * phần lớn trường hợp logo dùng chung cho cả hai chế độ.
 */
export function LogoThuongHieu({
    src,
    srcToi,
    canh,
    alt,
    className = '',
}: {
    src: string;
    /** Bỏ trống khi không có logo riêng cho nền tối. */
    srcToi?: string;
    /** Cạnh hiển thị, tính bằng px. */
    canh: number;
    alt: string;
    className?: string;
}) {
    const chung = `${className} object-cover rounded-full`;

    if (!srcToi) {
        return <Image src={src} alt={alt} width={canh} height={canh} className={chung} />;
    }

    return (
        <>
            <Image src={src} alt={alt} width={canh} height={canh} className={`${chung} dark:hidden`} />
            <Image src={srcToi} alt="" aria-hidden="true" width={canh} height={canh} className={`${chung} hidden dark:block`} />
        </>
    );
}
