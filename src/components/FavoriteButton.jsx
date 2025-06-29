import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import { observer } from "mobx-react-lite";
import { FavoritesContext } from "../index"; 
const FavoriteButton = observer(({ video }) => {
  const favorites = useContext(FavoritesContext);

  const isFav = favorites.isFavorite(video.id);

  const toggleFavorite = () => {
    if (isFav) {
      favorites.removeFavorite(video.id);
    } else {
      favorites.addFavorite(video);
    }
  };

  return (
    <Button variant={isFav ? "danger" : "outline-danger"} onClick={toggleFavorite}>
      {isFav ? "Удалить из избранного" : "Добавить в избранное"}
    </Button>
  );
});

export default FavoriteButton;
