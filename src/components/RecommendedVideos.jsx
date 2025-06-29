import React, { useState, useEffect } from 'react';
import { Row, Col, Spinner, Alert } from 'react-bootstrap';
import VideoItem from './VideoItem';
import axios from 'axios';

const RecommendedVideos = ({ categoryId, excludeId }) => {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!categoryId) return;

    const fetchRecommended = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(
          `https://dart-server-back-2.up.railway.app/api/video?categoryId=${categoryId}`
        );

        const filtered = response.data.filter(video => video.id !== excludeId);
        setRecommended(filtered);
      } catch (err) {
        console.error('Ошибка при загрузке рекомендованных видео:', err);
        setError('Не удалось загрузить рекомендованные видео.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommended();
  }, [categoryId, excludeId]);

  if (loading) {
    return (
      <div className="text-center mt-3">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Загрузка рекомендованных видео...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="mt-3">
        {error}
      </Alert>
    );
  }

  if (recommended.length === 0) {
    return <div className="text-muted mt-3">Рекомендации отсутствуют</div>;
  }

  return (
    <Row>
      {recommended.map(video => (
        <Col xs={12} key={video.id} className="mb-4">
          <VideoItem video={video} />
        </Col>
      ))}
    </Row>
  );
};

export default RecommendedVideos;
