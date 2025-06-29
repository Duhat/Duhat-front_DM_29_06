import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { $authHost } from '../../http';

const DeleteVideo = ({
  show,
  onHide,
  fetchVideos,
  videos
}) => {
  const [selectedVideo, setSelectedVideo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Сброс состояния при открытии/закрытии модального окна
  useEffect(() => {
    if (show) {
      setSelectedVideo('');
      setError('');
      setSuccess(false);
    }
  }, [show]);

  const handleDelete = async () => {
    setError('');
    setSuccess(false);

    if (!selectedVideo) {
      setError('Пожалуйста, выберите видео для удаления');
      return;
    }

    try {
      setLoading(true);
      await $authHost.delete(`/api/video/${selectedVideo}`);
      setSuccess(true);
      // Обновляем список видео в родителе
      fetchVideos();
      setTimeout(() => {
        onHide();
        setSelectedVideo('');
      }, 1500);
    } catch (err) {
      console.error('Ошибка при удалении видео:', err);
      setError(
        err.response?.data?.message ||
        'Не удалось удалить видео. Попробуйте ещё раз.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedVideo('');
    setError('');
    setSuccess(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-danger">
        <Modal.Title className="text-danger">
          Удаление видео
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Видео успешно удалено!
          </Alert>
        )}

        {!success && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Выберите видео для удаления:</Form.Label>
              <Form.Select
                value={selectedVideo}
                onChange={e => setSelectedVideo(e.target.value)}
                disabled={loading}
              >
                <option value="">-- Выберите видео --</option>
                {videos.map(video => (
                  <option key={video.id} value={video.id}>
                    {video.title}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            {selectedVideo && (
              <div className="mt-3">
                <p className="text-muted small">
                  Это действие нельзя отменить.
                </p>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={loading}
        >
          Отмена
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={loading || success || !selectedVideo}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="ms-2">Удаление...</span>
            </>
          ) : (
            'Удалить'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteVideo;
