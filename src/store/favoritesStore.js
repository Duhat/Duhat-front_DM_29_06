// favoritesStore.js
import { makeAutoObservable } from "mobx";

class FavoritesStore {
  favorites = [];

  constructor() {
    makeAutoObservable(this);
    this.loadFavorites();
  }

  loadFavorites() {
    const favs = localStorage.getItem("favorites");
    if (favs) this.favorites = JSON.parse(favs);
  }

  saveFavorites() {
    localStorage.setItem("favorites", JSON.stringify(this.favorites));
  }

  addFavorite(video) {
    if (!this.favorites.find(v => v.id === video.id)) {
      this.favorites.push(video);
      this.saveFavorites();
    }
  }

  removeFavorite(videoId) {
    this.favorites = this.favorites.filter(v => v.id !== videoId);
    this.saveFavorites();
  }

  isFavorite(videoId) {
    return this.favorites.some(v => v.id === videoId);
  }
}

export default FavoritesStore;
