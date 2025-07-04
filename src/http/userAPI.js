import { $authHost, $host } from "./index";
import { jwtDecode } from 'jwt-decode';

export const login = async (email, password) => {
  const { data } = await $host.post('api/user/login', { email, password });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const registration = async (name, email, password, roleId = 1) => {
  const { data } = await $host.post('api/user/register', { name, email, password, roleId });
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get('api/user/auth');
  localStorage.setItem('token', data.token);
  return jwtDecode(data.token);
};
