import Api from '../models/Api';
export default class Authenticate{

    static async getToken(userData){
        return await Api().post('/auth/login',userData);
    }

    static async handleToken(code,token){
        return await Api().post('/auth/verification',{code},{
            headers:{
                Authenticate: `Bearer ${token}`
            }
        });
    }

}