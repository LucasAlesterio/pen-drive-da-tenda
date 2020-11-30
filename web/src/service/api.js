import axios from  'axios';

const api = axios.create({
    baseURL:'https://trabalho-final-twm.rj.r.appspot.com'
    //baseURL:'http://localhost:8080'
})
export default api;