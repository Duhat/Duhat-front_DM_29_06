import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import RecommendedVideos from '../components/RecommendedVideos';
import { Context } from '../index';
import { observer } from 'mobx-react-lite';

import './VideoPage.css';

const VideoPage = observer(() => {
  const { id } = useParams();
  const { favorites } = useContext(Context);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        setLoading(true);
        const videoResponse = await axios.get(`https://dart-server-back-2.up.railway.app/api/video/${id}`);
        setVideo(videoResponse.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Не удалось загрузить видео');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoData();
  }, [id]);

  const isFavorite = video && favorites.isFavorite(video.id);

  const toggleFavorite = () => {
    if (!video) return;
    if (isFavorite) {
      favorites.removeFavorite(video.id);
    } else {
      favorites.addFavorite(video);
    }
  };

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Загрузка видео...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">
          {error}
          <div className="mt-2">
            <Button variant="primary" onClick={() => window.location.reload()}>
              Попробовать снова
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!video) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">Видео не найдено</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row>
        {/* Левая колонка: видео */}
        <Col md={8}>
          <Card className="mb-4">
            <div className="video-player-wrapper">
              <div dangerouslySetInnerHTML={{ __html: video.iframe }} />
            </div>
            <Card.Body>
              <Card.Title>{video.title}</Card.Title>
              <Card.Text>{video.description}</Card.Text>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-danger">
                  {video.category?.name || 'Без категории'}
                </span>
                <span className="text-muted">
                  {new Date(video.date).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="d-flex gap-2">
                <Button 
                  variant={isFavorite ? "danger" : "outline-danger"}
                  onClick={toggleFavorite}
                >
                  {isFavorite ? "Удалить из избранного" : "Добавить в избранное"}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Правая колонка: рекомендованные видео */}
        <Col md={4}>
          <h5>Рекомендуемые видео</h5>
          <RecommendedVideos 
            categoryId={video.categoryId} 
            excludeId={video.id} 
          />
        </Col>
      </Row>
    </Container>
  );
});

export default VideoPage;
