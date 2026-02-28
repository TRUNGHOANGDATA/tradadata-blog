'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Mail, Settings as SettingsIcon } from 'lucide-react';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<'general' | 'email'>('general');

    // States for General Config
    const [bankInfo, setBankInfo] = useState({ bankId: '', accountNo: '', accountName: '' });
    const [socialLinks, setSocialLinks] = useState({ zalo: '', facebook: '', phone: '', email: '' });
    const [googleSheet, setGoogleSheet] = useState({ sheetId: '' });
    const [postsPerPage, setPostsPerPage] = useState(12);

    // States for Email Templates
    const [templates, setTemplates] = useState<Record<string, { subject: string, html_content: string }>>({});
    const [selectedTemplate, setSelectedTemplate] = useState('welcome');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
        fetchTemplates();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            const data = await res.json();
            if (data.settings) {
                if (data.settings.bank_info) setBankInfo(data.settings.bank_info);
                if (data.settings.social_links) setSocialLinks(data.settings.social_links);
                if (data.settings.google_sheet_id) setGoogleSheet(data.settings.google_sheet_id);
                if (data.settings.posts_per_page) setPostsPerPage(Number(data.settings.posts_per_page) || 12);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        }
    };

    const fetchTemplates = async () => {
        try {
            const res = await fetch('/api/admin/email-templates');
            const data = await res.json();
            if (data.templates) {
                setTemplates(data.templates);
            }
        } catch (error) {
            console.error('Error fetching templates:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveGeneral = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    bank_info: bankInfo,
                    social_links: socialLinks,
                    google_sheet_id: googleSheet,
                    posts_per_page: postsPerPage
                })
            });
            if (res.ok) alert('Đã lưu cấu hình chung!');
            else alert('Có lỗi xảy ra khi lưu.');
        } catch (error) {
            alert('Lỗi hệ thống');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveTemplate = async () => {
        setSaving(true);
        try {
            const template = templates[selectedTemplate];
            const res = await fetch('/api/admin/email-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    templateId: selectedTemplate,
                    subject: template.subject,
                    html_content: template.html_content
                })
            });
            if (res.ok) alert('Đã lưu mẫu Email!');
            else alert('Có lỗi xảy ra khi lưu.');
        } catch (error) {
            alert('Lỗi hệ thống');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-surface-100 mb-6">Cài đặt Hệ thống</h1>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-surface-200 dark:border-surface-800 mb-8">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'general'
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                        }`}
                >
                    <SettingsIcon className="w-4 h-4" />
                    Cấu hình chung
                </button>
                <button
                    onClick={() => setActiveTab('email')}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${activeTab === 'email'
                        ? 'border-brand-500 text-brand-600 dark:text-brand-400'
                        : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
                        }`}
                >
                    <Mail className="w-4 h-4" />
                    Mẫu Email
                </button>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    {/* Bank Info */}
                    <section className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Mã QR Ngân Hàng (VietQR)</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Ngân Hàng (Tên viết tắt)</label>
                                <select
                                    value={bankInfo.bankId}
                                    onChange={(e) => setBankInfo({ ...bankInfo, bankId: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
                                >
                                    <option value="">-- Chọn Ngân hàng --</option>
                                    <option value="MB">MBBank (MB)</option>
                                    <option value="VCB">Vietcombank (VCB)</option>
                                    <option value="TCB">Techcombank (TCB)</option>
                                    <option value="VPB">VPBank (VPB)</option>
                                    <option value="ACB">ACB</option>
                                    <option value="ICB">VietinBank (ICB)</option>
                                    <option value="BIDV">BIDV</option>
                                    <option value="VBA">Agribank (VBA)</option>
                                    <option value="STB">Sacombank (STB)</option>
                                    <option value="TPB">TPBank (TPB)</option>
                                    <option value="HDB">HDBank (HDB)</option>
                                    <option value="VIB">VIB</option>
                                    <option value="SHB">SHB</option>
                                    <option value="EIB">Eximbank (EIB)</option>
                                    <option value="MSB">MSB</option>
                                    <option value="OCB">OCB</option>
                                    <option value="SeABank">SeABank</option>
                                    <option value="ABB">ABBank</option>
                                    <option value="BVB">BaoViet Bank</option>
                                    <option value="LPB">LPBank</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Số tài khoản</label>
                                <input
                                    type="text"
                                    value={bankInfo.accountNo}
                                    onChange={(e) => setBankInfo({ ...bankInfo, accountNo: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tên chủ tài khoản</label>
                                <input
                                    type="text"
                                    value={bankInfo.accountName}
                                    onChange={(e) => setBankInfo({ ...bankInfo, accountName: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Social Links */}
                    <section className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Liên hệ Hỗ trợ</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Zalo Link (zalo.me/sdt)</label>
                                <input
                                    type="text"
                                    value={socialLinks.zalo}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, zalo: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Facebook Link</label>
                                <input
                                    type="text"
                                    value={socialLinks.facebook}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, facebook: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">SĐT liên hệ</label>
                                <input
                                    type="text"
                                    value={socialLinks.phone}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, phone: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email liên hệ</label>
                                <input
                                    type="text"
                                    value={socialLinks.email}
                                    onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Google Sheets */}
                    <section className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Google Sheet (Log Doanh thu)</h2>
                        <div>
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Sheet ID</label>
                            <input
                                type="text"
                                value={googleSheet.sheetId}
                                onChange={(e) => setGoogleSheet({ sheetId: e.target.value })}
                                placeholder="Ví dụ: 1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms"
                                className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                            />
                            <p className="text-xs text-surface-500 mt-2">
                                Tìm Sheet ID trên thanh URL trình duyệt: docs.google.com/spreadsheets/d/<strong>[Sheet_ID]</strong>/edit.
                                <br />Vui lòng chia sẻ quyền Editor cho: <code>{process.env.NEXT_PUBLIC_SERVICE_ACCOUNT_EMAIL || 'your-service-account@your-project.iam.gserviceaccount.com'}</code>
                            </p>
                        </div>
                    </section>

                    {/* Blog Settings */}
                    <section className="bg-white dark:bg-surface-900 rounded-2xl p-6 border border-surface-200 dark:border-surface-800">
                        <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 mb-4">Cài đặt Blog</h2>
                        <div className="max-w-xs">
                            <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Số bài viết mỗi trang</label>
                            <input
                                type="number"
                                min={3}
                                max={50}
                                value={postsPerPage}
                                onChange={(e) => setPostsPerPage(Math.max(3, Math.min(50, Number(e.target.value) || 12)))}
                                className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                            />
                            <p className="text-xs text-surface-500 mt-2">Số lượng bài viết tối đa hiển thị trên 1 trang blog trước khi tự phân trang (3–50).</p>
                        </div>
                    </section>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveGeneral}
                            disabled={saving}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Lưu cấu hình
                        </button>
                    </div>
                </div>
            )}

            {/* Email Templates Array */}
            {activeTab === 'email' && (
                <div className="space-y-6 animate-in fade-in duration-300">
                    <div className="flex gap-2">
                        {['welcome', 'payment_success', 'new_post'].map(id => (
                            <button
                                key={id}
                                onClick={() => setSelectedTemplate(id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedTemplate === id
                                    ? 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-400'
                                    : 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                                    }`}
                            >
                                {id === 'welcome' && 'Welcome Mail'}
                                {id === 'payment_success' && 'Thanh toán thành công'}
                                {id === 'new_post' && 'Bài mới (Newsletter)'}
                            </button>
                        ))}
                    </div>

                    {templates[selectedTemplate] ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Tiêu đề (Subject)</label>
                                <input
                                    type="text"
                                    value={templates[selectedTemplate].subject}
                                    onChange={(e) => setTemplates({
                                        ...templates,
                                        [selectedTemplate]: { ...templates[selectedTemplate], subject: e.target.value }
                                    })}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Nội dung (HTML)</label>
                                <textarea
                                    value={templates[selectedTemplate].html_content}
                                    onChange={(e) => setTemplates({
                                        ...templates,
                                        [selectedTemplate]: { ...templates[selectedTemplate], html_content: e.target.value }
                                    })}
                                    rows={15}
                                    className="w-full px-3 py-2 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 font-mono text-sm"
                                ></textarea>
                                <p className="text-xs text-surface-500 mt-2">
                                    Các biến hỗ trợ: <code>{`{{name}}`}, {`{{url}}`}, {`{{order_code}}`}, {`{{product_name}}`}, {`{{amount}}`}, {`{{title}}`}, {`{{excerpt}}`}</code>
                                </p>
                            </div>
                            <div className="flex justify-end">
                                <button
                                    onClick={handleSaveTemplate}
                                    disabled={saving}
                                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 text-white font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
                                >
                                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    Lưu Email Template
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="py-12 text-center text-surface-500 bg-surface-50 dark:bg-surface-800/50 rounded-2xl border border-surface-200 dark:border-surface-800">
                            Không tìm thấy mẫu email này trong Database. Vui lòng kiểm tra lại.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
