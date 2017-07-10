const Auth = {
    isAuthenticated: false,
    authenticate(cb) {
        // will call api later
        this.isAuthenticated = true;
        setTimeout(cb, 100);
    },
    signout(cb){
        // will call api later
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
}

export default Auth;