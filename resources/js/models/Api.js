import Axios from 'axios';

export default () => {
    return Axios.create({
        baseURL: 'http://localhost:3000',
        headers:{
            'Accept': 'application/json'
        }
    })
}