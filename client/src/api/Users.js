import axios from 'axios';
import { Config }  from './index';

const Users = {
    getUsers(cb) {
        axios.get(Config.serverURL + '/api/users')
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    getUser(id, cb) {
        axios.get(Config.serverURL + '/api/users/' + id)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    create(user, cb) {
        axios.post(Config.serverURL + '/api/users', user)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    update(user, cb) {
        axios.put(Config.serverURL + '/api/users/' + user.id, user)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    delete(userId, cb) {
        axios.delete(Config.serverURL + '/api/users/' + userId)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    }
}

export default Users;