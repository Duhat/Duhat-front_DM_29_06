import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { $authHost } from '../../http';

const CreateVideo = ({ show, onHide, fetchVideos, categories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    iframe: '',
    date: new Date().toISOString().split('T')[0],
    categoryId: '',
    img: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const clearForm = () => {
    setFormData({
      title: '',
      description: '',
      iframe: '',
      date: new Date().toISOString().split('T')[0],
      categoryId: '',
      img: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Вместо throw - устанавливаем ошибку и прерываем выполнение
    if (!formData.title || !formData.iframe || !formData.categoryId) {
      setError('Заполните все обязательные поля');
      setLoading(false);
      return;
    }

    try {
      const response = await $authHost.post('/api/video', {
        title: formData.title,
        description: formData.description,
        iframe: formData.iframe,
        date: formData.date,
        categoryId: Number(formData.categoryId),
        img: formData.img || null
      });

      if (response.status === 201) {
        fetchVideos();
        clearForm();
        alert('Видео успешно создано!');
        onHide();
      }
    } catch (err) {
      console.error('Ошибка создания видео:', err);
      setError(err.response?.data?.message || err.message || 'Ошибка при создании видео');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Добавить новое видео</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Название видео*</Form.Label>
            <Form.Control
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Описание видео</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Введите описание видео"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group controlId="iframe" className="mb-3">
            <Form.Label>Iframe видео*</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="iframe"
              value={formData.iframe}
              onChange={handleChange}
              placeholder="Вставьте iframe код видео"
              disabled={loading}
              required
            />
            <Form.Text className="text-muted">
              Пример: &lt;iframe src="..." allowfullscreen&gt;&lt;/iframe&gt;
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="date" className="mb-3">
            <Form.Label>Дата публикации</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              disabled={loading}
            />
          </Form.Group>

          <Form.Group controlId="categoryId" className="mb-3">
            <Form.Label>Категория*</Form.Label>
            <Form.Select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
              disabled={loading || !categories.length}
            >
              <option value="">Выберите категорию</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide} disabled={loading}>
            Отмена
          </Button>
          <Button variant="danger" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner as="span" size="sm" animation="border" />
                <span className="ms-2">Сохранение...</span>
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateVideo;
