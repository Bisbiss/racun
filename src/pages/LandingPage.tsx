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

                {/* Section FAQ Responsif */}
                <section className="py-12 md:py-16 bg-background">
                  <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 md:mb-12">
                      <h2 className="text-2xl md:text-3xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
                      <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
                        Jawaban untuk pertanyaan yang sering ditanyakan tentang Racun Link
                      </p>
                    </div>
                    
                    <div className="space-y-0">
                      {[
                        {
                          q: "Apa itu Racun Link?",
                          a: "Racun Link adalah alat untuk membuat halaman link bio yang estetik dan mudah digunakan untuk mengelola link affiliate kamu, termasuk TikTok, Shopee, Tokopedia, dan banyak lagi."
                        },
                        {
                          q: "Apakah saya perlu membayar untuk menggunakan Racun Link?",
                          a: "Tidak, Racun Link dapat digunakan secara gratis dengan semua fitur dasar tanpa biaya tersembunyi."
                        },
                        {
                          q: "Apakah ada watermark di link yang saya buat?",
                          a: "Tidak, semua link yang kamu buat tidak ada watermark apapun dan tampil profesional."
                        },
                        {
                          q: "Bagaimana cara menambahkan link ke halaman saya?",
                          a: "Setelah login, kamu bisa menambahkan link melalui halaman dashboard dan mengisi form yang tersedia dengan detail link dan deskripsi yang diinginkan."
                        },
                        {
                          q: "Dapatkah saya melihat statistik klik link saya?",
                          a: "Tentu, Racun Link menyediakan analitik klik link secara real-time untuk membantu kamu melacak performa link affiliate kamu."
                        }
                      ].map((item, i) => {
                        const [open, setOpen] = useState(false);
                        return (
                          <div key={i} className="border-b border-gray-200 py-4 md:py-6">
                            <button 
                              onClick={() => setOpen(!open)}
                              className="flex justify-between items-center w-full text-left font-semibold text-base md:text-lg hover:text-emerald-600 transition-all"
                              aria-expanded={open}
                            >
                              <span className="pr-4">{item.q}</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                            <div className={`mt-3 overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                              <p className="text-sm md:text-base text-gray-600 pl-0 md:pl-4 border-l-2 border-emerald-500/30 py-2">
                                {item.a}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
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