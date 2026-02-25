import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SEO from '../components/SEO';
import './AdminDashboard.css';

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
        <div className="ad-container">
            <SEO 
                title="Dashboard Admin - Racun Link" 
                description="Kelola semua pengguna, link, dan statistik klik di platform Racun Link." 
            />
            {/* Stats Grid */}
            <div className="ad-stats-grid">
                <div style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)',
                    borderRadius: '20px',
                    padding: '24px',
                    color: 'white',
                    boxShadow: '0 10px 25px -5px rgba(239, 68, 68, 0.3)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <svg style={{ position: 'absolute', right: '-10px', bottom: '-10px', opacity: 0.2 }} width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                    </svg>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                        <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '14px', backdropFilter: 'blur(10px)' }}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0, opacity: 0.9 }}>Total Pengguna</h3>
                    </div>
                    <div>
                        <p style={{ fontSize: '2.5rem', fontWeight: '800', margin: 0, lineHeight: 1 }}>{stats.totalUsers}</p>
                        <p style={{ fontSize: '0.85rem', margin: '8px 0 0 0', opacity: 0.8 }}>Orang mendaftar / Akun</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-header">
                        <div className="ad-stat-icon links">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                            </svg>
                        </div>
                        <h3 className="ad-stat-title">Link Aktif (Sistem)</h3>
                    </div>
                    <div>
                        <p className="ad-stat-value">{stats.totalLinks}</p>
                        <p className="ad-stat-subtitle">Tautan yang statusnya ON</p>
                    </div>
                </div>

                <div className="ad-stat-card">
                    <div className="ad-stat-header">
                        <div className="ad-stat-icon clicks">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                            </svg>
                        </div>
                        <h3 className="ad-stat-title">Klik Link (Sistem)</h3>
                    </div>
                    <div>
                        <p className="ad-stat-value">{stats.totalClicks}</p>
                        <p className="ad-stat-subtitle">Lalu lintas tercatat total</p>
                    </div>
                </div>
            </div>

            {/* Chart Card */}
            <div className="ad-chart-card">
                <h3 className="ad-card-title">Statistik Pengunjung Jaringan (7 Hari)</h3>

                <div style={{ width: '100%', overflowX: 'auto' }}>
                    <div style={{ minWidth: '400px', height: '350px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorAdminClicks" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="display" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', padding: '12px' }}
                                    itemStyle={{ color: '#ef4444', fontWeight: 600 }}
                                />
                                <Area type="monotone" dataKey="clicks" name="Total Klik Seluruh Sistem" stroke="#ef4444" strokeWidth={3} fillOpacity={1} fill="url(#colorAdminClicks)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
