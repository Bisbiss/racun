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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Katalog Link Kamu</h2>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors cursor-pointer"
                    >
                        + Tambah Link
                    </button>
                )}
            </div>

            {isAdding && (
                <form onSubmit={handleAddLink} className="dashboard-form">
                    <div className="flex flex-col gap-3">
                        <input
                            type="text"
                            placeholder="Judul (Misal: Sepatu Shopee Viral)"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                            className="p-3 rounded-lg border border-gray-200 text-base"
                        />
                        <input
                            type="url"
                            placeholder="URL (Misal: https://shp.ee/...)"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            required
                            className="p-3 rounded-lg border border-gray-200 text-base"
                        />
                        <div className="flex gap-2">
                            <button type="submit" className="dashboard-btn dashboard-btn-primary">Simpan Link</button>
                            <button type="button" onClick={() => setIsAdding(false)} className="dashboard-btn bg-gray-100 hover:bg-gray-200">Batal</button>
                        </div>
                    </div>
                </form>
            )}

            {loading ? (
                <p className="text-gray-500">Memuat link...</p>
            ) : links.length === 0 ? (
                <p className="text-gray-500">Belum ada link yang ditambahkan. Yuk buat link affiliate pertamamu!</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {links.map((link) => (
                        <div key={link.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border border-gray-200 rounded-lg bg-white gap-4 md:gap-0">
                            <div className="flex flex-col gap-1 opacity-90">
                                <span className="font-bold text-lg">{link.title}</span>
                                <a href={link.url} target="_blank" rel="noreferrer" className="text-primary text-sm hover:underline">{link.url}</a>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto justify-end">
                                <button
                                    onClick={() => toggleStatus(link.id, link.is_active)}
                                    className="px-3 py-1.5 rounded-lg text-sm cursor-pointer"
                                    style={{ background: link.is_active ? '#fee2e2' : '#d1fae5', color: link.is_active ? '#991b1b' : '#065f46', border: 'none' }}
                                >
                                    {link.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                                </button>
                                <button
                                    onClick={() => handleDelete(link.id)}
                                    className="px-3 py-1.5 rounded-lg text-sm cursor-pointer border border-gray-200 bg-white text-gray-600"
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
