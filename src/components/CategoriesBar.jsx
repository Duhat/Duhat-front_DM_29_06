import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../index";
import { ListGroup, Spinner, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LIKED_ROUTE } from '../utils/consts';

const CategoriesBar = observer(() => {
  const { video } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://dart-server-back-2.up.railway.app/api/category"
        );
        video.setCategories(response.data);
        setError(null);
      } catch (e) {
        setError("Ошибка загрузки категорий");
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [video]);

  if (loading) return <Spinner animation="border" />;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <>
      <ListGroup>
        <ListGroup.Item
          action
          active={!video.selectedCategory}
          onClick={() => video.setSelectedCategory(null)}
          variant={!video.selectedCategory ? "danger" : undefined}
          className={!video.selectedCategory ? "text-white" : ""}
          style={{ cursor: "pointer" }}
        >
          Все категории
        </ListGroup.Item>
        
        {video.categories.map((category) => (
          <ListGroup.Item
            key={category.id}
            action
            active={video.selectedCategory?.id === category.id}
            onClick={() => video.setSelectedCategory(category)}
            variant={video.selectedCategory?.id === category.id ? "danger" : undefined}
            className={video.selectedCategory?.id === category.id ? "text-white" : ""}
            style={{ 
              cursor: "pointer",
              transition: "all 0.3s ease"
            }}
          >
            {category.name}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Button
        variant="outline-danger"
        className="mt-3 w-100"
        onClick={() => navigate(LIKED_ROUTE)}
      >
        Избранное
      </Button>
    </>
  );
});

export default CategoriesBar;