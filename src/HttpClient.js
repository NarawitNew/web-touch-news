import axios from 'axios'
import config from 'config'

const instance = axios.create({
    manageURL: config.REACT_APP_BASEURL,
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json'
}
});

instance.interceptors.request.use(async (config) => {
  // console.log('object')
//   const jwtToken = await localStorage.getItem("token")
//   if (jwtToken != null) {
//     config.headers = { 'x-access-token': jwtToken }
//   }

  return config;

});

export const httpClient = instance