import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { Row, Col, Spinner, Alert } from "react-bootstrap";
import VideoItem from "./VideoItem";
import axios from "axios";

const VideoList = observer(() => {
  const { video } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true);
        const params = {};
        
        if (video.selectedCategory?.id) {
          params.categoryId = video.selectedCategory.id;
        }

        const response = await axios.get(
          "https://dart-server-back-2.up.railway.app/api/video",
          { params }
        );

        const filteredVideos = video.selectedCategory
          ? response.data.filter(v => v.categoryId === video.selectedCategory.id)
          : response.data;

        video.setVideos(filteredVideos);
        setError(null);
      } catch (e) {
        console.error("Ошибка загрузки:", e);
        setError("Ошибка загрузки видео");
        video.setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [video.selectedCategory?.id]);

  if (loading) return <Spinner animation="border" variant="danger" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <h3 className="mb-3">
        {video.selectedCategory 
          ? `Категория: ${video.selectedCategory.name}` 
          : "Все видео"}
      </h3>

      {video.videos.length === 0 ? (
        <Alert variant="dark">
          {video.selectedCategory
            ? `В категории "${video.selectedCategory.name}" видео не найдены`
            : "Видео не найдены"}
        </Alert>
      ) : (
        <Row>
          {video.videos.map((v) => (
            <Col key={v.id} md={6} className="mb-4">
              <VideoItem video={v} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
});

export default VideoList;
