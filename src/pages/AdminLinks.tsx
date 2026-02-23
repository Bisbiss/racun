import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AdminLinks() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLinks() {
            setLoading(true);
            // Fetch all links belonging to users
            const { data } = await supabase
                .from('links')
                .select(`*, profiles(username)`)
                .order('created_at', { ascending: false });

            if (data) setLinks(data);
            setLoading(false);
        }
        fetchLinks();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Yakin ingin menghapus link ini dari sistem?')) return;

        await supabase.from('links').delete().eq('id', id);
        setLinks(links.filter(l => l.id !== id));
    };

    if (loading) return <div>Memuat data link...</div>;

    return (
        <div className="dash-card">
            <h3 style={{ fontSize: '1.2rem', marginBottom: '24px' }}>Manajemen Semua Tautan ({links.length})</h3>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e2e8f0', color: 'var(--text-muted)' }}>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Tautan</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Pemilik</th>
                            <th style={{ padding: '16px', fontWeight: 600 }}>Status</th>
                            <th style={{ padding: '16px', fontWeight: 600, textAlign: 'right' }}>Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {links.map(link => (
                            <tr key={link.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                <td style={{ padding: '16px' }}>
                                    <div style={{ fontWeight: 600, color: '#111827' }}>{link.title}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><a href={link.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>{link.url}</a></div>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-color)' }}>
                                    <a href={`/${link.profiles?.username}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1f2937', fontWeight: 500, textDecoration: 'none' }}>
                                        @{link.profiles?.username}
                                    </a>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    {link.is_active ?
                                        <span style={{ background: '#d1fae5', color: '#065f46', padding: '4px 8px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Aktif</span> :
                                        <span style={{ background: '#fee2e2', color: '#991b1b', padding: '4px 8px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Mati</span>
                                    }
                                </td>
                                <td style={{ padding: '16px', textAlign: 'right' }}>
                                    <button
                                        onClick={() => handleDelete(link.id)}
                                        style={{ backgroundColor: '#fee2e2', color: '#991b1b', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500 }}
                                    >Hapus Paksa</button>
                                </td>
                            </tr>
                        ))}
                        {links.length === 0 && (
                            <tr>
                                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>Belum ada tautan ditambahkan</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
