import { 
    ADMIN_ROUTE, 
    LOGIN_ROUTE, 
    REGISTRATION_ROUTE, 
    ROOT_ROUTE, 
    LIKED_ROUTE, 
    VIDEO_ROUTE 
  } from './utils/consts';  // Импортируем константы
  
  import Admin from "./pages/Admin";
  import Auth from "./pages/Auth";
  import FavoritesPage from "./pages/FavoritesPage";
  import Main from "./pages/Main";
  import VideoPage from "./pages/VideoPage";
  
  export const authRoutes = [
    {
      path: ADMIN_ROUTE,
      Component: Admin
    },
    {
      path: LIKED_ROUTE,
      Component: FavoritesPage
    },
  ];
  
  export const publicRoutes = [
    {
      path: ROOT_ROUTE,
      Component: Main
    },
    {
      path: LOGIN_ROUTE,
      Component: Auth
    },
    {
      path: REGISTRATION_ROUTE,
      Component: Auth
    },
    {
      path: `${VIDEO_ROUTE}/:id`,
      Component: VideoPage
    },
  ];