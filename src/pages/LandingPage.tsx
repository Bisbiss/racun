import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';

export default function LandingPage() {
    const [hasSession, setHasSession] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setHasSession(!!session);
        });
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <SEO
                title="Racun Link - Satu Link untuk Semua Racunmu"
                description="Buat halaman link bio yang estetik, kumpulkan link affiliate TikTok, Shopee, dan Tokopedia, dan tingkatkan konversi jualan kamu."
            />
            
            {/* Navbar */}
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 px-4 py-4 md:py-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#05963E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <span className="text-xl font-bold text-emerald-700">Racun<span className="text-emerald-500">Link</span></span>
                    </div>
                    <div className="flex gap-4">
                        {hasSession ? (
                            <Link to="/dashboard" className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors">Dashboard Saya</Link>
                        ) : (
                            <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">Mulai / Masuk</Link>
                        )}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-4 py-8">
                {/* Hero Section */}
                <section className="flex flex-col md:flex-row items-center gap-8 py-12 md:py-16">
                    <div className="flex-1 space-y-6">
                        <span className="inline-block px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">✨ Kumpulkan Link Affiliate-mu</span>
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">Satu Link untuk<br />Semua Racunmu.</h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Tingkatkan konversi affiliate TikTok, Shopee, dan Tokopedia dengan halaman link yang estetik, cepat, dan mudah dibagikan di bio kamu.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link to="/login" className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium">Mulai Sekarang</Link>
                            <Link to="/kubis" className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium">Lihat Demo</Link>
                        </div>
                    </div>
                    <div className="flex-1">
                        <img src="/racun-illustration.png" alt="Ilustrasi Racun Link" className="w-full max-w-lg mx-auto" />
                    </div>
                </section>

                {/* Brands Section */}
                <section className="py-12 border-t border-b border-gray-100">
                    <p className="text-center text-gray-500 mb-6">Terintegrasi dengan E-commerce Favoritmu</p>
                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/f/fe/Shopee.svg" alt="Shopee" className="h-8 md:h-10" />
                        <img src="https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg" alt="TikTok" className="h-6 md:h-8" />
                        <img src="https://p16-assets-sg.tokopedia-static.net/tos-alisg-i-cqp9s0kcd0-sg/assets-tokopedia-lite/v2/zeus/production/e5b8438b.svg" alt="Tokopedia" className="h-7 md:h-9 opacity-80" />
                        <img src="https://img.lazcdn.com/g/tps/images/ims-web/TB1Hs8GaMFY.1VjSZFnXXcFHXXa.png" alt="Lazada" className="h-6 md:h-7" />
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                                🚀
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Cepat dan Gratis</h3>
                            <p className="text-gray-600">Tanpa biaya tersembunyi, nikmati semua fitur tanpa harus membayar mahal.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                                🚫
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Tanpa Watermark</h3>
                            <p className="text-gray-600">Hasil link tidak ada watermark apapun, tampil profesional dan rapi.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                                👌
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Mudah Digunakan</h3>
                            <p className="text-gray-600">Antarmuka yang sederhana dan intuitif, tidak butuh keahlian teknis apapun.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                                📑
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Katalog Rapi</h3>
                            <p className="text-gray-600">Tampilkan linkmu dalam format katalog yang rapi dan mudah dilihat pengunjung.</p>
                        </div>
                        <div className="p-6 rounded-xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-emerald-50 text-emerald-600 mb-4">
                                📊
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Analitik Setiap Link</h3>
                            <p className="text-gray-600">Pantau jumlah klik dan performa linkmu secara real-time.</p>
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-gray-50 rounded-2xl">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Pertanyaan yang Sering Diajukan</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Jawaban untuk pertanyaan yang sering ditanyakan tentang Racun Link
                            </p>
                        </div>
                        
                        <div className="space-y-0">
                            {[
                                {
                                  question: "Apa itu Racun Link?",
                                  answer: "Racun Link adalah alat untuk membuat halaman link bio yang estetik dan mudah digunakan untuk mengelola link affiliate kamu, termasuk TikTok, Shopee, Tokopedia, dan banyak lagi."
                                },
                                {
                                  question: "Apakah saya perlu membayar untuk menggunakan Racun Link?",
                                  answer: "Tidak, Racun Link dapat digunakan secara gratis dengan semua fitur dasar tanpa biaya tersembunyi."
                                },
                                {
                                  question: "Apakah ada watermark di link yang saya buat?",
                                  answer: "Tidak, semua link yang kamu buat tidak ada watermark apapun dan tampil profesional."
                                },
                                {
                                  question: "Bagaimana cara menambahkan link ke halaman saya?",
                                  answer: "Setelah login, kamu bisa menambahkan link melalui halaman dashboard dan mengisi form yang tersedia dengan detail link dan deskripsi yang diinginkan."
                                },
                                {
                                  question: "Dapatkah saya melihat statistik klik link saya?",
                                  answer: "Tentu, Racun Link menyediakan analitik klik link secara real-time untuk membantu kamu melacak performa link affiliate kamu."
                                }
                              ].map((item, index) => (
                                <FAQItem 
                                  key={index}
                                  question={item.question}
                                  answer={item.answer}
                                />
                              ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 text-center">
                    <div className="max-w-3xl mx-auto space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Siap menyebarkan racunmu?</h2>
                        <p className="text-lg text-gray-600">Bergabunglah dengan kreator affiliate lainnya sekarang juga.</p>
                        <Link to="/login" className="inline-block px-8 py-4 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium text-lg">Mulai Gratis Sekarang</Link>
                    </div>
                </section>
            </main>

            <footer className="bg-emerald-700 text-white py-6">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p>© {new Date().getFullYear()} Racun Link. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-200 py-6">
      <button 
        className="flex justify-between items-center w-full text-left font-semibold text-lg hover:text-emerald-600 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{question}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div className={`mt-4 overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-600 pl-4 border-l-2 border-emerald-500/30 py-2">
          {answer}
        </p>
      </div>
    </div>
  )
}