import axios from 'axios';
const JWT_TOKEN = 'JWT_TOKEN', USERINFO = 'USERINFO';

const Store = {
    setLocalToken(token) {
        window.localStorage.setItem(JWT_TOKEN, token);
        window.sessionStorage.setItem(JWT_TOKEN, token);
    },
    getLocalToken() {
        return window.localStorage.getItem(JWT_TOKEN) || window.sessionStorage.getItem(JWT_TOKEN);
    },
    resetLocalToken() {
        window.localStorage.removeItem(JWT_TOKEN);
        window.sessionStorage.removeItem(JWT_TOKEN);
    },
    saveUserInfo(info) {
        this.save(USERINFO, info);
    },
    getUserInfo() {
        return this.get(USERINFO);
    },
    save(key, val) {
        window.localStorage.setItem(key, val);
        window.sessionStorage.setItem(key, val)
    },
    get(key) {
        return window.localStorage.getItem(key) || window.sessionStorage.getItem(key);
    },
}

const Config = {
    serverURL: 'http://localhost:3000'
}

export { Config, Store };

// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    if (Store.getLocalToken()) {
        config.headers['token'] = Store.getLocalToken();
    }
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    // console.log(response);
    if (response.status >= 200 && response.status < 300) {
        return response.data;
    }
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});