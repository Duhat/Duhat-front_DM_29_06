import React, { useState, useEffect } from 'react';
import { Modal, Button, Alert, Spinner, Form } from 'react-bootstrap';
import { $authHost } from '../../http';

const DeleteCategory = ({ 
  show, 
  onHide, 
  fetchCategories,
  categories // Принимаем список категорий из props
}) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isFetchingCategories, setIsFetchingCategories] = useState(false);

  useEffect(() => {
    if (show) {
      setSelectedCategory('');
      setError('');
      setSuccess(false);
    }
  }, [show]);

  const handleDelete = async () => {
    setError('');
    setSuccess(false);

    if (!selectedCategory) {
      setError('Пожалуйста, выберите категорию для удаления');
      return;
    }

    try {
      setLoading(true);
      await $authHost.delete(`/api/category/${selectedCategory}`);
      
      // Находим название удаленной категории для сообщения
      const deletedCategory = categories.find(c => c.id === selectedCategory);
      setSuccess(true);
      fetchCategories();
      setTimeout(() => {
        onHide();
        setSelectedCategory('');
      }, 1500);
    } catch (err) {
      console.error('Ошибка при удалении категории:', err);
      setError(err.response?.data?.message || 
        'Не удалось удалить категорию. Возможно, с ней связаны видео');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedCategory('');
    setError('');
    setSuccess(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-danger">
        <Modal.Title className="text-danger">
          Удаление категории
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && (
          <Alert variant="success">
            Категория успешно удалена!
          </Alert>
        )}

        {!success && (
          <>
            <Form.Group className="mb-3">
              <Form.Label>Выберите категорию для удаления:</Form.Label>
              <Form.Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                disabled={loading || isFetchingCategories}
              >
                <option value="">-- Выберите категорию --</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            {selectedCategory && (
              <div className="mt-3">
                <p className="text-muted small">
                  Это действие нельзя отменить. Все связанные видео останутся без категории.
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
          disabled={loading || success || !selectedCategory}
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

export default DeleteCategory;