"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, Phone, Mail, User } from "lucide-react";

export function Newsletter() {
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [phone, setPhone] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes("@")) {
            setStatus("error");
            setErrorMsg("Vui lòng nhập email hợp lệ");
            return;
        }

        if (!fullName.trim() || !phone.trim()) {
            setStatus("error");
            setErrorMsg("Email, họ và tên, số điện thoại là bắt buộc");
            return;
        }

        setStatus('loading');
        try {
            const response = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, full_name: fullName || undefined, phone: phone || undefined }),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus('error');
                setErrorMsg(data.error || "Đăng ký thất bại. Vui lòng thử lại.");
                return;
            }

            setStatus('success');
            setSuccessMsg(data.message || 'Đã đăng ký thành công!');
            setEmail('');
            setFullName('');
            setPhone('');
        } catch (error) {
            console.error('Subscription error:', error);
            setStatus('error');
            setErrorMsg("Đã có lỗi xảy ra.");
        } finally {
            setTimeout(() => {
                setStatus('idle');
                setErrorMsg('');
                setSuccessMsg('');
            }, 4000);
        }
    };

    return (
        <section className="mt-20">
            <div className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 to-brand-800" />
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-4 right-10 w-32 h-32 bg-white rounded-full filter blur-2xl" />
                    <div className="absolute bottom-4 left-20 w-40 h-40 bg-cyan-300 rounded-full filter blur-2xl" />
                </div>

                <div className="relative px-8 py-12 md:py-16 text-center w-full">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Nhận bài viết mới nhất
                    </h2>
                    <p className="text-white/80 mb-8 max-w-lg mx-auto">
                        Đăng ký để nhận thông báo khi có bài viết mới. Không spam, chỉ kiến thức chất lượng.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-2xl mx-auto">
                        {/* Name field */}
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                disabled={status === "loading" || status === "success"}
                                placeholder="Họ và tên *"
                                required
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm disabled:opacity-70"
                            />
                        </div>

                        {/* Email + Phone row */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-[3] relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={status === "loading" || status === "success"}
                                    placeholder="Email của bạn *"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm disabled:opacity-70"
                                />
                            </div>
                            <div className="flex-[2] relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={status === "loading" || status === "success"}
                                    placeholder="Số điện thoại *"
                                    required
                                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 text-white placeholder:text-white/50 border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/30 backdrop-blur-sm disabled:opacity-70"
                                />
                            </div>
                        </div>

                        {/* Error message */}
                        {status === "error" && (
                            <p className="text-red-300 text-sm text-left">{errorMsg}</p>
                        )}

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={status === "loading" || status === "success"}
                            className="w-full px-6 py-3 rounded-xl bg-white text-brand-700 font-semibold hover:bg-white/90 transition-all shadow-lg disabled:opacity-70 disabled:hover:bg-white flex items-center justify-center"
                        >
                            {status === "loading" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : status === "success" ? (
                                <span className="flex items-center gap-2 text-green-600"><CheckCircle2 className="w-5 h-5" /> {successMsg}</span>
                            ) : (
                                "Đăng ký nhận bản tin"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
