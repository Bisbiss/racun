import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUsers() {
            setLoading(true);
            // Fetch all profiles
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false });

            if (data) setUsers(data);
            setLoading(false);
        }
        fetchUsers();
    }, []);

    const handleDelete = async (userId: string) => {
        if (!confirm('Apakah Yakin ingin menghapus pengguna ini beserta semua link-nya?')) return;

        // Admin removing users
        // Since auth.users is owned by Supabase Auth, you usually just delete the profile.
        // Because of "on delete cascade" on the DB, ideally you delete from auth.users (requires service role).
        // For this demo, we just delete their profile (and links via cascade, but auth record remains).
        await supabase.from('profiles').delete().eq('id', userId);
        setUsers(users.filter(u => u.id !== userId));
    };

    if (loading) return <div>Memuat data pengguna...</div>;

    return (
        <div className="dash-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Daftar Pengguna ({users.length})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Username</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Nama Toko</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Bergabung</th>
                            <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <img
                                            src={user.avatar_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.username}`}
                                            alt={user.username}
                                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                                        />
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#111827' }}>@{user.username}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.id.substring(0, 8)}...</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-color)' }}>{user.full_name || '-'}</td>
                                <td style={{ padding: '16px', color: 'var(--text-muted)' }}>{new Date(user.created_at).toLocaleDateString('id-ID')}</td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <a
                                        href={`/${user.username}`}
                                        target="_blank"
                                        style={{ backgroundColor: '#f3f4f6', color: '#374151', padding: '6px 12px', borderRadius: '6px', textDecoration: 'none', marginRight: '8px', fontSize: '0.9rem', fontWeight: 500 }}
                                    >Lihat</a>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                                        disabled={user.role === 'admin'}
                                    >Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada pengguna terdaftar</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
