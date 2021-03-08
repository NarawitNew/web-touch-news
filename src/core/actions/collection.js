import { httpClient } from "HttpClient";

export const getDataNews = (schemas, params) => {
  return httpClient
    .get("/news/info/" + params)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

export const getData = (schemas, params) => {
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
