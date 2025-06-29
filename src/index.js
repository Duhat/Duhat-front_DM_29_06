import React, { createContext } from 'react';
import ReactDOM from 'react-dom/client';
import UserStore from "./store/UserStore";
import VideoStore from "./store/VideoStore";
import FavoritesStore from './store/favoritesStore';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Создаём контекст для доступа к MobX-сторам из компонентов
export const Context = createContext(null);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <Context.Provider value={{
    user: new UserStore(),
    video: new VideoStore(),
    favorites: new FavoritesStore()
  }}>
    <App />
  </Context.Provider>
);


