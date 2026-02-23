import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, totalLinks: 0, totalClicks: 0 });
    const [chartData, setChartData] = useState<any[]>([]);

    useEffect(() => {
        async function loadData() {
            // Count total users
            const { count: usersCount } = await supabase.from('profiles').select('id', { count: 'exact', head: true });

            // Count total active links
            const { count: linksCount } = await supabase.from('links').select('id', { count: 'exact', head: true }).eq('is_active', true);

            // Count total clicks entirely
            const { data: allClicks, count: clicksCount } = await supabase.from('link_clicks').select('created_at', { count: 'exact' });

            setStats({
                totalUsers: usersCount || 0,
                totalLinks: linksCount || 0,
                totalClicks: clicksCount || 0
            });

            // Prepare 7 Day chart data
            const last7Days = Array.from({ length: 7 }).map((_, i) => {
                const d = new Date();
                d.setDate(d.getDate() - (6 - i));
                return {
                    dateStr: d.toISOString().split('T')[0],
                    display: d.toLocaleDateString('id-ID', { weekday: 'short' }),
                    clicks: 0
                };
            });

            if (allClicks) {
                allClicks.forEach(click => {
                    const dateStr = click.created_at.split('T')[0];
                    const dayMatch = last7Days.find(d => d.dateStr === dateStr);
                    if (dayMatch) {
                        dayMatch.clicks += 1;
                    }
                });
            }

            setChartData(last7Days);
        }

        loadData();
    }, []);

    return (
        <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                <div style={{ background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)', borderRadius: '20px', padding: '24px', color: 'white', position: 'relative', overflow: 'hidden' }}>
                    <svg style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 }} width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '8px', opacity: 0.9 }}>Total Pengguna</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0 }}>{stats.totalUsers}</p>
                </div>

                <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '10px', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '12px', color: '#ef4444' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>Link Aktif (Total Sistem)</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>{stats.totalLinks}</p>
                </div>

                <div className="dash-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                        <div style={{ padding: '10px', background: '#FEF3C7', borderRadius: '12px', color: '#D97706' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <h3 style={{ color: 'var(--text-muted)', fontSize: '1rem', margin: 0 }}>Klik Keseluruhan Sistem</h3>
                    </div>
                    <p style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-color)', margin: 0 }}>{stats.totalClicks}</p>
                </div>
            </div>

            <div className="dash-card" style={{ marginTop: '32px', padding: '32px' }}>
                <h3 style={{ color: 'var(--text-color)', fontSize: '1.2rem', marginBottom: '32px', fontWeight: 600 }}>Statistik Pengunjung Sistem (7 Hari)</h3>

                <div style={{ width: '100%', height: 350 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorAdminClicks" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="display" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '12px' }}
                                itemStyle={{ color: '#ef4444', fontWeight: 600 }}
                            />
                            <Area type="monotone" dataKey="clicks" name="Total Klik Seluruh Sistem" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminClicks)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
