import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './DashboardLinks.css';

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
            <div className="dl-header">
                <h2 className="dl-title">Katalog Link Kamu</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="dl-btn-add"
                    >
                        + Tambah Link
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleAddLink} className="dl-form-container">
                    <input
                        type="text"
                        placeholder="Judul (Misal: Sepatu Shopee Viral)"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        required
                        className="dl-input"
                    />
                    <input
                        type="url"
                        placeholder="URL (Misal: https://shp.ee/...)"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                        required
                        className="dl-input"
                    />
                    <div className="dl-actions">
                        <button type="submit" className="dl-btn-save">Simpan Link</button>
                        <button type="button" onClick={() => setIsAdding(false)} className="dl-btn-cancel">Batal</button>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="dl-empty">Memuat link...</p>
            ) : links.length === 0 ? (
                <p className="dl-empty">Belum ada link yang ditambahkan. Yuk buat link affiliate pertamamu!</p>
            ) : (
                <div className="dl-list">
                    {links.map((link) => (
                        <div key={link.id} className="dl-item">
                            <div className="dl-item-content">
                                <h3 className="dl-item-title">{link.title}</h3>
                                <a href={link.url} target="_blank" rel="noreferrer" className="dl-item-url">{link.url}</a>
                            </div>
                            <div className="dl-item-actions">
                                <button
                                    onClick={() => toggleStatus(link.id, link.is_active)}
                                    className="dl-btn-toggle"
                                    style={{
                                        background: link.is_active ? '#fee2e2' : '#d1fae5',
                                        color: link.is_active ? '#991b1b' : '#065f46'
                                    }}
                                >
                                    {link.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                </button>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    className="dl-btn-delete"
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
