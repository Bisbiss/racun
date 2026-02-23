import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserDashboard() {
    const [stats, setStats] = useState({ totalClicks: 0, totalLinks: 0, topLink: 'Memuat...' });
    const [chartData, setChartData] = useState<any[]>([]);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        async function loadStats() {
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
                topLink: topLinkObj ? `${topLinkObj.title} (${maxClicks} klik)` : 'Belum ada data'
            });

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

    return (
        <div className="dashboard-container">
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-color)', marginBottom: '4px' }}>
                    {getGreeting()}, {userName}! 👋
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Ini adalah pantauan aktivitas link tokomu selama 7 hari terakhir.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    borderRadius: '20px',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 10px 15px -3px rgba(16, 185, 129, 0.3)',
                    position: 'relative',
                    overflow: 'hidden'
                }} className="dash-card">
                    <svg style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 }} width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px', opacity: 0.9 }}>Total Klik URL</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{stats.totalClicks}</p>
                </div>

                <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '10px', background: 'var(--bg-color)', borderRadius: '12px', color: 'var(--primary)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>Tautan Aktif</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>{stats.totalLinks}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Sedang berjalan di profil</p>
                </div>

                <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '10px', background: '#FEF3C7', borderRadius: '12px', color: '#D97706' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                        </div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>Link Terpopuler</h3>
                    </div>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-color)', margin: 0, marginTop: '8px' }}>{stats.topLink}</p>
                </div>
            </div>

            <div className="dash-card" style={{ marginTop: '32px' }}>
                <h3 style={{ color: 'var(--text-color)', fontSize: '1.2rem', marginBottom: '32px', fontWeight: 600 }}>Statistik Pengunjung (7 Hari)</h3>

                <div style={{ width: '100%' }}>
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="display" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '12px' }}
                                itemStyle={{ color: 'var(--primary)', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="clicks" name="Total Klik" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
