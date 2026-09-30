import React, { useState } from 'react';
import { getUserAvatarUrl, getUserInitials } from '../utils/imageFallback';

/**
 * Reusable CarCraft User Avatar component.
 * Displays the user's actual profile photo when available.
 * If the image is null/empty or fails to load, gracefully displays the user's
 * initials in a sleek, neon-green outlined CarCraft dark glass badge.
 */
export default function UserAvatar({
  user,
  size = 26,
  fontSize = '0.72rem',
  className = '',
  style = {},
}) {
  const [hasError, setHasError] = useState(false);
  const avatarUrl = getUserAvatarUrl(user);
  const initials = getUserInitials(user);

  if (avatarUrl && !hasError) {
    return (
      <img
        src={avatarUrl}
        alt={user?.name || user?.username || 'User Profile'}
        className={className}
        onError={() => setHasError(true)}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: '50%',
          objectFit: 'cover',
          border: '1px solid #bef264',
          display: 'block',
          flexShrink: 0,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, rgba(190, 242, 100, 0.22), rgba(132, 204, 22, 0.12))',
        border: '1px solid rgba(190, 242, 100, 0.65)',
        color: '#bef264',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
        fontWeight: 800,
        fontSize,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        userSelect: 'none',
        boxShadow: '0 0 10px rgba(190, 242, 100, 0.2)',
        flexShrink: 0,
        ...style,
      }}
    >
      {initials}
    </div>
  );
}
