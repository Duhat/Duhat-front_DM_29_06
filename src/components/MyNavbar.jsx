import React, { useContext } from 'react';
import { Context } from '../index';
import { Nav, Navbar, Button, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { 
  ADMIN_ROUTE, 
  LOGIN_ROUTE, 
  ROOT_ROUTE, 
  LIKED_ROUTE 
} from '../utils/consts';

const MyNavbar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = () => {
    user.setUser({});
    user.setIsAuth(false);
    localStorage.removeItem('token');
    navigate(LOGIN_ROUTE);
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" sticky="top">
      <Container>
        <Navbar.Brand as={Link} to={ROOT_ROUTE}>Dart Media</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to={ROOT_ROUTE}>Видео</Nav.Link>

            {user.isAuth && user.user.roleId === 1 && (
              <Nav.Link as={Link} to={ADMIN_ROUTE} className="text-danger">
                Админ панель
              </Nav.Link>
            )}

            {user.isAuth && user.user.roleId !== 1 && (
              <Nav.Link as={Link} to={LIKED_ROUTE} className="text-danger">
                Избранное
              </Nav.Link>
            )}
          </Nav>

          <Nav>
            {user.isAuth ? (
              <Button variant="outline-danger" onClick={handleLogout}>
                Выйти
              </Button>
            ) : (
              <Nav.Link as={Link} to={LOGIN_ROUTE} className="text-danger">
                Авторизация
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
});

export default MyNavbar;