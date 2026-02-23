import React from 'react';

export default function AdminSettings() {
    return (
        <div style={{ maxWidth: '600px' }}>
            <h2 style={{ fontSize: '1.4rem', marginBottom: '16px', fontWeight: 600 }}>Pengaturan Administrator</h2>

            <div className="dash-card">
                <h3 style={{ fontSize: '1.2rem', marginBottom: '16px' }}>Preferensi Dashboard</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>Fitur pengaturan admin masih dalam tahap pengembangan. Untuk saat ini manajemen peran (roles) Admin dilakukan di level database secara langsung (Supabase Studio).</p>

                <div style={{ padding: '16px', backgroundColor: '#f1f5f9', borderRadius: '12px', color: '#334155' }}>
                    <strong>Instruksi SQL untuk menjadikan Admin:</strong>
                    <pre style={{ marginTop: '12px', backgroundColor: '#1e293b', color: '#e2e8f0', padding: '16px', borderRadius: '8px', overflowX: 'auto', fontSize: '0.85rem' }}>
                        {`-- Berikan hak akses admin pada pengguna tertentu
UPDATE public.profiles
SET role = 'admin'
WHERE username = 'username_target';

-- Pastikan kolom peran ada
-- ALTER TABLE public.profiles ADD COLUMN role text DEFAULT 'user';`}
                    </pre>
                </div>
            </div>
        </div>
    );
}
