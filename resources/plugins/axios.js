export default function ({ $axios, redirect, store }) {
    $axios.onRequest(config => {
        const token = store.getters['auth/token'];
        const language = store.getters['lang/language'];
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            //config.headers.common['Authorization'] = `Bearer ${token}`;
        }

        if (language) {
            //config.headers.common['Accept-Language'] = language; //for version 0.21.1
            config.headers['Accept-Language'] = language; //for 1.3.2
        }
        //config.timeout = 180000; //3 minutes response timeout

        const logData = { url: config.url, data: config.data }
        store.dispatch('auth/writeLog', logData)
    })

    $axios.onError(error => {
        const code = parseInt(error.response && error.response.status)
        if (code === 400 && store.getters['auth/auth']) {
            redirect('/400')
        } else if (code === 422) {
            const message = error.response.data;
            return Promise.reject(message)
        } else if (code === 404) {
            const message = error.response.data;
            return Promise.reject(message)
        } else {
            return Promise.reject(new Error(error))
        }
    })
}