"use client";

import api from "./axios";

// ✅ Standard success response
const success = (res) => ({
  status: res.status,
  data: res.data,
  error: false,
});

// ✅ Standard error response
const failure = (error) => {
  if (error.response) {
    return {
      status: error.response.status,
      data: error.response.data,
      error: true,
    };
  }

  if (error.request) {
    return {
      status: null,
      data: null,
      error: true,
      message: "No response from server",
    };
  }

  return {
    status: null,
    data: null,
    error: true,
    message: error.message || "Unexpected error",
  };
};

// ✅ GET
export const getData = async (url, params = {}, config = {}) => {
  try {
    const res = await api.get(url, { params, ...config });
    return success(res);
  } catch (err) {
    return failure(err);
  }
};

// ✅ POST
export const postData = async (url, data = {}, config = {}) => {
  try {
    const res = await api.post(url, data, config);
    return success(res);
  } catch (err) {
    return failure(err);
  }
};

// ✅ PUT
export const putData = async (url, data = {}, config = {}) => {
  try {
    const res = await api.put(url, data, config);
    return success(res);
  } catch (err) {
    return failure(err);
  }
};

// ✅ DELETE
export const deleteData = async (url, config = {}) => {
  try {
    const res = await api.delete(url, config);
    return success(res);
  } catch (err) {
    return failure(err);
  }
};
