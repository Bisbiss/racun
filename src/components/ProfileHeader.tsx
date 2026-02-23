import './ProfileHeader.css';

interface ProfileHeaderProps {
  name: string;
  bio: string;
  avatarUrl?: string;
}

export default function ProfileHeader({ name, bio, avatarUrl }: ProfileHeaderProps) {
  const seed = name ? name.replace(/\s+/g, '') : 'RacunLink';
  const defaultAvatar = `https://api.dicebear.com/7.x/notionists/svg?seed=${seed}&backgroundColor=b6e3f4`;

  return (
    <div className="profile-header">
      <div className="avatar-container">
        <img
          src={avatarUrl || defaultAvatar}
          alt="Profile Avatar"
          className="avatar"
        />
      </div>
      <h1 className="profile-name">{name || 'Nama Toko'}</h1>
      <p className="profile-bio" style={{ whiteSpace: 'pre-line' }}>{bio || 'Belum ada bio'}</p>
    </div>
  )
}

