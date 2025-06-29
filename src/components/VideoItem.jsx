import React from 'react';
import { Col, Card } from 'react-bootstrap';
import { VIDEO_ROUTE } from "../utils/consts";
import { useNavigate } from "react-router-dom";
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import './VideoItem.css'

const VideoItem = ({ video }) => {
  const navigate = useNavigate();

  return (
    <Col md={3} className="mt-3" onClick={() => navigate(VIDEO_ROUTE + '/' + video.id)}>
      <Card style={{ width: 450, cursor: 'pointer' }} border="light">
        {/* Вставляем iframe с видео */}
        <div 
          className="video-container"
          dangerouslySetInnerHTML={{ __html: video.iframe || '' }}
        />
        
        <Card.Body>
          <Card.Title>{video.title || 'Без названия'}</Card.Title>
         
          
          <div className="d-flex justify-content-between align-items-center mt-2">
            <span className="badge bg-outline-white">
              {video.category?.name || 'Без категории'}
            </span>
            
            <div className="text-muted small">
              <span className="me-2">
                {video.date ? format(new Date(video.date), 'dd MMMM yyyy', { locale: ru }) : 'Дата неизвестна'}
              </span>
              
            </div>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default VideoItem;