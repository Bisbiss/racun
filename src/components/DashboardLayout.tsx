import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import './DashboardLayout.css';

export default function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Analytics', icon: '📊' },
        { path: '/dashboard/links', label: 'Manage Links', icon: '🔗' },
        { path: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="dashboard-container">
            <aside className="dashboard-sidebar">
                <div className="sidebar-header">
                    <h2>Racun<span>Link</span></h2>
                </div>

                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <span className="sidebar-icon">{item.icon}</span>
                            {item.label}
                        </Link>
                    ))}

                    <button onClick={handleLogout} className="sidebar-link logout-btn">
                        <span className="sidebar-icon">🚪</span>
                        Logout
                    </button>
                </nav>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>
                        {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
                    </h1>
                    <a href="/preview" target="_blank" className="preview-btn">
                        Melihat Profil Publik
                    </a>
                </header>

                <div className="dashboard-content">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
