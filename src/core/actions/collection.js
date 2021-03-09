import config from "config";
import { httpClient } from "HttpClient";

export const getDataRead = (schemas, params) => {
  return httpClient
    .get(`${schemas}/${params}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

export const getDataList = (schemas, params) => {
  return httpClient
    .get(schemas, params)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};
export const deleteData = (schemas, id) => {
  return httpClient
    .delete(`${schemas}/${id}`)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

export const postData = (schemas, params) => {
  return httpClient
    .post(schemas, params)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

export const putData = (schemas, id, params) => {
  return httpClient
    .put(`${schemas}/${id}`, params)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

export const postIamge = (schemas, params) => {
  return httpClient
    .post(config.REACT_APP_IMGAE + schemas, params)
    .then(function (response) {
      return response;
    })
    .catch(function (error) {
      throw error;
    });
};
