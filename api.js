import axios from "axios";

let api = axios.create({
    baseURL:"https://api.punkapi.com/v2/"
})
export default api