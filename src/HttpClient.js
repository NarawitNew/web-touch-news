// import axios from 'axios'
// import config from 'config'

// const instance = axios.create({
//     manageURL: config.REACT_APP_BASEURL,
//   timeout: 100000,
//   headers: {
//     'Content-Type': 'application/json'
// }
// });

// instance.interceptors.request.use(async (config) => {
//   // console.log('object')
//   const jwtToken = await localStorage.getItem("access_token")
//   if (jwtToken != null) {
//     config.headers = { 'x-access-token': jwtToken }
//   }

//   return config;

// });

// export const httpClient = instance

import axios from 'axios'
import config from 'config'

const instance = axios.create({
  baseURL: config.REACT_APP_BASEURL,
  timeout: 10000,
});

instance.interceptors.request.use(async (config) => {
  const jwtToken = await localStorage.getItem("access_token")
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}` 
  }
  return config;
});

const clearLocalStorage = () => {
  localStorage.clear()
  window.location.href = '/login'
}

instance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response.status
    const originalRequest = error.config
    if (status === 401) {
      const refreshToken = localStorage.getItem("refresh_token")
      return axios.get(`${config.REACT_APP_BASEURL}/refresh_token`,
        { headers: { 'Authorization': `Bearer ${refreshToken}` } })
        .then(refreshRes => {
          if (refreshRes.data.code === 200) {
            const newToken = refreshRes.data.data.access_token
            const newRefreshToken = refreshRes.data.data.refresh_token
            localStorage.setItem('access_token', newToken)
            localStorage.setItem('refresh_token', newRefreshToken)
            instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}` //Add new token
            return instance(originalRequest) //call API
          } else {
            clearLocalStorage()
          }
        }).catch(err => {
          clearLocalStorage()
        })
    } else {
    return error
    }
  }
);
export const httpClient = instance
