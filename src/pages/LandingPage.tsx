import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import './LandingPage.css';

export default function LandingPage() {
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setHasSession(!!session);
        });
    }, []);

    return (
        <div className="lp-container">
            <SEO
                title="Racun Link - Satu Link untuk Semua Racunmu"
                description="Buat halaman link bio yang estetik, kumpulkan link affiliate TikTok, Shopee, dan Tokopedia, dan tingkatkan konversi jualan kamu."
            />
            <nav className="lp-nav">
                <div className="lp-logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                    Racun<span>Link</span>
                </div>
                <div className="lp-nav-actions">
                    {hasSession ? (
                        <Link to="/dashboard" className="lp-btn lp-btn-small" style={{ background: '#0f172a' }}>Dashboard Saya</Link>
                    ) : (
                        <Link to="/login" className="lp-btn lp-btn-small">Mulai / Masuk</Link>
                    )}
                </div>
            </nav>

            <main className="lp-main">
                <section className="lp-hero">
                    <div className="lp-hero-content">
                        <div className="lp-hero-text">
                            <div className="lp-hero-badge">✨ Kumpulkan Link Affiliate-mu</div>
                            <h1 className="lp-title">Satu Link untuk<br />Semua Racunmu.</h1>
                            <p className="lp-subtitle">
                                Tingkatkan konversi affiliate TikTok, Shopee, dan Tokopedia dengan halaman link yang estetik, cepat, dan mudah dibagikan di bio kamu.
                            </p>
                            <div className="lp-actions">
                                <Link to="/login" className="lp-btn lp-btn-primary">Mulai Sekarang</Link>
                                <Link to="/kubis" className="lp-btn lp-btn-secondary">Lihat Demo</Link>
                            </div>
                        </div>
                        <div className="lp-hero-illustration">
                            <img src="/racun-illustration.png" alt="Ilustrasi Racun Link - Satu Link untuk Semua Link Affiliate" className="lp-hero-img" />
                        </div>
                    </div>
                </section>

                <section className="lp-brands">
                    <p>Terintegrasi dengan E-commerce Favoritmu</p>
                    <div className="lp-brands-list">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" alt="Shopee Logo" className="lp-brand-icon" style={{ height: '35px' }} />
                        <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok Logo" className="lp-brand-icon" />
                        <img src="https://p16-assets-sg.tokopedia-static.net/tos-alisg-i-cqp9s0kcd0-sg/assets-tokopedia-lite/v2/zeus/production/e5b8438b.svg" alt="Tokopedia Logo" className="lp-brand-icon" style={{ height: '30px', filter: 'none', opacity: '0.8' }} />
                        <img src="https://img.lazcdn.com/g/tps/images/ims-web/TB1Hs8GaMFY.1VjSZFnXXcFHXXa.png" alt="Lazada Logo" className="lp-brand-icon" style={{ height: '28px' }} />
                    </div>
                </section>

                <section className="lp-features">
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon">🚀</div>
                        <h3>Cepat dan Gratis</h3>
                        <p>Tanpa biaya tersembunyi, nikmati semua fitur tanpa harus membayar mahal.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon">🚫</div>
                        <h3>Tanpa Watermark</h3>
                        <p>Hasil link tidak ada watermark apapun, tampil profesional dan rapi.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon">👌</div>
                        <h3>Mudah Digunakan</h3>
                        <p>Antarmuka yang sederhana dan intuitif, tidak butuh keahlian teknis apapun.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon">📑</div>
                        <h3>Katalog Rapi</h3>
                        <p>Tampilkan linkmu dalam format katalog yang rapi dan mudah dilihat pengunjung.</p>
                    </div>
                    <div className="lp-feature-card">
                        <div className="lp-feature-icon">📊</div>
                        <h3>Analitik Setiap Link</h3>
                        <p>Pantau jumlah klik dan performa linkmu secara real-time.</p>
                    </div>
                </section>

                <section className="lp-cta-bottom">
                    <h2>Siap menyebarkan racunmu?</h2>
                    <p>Bergabunglah dengan kreator affiliate lainnya sekarang juga.</p>
                    <Link to="/login" className="lp-btn lp-btn-primary">Mulai Gratis Sekarang</Link>
                </section>
            </main>

            <footer className="lp-footer">
                <p>&copy; {new Date().getFullYear()} Racun Link. All rights reserved.</p>
            </footer>
        </div>
    )
}