import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://playsopt.o-r.kr',
});