import { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import SEO from './SEO';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const [username, setUsername] = useState<string>('');
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

    useEffect(() => {
        async function fetchUsername() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            const { data } = await supabase
                .from('profiles')
                .select('username, role')
                .eq('id', session.user.id)
                .single();

            if (data?.role === 'admin') {
                navigate('/admin');
                return;
            }

            if (data?.username) {
                setUsername(data.username);
            }
        }
        fetchUsername();
    }, [location.pathname]); // Re-fetch if they navigate around, especially back from settings

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Analytics', icon: '📊' },
        { path: '/dashboard/links', label: 'Manage Links', icon: '🔗' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
    ];

    const currentTabLabel = navItems.find(i => i.path === location.pathname)?.label || 'Dashboard';

    return (
        <div className="dashboard-container">
            <SEO 
                title={`${currentTabLabel} - Racun Link Dashboard`} 
                description="Kelola link affiliate dan profil kamu di platform Racun Link" 
            />
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>
                        Racun<span>Link</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
                        </svg>
                    </h2>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <button onClick={() => {
                        handleLogout();
                        setSidebarOpen(false);
                    }} className="sidebar-link logout-btn">
                        <span className="sidebar-icon">🚪</span>
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>
                        {currentTabLabel}
                    </h1>
                    <a
                        href={username ? `/${username}` : '#'}
                        target="_blank"
                        className="preview-btn"
                        onClick={(e) => {
                            if (!username) {
                                e.preventDefault();
                                alert('Silakan atur username di Settings terlebih dahulu.');
                            }
                        }}
                    >
                        Melihat Profil Publik
                    </a>
                </header>

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>

            {/* Mobile Sidebar Toggle Button */}
            <button 
                className="sidebar-toggle-btn" 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label={sidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
            >
                {sidebarOpen ? '✕' : '☰'}
            </button>
        </div>
    );
}