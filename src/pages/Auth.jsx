import React, { useContext, useState } from 'react';
import { Container, Form, Alert, Card, Button, Row } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, REGISTRATION_ROUTE, ROOT_ROUTE } from "../utils/consts";
import { observer } from "mobx-react-lite";
import { Context } from "../index";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: 2
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await user.login(formData.email, formData.password);
      } else {
        await user.registration(formData.name, formData.email, formData.password, formData.roleId);
      }
      navigate(ROOT_ROUTE);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Ошибка при авторизации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card style={{ width: '100%', maxWidth: '500px' }} className="p-4 shadow">
        <h2 className="text-center mb-4 text-white">
          {isLogin ? 'Авторизация' : 'Регистрация'}
        </h2>

        {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {!isLogin && (
            <Form.Group className="mb-3">
              <Form.Label>Имя</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Введите ваше имя"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isLoading}
                minLength={2}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder="Введите ваш email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Пароль</Form.Label>
            <Form.Control
              type="password"
              name="password"
              placeholder="Введите ваш пароль"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              minLength={6}
            />
          </Form.Group>

          <Row className="d-flex justify-content-between align-items-center">
            <div>
              {isLogin ? (
                <span>
                  Нет аккаунта?{' '}
                  <NavLink to={REGISTRATION_ROUTE} className="text-danger">Зарегистрируйтесь</NavLink>
                </span>
              ) : (
                <span>
                  Есть аккаунт?{' '}
                  <NavLink to={LOGIN_ROUTE} className="text-danger">Войдите</NavLink>
                </span>
              )}
            </div>

            <Button
              variant="danger"
              type="submit"
              disabled={isLoading || !formData.email || !formData.password || (!isLogin && !formData.name)}
              className="mt-3"
            >
              {isLoading ? 'Обработка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
            </Button>
          </Row>
        </Form>
      </Card>
    </Container>
  );
});

export default Auth;
