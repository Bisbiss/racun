import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './UserDashboard.css';

export default function UserDashboard() {
    const [stats, setStats] = useState({ totalClicks: 0, totalLinks: 0, topLink: 'Belum ada data', topLinkClicks: 0 });
    const [chartData, setChartData] = useState<any[]>([]);
    const [userName, setUserName] = useState('');
    const [recentLinks, setRecentLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadStats() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const userId = session.user.id;

            // Fetch name for greeting
            const { data: profile } = await supabase.from('profiles').select('full_name, username').eq('id', userId).single();
            if (profile) setUserName(profile.full_name || profile.username || 'Kreator');

            // Fetch Links specifically for this user to count total
            const { data: links, error: linksError } = await supabase
                .from('links')
                .select('*')
                .eq('user_id', userId);

            if (linksError || !links) return;

            const linkIds = links.map(l => l.id);

            // Fetch clicks
            let allClicks: any[] = [];
            if (linkIds.length > 0) {
                // Find clicks attached to these specific linkIds
                const { data: clicks } = await supabase
                    .from('link_clicks')
                    .select('id, link_id, created_at')
                    .in('link_id', linkIds);

                if (clicks) allClicks = clicks;
            }

            // Compute Top Link
            const clickCounts = allClicks.reduce((acc: any, click) => {
                acc[click.link_id] = (acc[click.link_id] || 0) + 1;
                return acc;
            }, {});

            let maxClicks = 0;
            let topLinkId = null;
            for (const [id, count] of Object.entries(clickCounts)) {
                if ((count as number) > maxClicks) {
                    maxClicks = count as number;
                    topLinkId = id;
                }
            }

            const topLinkObj = links.find(l => l.id === topLinkId);

            setStats({
                totalClicks: allClicks.length,
                totalLinks: links.filter(l => l.is_active).length, // Only count active
                topLink: topLinkObj ? topLinkObj.title : 'Belum ada data',
                topLinkClicks: maxClicks
            });

            // Get recent links (last 5)
            const sortedLinks = [...links].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setRecentLinks(sortedLinks.slice(0, 5));

            // Prepare Chart Data (Last 7 days counting from today)
            const last7Days = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return {
                    dateObj: d,
                    dateStr: d.toISOString().split('T')[0],
                    display: d.toLocaleDateString('id-ID', { weekday: 'short' }),
                    clicks: 0
                };
            });

            // Populate chart data clicks
            allClicks.forEach(click => {
                const dateStr = click.created_at.split('T')[0];
                const dayMatch = last7Days.find(d => d.dateStr === dateStr);
                if (dayMatch) {
                    dayMatch.clicks += 1;
                }
            });

            setChartData(last7Days);
            setLoading(false);
        }

        loadStats();
    }, []);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 11) return "Selamat Pagi";
        if (hour < 15) return "Selamat Siang";
        if (hour < 18) return "Selamat Sore";
        return "Selamat Malam";
    };

    if (loading) {
        return <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>Mempersiapkan Dasbor...</div>;
    }

    return (
        <div className="ud-container">
            {/* Greeting Card */}
            <div className="ud-greeting">
                <div className="ud-greeting-text">
                    <h2>{getGreeting()}, {userName}! 👋</h2>
                    <p>Pantau perkembangan tautan tokomu dalam 7 hari terakhir.</p>
                </div>
                <div className="ud-greeting-icon">
                    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                    </svg>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="ud-stats-grid">
                <div className="ud-stat-card">
                    <div className="ud-stat-header">
                        <div className="ud-stat-icon clicks">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <h3 className="ud-stat-title">Total Pengunjung</h3>
                    </div>
                    <div>
                        <p className="ud-stat-value">{stats.totalClicks}</p>
                        <p className="ud-stat-subtitle">Total klik keseluruhan</p>
                    </div>
                </div>

                <div className="ud-stat-card">
                    <div className="ud-stat-header">
                        <div className="ud-stat-icon links">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                <line x1="9" y1="3" x2="9" y2="21"></line>
                            </svg>
                        </div>
                        <h3 className="ud-stat-title">Tautan Aktif</h3>
                    </div>
                    <div>
                        <p className="ud-stat-value">{stats.totalLinks}</p>
                        <p className="ud-stat-subtitle">Link yang tampil di profil</p>
                    </div>
                </div>

                <div className="ud-stat-card">
                    <div className="ud-stat-header">
                        <div className="ud-stat-icon top">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <h3 className="ud-stat-title">Tautan Bintang</h3>
                    </div>
                    <div>
                        <p className="ud-stat-value" style={{ fontSize: '1.25rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {stats.topLink}
                        </p>
                        <p className="ud-stat-subtitle">{stats.topLinkClicks} klik didapatkan</p>
                    </div>
                </div>
            </div>

            {/* Bottom Grid: Chart & Recent */}
            <div className="ud-bottom-grid">
                {/* Chart Card */}
                <div className="ud-chart-card">
                    <h3 className="ud-card-title">Statistik 7 Hari (Klik)</h3>
                    <div style={{ width: '100%', overflowX: 'auto' }}>
                        <div style={{ minWidth: '400px', height: 320, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="display" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                    <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 600 }}
                                    />
                                    <Area type="monotone" dataKey="clicks" name="Sistem Klik" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Links Card */}
                <div className="ud-recent-card">
                    <div className="ud-card-title">
                        <span>Tautan Terbaru</span>
                        <Link to="/dashboard/links" style={{ fontSize: '0.9rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Kelola</Link>
                    </div>

                    {recentLinks.length > 0 ? (
                        <div className="ud-recent-list">
                            {recentLinks.map(link => (
                                <div key={link.id} className="ud-recent-item">
                                    <div className="ud-recent-icon">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                                        </svg>
                                    </div>
                                    <div className="ud-recent-info">
                                        <h4 className="ud-recent-title">{link.title || 'Tanpa Judul'}</h4>
                                        <a href={link.url} target="_blank" rel="noreferrer" className="ud-recent-url">{link.url}</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="ud-empty-state">
                            <p style={{ margin: 0, marginBottom: '16px' }}>Belum ada tautan dibuat.</p>
                            <Link to="/dashboard/links" style={{
                                padding: '8px 16px',
                                background: 'var(--primary)',
                                color: 'white',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontWeight: 600,
                                display: 'inline-block'
                            }}>
                                Buat Sekarang
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
