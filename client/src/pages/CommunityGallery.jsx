import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import galleryIcon from '../assets/gallery_icon.svg';
import './Community.css';

const CommunityGallery = ({ gallery = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const image = gallery.find(img => String(img.id) === String(id));

  return (
    <div className="community-page">
      <div className="community-header">
        <button className="community-back" onClick={() => navigate('/community')}>← Back</button>
        <h2>Community Image #{id}</h2>
      </div>

      <div className="community-detail-card">
        <div className="community-detail-image">
          {image ? <img src={image.src} alt={`community-${id}`} /> : <img src={galleryIcon} alt={`community-${id}`} />}
        </div>
        <div className="community-detail-meta">
          <h3>{image ? (image.text || `Community Image ${image.id}`) : 'Sample Community Image'}</h3>
          <p className="muted">{image ? `Uploaded by ${image.uploader} • ID: ${image.id}` : `Uploaded by community • ID: ${id}`}</p>
          <p>{image ? `Uploaded ${image.createdAt ? new Date(image.createdAt).toLocaleString() : ''}` : 'This is a placeholder community image. Replace with actual images in your backend or storage.'}</p>
        </div>
      </div>
    </div>
  );
};

export default CommunityGallery;
