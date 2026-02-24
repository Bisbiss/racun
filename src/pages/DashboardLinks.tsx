import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import './DashboardLinks.css';

interface LinkType {
    id: string;
    title: string;
    url: string;
    icon: string | null;
    is_active: boolean;
    order_index: number;
    clicks?: number;
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

            // Fetch Links
            const { data: linksData, error } = await supabase
                .from('links')
                .select('*')
                .eq('user_id', session.user.id)
                .order('order_index', { ascending: true });

            if (error) throw error;

            if (linksData && linksData.length > 0) {
                // Fetch Clicks
                const linkIds = linksData.map(l => l.id);
                const { data: clicksData } = await supabase
                    .from('link_clicks')
                    .select('link_id')
                    .in('link_id', linkIds);

                // Calculate click counts
                const clickCounts: Record<string, number> = {};
                if (clicksData) {
                    clicksData.forEach(c => {
                        clickCounts[c.link_id] = (clickCounts[c.link_id] || 0) + 1;
                    });
                }

                // Map clicks to links
                const finalLinks = linksData.map(link => ({
                    ...link,
                    clicks: clickCounts[link.id] || 0
                }));

                setLinks(finalLinks);
            } else {
                setLinks([]);
            }

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

            if (data && data.length > 0) {
                const newLink = { ...data[0], clicks: 0 };
                setLinks([...links, newLink]);
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
        if (!window.confirm('Verifikasi: Apakah Anda Yakin ingin menghapus link ini?')) return;
        try {
            const { error } = await supabase.from('links').delete().eq('id', id);
            if (error) throw error;
            setLinks(links.filter(l => l.id !== id));
        } catch (error) {
            console.error('Error deleting link:', error);
            alert('Gagal menghapus link.')
        }
    }

    async function toggleStatus(id: string, currentStatus: boolean) {
        try {
            const { error } = await supabase.from('links').update({ is_active: !currentStatus }).eq('id', id);
            if (error) throw error;
            setLinks(links.map(l => l.id === id ? { ...l, is_active: !currentStatus } : l));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Gagal memperbaharui status link.')
        }
    }

    async function moveLink(index: number, direction: 'up' | 'down') {
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === links.length - 1) return;

        const updatedLinks = [...links];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;

        // Swap items in the local array
        const temp = updatedLinks[index];
        updatedLinks[index] = updatedLinks[swapIndex];
        updatedLinks[swapIndex] = temp;

        // Re-assign order_index based on new array order
        const reorderedLinks = updatedLinks.map((link, i) => ({ ...link, order_index: i }));
        setLinks(reorderedLinks);

        // Batch update to Supabase
        try {
            // Promise.all to update the swapped elements
            await Promise.all([
                supabase.from('links').update({ order_index: reorderedLinks[index].order_index }).eq('id', reorderedLinks[index].id),
                supabase.from('links').update({ order_index: reorderedLinks[swapIndex].order_index }).eq('id', reorderedLinks[swapIndex].id)
            ]);
        } catch (error) {
            console.error('Failed to update orders in DB', error);
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
                    {links.map((link, index) => (
                        <div key={link.id} className="dl-item">
                            <div className="dl-item-drag">
                                <button
                                    onClick={() => moveLink(index, 'up')}
                                    disabled={index === 0}
                                    className="dl-btn-move"
                                    title="Pindah ke Atas"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="18 15 12 9 6 15"></polyline>
                                    </svg>
                                </button>
                                <button
                                    onClick={() => moveLink(index, 'down')}
                                    disabled={index === links.length - 1}
                                    className="dl-btn-move"
                                    title="Pindah ke Bawah"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>

                            <div className="dl-item-content">
                                <h3 className="dl-item-title">
                                    {link.title}
                                    <div className="dl-badge-clicks">
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                        </svg>
                                        {link.clicks || 0} Klik
                                    </div>
                                </h3>
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
