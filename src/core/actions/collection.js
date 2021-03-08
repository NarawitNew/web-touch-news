import { httpClient } from "HttpClient";

export const getCategoryList = () => {
  return httpClient
    .get("/category")
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};
