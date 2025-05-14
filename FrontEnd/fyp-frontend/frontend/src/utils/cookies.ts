import Cookies from 'js-cookie';

export const removeSession = () => {
  return new Promise((resolve, reject) => {
    try {
      Cookies.remove('session');
      resolve('session deleted');
    } catch (error) {
      reject('session not deleted');
    }
  });
};

export const getSessionData = () => {
  const sessionData = Cookies.get('session');
  return sessionData ? JSON.parse(sessionData) : null;
};

export const getAuthToken = () => {
  return Cookies.get('token') || '';
};

export const removeToken = () => {
  Cookies.remove('token');
};

export const setCookie = (name: string, value: string, options = {}) => {
  Cookies.set(name, value, { expires: 1, ...options });
};