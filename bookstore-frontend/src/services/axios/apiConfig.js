import axios from 'axios';
import { apiURL } from 'constants/defaultValues';

export const getClient = () => {
  const client = axios.create({ baseURL: apiURL });
  return client;
};