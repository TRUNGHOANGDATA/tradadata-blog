'use client';

import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { KHOA_THEME } from '@/lib/constants';

export function ThemeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        // MAC DINH LA LIGHT, khong theo `prefers-color-scheme` cua he dieu hanh.
        //
        // Truoc day o day co `|| (!saved && prefersDark)`, nen khach nao dat may
        // o dark mode la vao site thay dark ngay du chua bao gio bam nut. Chu y
        // hien tai: giao dien sang la mac dinh, dark chi bat khi nguoi dung TU
        // chon — nen `localStorage` la nguon duy nhat quyet dinh.
        //
        // localStorage co the nem loi (cua so an danh, trinh duyet chan site
        // data) nen phai boc try/catch, va khi loi thi roi ve light.
        let isDark = false;
        try {
            isDark = localStorage.getItem(KHOA_THEME) === 'dark';
        } catch {
            isDark = false;
        }
        // Doc localStorage chi co o trinh duyet. Tinh trong render dau la
        // hydration mismatch, nen phai doc sau khi mount.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDark(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }, []);

    const toggle = () => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle('dark', next);
        try {
            localStorage.setItem(KHOA_THEME, next ? 'dark' : 'light');
        } catch {
            // Khong luu duoc thi lan sau vao lai ve light — chap nhan duoc,
            // khong duoc de nem loi lam vo ca nut.
        }
    };

    return (
        <button
            onClick={toggle}
            className="relative grid place-items-center min-h-11 min-w-11 rounded-xl bg-surface-100 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 transition-all duration-300 group"
            aria-label="Toggle theme"
        >
            <Sun className="h-5 w-5 text-amber-500 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute inset-0 m-auto h-5 w-5 text-brand-400 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
