import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || 'https://dart-server-back-2.up.railway.app/';

const $host = axios.create({ baseURL });
const $authHost = axios.create({ baseURL });

const authInterceptor = config => {
    config.headers.authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
};

$authHost.interceptors.request.use(authInterceptor);

export { $host, $authHost };
