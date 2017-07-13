import { Config, Store }  from './index';
import axios from 'axios';

const Auth = {
    isAuthenticated() {
        return !!Store.getLocalToken();
    },
    authenticate(info, cb) {
        // will call api later
        // AuthSvc.login(info, res => {
        //     console.log(res);
        // })
        axios.post(Config.serverURL + '/api/users/login', info)
        .then(res => {
            // console.log(res);
            if (res.status === 1) {
                // this.isAuthenticated = true;
                Store.setLocalToken(res.data.token);
                Store.saveUserInfo(JSON.stringify(res.data.userInfo));
            }

            setTimeout(cb, 100);
        })
    },
    signout(cb) {
        // will call api later
        // this.isAuthenticated = false;
        Store.resetLocalToken();
        setTimeout(cb, 100);
    }
}

export default Auth;