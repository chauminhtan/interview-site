import axios from 'axios';
import { Config }  from './index';

const model = 'results';

const ApiCollection = {
    getAll(cb) {
        axios.get(Config.serverURL + '/api/' + model)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    getOne(id, cb) {
        axios.get(Config.serverURL + '/api/' + model + '/' + id)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    getByTestId(id, cb) {
        axios.get(Config.serverURL + '/api/resultsByTestId/' + id)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    create(data, cb) {
        axios.post(Config.serverURL + '/api/' + model, data)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    update(data, cb) {
        axios.put(Config.serverURL + '/api/' + model + '/' + data.id, data)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    delete(id, cb) {
        axios.delete(Config.serverURL + '/api/' + model + '/' + id)
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    },
    sendmail(cb) {
        axios.get(Config.serverURL + '/api/sendmail')
        .then(res => {
            // handle error here
            if (res.status === 1) {
                
            }

            setTimeout(cb(res), 100);
        })
    }
}

export default ApiCollection;