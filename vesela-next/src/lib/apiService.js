import api from "./axios";

const handleSuccess = (res) => ({
  status: res.status,
  data: res.data,
  error: false,
});

const handleError = (err) => ({
  status: err?.response?.status || null,
  data: err?.response?.data || null,
  error: true,
  message: err?.message || "Something went wrong",
});

export const get = async (url, params = {}) => {
  try {
    const res = await api.get(url, { params });
    return handleSuccess(res);
  } catch (err) {
    return handleError(err);
  }
};

export const post = async (url, data) => {
  try {
    const res = await api.post(url, data);
    return handleSuccess(res);
  } catch (err) {
    return handleError(err);
  }
};

export const put = async (url, data) => {
  try {
    const res = await api.put(url, data);
    return handleSuccess(res);
  } catch (err) {
    return handleError(err);
  }
};

export const del = async (url) => {
  try {
    const res = await api.delete(url);
    return handleSuccess(res);
  } catch (err) {
    return handleError(err);
  }
};
