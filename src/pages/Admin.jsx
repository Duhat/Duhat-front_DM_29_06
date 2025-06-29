import React, { useState, useEffect } from 'react';
import { Container, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { $authHost } from '../http';
import CreateCategory from '../components/modals/CreateCategory';
import CreateVideo from '../components/modals/CreateVideo';
import DeleteCategory from '../components/modals/DeleteCategory';
import DeleteVideo from '../components/modals/DeleteVideo';

function Admin() {
  // Состояния
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeleteVideoModal, setShowDeleteVideoModal] = useState(false);

  const [categories, setCategories] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState({
    categories: false,
    videos: false,
    general: false
  });
  const [error, setError] = useState(null);

  // Загрузка данных
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(prev => ({ ...prev, general: true }));
      setError(null);
      await Promise.all([fetchCategories(), fetchVideos()]);
    } catch (err) {
      setError('Ошибка загрузки данных. Проверьте подключение к серверу.');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(prev => ({ ...prev, general: false }));
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(prev => ({ ...prev, categories: true }));
      const response = await $authHost.get('/api/category');
      setCategories(response.data);
    } catch (err) {
      console.error('Ошибка загрузки категорий:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(prev => ({ ...prev, videos: true }));
      const response = await $authHost.get('/api/video'); // Изменил эндпоинт
      setVideos(response.data);
    } catch (err) {
      console.error('Ошибка загрузки видео:', err);
      throw err;
    } finally {
      setLoading(prev => ({ ...prev, videos: false }));
    }
  };

  // Обработчики модальных окон
  const handleOpenVideoModal = () => setShowVideoModal(true);
  const handleCloseVideoModal = () => setShowVideoModal(false);

  const handleOpenCategoryModal = () => setShowCategoryModal(true);
  const handleCloseCategoryModal = () => setShowCategoryModal(false);

  const handleOpenDeleteCategoryModal = () => setShowDeleteCategoryModal(true);
  const handleCloseDeleteCategoryModal = () => setShowDeleteCategoryModal(false);

  const handleOpenDeleteVideoModal = () => setShowDeleteVideoModal(true);
  const handleCloseDeleteVideoModal = () => setShowDeleteVideoModal(false);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Панель администратора</h2>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Button
            variant="outline-danger"
            className="w-100 py-2"
            onClick={handleOpenVideoModal}
            disabled={loading.general}
          >
            {loading.videos ? (
              <Spinner as="span" size="sm" animation="border" />
            ) : (
              'Добавить видео'
            )}
          </Button>
        </Col>

        <Col md={3}>
          <Button
            variant="outline-danger"
            className="w-100 py-2"
            onClick={() => setShowDeleteVideoModal(true)}
            disabled={loading.general || videos.length === 0}
          >
            {loading.videos ? (
              <Spinner as="span" size="sm" animation="border" />
            ) : (
              'Удалить видео'
            )}
          </Button>
        </Col>

        <Col md={4}>
          <Button
            variant="outline-danger"
            className="w-100 py-2"
            onClick={handleOpenCategoryModal}
            disabled={loading.general}
          >
            {loading.categories ? (
              <Spinner as="span" size="sm" animation="border" />
            ) : (
              'Добавить категорию'
            )}
          </Button>
        </Col>

        <Col md={4}>
          <Button
            variant="outline-danger"
            className="w-100 py-2"
            onClick={handleOpenDeleteCategoryModal}
            disabled={loading.general || categories.length === 0}
          >
            {loading.categories ? (
              <Spinner as="span" size="sm" animation="border" />
            ) : (
              'Удалить категорию'
            )}
          </Button>
        </Col>



      </Row>

      {/* Модальные окна */}
      <CreateVideo
        show={showVideoModal}
        onHide={handleCloseVideoModal}
        fetchVideos={fetchVideos}
        categories={categories}
      />

      <DeleteVideo
        show={showDeleteVideoModal}
        onHide={handleCloseDeleteVideoModal}
        fetchVideos={fetchVideos}
        videos={videos}
      />


      <CreateCategory
        show={showCategoryModal}
        onHide={handleCloseCategoryModal}
        fetchCategories={fetchCategories}
      />

      <DeleteCategory
        show={showDeleteCategoryModal}
        onHide={handleCloseDeleteCategoryModal}
        fetchCategories={fetchCategories}
        categories={categories}
      />
    </Container>
  );
}

export default Admin;