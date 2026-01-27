import React from 'react';
import { Link } from 'react-router-dom';
import galleryIcon from '../assets/gallery_icon.svg';
import './Community.css';

const Community = ({ gallery = [] }) => {
  const items = gallery.length ? gallery : new Array(8).fill(0).map((_, i) => ({ id: i + 1 }));

  return (
    <div className="community-page">
      <div className="community-header">
        <h2>Community Images</h2>
        <p className="muted">Browse community shared images</p>
      </div>

      <div className="community-grid">
        {items.map((item, idx) => (
          <Link to={`/community/gallery/${item.id || idx + 1}`} className="community-card" key={item.id || idx}>
            <div className="community-card-image">
              {item.src ? <img src={item.src} alt={`img-${item.id || idx}`} /> : <img src={galleryIcon} alt={`img-${item.id || idx}`} />}
            </div>
            <div className="community-card-title">{item.id ? `Community Image ${item.id}` : `Community Image #${idx + 1}`}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Community;
