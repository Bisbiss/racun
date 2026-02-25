import { useEffect, useState } from 'react'
import ProfileHeader from '../components/ProfileHeader'
import SocialLinks from '../components/SocialLinks'
import LinkCard from '../components/LinkCard'
import SEO from '../components/SEO'
import { useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import '../App.css'

export default function UserProfile() {
    const { username } = useParams();
    const [profile, setProfile] = useState<any>(null);
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOwner, setIsOwner] = useState(false);

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

                // Check if current visitor is the owner of this profile
                const { data: { session } } = await supabase.auth.getSession();
                if (session && profileData && session.user.id === profileData.id) {
                    setIsOwner(true);
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
        return (
            <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <SEO 
                    title="Memuat Profil" 
                    description="Tunggu sebentar, kami sedang memuat profil kamu."
                />
                Memuat profil...
            </div>
        );
    }

    if (!profile) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '20px' }}>
                <SEO 
                    title={`Profil Tidak Ditemukan`} 
                    description={`Profil @${username} tidak ditemukan atau belum dibuat. Buat profil Racun Link kamu sendiri sekarang!`}
                />
                <h1 style={{ fontSize: '4rem', marginBottom: '10px' }}>Opsi.</h1>
                <p style={{ color: 'var(--text-muted)' }}>Profil <b>@{username}</b> tidak ditemukan atau belum dibuat.</p>
                <a href="/" style={{ marginTop: '20px', padding: '10px 20px', background: 'var(--primary)', color: 'white', borderRadius: '50px', textDecoration: 'none' }}>Buat punyamu sekarang</a>
            </div>
        );
    }

    return (
        <div className="layout-container" style={{ background: profile.theme_color ? `linear-gradient(to bottom, #fff, ${profile.theme_color}33)` : 'var(--bg-color)' }}>
            <SEO
                title={`${profile.full_name || username} - Racun Link`}
                description={profile.bio || `Koleksi link rekomendasi dari ${profile.full_name || username}. Temukan barang-barang menarik dan racun belanja online di sini.`}
                image={profile.avatar_url || "/og-image.png"}
            />
            <main className="main-content">
                <ProfileHeader
                    name={profile.full_name || profile.username}
                    bio={profile.bio}
                    avatarUrl={profile.avatar_url}
                />
                <SocialLinks
                    instagram={profile.instagram_url}
                    tiktok={profile.tiktok_url}
                    whatsapp={profile.whatsapp_url}
                />

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

            {isOwner && (
                <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}>
                    <a href="/dashboard" style={{
                        background: '#0f172a',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                        transition: 'transform 0.2s',
                    }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Edit Tautan
                    </a>
                </div>
            )}

            <footer className="footer">
                <p>{profile.username || 'Racun'} &copy; {new Date().getFullYear()}</p>
            </footer>
        </div>
    )
}

