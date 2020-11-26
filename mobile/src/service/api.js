import axios from  'axios';

const api = axios.create({
    baseURL:'https://trabalho-final-twm.rj.r.appspot.com'
});
export default api;