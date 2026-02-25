import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const RESERVED_USERNAMES = ['admin', 'dashboard', 'login', 'register', 'api', 'auth', 'settings', 'null', 'undefined', 'racun', 'racunlink'];

export default function DashboardSettings() {
    const [loading, setLoading] = useState(false);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [profile, setProfile] = useState({ username: '', full_name: '', bio: '', id: '', avatar_url: '', instagram_url: '', tiktok_url: '', whatsapp_url: '' });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [refreshKey, setRefreshKey] = useState(Date.now());

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                setProfile({
                    id: data.id,
                    username: data.username || '',
                    full_name: data.full_name || '',
                    bio: data.bio || '',
                    avatar_url: data.avatar_url || '',
                    instagram_url: data.instagram_url || '',
                    tiktok_url: data.tiktok_url || '',
                    whatsapp_url: data.whatsapp_url || '',
                });
            }
        }
        loadProfile();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (!profile.id) {
                setMessage({ type: 'error', text: 'Harap Simpan Nama Pengguna terlebih dahulu sebelum mengunggah foto.' });
                return;
            }

            setUploadingAvatar(true);
            setMessage({ type: '', text: '' });

            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${profile.id}/${fileName}`;

            // Upload the file to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            // Get the public URL
            const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);

            // Set the state
            setProfile(prev => ({ ...prev, avatar_url: data.publicUrl }));
            setMessage({ type: 'success', text: 'Foto berhasil diunggah. Jangan lupa klik "Simpan Perubahan".' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Gagal mengunggah foto: ' + error.message });
        } finally {
            setUploadingAvatar(false);
            // Reset input file value
            e.target.value = '';
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error('Anda harus login terlebih dahulu.');

            const userId = session.user.id;

            // 1. Validate reserved words
            const lowerUsername = profile.username.toLowerCase().trim();
            if (RESERVED_USERNAMES.includes(lowerUsername)) {
                throw new Error('Nama pengguna ini tidak dapat digunakan (Dipesan Sistem).');
            }

            // 2. Format validation (alphanumeric and dashes only)
            if (!/^[a-z0-9-]+$/.test(lowerUsername)) {
                throw new Error('Nama pengguna hanya boleh berisi huruf kecil, angka, dan strip (-).');
            }

            // 3. Check availability in DB (exclude current user)
            const { data: existingChecks } = await supabase
                .from('profiles')
                .select('id')
                .eq('username', lowerUsername)
                .neq('id', userId);

            if (existingChecks && existingChecks.length > 0) {
                throw new Error('Nama pengguna sudah dipakai orang lain. Silakan pilih yang lain.');
            }

            // 4. Update Profile (Upsert in case the record doesn't exist yet)
            const { error } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    username: lowerUsername,
                    full_name: profile.full_name,
                    bio: profile.bio,
                    avatar_url: profile.avatar_url,
                    instagram_url: profile.instagram_url,
                    tiktok_url: profile.tiktok_url,
                    whatsapp_url: profile.whatsapp_url,
                });

            if (error) throw error;

            // Set profile ID locally in case it was blank
            setProfile(prev => ({ ...prev, id: userId }));
            setMessage({ type: 'success', text: 'Profil berhasil diperbarui!' });
            setRefreshKey(Date.now());
        } catch (error: any) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            setMessage({ type: 'error', text: error.message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dash-card">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Pengaturan Profil</h2>

            {message.text && (
                <div style={{
                    padding: '12px',
                    marginBottom: '20px',
                    borderRadius: '8px',
                    backgroundColor: message.type === 'error' ? '#fee2e2' : '#d1fae5',
                    color: message.type === 'error' ? '#991b1b' : '#065f46'
                }}>
                    {message.text}
                </div>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
                {/* Left side: Form */}
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: '1 1 400px', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>Nama Pengguna</label>
                        <input
                            type="text"
                            name="username"
                            value={profile.username}
                            onChange={handleChange}
                            required
                            placeholder="nama-pengguna-kamu"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{window.location.host}/<b>{profile.username || 'nama-pengguna'}</b></span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>Nama Tampilan / Nama Toko</label>
                        <input
                            type="text"
                            name="full_name"
                            value={profile.full_name}
                            onChange={handleChange}
                            placeholder="Contoh: Racun by Sarah"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>Bio Singkat</label>
                        <textarea
                            rows={3}
                            name="bio"
                            value={profile.bio}
                            onChange={handleChange}
                            placeholder="Ceritakan sedikit tentang produk kamu..."
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', fontFamily: 'inherit' }}
                        />
                    </div>

                    {/* Additional Settings */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
                        <h4 style={{ color: 'var(--text-color)', fontSize: '1rem', margin: '0 0 8px 0' }}>Media & Sosial</h4>

                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>Link Foto Profil / Unggah</label>
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                            <input
                                type="url"
                                name="avatar_url"
                                value={profile.avatar_url}
                                onChange={handleChange}
                                placeholder="Masukan URL / Klik Unggah..."
                                style={{ flex: 1, minWidth: 0, padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem' }}
                            />
                            <label style={{
                                background: 'white', color: 'var(--text-color)', border: '1px solid #cbd5e1', padding: '0 16px', borderRadius: '8px',
                                cursor: uploadingAvatar ? 'wait' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', whiteSpace: 'nowrap', transition: 'background-color 0.2s'
                            }}>
                                {uploadingAvatar ? '...' : 'Unggah File'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    disabled={uploadingAvatar}
                                    style={{ position: 'absolute', width: '1px', height: '1px', padding: 0, margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', borderWidth: 0 }}
                                />
                            </label>
                        </div>

                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>Instagram URL</label>
                        <input
                            type="url"
                            name="instagram_url"
                            value={profile.instagram_url}
                            onChange={handleChange}
                            placeholder="https://instagram.com/..."
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', marginBottom: '8px' }}
                        />

                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>TikTok URL</label>
                        <input
                            type="url"
                            name="tiktok_url"
                            value={profile.tiktok_url}
                            onChange={handleChange}
                            placeholder="https://tiktok.com/@..."
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', marginBottom: '8px' }}
                        />

                        <label style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-color)' }}>Nomor WhatsApp (dengan awalan 62)</label>
                        <input
                            type="text"
                            name="whatsapp_url"
                            value={profile.whatsapp_url}
                            onChange={handleChange}
                            placeholder="62812xxxxxx"
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '0.9rem', marginBottom: '8px' }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="lp-btn-small"
                        style={{ alignSelf: 'flex-start', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '10px' }}
                    >
                        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                </form>

                {/* Right side: Live Preview */}
                <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', marginBottom: '16px', color: 'var(--text-muted)' }}>Pratinjau Tampilan Publik</h3>
                    <div style={{
                        width: '100%',
                        maxWidth: '380px',
                        height: '700px',
                        border: '8px solid #333',
                        borderRadius: '36px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                        background: 'var(--bg-color)'
                    }}>
                        {profile.username ? (
                            <iframe
                                key={refreshKey}
                                src={`${window.location.origin}/${profile.username}`}
                                title="Profile Preview"
                                style={{ width: '100%', height: '100%', border: 'none' }}
                            />
                        ) : (
                            <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
                                <p>Silahkan isi dan simpan nama pengguna terlebih dahulu untuk melihat pratinjau.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
