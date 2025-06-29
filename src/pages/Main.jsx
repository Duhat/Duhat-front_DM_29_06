import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import CategoriesBar from '../components/CategoriesBar'; 
import VideoList from '../components/VideoList';

function Main() {
  return (
    <Container>
      <Row className='mt-5'>
        <Col md={3}>
          <CategoriesBar />
        </Col>
        <Col md={9}>
          <VideoList />
        </Col>
      </Row>
    </Container>
  );
}

export default Main;