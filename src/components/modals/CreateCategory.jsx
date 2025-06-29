import React, { useState } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { $authHost } from '../../http'; 

const CreateCategory = ({ show, onHide, fetchCategories }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!name.trim()) {
      setError('Название категории обязательно');
      return;
    }

    try {
      setLoading(true);
      const { data } = await $authHost.post('/api/category', { name });
      setSuccess(true);
      setName('');
      fetchCategories(); 
      setTimeout(onHide, 1500);
    } catch (err) {
      console.error('Ошибка при создании категории:', err);
      //setError(err.response?.data?.message || 'Ошибка при создании категории');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setError('');
    setSuccess(false);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton className="border-danger">
        <Modal.Title className="text-danger">Добавить новую категорию</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && (
            <Alert variant="success">Категория успешно создана!</Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Название категории</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Например: Баскетбол"
              disabled={loading}
              className="border-danger"
            />
          </Form.Group>
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
            type="submit"
            disabled={loading || !name.trim()}
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

export default CreateCategory;