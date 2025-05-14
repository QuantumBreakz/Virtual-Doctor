import axios, { AxiosInstance, AxiosError } from 'axios';
import { getAuthToken } from './cookies';

const getAxios = async (tocInstance: boolean, header?: any): Promise<AxiosInstance> => {
  const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: header || {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
      'Accept': '*/*',
    },
  });

  if (tocInstance) {
    const token = await getAuthToken();
    if (token) {
      instance.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      throw new Error('Unauthorized');
    }
  }

  return instance;
};

function onAxiosRejected(error: AxiosError) {
  return error;
}

export const get = async (uri: string, payload = null, tocInstance = true, req = false) => {
  const axiosInstance = await getAxios(tocInstance, req);
  return axiosInstance.get(uri, { params: payload })
    .then((res) => res.data, onAxiosRejected);
};

export const post = async (uri: string, payload: any, tocInstance = true, req = false) => {
  const axiosInstance = await getAxios(tocInstance, req);
  return axiosInstance.post(uri, payload)
    .then((res) => res.data, onAxiosRejected);
};

export const postFd = async (uri: string, payload: any, tocInstance = true) => {
  const header = {
    'Access-Control-Allow-Origin': '*',
    'content-type': 'multipart/form-data',
  };
  const axiosInstance = await getAxios(tocInstance, header);
  return axiosInstance.post(uri, payload)
    .then((res) => res.data, onAxiosRejected);
};

export const put = async (uri: string, payload: any, tocInstance = true, req = false) => {
  const axiosInstance = await getAxios(tocInstance, req);
  return axiosInstance.put(uri, payload)
    .then((res) => res.data, onAxiosRejected);
};

export const del = async (uri: string, tocInstance = true, req = false) => {
  const axiosInstance = await getAxios(tocInstance, req);
  return axiosInstance.delete(uri)
    .then((res) => res.data, onAxiosRejected);
};

export const delWithPayload = async (uri: string, payload: any, tocInstance = true, req = false) => {
  const axiosInstance = await getAxios(tocInstance, req);
  return axiosInstance.delete(uri, { data: payload })
    .then((res) => res.data, onAxiosRejected);
};