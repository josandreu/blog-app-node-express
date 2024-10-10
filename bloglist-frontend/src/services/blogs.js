import axios from 'axios';
const baseUrl = '/api/blogs';

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getConfig = () => ({
  headers: { Authorization: token },
});

const getAll = async () => {
  const request = axios.get(baseUrl);
  const response = await request;
  return response.data.sort((a, b) => b.likes - a.likes);
};

const create = async (blogData) => {
  const config = getConfig();

  const response = await axios.post(baseUrl, blogData, config);

  if (response.status !== 201) {
    return false;
  }

  return response.data;
};

const update = async (blogData, id) => {
  const config = getConfig();

  const response = await axios.put(`${baseUrl}/${id}`, blogData, config);

  if (response.status !== 200) {
    return false;
  }

  return response.data;
};

const remove = async (id) => {
  const config = getConfig();

  const response = await axios.delete(`${baseUrl}/${id}`, config);

  if (response.status !== 204) {
    return false;
  }

  return response.data;
};

export default { getAll, create, update, remove, setToken };
