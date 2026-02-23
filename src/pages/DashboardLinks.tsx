import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface LinkType {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    is_active: boolean;
}

export default function DashboardLinks() {
    const [links, setLinks] = useState<LinkType[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // New link form state
    const [newTitle, setNewTitle] = useState('');
    const [newUrl, setNewUrl] = useState('');

    useEffect(() => {
        fetchLinks();
    }, []);

    async function fetchLinks() {
        try {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase
                .from('links')
                .select('*')
                .eq('user_id', session.user.id)
                .order('order_index', { ascending: true });

            if (error) throw error;
            setLinks(data || []);
        } catch (error) {
            console.error('Error fetching links:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleAddLink(e: React.FormEvent) {
        e.preventDefault();
        if (!newTitle.trim() || !newUrl.trim()) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data, error } = await supabase.from('links').insert([{
                user_id: session.user.id,
                title: newTitle,
                url: newUrl,
                icon: 'link', // Default icon
                order_index: links.length // Append at the end
            }]).select();

            if (error) throw error;

            if (data) {
                setLinks([...links, ...data]);
                setIsAdding(false);
                setNewTitle('');
                setNewUrl('');
            }
        } catch (error) {
            console.error('Error adding link:', error);
            alert('Gagal menambah link.');
        }
    }

    async function handleDelete(id: string) {
        if (!window.confirm('Hapus link ini?')) return;
        try {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            setLinks(links.filter(l => l.id !== id));
        } catch (error) {
            console.error('Error deleting link:', error);
        }
    }

    async function toggleStatus(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase.from('links').update({ is_active: !currentStatus }).eq('id', id);
            if (error) throw error;
            setLinks(links.map(l => l.id === id ? { ...l, is_active: !currentStatus } : l));
        } catch (error) {
            console.error('Error updating status:', error);
        }
    }

    return (
        <div className="dash-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.2rem' }}>Katalog Link Kamu</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="lp-btn-small"
                        style={{ border: 'none', cursor: 'pointer' }}
                    >
                        + Tambah Link
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleAddLink} style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="Judul (Misal: Sepatu Shopee Viral)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                        <input
                            type="url"
                            placeholder="URL (Misal: https://shp.ee/...)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            required
                            style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button type="submit" className="lp-btn-small" style={{ cursor: 'pointer', border: 'none' }}>Simpan Link</button>
                            <button type="button" onClick={() => setIsAdding(false)} style={{ padding: '8px 16px', borderRadius: '50px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}>Batal</button>
                        </div>
                    </div>
                </form>
            )}

            {loading ? (
                <p style={{ color: 'var(--text-muted)' }}>Memuat link...</p>
            ) : links.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>Belum ada link yang ditambahkan. Yuk buat link affiliate pertamamu!</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {links.map((link) => (
                        <div key={link.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid #e2e8f0', borderRadius: '12px', background: link.is_active ? 'white' : '#f8fafc' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', opacity: link.is_active ? 1 : 0.5 }}>
                                <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>{link.title}</span>
                                <a href={link.url} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none' }}>{link.url}</a>
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => toggleStatus(link.id, link.is_active)}
                                    style={{ padding: '6px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', background: link.is_active ? '#fee2e2' : '#d1fae5', color: link.is_active ? '#991b1b' : '#065f46', fontSize: '0.85rem' }}
                                >
                                    {link.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                </button>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid #e2e8f0', cursor: 'pointer', background: 'white', color: '#64748b', fontSize: '0.85rem' }}
                                >
                                    Hapus
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
