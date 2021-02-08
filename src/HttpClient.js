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
  // if (jwtToken) {
  //   config.headers =  { 'Authorization': `Bearer ${jwtToken}` }
  // }
  return config;
});

const clearLocalStorage = () => {
  localStorage.clear()
  window.location.href = '/login'
}

instance.interceptors.response.use(
  (response) => {
    const status = response.data ? response.data.code : null
    const originalRequest = response.config
    if (status === 401) {
      const refreshToken = localStorage.getItem("refresh_token")
      return axios.get(`${config.REACT_APP_BASEURL}/refresh`,
        { headers: { 'Authorization': `Bearer ${refreshToken}` } })
        .then(refreshRes => {
          if (refreshRes.data.code === 200) {
            const newToken = refreshRes.data.data.access_token
            const newRefreshToken = refreshRes.data.data.refresh_token
            localStorage.setItem('newToken', newToken)
            localStorage.setItem('newRefreshToken', newRefreshToken)
            instance.defaults.headers.common['Authorization'] = `Bearer ${newToken}` //Add new token
            return instance(originalRequest) //call API
          } else {
            clearLocalStorage()
          }
        }).catch(err => {
          clearLocalStorage()
        })
    } else {
      return response
    }
  },
  (error) => {
    return error
  }
);

export const httpClient = instance
