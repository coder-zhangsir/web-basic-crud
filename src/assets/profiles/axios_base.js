import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:3007/api';
// 注意：下面我只配置了post请求的Content-Type
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

export default {}