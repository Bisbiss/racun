import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { Link } from 'react-router-dom';

export default function Login() {
    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${import.meta.env.VITE_REDIRECT_URL || window.location.origin}/dashboard`,
                }
            });

            if (error) throw error;
        } catch (error: any) {
            alert(error.message || 'Terjadi kesalahan saat login.');
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#fdfdfd' }}>
            <SEO 
                title="Masuk - Racun Link" 
                description="Masuk ke akun Racun Link kamu untuk mengelola link affiliate dan bio linkmu dengan mudah." 
            />

            {/* Left Side Branding */}
            <div style={{
                flex: 1,
                display: 'none',
                background: 'linear-gradient(135deg, var(--primary) 0%, #059669 100%)',
                color: 'white',
                padding: '40px',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                overflow: 'hidden'
            }} className="login-sidebar">
                {/* Decorative blob */}
                <div style={{
                    position: 'absolute', top: '-10%', right: '-10%', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
                    borderRadius: '50%'
                }} />

                <div>
                    <Link to="/" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Racun<span style={{ opacity: 0.8 }}>Link</span></h2>
                    </Link>
                </div>

                <div>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '20px' }}>
                        Satu Link untuk <br />Semua Racunmu.
                    </h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9, maxWidth: '400px', lineHeight: 1.6 }}>
                        Kelola katalog afiliate kamu dengan lebih estetik, cepat, dan mudah hanya dengan login menggunakan akun Google.
                    </p>
                </div>

                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    &copy; {new Date().getFullYear()} Racun Link. All rights reserved.
                </div>
            </div>

            {/* Right Side Login Area */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '20px',
                position: 'relative'
            }}>
                {/* Mobile back link header */}
                <div style={{ position: 'absolute', top: 20, left: 20 }} className="mobile-only-block">
                    <Link to="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>&larr; Kembali</Link>
                </div>

                <div style={{
                    width: '100%',
                    maxWidth: '400px',
                    textAlign: 'center'
                }}>
                    <div className="mobile-only-block" style={{ marginBottom: '40px' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </div>

                    <h2 style={{ marginBottom: '10px', fontSize: '2rem', fontWeight: 800, color: '#111827' }}>Selamat Datang</h2>
                    <p style={{ color: '#6B7280', marginBottom: '40px', fontSize: '1.05rem' }}>Masuk untuk mengelola ruang kerjamu.</p>

                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            width: '100%',
                            padding: '16px',
                            backgroundColor: '#fff',
                            color: '#374151',
                            fontSize: '1.05rem',
                            fontWeight: '600',
                            borderRadius: '16px',
                            border: '1px solid #E5E7EB',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
                        onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)' }}
                    >
                        <svg width="24" height="24" viewBox="0 0 48 48">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                            <path fill="none" d="M0 0h48v48H0z" />
                        </svg>
                        Lanjutkan dengan Google
                    </button>

                    <div style={{ marginTop: '30px', fontSize: '0.9rem', color: '#9CA3AF' }}>
                        Hanya mendukung Login dengan Akun Google
                    </div>
                </div>
            </div>
        </div>
    )
}
