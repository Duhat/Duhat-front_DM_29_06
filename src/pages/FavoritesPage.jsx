import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Container, Row, Col, Alert } from "react-bootstrap";
import VideoItem from "../components/VideoItem";

const FavoritesPage = observer(() => {
  const { favorites } = useContext(Context);

  if (favorites.favorites.length === 0) {
    return <Alert variant="info">У вас нет избранных видео</Alert>;
  }

  return (
    <Container className="mt-4">
      <Row>
        {favorites.favorites.map((video) => (
          <Col key={video.id} md={6} className="mb-4">
            <VideoItem video={video} />
          </Col>
        ))}
      </Row>
    </Container>
  );
});

export default FavoritesPage;
