import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from './SEO';
import './DashboardLayout.css'; // We can reuse the CSS for the dashboard structure

export default function AdminLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function checkAdmin() {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/login');
                return;
            }

            // Check if user has admin role
            const { data } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            // Check if role is admin
            if (data?.role === 'admin') {
                setIsAdmin(true);
            } else {
                // Not an admin, redirect to normal dashboard
                navigate('/dashboard');
            }
            setLoading(false);
        }
        checkAdmin();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const adminNavItems = [
        { path: '/admin', label: 'Analytics', icon: '📈' },
        { path: '/admin/users', label: 'Manage User', icon: '👥' },
        { path: '/admin/links', label: 'Manage Link', icon: '🔗' },
        { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    ];

    const currentTabLabel = adminNavItems.find(i => i.path === location.pathname)?.label || 'Admin Area';

    if (loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Memverifikasi Akses...</div>;
    }

    if (!isAdmin) return null;

    return (
        <div className="dashboard-container">
            <SEO title={`${currentTabLabel} - Admin Racun Link`} />
            <aside className="dashboard-sidebar" style={{ borderRight: '1px solid #fecaca' }}>
                <div className="sidebar-header">
                    <h2>
                        Racun<span style={{ color: '#ef4444' }}>Admin</span>
                    </h2>
                </div>

                <nav className="sidebar-nav">
                    {adminNavItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '12px 16px',
                                borderRadius: '12px',
                                color: location.pathname === item.path ? '#ef4444' : 'var(--text-muted)',
                                textDecoration: 'none',
                                fontWeight: 500,
                                background: location.pathname === item.path ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <button onClick={handleLogout} className="sidebar-link logout-btn" style={{ marginTop: 'auto', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '1rem', color: '#ef4444', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px' }}>
                        <span className="sidebar-icon">🚪</span>
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header" style={{ borderBottom: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <h1>{currentTabLabel}</h1>
                </header>

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
