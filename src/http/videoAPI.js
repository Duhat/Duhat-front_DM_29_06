import { $authHost } from './index';

export const createVideo = async (videoData) => {
  // videoData должен содержать title, description, iframe, date, categoryId, img
  const { data } = await $authHost.post('api/video', videoData);
  return data;
};
