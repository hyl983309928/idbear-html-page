/* eslint-disable */
import axios from 'axios'
import Vue from 'vue'
const http = axios


//在main.js设置全局的请求次数，请求的间隙
axios.defaults.retry = 2;
axios.defaults.retryDelay = 1000;

axios.interceptors.response.use(checkStatus, function axiosRetryInterceptor(err) {
  var config = err.config;
  // If config does not exist or the retry option is not set, reject
  if(!config || !config.retry) return Promise.reject(err);

  if (err.message.toString().indexOf('timeout') !== -1 || err.message === 'Network Error') {
  } else {
    return Promise.reject(err);
  }

  // Set the variable for keeping track of the retry count
  config.__retryCount = config.__retryCount || 0;

  // Check if we've maxed out the total number of retries
  if(config.__retryCount >= config.retry) {
    // Reject with the error
    if (err.message.toString().indexOf('timeout') !== -1) {
      Vue.$vux.toast.show({
        text: '请求超时，请检查网络状况',
        type: 'warn'
      })
    } else if (err.message === 'Network Error') {
      Vue.$vux.toast.show({
        text: '网络连接失败，请刷新重试',
        type: 'warn'
      })
    }
    return Promise.reject(err);
  }

  // Increase the retry count
  config.__retryCount += 1;

  // Create new promise to handle exponential backoff
  var backoff = new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, config.retryDelay || 1);
  });

  // Return the promise in which recalls axios to retry the request
  return backoff.then(function() {
    return axios(config);
  });
});


http.interceptors.request.use(config => {
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Vue.$vux.toast.show({
    text: '请求错误，请重试',
    type: 'warn'
  })
  Promise.reject(error)
})

if (process.env.NODE_ENV === 'test' || process.env.NODE_ENV === 'production') {
  http.defaults.baseURL = process.env.API_ROOT
}

http.defaults.timeout = 6000

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response.data
  } else {
    var error = new Error(response.statusText)
    error.response = response
    Promise.reject(error)
  }
}

function getUrl(url, param) {
  if (!param) {
    return url
  }
  url += '?'
  var list = []
  for (var key in param) {
    if (param.hasOwnProperty(key)) {
      var val = param[key]
      if (Object.prototype.toString.call(val) == '[object Array]') {
        for (let i = 0; i < val.length; i++) {
          if (val[i]) {
            var temp = encodeURIComponent(val[i])
            list.push(key + '=' + temp)
          }
        }
      } else {
        if (val) {
          val = encodeURIComponent(val)
          list.push(key + '=' + val)
        }
      }
    }
  }
  url += list.join('&')
  return url
}

export function apiRequest(path, method = 'get', data = null) {
  var url = path
  var headers = {
  }
  if (method === 'get') {
    return http.get(getUrl(url, data), headers)
  } else if (method === 'post') {
    let onUploadProgress = function (progressEvent) {
    }
    headers['Content-type'] = 'application/json; charset=utf-8'
    return http.post(url, data, { headers, onUploadProgress })
  } else if (method === 'put') {
    headers['Content-type'] = 'application/json; charset=utf-8'
    return http.put(url, data, { headers })
  } else if (method === 'form') {
    headers['Content-type'] = ' application/x-www-form-urlencoded;charset=utf-8'
    return http.post(url, data, { headers })
  }
}
