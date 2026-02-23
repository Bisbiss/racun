import { useEffect, useState } from 'react'
import ProfileHeader from '../components/ProfileHeader'
import SocialLinks from '../components/SocialLinks'
import LinkCard from '../components/LinkCard'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../App.css'

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUserData() {
            setLoading(true);
            try {
                // Fetch profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('username', username?.toLowerCase())
                    .single();

                if (profileError || !profileData) throw new Error('User not found');
                setProfile(profileData);

                // Fetch public links
                const { data: linksData, error: linksError } = await supabase
                    .from('links')
                    .select('*')
                    .eq('user_id', profileData.id)
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (!linksError && linksData) {
                    setLinks(linksData);
                }
            } catch (err) {
                console.error(err);
                setProfile(null);
            } finally {
                setLoading(false);
            }
        }

        if (username) fetchUserData();
    }, [username]);

    const handleLinkClick = async (linkId: string) => {
        // Record click silently
        await supabase.from('link_clicks').insert([{ link_id: linkId }]);
    };

    if (loading) {
        return <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>Memuat profil...</div>;
    }

    if (!profile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>Opsi.</h1>
                <p style={{ color: 'var(--text-muted)' }}>Profil <b>@{username}</b> tidak ditemukan atau belum dibuat.</p>
                <a href="/" style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '50px', textDecoration: 'none' }}>Buat punyamu sekarang</a>
            </div>
        );
    }

    return (
        <div className="layout-container" style={{ background: profile.theme_color ? `linear-gradient(to bottom, #fff, ${profile.theme_color}33)` : 'var(--bg-color)' }}>
            <main className="main-content">
                <ProfileHeader
                    name={profile.full_name || profile.username}
                    bio={profile.bio}
                    avatarUrl={profile.avatar_url}
                />
                <SocialLinks />

                <div className="links-container">
                    {links.map((link, index) => (
                        <div key={link.id} onClick={() => handleLinkClick(link.id)}>
                            <LinkCard
                                id={link.id}
                                title={link.title}
                                url={link.url}
                                icon={link.icon || 'link'}
                                index={index}
                            />
                        </div>
                    ))}
                </div>
            </main>

            <footer className="footer">
                <p>{profile.username || 'Racun'} Link &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}

