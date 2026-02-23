import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function UserDashboard() {
    const [stats, setStats] = useState({ totalClicks: 0, totalLinks: 0, topLink: 'Loading...' });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function loadStats() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            const userId = session.user.id;

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
                totalLinks: links.length,
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

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
                <div className="dash-card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Klik URL</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>{stats.totalClicks}</p>
                </div>

                <div className="dash-card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Total Tautan Aktif</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>{stats.totalLinks}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>Dibagikan di profil</p>
                </div>

                <div className="dash-card">
                    <h3 style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}>Link Terpopuler</h3>
                    <p style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--text-color)', margin: 0 }}>{stats.topLink}</p>
                </div>
            </div>

            <div className="dash-card" style={{ marginTop: '24px' }}>
                <h3 style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '24px' }}>Statistik Pengunjung (7 Hari Terakhir)</h3>

                <div style={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="display" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                            />
                            <Area type="monotone" dataKey="clicks" name="Klik" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorClicks)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
