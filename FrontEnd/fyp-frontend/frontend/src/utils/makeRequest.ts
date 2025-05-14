import { AxiosError } from 'axios';

export const makeRequest = async (
  loading: (state: boolean) => void,
  call: (payload: any) => Promise<any>,
  payload: any,
  onSuccess: (data: any, response: any) => void,
  onError?: (message: string, error: any) => void
) => {
  loading(true);
  try {
    const res = await call(payload);

    if (res && res.response && res.response.status) {
      const statusCode = res.response.status;

      if (statusCode === 401 || statusCode === 403) {
        // Handle unauthorized access
        window.location.href = '/login';
        return;
      }
    }

    if (res) {
      onSuccess(res, res);
    } else {
      if (onError) {
        onError('No response received from the server.', null);
      }
    }
  } catch (e) {
    const error = e as AxiosError;
    if (onError) {
      onError(error.message, error);
    }
  } finally {
    loading(false);
  }
};