(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/public/javascript/app"],{

/***/ "./node_modules/axios/index.js":
/*!*************************************!*\
  !*** ./node_modules/axios/index.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./lib/axios */ "./node_modules/axios/lib/axios.js");

/***/ }),

/***/ "./node_modules/axios/lib/adapters/xhr.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/adapters/xhr.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var settle = __webpack_require__(/*! ./../core/settle */ "./node_modules/axios/lib/core/settle.js");
var buildURL = __webpack_require__(/*! ./../helpers/buildURL */ "./node_modules/axios/lib/helpers/buildURL.js");
var parseHeaders = __webpack_require__(/*! ./../helpers/parseHeaders */ "./node_modules/axios/lib/helpers/parseHeaders.js");
var isURLSameOrigin = __webpack_require__(/*! ./../helpers/isURLSameOrigin */ "./node_modules/axios/lib/helpers/isURLSameOrigin.js");
var createError = __webpack_require__(/*! ../core/createError */ "./node_modules/axios/lib/core/createError.js");
var btoa = (typeof window !== 'undefined' && window.btoa && window.btoa.bind(window)) || __webpack_require__(/*! ./../helpers/btoa */ "./node_modules/axios/lib/helpers/btoa.js");

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();
    var loadEvent = 'onreadystatechange';
    var xDomain = false;

    // For IE 8/9 CORS support
    // Only supports POST and GET calls and doesn't returns the response headers.
    // DON'T do this for testing b/c XMLHttpRequest is mocked, not XDomainRequest.
    if ( true &&
        typeof window !== 'undefined' &&
        window.XDomainRequest && !('withCredentials' in request) &&
        !isURLSameOrigin(config.url)) {
      request = new window.XDomainRequest();
      loadEvent = 'onload';
      xDomain = true;
      request.onprogress = function handleProgress() {};
      request.ontimeout = function handleTimeout() {};
    }

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    request.open(config.method.toUpperCase(), buildURL(config.url, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request[loadEvent] = function handleLoad() {
      if (!request || (request.readyState !== 4 && !xDomain)) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        // IE sends 1223 instead of 204 (https://github.com/axios/axios/issues/201)
        status: request.status === 1223 ? 204 : request.status,
        statusText: request.status === 1223 ? 'No Content' : request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      reject(createError('timeout of ' + config.timeout + 'ms exceeded', config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(/*! ./../helpers/cookies */ "./node_modules/axios/lib/helpers/cookies.js");

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(config.url)) && config.xsrfCookieName ?
          cookies.read(config.xsrfCookieName) :
          undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (config.withCredentials) {
      request.withCredentials = true;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/axios.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/axios.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var Axios = __webpack_require__(/*! ./core/Axios */ "./node_modules/axios/lib/core/Axios.js");
var defaults = __webpack_require__(/*! ./defaults */ "./node_modules/axios/lib/defaults.js");

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(utils.merge(defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(/*! ./cancel/Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");
axios.CancelToken = __webpack_require__(/*! ./cancel/CancelToken */ "./node_modules/axios/lib/cancel/CancelToken.js");
axios.isCancel = __webpack_require__(/*! ./cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(/*! ./helpers/spread */ "./node_modules/axios/lib/helpers/spread.js");

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/Cancel.js":
/*!*************************************************!*\
  !*** ./node_modules/axios/lib/cancel/Cancel.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/CancelToken.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/cancel/CancelToken.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(/*! ./Cancel */ "./node_modules/axios/lib/cancel/Cancel.js");

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),

/***/ "./node_modules/axios/lib/cancel/isCancel.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/cancel/isCancel.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/Axios.js":
/*!**********************************************!*\
  !*** ./node_modules/axios/lib/core/Axios.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var defaults = __webpack_require__(/*! ./../defaults */ "./node_modules/axios/lib/defaults.js");
var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var InterceptorManager = __webpack_require__(/*! ./InterceptorManager */ "./node_modules/axios/lib/core/InterceptorManager.js");
var dispatchRequest = __webpack_require__(/*! ./dispatchRequest */ "./node_modules/axios/lib/core/dispatchRequest.js");

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = utils.merge({
      url: arguments[0]
    }, arguments[1]);
  }

  config = utils.merge(defaults, {method: 'get'}, this.defaults, config);
  config.method = config.method.toLowerCase();

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),

/***/ "./node_modules/axios/lib/core/InterceptorManager.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/core/InterceptorManager.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),

/***/ "./node_modules/axios/lib/core/createError.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/core/createError.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(/*! ./enhanceError */ "./node_modules/axios/lib/core/enhanceError.js");

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),

/***/ "./node_modules/axios/lib/core/dispatchRequest.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/core/dispatchRequest.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");
var transformData = __webpack_require__(/*! ./transformData */ "./node_modules/axios/lib/core/transformData.js");
var isCancel = __webpack_require__(/*! ../cancel/isCancel */ "./node_modules/axios/lib/cancel/isCancel.js");
var defaults = __webpack_require__(/*! ../defaults */ "./node_modules/axios/lib/defaults.js");
var isAbsoluteURL = __webpack_require__(/*! ./../helpers/isAbsoluteURL */ "./node_modules/axios/lib/helpers/isAbsoluteURL.js");
var combineURLs = __webpack_require__(/*! ./../helpers/combineURLs */ "./node_modules/axios/lib/helpers/combineURLs.js");

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Support baseURL config
  if (config.baseURL && !isAbsoluteURL(config.url)) {
    config.url = combineURLs(config.baseURL, config.url);
  }

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers || {}
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/core/enhanceError.js":
/*!*****************************************************!*\
  !*** ./node_modules/axios/lib/core/enhanceError.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }
  error.request = request;
  error.response = response;
  return error;
};


/***/ }),

/***/ "./node_modules/axios/lib/core/settle.js":
/*!***********************************************!*\
  !*** ./node_modules/axios/lib/core/settle.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(/*! ./createError */ "./node_modules/axios/lib/core/createError.js");

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  // Note: status is not exposed by XDomainRequest
  if (!response.status || !validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),

/***/ "./node_modules/axios/lib/core/transformData.js":
/*!******************************************************!*\
  !*** ./node_modules/axios/lib/core/transformData.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),

/***/ "./node_modules/axios/lib/defaults.js":
/*!********************************************!*\
  !*** ./node_modules/axios/lib/defaults.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(/*! ./utils */ "./node_modules/axios/lib/utils.js");
var normalizeHeaderName = __webpack_require__(/*! ./helpers/normalizeHeaderName */ "./node_modules/axios/lib/helpers/normalizeHeaderName.js");

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(/*! ./adapters/xhr */ "./node_modules/axios/lib/adapters/xhr.js");
  } else if (typeof process !== 'undefined') {
    // For node use HTTP adapter
    adapter = __webpack_require__(/*! ./adapters/http */ "./node_modules/axios/lib/adapters/xhr.js");
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/axios/lib/helpers/bind.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/bind.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/btoa.js":
/*!************************************************!*\
  !*** ./node_modules/axios/lib/helpers/btoa.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// btoa polyfill for IE<10 courtesy https://github.com/davidchambers/Base64.js

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function E() {
  this.message = 'String contains an invalid character';
}
E.prototype = new Error;
E.prototype.code = 5;
E.prototype.name = 'InvalidCharacterError';

function btoa(input) {
  var str = String(input);
  var output = '';
  for (
    // initialize result and counter
    var block, charCode, idx = 0, map = chars;
    // if the next str index does not exist:
    //   change the mapping table to "="
    //   check if d has no fractional digits
    str.charAt(idx | 0) || (map = '=', idx % 1);
    // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
    output += map.charAt(63 & block >> 8 - idx % 1 * 8)
  ) {
    charCode = str.charCodeAt(idx += 3 / 4);
    if (charCode > 0xFF) {
      throw new E();
    }
    block = block << 8 | charCode;
  }
  return output;
}

module.exports = btoa;


/***/ }),

/***/ "./node_modules/axios/lib/helpers/buildURL.js":
/*!****************************************************!*\
  !*** ./node_modules/axios/lib/helpers/buildURL.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/combineURLs.js":
/*!*******************************************************!*\
  !*** ./node_modules/axios/lib/helpers/combineURLs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/cookies.js":
/*!***************************************************!*\
  !*** ./node_modules/axios/lib/helpers/cookies.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
  (function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path, domain, secure) {
        var cookie = [];
        cookie.push(name + '=' + encodeURIComponent(value));

        if (utils.isNumber(expires)) {
          cookie.push('expires=' + new Date(expires).toGMTString());
        }

        if (utils.isString(path)) {
          cookie.push('path=' + path);
        }

        if (utils.isString(domain)) {
          cookie.push('domain=' + domain);
        }

        if (secure === true) {
          cookie.push('secure');
        }

        document.cookie = cookie.join('; ');
      },

      read: function read(name) {
        var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
        return (match ? decodeURIComponent(match[3]) : null);
      },

      remove: function remove(name) {
        this.write(name, '', Date.now() - 86400000);
      }
    };
  })() :

  // Non standard browser env (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return {
      write: function write() {},
      read: function read() { return null; },
      remove: function remove() {}
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isAbsoluteURL.js":
/*!*********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isAbsoluteURL.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/isURLSameOrigin.js":
/*!***********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/isURLSameOrigin.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  (function standardBrowserEnv() {
    var msie = /(msie|trident)/i.test(navigator.userAgent);
    var urlParsingNode = document.createElement('a');
    var originURL;

    /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
    function resolveURL(url) {
      var href = url;

      if (msie) {
        // IE needs attribute set twice to normalize properties
        urlParsingNode.setAttribute('href', href);
        href = urlParsingNode.href;
      }

      urlParsingNode.setAttribute('href', href);

      // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
                  urlParsingNode.pathname :
                  '/' + urlParsingNode.pathname
      };
    }

    originURL = resolveURL(window.location.href);

    /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
    return function isURLSameOrigin(requestURL) {
      var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
      return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
    };
  })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
  (function nonStandardBrowserEnv() {
    return function isURLSameOrigin() {
      return true;
    };
  })()
);


/***/ }),

/***/ "./node_modules/axios/lib/helpers/normalizeHeaderName.js":
/*!***************************************************************!*\
  !*** ./node_modules/axios/lib/helpers/normalizeHeaderName.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ../utils */ "./node_modules/axios/lib/utils.js");

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/parseHeaders.js":
/*!********************************************************!*\
  !*** ./node_modules/axios/lib/helpers/parseHeaders.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(/*! ./../utils */ "./node_modules/axios/lib/utils.js");

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),

/***/ "./node_modules/axios/lib/helpers/spread.js":
/*!**************************************************!*\
  !*** ./node_modules/axios/lib/helpers/spread.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),

/***/ "./node_modules/axios/lib/utils.js":
/*!*****************************************!*\
  !*** ./node_modules/axios/lib/utils.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(/*! ./helpers/bind */ "./node_modules/axios/lib/helpers/bind.js");
var isBuffer = __webpack_require__(/*! is-buffer */ "./node_modules/is-buffer/index.js");

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  extend: extend,
  trim: trim
};


/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/GoogleMap.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/GoogleMap.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "GoogleMap",
  data: function data() {
    return {
      // default to Montreal to keep it simple
      // change this to whatever makes sense
      center: {
        lat: 45.508,
        lng: -73.587
      },
      markers: [],
      places: [],
      currentPlace: null
    };
  },
  mounted: function mounted() {
    this.geolocate();
  },
  methods: {
    // receives a place object via the autocomplete component
    setPlace: function setPlace(place) {
      this.currentPlace = place;
    },
    addMarker: function addMarker() {
      if (this.currentPlace) {
        var marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng()
        };
        this.markers.push({
          position: marker
        });
        this.places.push(this.currentPlace);
        this.center = marker;
        this.currentPlace = null;
      }
    },
    geolocate: function geolocate() {
      var _this = this;

      navigator.geolocation.getCurrentPosition(function (position) {
        _this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/IconBase.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  props: {
    iconName: {
      type: String,
      "default": 'box'
    },
    width: {
      type: [Number, String],
      "default": 512
    },
    height: {
      type: [Number, String],
      "default": 512
    },
    iconColor: {
      type: String,
      "default": 'currentColor'
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_IconBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/IconBase */ "./resources/components/IconBase.vue");
/* harmony import */ var _components_icons_Location__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/icons/Location */ "./resources/components/icons/Location.vue");
/* harmony import */ var _components_icons_bicycle__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/icons/bicycle */ "./resources/components/icons/bicycle.vue");
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ __webpack_exports__["default"] = ({
  name: "leaseplanButtonOrange",
  props: ['text', 'iconName'],
  components: {
    IconBase: _components_IconBase__WEBPACK_IMPORTED_MODULE_0__["default"],
    Location: _components_icons_Location__WEBPACK_IMPORTED_MODULE_1__["default"],
    Bicycle: _components_icons_bicycle__WEBPACK_IMPORTED_MODULE_2__["default"]
  },
  data: function data() {
    return {
      child_component: this.iconName // width: this.width,
      // height: this.height

    };
  },
  methods: {
    onClick: function onClick() {
      //let the algorithm do his job
      console.log("let the algorithm do his job");
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/start.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/buttons/start.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "Start",
  data: function data() {
    return {
      //put data here
      text: "Ophalen Starten"
    };
  },
  methods: {
    onStartRoute: function onStartRoute() {
      //let the algorithm do his job
      console.log("Geklikt op ophalen starten");
    }
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=script&lang=js&":
/*!************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/locations_holder.vue?vue&type=script&lang=js& ***!
  \************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "loctions_holder"
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/dashboard.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_buttons_leaseplanButtonOrange__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/buttons/leaseplanButtonOrange */ "./resources/components/buttons/leaseplanButtonOrange.vue");
/* harmony import */ var _components_buttons_start__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../components/buttons/start */ "./resources/components/buttons/start.vue");
/* harmony import */ var _components_locations_holder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../components/locations_holder */ "./resources/components/locations_holder.vue");
/* harmony import */ var _components_GoogleMap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../components/GoogleMap */ "./resources/components/GoogleMap.vue");
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



 // import image from "../../../resources/images/Logo.png"


/* harmony default export */ __webpack_exports__["default"] = ({
  name: "dashboard",
  props: ['url'],
  components: {
    leaseplanButtonOrange: _components_buttons_leaseplanButtonOrange__WEBPACK_IMPORTED_MODULE_1__["default"],
    start: _components_buttons_start__WEBPACK_IMPORTED_MODULE_2__["default"],
    GoogleMap: _components_GoogleMap__WEBPACK_IMPORTED_MODULE_4__["default"],
    loactions_holder: _components_locations_holder__WEBPACK_IMPORTED_MODULE_3__["default"]
  },
  data: function data() {
    return {
      images: {
        image: 'https://jp.vuejs.org/images/logo.png'
      }
    };
  }
});

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/login.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_IconBase__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../components/IconBase */ "./resources/components/IconBase.vue");
/* harmony import */ var _components_icons_Logo__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../components/icons/Logo */ "./resources/components/icons/Logo.vue");
//
//
//
//
//
//
//
//
//
//
//
//


/* harmony default export */ __webpack_exports__["default"] = ({
  name: "login",
  components: {
    IconBase: _components_IconBase__WEBPACK_IMPORTED_MODULE_0__["default"],
    Logo: _components_icons_Logo__WEBPACK_IMPORTED_MODULE_1__["default"]
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.vue-map-container {\n  position: relative;\n}\n.vue-map-container .vue-map {\n  left: 0; right: 0; top: 0; bottom: 0;\n  position: absolute;\n}\n.vue-map-hidden {\n  display: none;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.vue-street-view-pano-container {\n  position: relative;\n}\n.vue-street-view-pano-container .vue-street-view-pano {\n  left: 0; right: 0; top: 0; bottom: 0;\n  position: absolute;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\nsvg[data-v-04509bdb] {\n    display: inline-block;\n    vertical-align: baseline;\n    margin-bottom: -2px; /* yes, I'm that particular about formatting */\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css&":
/*!********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css& ***!
  \********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.leaseplanButton[data-v-77209294]{\n    width: 160px;\n    height: 160px;\n    background-color: #fe8d12;\n    box-shadow: grey 3px 3px;\n    border-radius: 6px;\n    position: relative;\n    float: left;\n}\n.leaseplanButton[data-v-77209294] div{\n    font-size: 20px;\n    font-weight: bold;\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n    color: white;\n    width: 100%;\n    text-align: center;\n    position: absolute;\n    top: 12%;\n}\n.leaseplanButton[data-v-77209294] span{\n    display: block;\n    width: 100%;\n    height: 75%;\n    margin: 19% 0px auto auto;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css&":
/*!*******************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css& ***!
  \*******************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.locations_holder[data-v-11c1c004] {\n    width: 240px;\n    height: 345px;\n    box-shadow: grey 3px 3px;\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.startRouteBtn[data-v-e1aead0a]{\n    background-color: white;\n    width: 354px;\n    height: 160px;\n    border: 5px solid #fe8d12;\n    box-shadow: grey 3px 3px;\n    border-radius: 6px;\n    text-align: center;\n    vertical-align: center;\n    position: relative;\n}\n.startRouteBtn[data-v-e1aead0a] div{\n    font-size: 37px;\n    font-weight: bold;\n    font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n    color: #fe8d12;\n    position: absolute;\n    top: 36%;\n    left: 8%;\n}\n.leaseplanButtonLeft[data-v-e1aead0a]{\n    margin-right: 30px;\n}\n.header[data-v-e1aead0a]{\n    margin: 40px 0px 40px 0px;\n}\n.header img[data-v-e1aead0a]{\n    display: block;\n    margin: 0px auto;\n}\n.google-map[data-v-e1aead0a]{\n    margin-top: 40px;\n}\n\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css&":
/*!******************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css& ***!
  \******************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, "\n.background[data-v-780e8960] {\n    height: 100vh;\n    width: 100vw;\n    background-color: black;\n    -webkit-animation-name: colorchangebw-data-v-780e8960;\n            animation-name: colorchangebw-data-v-780e8960;\n    -webkit-animation-delay: 2s;\n            animation-delay: 2s;\n    -webkit-animation-duration: 2s;\n            animation-duration: 2s;\n    -webkit-animation-iteration-count: 1;\n            animation-iteration-count: 1;\n    -webkit-animation-fill-mode: forwards;\n            animation-fill-mode: forwards;\n}\n.container[data-v-780e8960] {\n   \n    height: inherit;\n    width: inherit;\n    margin: auto auto;\n}\n.circle[data-v-780e8960] {\n    position: absolute;\n    left: 25%;\n    top: 30%;\n    height: 500px;\n    width: 500px;\n    border-radius: 50%;\n    margin: auto auto;\n    background-color: white;\n}\n.logo[data-v-780e8960] {\n    position: absolute;\n    left: 33%;\n    top: 33%;\n    height: 33%;\n    width: 33%;\n    margin: auto auto;\n}\n@-webkit-keyframes colorchangebw-data-v-780e8960 {\nfrom {\n        background-color: black;\n}\nto {\n        background-color: white;\n}\n}\n@keyframes colorchangebw-data-v-780e8960 {\nfrom {\n        background-color: black;\n}\nto {\n        background-color: white;\n}\n}\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/css-loader/lib/css-base.js":
/*!*************************************************!*\
  !*** ./node_modules/css-loader/lib/css-base.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ "./node_modules/is-buffer/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-buffer/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

/*!
 * Determine if an object is a Buffer
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */

// The _isBuffer check is for Safari 5-7 support, because it's missing
// Object.prototype.constructor. Remove this eventually
module.exports = function (obj) {
  return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer)
}

function isBuffer (obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
}

// For Node v0.10 support. Remove this eventually.
function isSlowBuffer (obj) {
  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isBuffer(obj.slice(0, 0))
}


/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/setimmediate/setImmediate.js":
/*!***************************************************!*\
  !*** ./node_modules/setimmediate/setImmediate.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js"), __webpack_require__(/*! ./../process/browser.js */ "./node_modules/process/browser.js")))

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./map.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./streetViewPanorama.vue?vue&type=style&index=0&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css&":
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css& ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader??ref--6-1!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??ref--6-2!../../node_modules/vue-loader/lib??vue-loader-options!./IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css&":
/*!***********************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css& ***!
  \***********************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../node_modules/css-loader??ref--6-1!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??ref--6-2!../../node_modules/vue-loader/lib??vue-loader-options!./locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css&":
/*!**************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css& ***!
  \**************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css&":
/*!**********************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader??ref--6-1!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--6-2!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css& ***!
  \**********************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css& */ "./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css&");

if(typeof content === 'string') content = [[module.i, content, '']];

var transform;
var insertInto;



var options = {"hmr":true}

options.transform = transform
options.insertInto = undefined;

var update = __webpack_require__(/*! ../../../node_modules/style-loader/lib/addStyles.js */ "./node_modules/style-loader/lib/addStyles.js")(content, options);

if(content.locals) module.exports = content.locals;

if(false) {}

/***/ }),

/***/ "./node_modules/style-loader/lib/addStyles.js":
/*!****************************************************!*\
  !*** ./node_modules/style-loader/lib/addStyles.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

var stylesInDom = {};

var	memoize = function (fn) {
	var memo;

	return function () {
		if (typeof memo === "undefined") memo = fn.apply(this, arguments);
		return memo;
	};
};

var isOldIE = memoize(function () {
	// Test for IE <= 9 as proposed by Browserhacks
	// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
	// Tests for existence of standard globals is to allow style-loader
	// to operate correctly into non-standard environments
	// @see https://github.com/webpack-contrib/style-loader/issues/177
	return window && document && document.all && !window.atob;
});

var getTarget = function (target, parent) {
  if (parent){
    return parent.querySelector(target);
  }
  return document.querySelector(target);
};

var getElement = (function (fn) {
	var memo = {};

	return function(target, parent) {
                // If passing function in options, then use it for resolve "head" element.
                // Useful for Shadow Root style i.e
                // {
                //   insertInto: function () { return document.querySelector("#foo").shadowRoot }
                // }
                if (typeof target === 'function') {
                        return target();
                }
                if (typeof memo[target] === "undefined") {
			var styleTarget = getTarget.call(this, target, parent);
			// Special case to return head of iframe instead of iframe itself
			if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
				try {
					// This will throw an exception if access to iframe is blocked
					// due to cross-origin restrictions
					styleTarget = styleTarget.contentDocument.head;
				} catch(e) {
					styleTarget = null;
				}
			}
			memo[target] = styleTarget;
		}
		return memo[target]
	};
})();

var singleton = null;
var	singletonCounter = 0;
var	stylesInsertedAtTop = [];

var	fixUrls = __webpack_require__(/*! ./urls */ "./node_modules/style-loader/lib/urls.js");

module.exports = function(list, options) {
	if (typeof DEBUG !== "undefined" && DEBUG) {
		if (typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};

	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (!options.singleton && typeof options.singleton !== "boolean") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
        if (!options.insertInto) options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (!options.insertAt) options.insertAt = "bottom";

	var styles = listToStyles(list, options);

	addStylesToDom(styles, options);

	return function update (newList) {
		var mayRemove = [];

		for (var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];

			domStyle.refs--;
			mayRemove.push(domStyle);
		}

		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}

		for (var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];

			if(domStyle.refs === 0) {
				for (var j = 0; j < domStyle.parts.length; j++) domStyle.parts[j]();

				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom (styles, options) {
	for (var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];

		if(domStyle) {
			domStyle.refs++;

			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}

			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];

			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}

			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles (list, options) {
	var styles = [];
	var newStyles = {};

	for (var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};

		if(!newStyles[id]) styles.push(newStyles[id] = {id: id, parts: [part]});
		else newStyles[id].parts.push(part);
	}

	return styles;
}

function insertStyleElement (options, style) {
	var target = getElement(options.insertInto)

	if (!target) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}

	var lastStyleElementInsertedAtTop = stylesInsertedAtTop[stylesInsertedAtTop.length - 1];

	if (options.insertAt === "top") {
		if (!lastStyleElementInsertedAtTop) {
			target.insertBefore(style, target.firstChild);
		} else if (lastStyleElementInsertedAtTop.nextSibling) {
			target.insertBefore(style, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			target.appendChild(style);
		}
		stylesInsertedAtTop.push(style);
	} else if (options.insertAt === "bottom") {
		target.appendChild(style);
	} else if (typeof options.insertAt === "object" && options.insertAt.before) {
		var nextSibling = getElement(options.insertAt.before, target);
		target.insertBefore(style, nextSibling);
	} else {
		throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");
	}
}

function removeStyleElement (style) {
	if (style.parentNode === null) return false;
	style.parentNode.removeChild(style);

	var idx = stylesInsertedAtTop.indexOf(style);
	if(idx >= 0) {
		stylesInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement (options) {
	var style = document.createElement("style");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}

	if(options.attrs.nonce === undefined) {
		var nonce = getNonce();
		if (nonce) {
			options.attrs.nonce = nonce;
		}
	}

	addAttrs(style, options.attrs);
	insertStyleElement(options, style);

	return style;
}

function createLinkElement (options) {
	var link = document.createElement("link");

	if(options.attrs.type === undefined) {
		options.attrs.type = "text/css";
	}
	options.attrs.rel = "stylesheet";

	addAttrs(link, options.attrs);
	insertStyleElement(options, link);

	return link;
}

function addAttrs (el, attrs) {
	Object.keys(attrs).forEach(function (key) {
		el.setAttribute(key, attrs[key]);
	});
}

function getNonce() {
	if (false) {}

	return __webpack_require__.nc;
}

function addStyle (obj, options) {
	var style, update, remove, result;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    result = typeof options.transform === 'function'
		 ? options.transform(obj.css) 
		 : options.transform.default(obj.css);

	    if (result) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = result;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css.
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;

		style = singleton || (singleton = createStyleElement(options));

		update = applyToSingletonTag.bind(null, style, styleIndex, false);
		remove = applyToSingletonTag.bind(null, style, styleIndex, true);

	} else if (
		obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function"
	) {
		style = createLinkElement(options);
		update = updateLink.bind(null, style, options);
		remove = function () {
			removeStyleElement(style);

			if(style.href) URL.revokeObjectURL(style.href);
		};
	} else {
		style = createStyleElement(options);
		update = applyToTag.bind(null, style);
		remove = function () {
			removeStyleElement(style);
		};
	}

	update(obj);

	return function updateStyle (newObj) {
		if (newObj) {
			if (
				newObj.css === obj.css &&
				newObj.media === obj.media &&
				newObj.sourceMap === obj.sourceMap
			) {
				return;
			}

			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;

		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag (style, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (style.styleSheet) {
		style.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = style.childNodes;

		if (childNodes[index]) style.removeChild(childNodes[index]);

		if (childNodes.length) {
			style.insertBefore(cssNode, childNodes[index]);
		} else {
			style.appendChild(cssNode);
		}
	}
}

function applyToTag (style, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		style.setAttribute("media", media)
	}

	if(style.styleSheet) {
		style.styleSheet.cssText = css;
	} else {
		while(style.firstChild) {
			style.removeChild(style.firstChild);
		}

		style.appendChild(document.createTextNode(css));
	}
}

function updateLink (link, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/*
		If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
		and there is no publicPath defined then lets turn convertToAbsoluteUrls
		on by default.  Otherwise default to the convertToAbsoluteUrls option
		directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls) {
		css = fixUrls(css);
	}

	if (sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = link.href;

	link.href = URL.createObjectURL(blob);

	if(oldSrc) URL.revokeObjectURL(oldSrc);
}


/***/ }),

/***/ "./node_modules/style-loader/lib/urls.js":
/*!***********************************************!*\
  !*** ./node_modules/style-loader/lib/urls.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ "./node_modules/timers-browserify/main.js":
/*!************************************************!*\
  !*** ./node_modules/timers-browserify/main.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ "./node_modules/setimmediate/setImmediate.js");
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/uiv/dist/uiv.esm.js":
/*!******************************************!*\
  !*** ./node_modules/uiv/dist/uiv.esm.js ***!
  \******************************************/
/*! exports provided: Carousel, Slide, Collapse, Dropdown, Modal, Tab, Tabs, DatePicker, Affix, Alert, Pagination, Tooltip, Popover, TimePicker, Typeahead, ProgressBar, ProgressBarStack, Breadcrumbs, BreadcrumbItem, Btn, BtnGroup, BtnToolbar, MultiSelect, Navbar, NavbarNav, NavbarForm, NavbarText, tooltip, popover, scrollspy, MessageBox, Notification, install */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Carousel", function() { return Carousel; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Slide", function() { return Slide; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Collapse", function() { return Collapse; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dropdown", function() { return Dropdown; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Modal", function() { return Modal; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tab", function() { return Tab; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tabs", function() { return Tabs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "DatePicker", function() { return DatePicker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Affix", function() { return Affix; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Alert", function() { return Alert; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Pagination", function() { return Pagination; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Tooltip", function() { return Tooltip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Popover", function() { return Popover; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "TimePicker", function() { return TimePicker; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Typeahead", function() { return Typeahead; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBar", function() { return ProgressBar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ProgressBarStack", function() { return ProgressBarStack; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Breadcrumbs", function() { return Breadcrumbs; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BreadcrumbItem", function() { return BreadcrumbItem; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Btn", function() { return Btn; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BtnGroup", function() { return BtnGroup; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "BtnToolbar", function() { return BtnToolbar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiSelect", function() { return MultiSelect; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Navbar", function() { return Navbar; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarNav", function() { return NavbarNav; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarForm", function() { return NavbarForm; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "NavbarText", function() { return NavbarText; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "tooltip", function() { return tooltip; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "popover", function() { return popover; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "scrollspy", function() { return scrollspy; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MessageBox", function() { return messageBox; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Notification", function() { return notification; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "install", function() { return install; });
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);


function isExist(obj) {
  return typeof obj !== 'undefined' && obj !== null;
}

function isFunction(obj) {
  return typeof obj === 'function';
}

function isNumber(obj) {
  return typeof obj === 'number';
}

function isString(obj) {
  return typeof obj === 'string';
}

function isBoolean(obj) {
  return typeof obj === 'boolean';
}

function isPromiseSupported() {
  return typeof window !== 'undefined' && isExist(window.Promise);
}

var Carousel = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "carousel slide", attrs: { "data-ride": "carousel" }, on: { "mouseenter": _vm.stopInterval, "mouseleave": _vm.startInterval } }, [_vm.indicators ? _vm._t("indicators", [_c('ol', { staticClass: "carousel-indicators" }, _vm._l(_vm.slides, function (slide, index) {
      return _c('li', { class: { active: index === _vm.activeIndex }, on: { "click": function click($event) {
            return _vm.select(index);
          } } });
    }), 0)], { "select": _vm.select, "activeIndex": _vm.activeIndex }) : _vm._e(), _vm._v(" "), _c('div', { staticClass: "carousel-inner", attrs: { "role": "listbox" } }, [_vm._t("default")], 2), _vm._v(" "), _vm.controls ? _c('a', { staticClass: "left carousel-control", attrs: { "href": "#", "role": "button" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.prev();
        } } }, [_c('span', { class: _vm.iconControlLeft, attrs: { "aria-hidden": "true" } }), _vm._v(" "), _c('span', { staticClass: "sr-only" }, [_vm._v("Previous")])]) : _vm._e(), _vm._v(" "), _vm.controls ? _c('a', { staticClass: "right carousel-control", attrs: { "href": "#", "role": "button" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.next();
        } } }, [_c('span', { class: _vm.iconControlRight, attrs: { "aria-hidden": "true" } }), _vm._v(" "), _c('span', { staticClass: "sr-only" }, [_vm._v("Next")])]) : _vm._e()], 2);
  }, staticRenderFns: [],
  props: {
    value: Number,
    indicators: {
      type: Boolean,
      default: true
    },
    controls: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000
    },
    iconControlLeft: {
      type: String,
      default: 'glyphicon glyphicon-chevron-left'
    },
    iconControlRight: {
      type: String,
      default: 'glyphicon glyphicon-chevron-right'
    }
  },
  data: function data() {
    return {
      slides: [],
      activeIndex: 0, // Make v-model not required
      timeoutId: 0,
      intervalId: 0
    };
  },

  watch: {
    interval: function interval() {
      this.startInterval();
    },
    value: function value(index, oldValue) {
      this.run(index, oldValue);
      this.activeIndex = index;
    }
  },
  mounted: function mounted() {
    if (isExist(this.value)) {
      this.activeIndex = this.value;
    }
    if (this.slides.length > 0) {
      this.$select(this.activeIndex);
    }
    this.startInterval();
  },
  beforeDestroy: function beforeDestroy() {
    this.stopInterval();
  },

  methods: {
    run: function run(newIndex, oldIndex) {
      var _this = this;

      var currentActiveIndex = oldIndex || 0;
      var direction = void 0;
      if (newIndex > currentActiveIndex) {
        direction = ['next', 'left'];
      } else {
        direction = ['prev', 'right'];
      }
      this.slides[newIndex].slideClass[direction[0]] = true;
      this.$nextTick(function () {
        _this.slides[newIndex].$el.offsetHeight;
        _this.slides.forEach(function (slide, i) {
          if (i === currentActiveIndex) {
            slide.slideClass.active = true;
            slide.slideClass[direction[1]] = true;
          } else if (i === newIndex) {
            slide.slideClass[direction[1]] = true;
          }
        });
        _this.timeoutId = setTimeout(function () {
          _this.$select(newIndex);
          _this.$emit('change', newIndex);
          _this.timeoutId = 0;
        }, 600);
      });
    },
    startInterval: function startInterval() {
      var _this2 = this;

      this.stopInterval();
      if (this.interval > 0) {
        this.intervalId = setInterval(function () {
          _this2.next();
        }, this.interval);
      }
    },
    stopInterval: function stopInterval() {
      clearInterval(this.intervalId);
      this.intervalId = 0;
    },
    resetAllSlideClass: function resetAllSlideClass() {
      this.slides.forEach(function (slide) {
        slide.slideClass.active = false;
        slide.slideClass.left = false;
        slide.slideClass.right = false;
        slide.slideClass.next = false;
        slide.slideClass.prev = false;
      });
    },
    $select: function $select(index) {
      this.resetAllSlideClass();
      this.slides[index].slideClass.active = true;
    },
    select: function select(index) {
      if (this.timeoutId !== 0 || index === this.activeIndex) {
        return;
      }
      if (isExist(this.value)) {
        this.$emit('input', index);
      } else {
        this.run(index, this.activeIndex);
        this.activeIndex = index;
      }
    },
    prev: function prev() {
      this.select(this.activeIndex === 0 ? this.slides.length - 1 : this.activeIndex - 1);
    },
    next: function next() {
      this.select(this.activeIndex === this.slides.length - 1 ? 0 : this.activeIndex + 1);
    }
  }
};

function spliceIfExist(arr, item) {
  if (Array.isArray(arr)) {
    var index = arr.indexOf(item);
    if (index >= 0) {
      arr.splice(index, 1);
    }
  }
}

function range(end) {
  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

  var arr = [];
  for (var i = start; i < end; i += step) {
    arr.push(i);
  }
  return arr;
}

function nodeListToArray(nodeList) {
  return Array.prototype.slice.call(nodeList || []);
}

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

var Slide = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "item", class: _vm.slideClass }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  data: function data() {
    return {
      slideClass: {
        active: false,
        prev: false,
        next: false,
        left: false,
        right: false
      }
    };
  },
  created: function created() {
    try {
      this.$parent.slides.push(this);
    } catch (e) {
      throw new Error('Slide parent must be Carousel.');
    }
  },
  beforeDestroy: function beforeDestroy() {
    var slides = this.$parent && this.$parent.slides;
    spliceIfExist(slides, this);
  }
};

var EVENTS = {
  MOUSE_ENTER: 'mouseenter',
  MOUSE_LEAVE: 'mouseleave',
  FOCUS: 'focus',
  BLUR: 'blur',
  CLICK: 'click',
  INPUT: 'input',
  KEY_DOWN: 'keydown',
  KEY_UP: 'keyup',
  KEY_PRESS: 'keypress',
  RESIZE: 'resize',
  SCROLL: 'scroll',
  TOUCH_START: 'touchstart',
  TOUCH_END: 'touchend'
};

var TRIGGERS = {
  CLICK: 'click',
  HOVER: 'hover',
  FOCUS: 'focus',
  HOVER_FOCUS: 'hover-focus',
  OUTSIDE_CLICK: 'outside-click',
  MANUAL: 'manual'
};

var PLACEMENTS = {
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left'
};

function isIE11() {
  return !!window.MSInputMethodContext && !!document.documentMode;
}

function isIE10() {
  return window.navigator.appVersion.indexOf('MSIE 10') !== -1;
}

function getComputedStyle(el) {
  return window.getComputedStyle(el);
}

function getViewportSize() {
  var width = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  return { width: width, height: height };
}

var scrollbarWidth = null;
var savedScreenSize = null;

function getScrollbarWidth() {
  var recalculate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

  var screenSize = getViewportSize();
  // return directly when already calculated & not force recalculate & screen size not changed
  if (scrollbarWidth !== null && !recalculate && screenSize.height === savedScreenSize.height && screenSize.width === savedScreenSize.width) {
    return scrollbarWidth;
  }
  if (document.readyState === 'loading') {
    return null;
  }
  var div1 = document.createElement('div');
  var div2 = document.createElement('div');
  div1.style.width = div2.style.width = div1.style.height = div2.style.height = '100px';
  div1.style.overflow = 'scroll';
  div2.style.overflow = 'hidden';
  document.body.appendChild(div1);
  document.body.appendChild(div2);
  scrollbarWidth = Math.abs(div1.scrollHeight - div2.scrollHeight);
  document.body.removeChild(div1);
  document.body.removeChild(div2);
  // save new screen size
  savedScreenSize = screenSize;
  return scrollbarWidth;
}

function on(element, event, handler) {
  element.addEventListener(event, handler);
}

function off(element, event, handler) {
  element.removeEventListener(event, handler);
}

function isElement(el) {
  return el && el.nodeType === Node.ELEMENT_NODE;
}

function removeFromDom(el) {
  isElement(el) && isElement(el.parentNode) && el.parentNode.removeChild(el);
}

function ensureElementMatchesFunction() {
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function (s) {
      var matches = (this.document || this.ownerDocument).querySelectorAll(s);
      var i = matches.length;
      while (--i >= 0 && matches.item(i) !== this) {}
      return i > -1;
    };
  }
}

function addClass(el, className) {
  if (!isElement(el)) {
    return;
  }
  if (el.className) {
    var classes = el.className.split(' ');
    if (classes.indexOf(className) < 0) {
      classes.push(className);
      el.className = classes.join(' ');
    }
  } else {
    el.className = className;
  }
}

function removeClass(el, className) {
  if (!isElement(el)) {
    return;
  }
  if (el.className) {
    var classes = el.className.split(' ');
    var newClasses = [];
    for (var i = 0, l = classes.length; i < l; i++) {
      if (classes[i] !== className) {
        newClasses.push(classes[i]);
      }
    }
    el.className = newClasses.join(' ');
  }
}

function hasClass(el, className) {
  if (!isElement(el)) {
    return false;
  }
  var classes = el.className.split(' ');
  for (var i = 0, l = classes.length; i < l; i++) {
    if (classes[i] === className) {
      return true;
    }
  }
  return false;
}

function setDropdownPosition(dropdown, trigger) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var doc = document.documentElement;
  var containerScrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  var containerScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  var rect = trigger.getBoundingClientRect();
  var dropdownRect = dropdown.getBoundingClientRect();
  dropdown.style.right = 'auto';
  dropdown.style.bottom = 'auto';
  if (options.menuRight) {
    dropdown.style.left = containerScrollLeft + rect.left + rect.width - dropdownRect.width + 'px';
  } else {
    dropdown.style.left = containerScrollLeft + rect.left + 'px';
  }
  if (options.dropup) {
    dropdown.style.top = containerScrollTop + rect.top - dropdownRect.height - 4 + 'px';
  } else {
    dropdown.style.top = containerScrollTop + rect.top + rect.height + 'px';
  }
}

function isAvailableAtPosition(trigger, popup, placement) {
  var triggerRect = trigger.getBoundingClientRect();
  var popupRect = popup.getBoundingClientRect();
  var viewPortSize = getViewportSize();
  var top = true;
  var right = true;
  var bottom = true;
  var left = true;
  switch (placement) {
    case PLACEMENTS.TOP:
      top = triggerRect.top >= popupRect.height;
      left = triggerRect.left + triggerRect.width / 2 >= popupRect.width / 2;
      right = triggerRect.right - triggerRect.width / 2 + popupRect.width / 2 <= viewPortSize.width;
      break;
    case PLACEMENTS.BOTTOM:
      bottom = triggerRect.bottom + popupRect.height <= viewPortSize.height;
      left = triggerRect.left + triggerRect.width / 2 >= popupRect.width / 2;
      right = triggerRect.right - triggerRect.width / 2 + popupRect.width / 2 <= viewPortSize.width;
      break;
    case PLACEMENTS.RIGHT:
      right = triggerRect.right + popupRect.width <= viewPortSize.width;
      top = triggerRect.top + triggerRect.height / 2 >= popupRect.height / 2;
      bottom = triggerRect.bottom - triggerRect.height / 2 + popupRect.height / 2 <= viewPortSize.height;
      break;
    case PLACEMENTS.LEFT:
      left = triggerRect.left >= popupRect.width;
      top = triggerRect.top + triggerRect.height / 2 >= popupRect.height / 2;
      bottom = triggerRect.bottom - triggerRect.height / 2 + popupRect.height / 2 <= viewPortSize.height;
      break;
  }
  return top && right && bottom && left;
}

function setTooltipPosition(tooltip, trigger, placement, auto, appendToSelector, viewport) {
  var isPopover = tooltip && tooltip.className && tooltip.className.indexOf('popover') >= 0;
  var containerScrollTop = void 0;
  var containerScrollLeft = void 0;
  if (!isExist(appendToSelector) || appendToSelector === 'body') {
    var doc = document.documentElement;
    containerScrollLeft = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    containerScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
  } else {
    var container = document.querySelector(appendToSelector);
    containerScrollLeft = container.scrollLeft;
    containerScrollTop = container.scrollTop;
  }
  // auto adjust placement
  if (auto) {
    // Try: right -> bottom -> left -> top
    // Cause the default placement is top
    var placements = [PLACEMENTS.RIGHT, PLACEMENTS.BOTTOM, PLACEMENTS.LEFT, PLACEMENTS.TOP];
    // The class switch helper function
    var changePlacementClass = function changePlacementClass(placement) {
      // console.log(placement)
      placements.forEach(function (placement) {
        removeClass(tooltip, placement);
      });
      addClass(tooltip, placement);
    };
    // No need to adjust if the default placement fits
    if (!isAvailableAtPosition(trigger, tooltip, placement)) {
      for (var i = 0, l = placements.length; i < l; i++) {
        // Re-assign placement class
        changePlacementClass(placements[i]);
        // Break if new placement fits
        if (isAvailableAtPosition(trigger, tooltip, placements[i])) {
          placement = placements[i];
          break;
        }
      }
      changePlacementClass(placement);
    }
  }
  // fix left and top for tooltip
  var rect = trigger.getBoundingClientRect();
  var tooltipRect = tooltip.getBoundingClientRect();
  var top = void 0;
  var left = void 0;
  if (placement === PLACEMENTS.BOTTOM) {
    top = containerScrollTop + rect.top + rect.height;
    left = containerScrollLeft + rect.left + rect.width / 2 - tooltipRect.width / 2;
  } else if (placement === PLACEMENTS.LEFT) {
    top = containerScrollTop + rect.top + rect.height / 2 - tooltipRect.height / 2;
    left = containerScrollLeft + rect.left - tooltipRect.width;
  } else if (placement === PLACEMENTS.RIGHT) {
    top = containerScrollTop + rect.top + rect.height / 2 - tooltipRect.height / 2;
    // https://github.com/wxsms/uiv/issues/272
    // add 1px to fix above issue
    left = containerScrollLeft + rect.left + rect.width + 1;
  } else {
    top = containerScrollTop + rect.top - tooltipRect.height;
    left = containerScrollLeft + rect.left + rect.width / 2 - tooltipRect.width / 2;
  }
  var viewportEl = void 0;
  // viewport option
  if (isString(viewport)) {
    viewportEl = document.querySelector(viewport);
  } else if (isFunction(viewport)) {
    viewportEl = viewport(trigger);
  }
  if (isElement(viewportEl)) {
    var popoverFix = isPopover ? 11 : 0;
    var viewportReact = viewportEl.getBoundingClientRect();
    var viewportTop = containerScrollTop + viewportReact.top;
    var viewportLeft = containerScrollLeft + viewportReact.left;
    var viewportBottom = viewportTop + viewportReact.height;
    var viewportRight = viewportLeft + viewportReact.width;
    // fix top
    if (top < viewportTop) {
      top = viewportTop;
    } else if (top + tooltipRect.height > viewportBottom) {
      top = viewportBottom - tooltipRect.height;
    }
    // fix left
    if (left < viewportLeft) {
      left = viewportLeft;
    } else if (left + tooltipRect.width > viewportRight) {
      left = viewportRight - tooltipRect.width;
    }
    // fix for popover pointer
    if (placement === PLACEMENTS.BOTTOM) {
      top -= popoverFix;
    } else if (placement === PLACEMENTS.LEFT) {
      left += popoverFix;
    } else if (placement === PLACEMENTS.RIGHT) {
      left -= popoverFix;
    } else {
      top += popoverFix;
    }
  }
  // set position finally
  tooltip.style.top = top + 'px';
  tooltip.style.left = left + 'px';
}

function hasScrollbar(el) {
  var SCROLL = 'scroll';
  var hasVScroll = el.scrollHeight > el.clientHeight;
  var style = getComputedStyle(el);
  return hasVScroll || style.overflow === SCROLL || style.overflowY === SCROLL;
}

function toggleBodyOverflow(enable) {
  var MODAL_OPEN = 'modal-open';
  var body = document.body;
  if (enable) {
    removeClass(body, MODAL_OPEN);
    body.style.paddingRight = null;
  } else {
    var browsersWithFloatingScrollbar = isIE10() || isIE11();
    var documentHasScrollbar = hasScrollbar(document.documentElement) || hasScrollbar(document.body);
    if (documentHasScrollbar && !browsersWithFloatingScrollbar) {
      body.style.paddingRight = getScrollbarWidth() + 'px';
    }
    addClass(body, MODAL_OPEN);
  }
}

function getClosest(el, selector) {
  ensureElementMatchesFunction();
  var parent = void 0;
  var _el = el;
  while (_el) {
    parent = _el.parentElement;
    if (parent && parent.matches(selector)) {
      return parent;
    }
    _el = parent;
  }
  return null;
}

function getParents(el, selector) {
  var until = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  ensureElementMatchesFunction();
  var parents = [];
  var parent = el.parentElement;
  while (parent) {
    if (parent.matches(selector)) {
      parents.push(parent);
    } else if (until && (until === parent || parent.matches(until))) {
      break;
    }
    parent = parent.parentElement;
  }
  return parents;
}

function focus(el) {
  if (!isElement(el)) {
    return;
  }
  el.getAttribute('tabindex') ? null : el.setAttribute('tabindex', '-1');
  el.focus();
}

var COLLAPSE = 'collapse';
var IN = 'in';
var COLLAPSING = 'collapsing';

var Collapse = {
  render: function render(h) {
    return h(this.tag, {}, this.$slots.default);
  },

  props: {
    tag: {
      type: String,
      default: 'div'
    },
    value: {
      type: Boolean,
      default: false
    },
    transitionDuration: {
      type: Number,
      default: 350
    }
  },
  data: function data() {
    return {
      timeoutId: 0
    };
  },

  watch: {
    value: function value(show) {
      this.toggle(show);
    }
  },
  mounted: function mounted() {
    var el = this.$el;
    addClass(el, COLLAPSE);
    if (this.value) {
      addClass(el, IN);
    }
  },

  methods: {
    toggle: function toggle(show) {
      var _this = this;

      clearTimeout(this.timeoutId);
      var el = this.$el;
      if (show) {
        this.$emit('show');
        removeClass(el, COLLAPSE);
        el.style.height = 'auto';
        var height = window.getComputedStyle(el).height;
        el.style.height = null;
        addClass(el, COLLAPSING);
        el.offsetHeight; // force repaint
        el.style.height = height;
        this.timeoutId = setTimeout(function () {
          removeClass(el, COLLAPSING);
          addClass(el, COLLAPSE);
          addClass(el, IN);
          el.style.height = null;
          _this.timeoutId = 0;
          _this.$emit('shown');
        }, this.transitionDuration);
      } else {
        this.$emit('hide');
        el.style.height = window.getComputedStyle(el).height;
        removeClass(el, IN);
        removeClass(el, COLLAPSE);
        el.offsetHeight;
        el.style.height = null;
        addClass(el, COLLAPSING);
        this.timeoutId = setTimeout(function () {
          addClass(el, COLLAPSE);
          removeClass(el, COLLAPSING);
          el.style.height = null;
          _this.timeoutId = 0;
          _this.$emit('hidden');
        }, this.transitionDuration);
      }
    }
  }
};

var DEFAULT_TAG = 'div';

var Dropdown = {
  render: function render(h) {
    return h(this.tag, {
      class: {
        'btn-group': this.tag === DEFAULT_TAG,
        dropdown: !this.dropup,
        dropup: this.dropup,
        open: this.show
      }
    }, [this.$slots.default, h('ul', {
      class: {
        'dropdown-menu': true,
        'dropdown-menu-right': this.menuRight
      },
      ref: 'dropdown'
    }, [this.$slots.dropdown])]);
  },

  props: {
    tag: {
      type: String,
      default: DEFAULT_TAG
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    value: Boolean,
    dropup: {
      type: Boolean,
      default: false
    },
    menuRight: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    notCloseElements: Array,
    positionElement: null
  },
  data: function data() {
    return {
      show: false,
      triggerEl: undefined
    };
  },

  watch: {
    value: function value(v) {
      this.toggle(v);
    }
  },
  mounted: function mounted() {
    this.initTrigger();
    if (this.triggerEl) {
      on(this.triggerEl, EVENTS.CLICK, this.toggle);
      on(this.triggerEl, EVENTS.KEY_DOWN, this.onKeyPress);
    }
    on(this.$refs.dropdown, EVENTS.KEY_DOWN, this.onKeyPress);
    on(window, EVENTS.CLICK, this.windowClicked);
    on(window, EVENTS.TOUCH_END, this.windowClicked);
    if (this.value) {
      this.toggle(true);
    }
  },
  beforeDestroy: function beforeDestroy() {
    this.removeDropdownFromBody();
    if (this.triggerEl) {
      off(this.triggerEl, EVENTS.CLICK, this.toggle);
      off(this.triggerEl, EVENTS.KEY_DOWN, this.onKeyPress);
    }
    off(this.$refs.dropdown, EVENTS.KEY_DOWN, this.onKeyPress);
    off(window, EVENTS.CLICK, this.windowClicked);
    off(window, EVENTS.TOUCH_END, this.windowClicked);
  },

  methods: {
    onKeyPress: function onKeyPress(event) {
      if (this.show) {
        var dropdownEl = this.$refs.dropdown;
        var keyCode = event.keyCode || event.which;
        if (keyCode === 27) {
          this.toggle(false);
          this.triggerEl && this.triggerEl.focus();
        } else if (keyCode === 13) {
          var currentFocus = dropdownEl.querySelector('li > a:focus');
          currentFocus && currentFocus.click();
        } else if (keyCode === 38 || keyCode === 40) {
          event.preventDefault();
          event.stopPropagation();
          var _currentFocus = dropdownEl.querySelector('li > a:focus');
          var items = dropdownEl.querySelectorAll('li:not(.disabled) > a');
          if (!_currentFocus) {
            focus(items[0]);
          } else {
            for (var i = 0; i < items.length; i++) {
              if (_currentFocus === items[i]) {
                if (keyCode === 38 && i < items.length > 0) {
                  focus(items[i - 1]);
                } else if (keyCode === 40 && i < items.length - 1) {
                  focus(items[i + 1]);
                }
                break;
              }
            }
          }
        }
      }
    },
    initTrigger: function initTrigger() {
      var trigger = this.$el.querySelector('[data-role="trigger"]') || this.$el.querySelector('.dropdown-toggle') || this.$el.firstChild;
      this.triggerEl = trigger && trigger !== this.$refs.dropdown ? trigger : null;
    },
    toggle: function toggle(show) {
      if (this.disabled) {
        return;
      }
      if (isBoolean(show)) {
        this.show = show;
      } else {
        this.show = !this.show;
      }
      if (this.appendToBody) {
        this.show ? this.appendDropdownToBody() : this.removeDropdownFromBody();
      }
      this.$emit('input', this.show);
    },
    windowClicked: function windowClicked(event) {
      var target = event.target;
      if (this.show && target) {
        var targetInNotCloseElements = false;
        if (this.notCloseElements) {
          for (var i = 0, l = this.notCloseElements.length; i < l; i++) {
            var isTargetInElement = this.notCloseElements[i].contains(target);
            var shouldBreak = isTargetInElement;
            if (this.appendToBody) {
              var isTargetInDropdown = this.$refs.dropdown.contains(target);
              var isElInElements = this.notCloseElements.indexOf(this.$el) >= 0;
              shouldBreak = isTargetInElement || isTargetInDropdown && isElInElements;
            }
            if (shouldBreak) {
              targetInNotCloseElements = true;
              break;
            }
          }
        }
        var targetInDropdownBody = this.$refs.dropdown.contains(target);
        var targetInTrigger = this.$el.contains(target) && !targetInDropdownBody;
        // normally, a dropdown select event is handled by @click that trigger after @touchend
        // then @touchend event have to be ignore in this case
        var targetInDropdownAndIsTouchEvent = targetInDropdownBody && event.type === 'touchend';
        if (!targetInTrigger && !targetInNotCloseElements && !targetInDropdownAndIsTouchEvent) {
          this.toggle(false);
        }
      }
    },
    appendDropdownToBody: function appendDropdownToBody() {
      try {
        var el = this.$refs.dropdown;
        el.style.display = 'block';
        document.body.appendChild(el);
        var positionElement = this.positionElement || this.$el;
        setDropdownPosition(el, positionElement, this);
      } catch (e) {
        // Silent
      }
    },
    removeDropdownFromBody: function removeDropdownFromBody() {
      try {
        var el = this.$refs.dropdown;
        el.removeAttribute('style');
        this.$el.appendChild(el);
      } catch (e) {
        // Silent
      }
    }
  }
};

var defaultLang = {
  uiv: {
    datePicker: {
      clear: 'Clear',
      today: 'Today',
      month: 'Month',
      month1: 'January',
      month2: 'February',
      month3: 'March',
      month4: 'April',
      month5: 'May',
      month6: 'June',
      month7: 'July',
      month8: 'August',
      month9: 'September',
      month10: 'October',
      month11: 'November',
      month12: 'December',
      year: 'Year',
      week1: 'Mon',
      week2: 'Tue',
      week3: 'Wed',
      week4: 'Thu',
      week5: 'Fri',
      week6: 'Sat',
      week7: 'Sun'
    },
    timePicker: {
      am: 'AM',
      pm: 'PM'
    },
    modal: {
      cancel: 'Cancel',
      ok: 'OK'
    },
    multiSelect: {
      placeholder: 'Select...',
      filterPlaceholder: 'Search...'
    }
  }
};

// https://github.com/ElemeFE/element/blob/dev/src/locale/index.js
var lang = defaultLang;

var i18nHandler = function i18nHandler() {
  var vuei18n = Object.getPrototypeOf(this).$t;
  if (isFunction(vuei18n)) {
    try {
      return vuei18n.apply(this, arguments);
    } catch (err) {
      //  vuei18n.apply doesn't work with 7.3.3 of vue-i18n
      return this.$t.apply(this, arguments);
    }
  }
};

var t = function t(path, options) {
  options = options || {};

  var value = i18nHandler.apply(this, arguments);
  if (isExist(value) && !options.$$locale) {
    return value;
  }
  var array = path.split('.');
  var current = options.$$locale || lang;

  for (var i = 0, j = array.length; i < j; i++) {
    var property = array[i];
    value = current[property];
    if (i === j - 1) return value;
    if (!value) return '';
    current = value;
  }
  return '';
};

var use = function use(l) {
  lang = l || lang;
};

var i18n = function i18n(fn) {
  i18nHandler = fn || i18nHandler;
};

var locale = { use: use, t: t, i18n: i18n };

var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var Local = {
  methods: {
    t: function t$$1() {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      args[1] = _extends({ $$locale: this.locale }, args[1]);
      return t.apply(this, args);
    }
  },
  props: {
    locale: Object
  }
};

function mergeData() {
  for (var e, a, s = {}, t = arguments.length; t--;) {
    for (var r = 0, c = Object.keys(arguments[t]); r < c.length; r++) {
      switch (e = c[r]) {case "class":case "style":case "directives":
          Array.isArray(s[e]) || (s[e] = []), s[e] = s[e].concat(arguments[t][e]);break;case "staticClass":
          if (!arguments[t][e]) break;void 0 === s[e] && (s[e] = ""), s[e] && (s[e] += " "), s[e] += arguments[t][e].trim();break;case "on":case "nativeOn":
          s[e] || (s[e] = {});for (var o = 0, n = Object.keys(arguments[t][e]); o < n.length; o++) {
            a = n[o], s[e][a] ? s[e][a] = [].concat(s[e][a], arguments[t][e][a]) : s[e][a] = arguments[t][e][a];
          }break;case "attrs":case "props":case "domProps":case "scopedSlots":case "staticStyle":case "hook":case "transition":
          s[e] || (s[e] = {}), s[e] = __assign({}, arguments[t][e], s[e]);break;case "slot":case "key":case "ref":case "tag":case "show":case "keepAlive":default:
          s[e] || (s[e] = arguments[t][e]);}
    }
  }return s;
}var __assign = Object.assign || function (e) {
  for (var a, s = 1, t = arguments.length; s < t; s++) {
    a = arguments[s];for (var r in a) {
      Object.prototype.hasOwnProperty.call(a, r) && (e[r] = a[r]);
    }
  }return e;
};

var linkMixin = {
  props: {
    // <a> props
    href: String,
    target: String,
    // <router-link> props
    to: null,
    replace: {
      type: Boolean,
      default: false
    },
    append: {
      type: Boolean,
      default: false
    },
    exact: {
      type: Boolean,
      default: false
    }
  }
};

var BtnGroup = {
  functional: true,
  render: function render(h, _ref) {
    var props = _ref.props,
        children = _ref.children,
        data = _ref.data;

    return h('div', mergeData(data, {
      class: defineProperty({
        'btn-group': !props.vertical,
        'btn-group-vertical': props.vertical,
        'btn-group-justified': props.justified
      }, 'btn-group-' + props.size, props.size),
      attrs: {
        role: 'group',
        'data-toggle': 'buttons'
      }
    }), children);
  },

  props: {
    size: String,
    vertical: {
      type: Boolean,
      default: false
    },
    justified: {
      type: Boolean,
      default: false
    }
  }
};

var INPUT_TYPE_CHECKBOX = 'checkbox';
var INPUT_TYPE_RADIO = 'radio';

var Btn = {
  functional: true,
  mixins: [linkMixin],
  render: function render(h, _ref) {
    var _classes;

    var children = _ref.children,
        props = _ref.props,
        data = _ref.data;

    // event listeners
    var listeners = data.on || {};
    // checkbox: model contain inputValue
    // radio: model === inputValue
    var isInputActive = props.inputType === INPUT_TYPE_CHECKBOX ? props.value.indexOf(props.inputValue) >= 0 : props.value === props.inputValue;
    // button class
    var classes = (_classes = {
      btn: true,
      active: props.inputType ? isInputActive : props.active,
      disabled: props.disabled,
      'btn-block': props.block
    }, defineProperty(_classes, 'btn-' + props.type, Boolean(props.type)), defineProperty(_classes, 'btn-' + props.size, Boolean(props.size)), _classes);
    // prevent event for disabled links
    var on = {
      click: function click(e) {
        if (props.disabled && e instanceof Event) {
          e.preventDefault();
          e.stopPropagation();
        }
      }
    };
    // render params
    var tag = void 0,
        options = void 0,
        slot = void 0;

    if (props.href) {
      // is native link
      tag = 'a';
      slot = children;
      options = mergeData(data, {
        on: on,
        class: classes,
        attrs: {
          role: 'button',
          href: props.href,
          target: props.target
        }
      });
    } else if (props.to) {
      // is vue router link
      tag = 'router-link';
      slot = children;
      options = mergeData(data, {
        nativeOn: on,
        class: classes,
        props: {
          event: props.disabled ? '' : 'click', // prevent nav while disabled
          to: props.to,
          replace: props.replace,
          append: props.append,
          exact: props.exact
        },
        attrs: {
          role: 'button'
        }
      });
    } else if (props.inputType) {
      // is input checkbox or radio
      tag = 'label';
      options = mergeData(data, {
        on: on,
        class: classes
      });
      slot = [h('input', {
        attrs: {
          autocomplete: 'off',
          type: props.inputType,
          checked: isInputActive ? 'checked' : null,
          disabled: props.disabled
        },
        domProps: {
          checked: isInputActive // required
        },
        on: {
          change: function change() {
            if (props.inputType === INPUT_TYPE_CHECKBOX) {
              var valueCopied = props.value.slice();
              if (isInputActive) {
                valueCopied.splice(valueCopied.indexOf(props.inputValue), 1);
              } else {
                valueCopied.push(props.inputValue);
              }
              listeners['input'](valueCopied);
            } else {
              listeners['input'](props.inputValue);
            }
          }
        }
      }), children];
    } else if (props.justified) {
      // is in justified btn-group
      tag = BtnGroup;
      options = {};
      slot = [h('button', mergeData(data, {
        on: on,
        class: classes,
        attrs: {
          type: props.nativeType,
          disabled: props.disabled
        }
      }), children)];
    } else {
      // is button
      tag = 'button';
      slot = children;
      options = mergeData(data, {
        on: on,
        class: classes,
        attrs: {
          type: props.nativeType,
          disabled: props.disabled
        }
      });
    }

    return h(tag, options, slot);
  },

  props: {
    justified: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'default'
    },
    nativeType: {
      type: String,
      default: 'button'
    },
    size: String,
    block: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // <input> props
    value: null,
    inputValue: null,
    inputType: {
      type: String,
      validator: function validator(value) {
        return value === INPUT_TYPE_CHECKBOX || value === INPUT_TYPE_RADIO;
      }
    }
  }
};

var MODAL_BACKDROP = 'modal-backdrop';
var IN$1 = 'in';
var getOpenModals = function getOpenModals() {
  return document.querySelectorAll('.' + MODAL_BACKDROP);
};
var getOpenModalNum = function getOpenModalNum() {
  return getOpenModals().length;
};

var Modal = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "modal", class: { fade: _vm.transitionDuration > 0 }, attrs: { "tabindex": "-1", "role": "dialog" }, on: { "click": function click($event) {
          if ($event.target !== $event.currentTarget) {
            return null;
          }return _vm.backdropClicked($event);
        } } }, [_c('div', { ref: "dialog", staticClass: "modal-dialog", class: _vm.modalSizeClass, attrs: { "role": "document" } }, [_c('div', { staticClass: "modal-content" }, [_vm.header ? _c('div', { staticClass: "modal-header" }, [_vm._t("header", [_vm.dismissBtn ? _c('button', { staticClass: "close", staticStyle: { "position": "relative", "z-index": "1060" }, attrs: { "type": "button", "aria-label": "Close" }, on: { "click": function click($event) {
          return _vm.toggle(false);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("×")])]) : _vm._e(), _vm._v(" "), _c('h4', { staticClass: "modal-title" }, [_vm._t("title", [_vm._v(_vm._s(_vm.title))])], 2)])], 2) : _vm._e(), _vm._v(" "), _c('div', { staticClass: "modal-body" }, [_vm._t("default")], 2), _vm._v(" "), _vm.footer ? _c('div', { staticClass: "modal-footer" }, [_vm._t("footer", [_c('btn', { attrs: { "type": _vm.cancelType }, on: { "click": function click($event) {
          return _vm.toggle(false, 'cancel');
        } } }, [_c('span', [_vm._v(_vm._s(_vm.cancelText || _vm.t('uiv.modal.cancel')))])]), _vm._v(" "), _c('btn', { attrs: { "type": _vm.okType, "data-action": "auto-focus" }, on: { "click": function click($event) {
          return _vm.toggle(false, 'ok');
        } } }, [_c('span', [_vm._v(_vm._s(_vm.okText || _vm.t('uiv.modal.ok')))])])])], 2) : _vm._e()])]), _vm._v(" "), _c('div', { ref: "backdrop", staticClass: "modal-backdrop", class: { fade: _vm.transitionDuration > 0 } })]);
  }, staticRenderFns: [],
  mixins: [Local],
  components: { Btn: Btn },
  props: {
    value: {
      type: Boolean,
      default: false
    },
    title: String,
    size: String,
    backdrop: {
      type: Boolean,
      default: true
    },
    footer: {
      type: Boolean,
      default: true
    },
    header: {
      type: Boolean,
      default: true
    },
    cancelText: String,
    cancelType: {
      type: String,
      default: 'default'
    },
    okText: String,
    okType: {
      type: String,
      default: 'primary'
    },
    dismissBtn: {
      type: Boolean,
      default: true
    },
    transitionDuration: {
      type: Number,
      default: 150
    },
    autoFocus: {
      type: Boolean,
      default: false
    },
    keyboard: {
      type: Boolean,
      default: true
    },
    beforeClose: Function,
    zOffset: {
      type: Number,
      default: 20
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    displayStyle: {
      type: String,
      default: 'block'
    }
  },
  data: function data() {
    return {
      msg: '',
      timeoutId: 0
    };
  },

  computed: {
    modalSizeClass: function modalSizeClass() {
      return defineProperty({}, 'modal-' + this.size, Boolean(this.size));
    }
  },
  watch: {
    value: function value(v) {
      this.$toggle(v);
    }
  },
  mounted: function mounted() {
    removeFromDom(this.$refs.backdrop);
    on(window, EVENTS.KEY_UP, this.onKeyPress);
    if (this.value) {
      this.$toggle(true);
    }
  },
  beforeDestroy: function beforeDestroy() {
    clearTimeout(this.timeoutId);
    removeFromDom(this.$refs.backdrop);
    removeFromDom(this.$el);
    if (getOpenModalNum() === 0) {
      toggleBodyOverflow(true);
    }
    off(window, EVENTS.KEY_UP, this.onKeyPress);
  },

  methods: {
    onKeyPress: function onKeyPress(event) {
      if (this.keyboard && this.value && event.keyCode === 27) {
        var thisModal = this.$refs.backdrop;
        var thisZIndex = thisModal.style.zIndex;
        thisZIndex = thisZIndex && thisZIndex !== 'auto' ? parseInt(thisZIndex) : 0;
        // Find out if this modal is the top most one.
        var modals = getOpenModals();
        var modalsLength = modals.length;
        for (var i = 0; i < modalsLength; i++) {
          if (modals[i] !== thisModal) {
            var zIndex = modals[i].style.zIndex;
            zIndex = zIndex && zIndex !== 'auto' ? parseInt(zIndex) : 0;
            // if any existing modal has higher zIndex, ignore
            if (zIndex > thisZIndex) {
              return;
            }
          }
        }
        this.toggle(false);
      }
    },
    toggle: function toggle(show, msg) {
      // skip the hiding while show===false & beforeClose returning falsely value
      if (!show && isFunction(this.beforeClose) && !this.beforeClose(msg)) {
        return;
      }
      this.msg = msg;
      this.$emit('input', show);
    },
    $toggle: function $toggle(show) {
      var _this = this;

      var modal = this.$el;
      var backdrop = this.$refs.backdrop;
      clearTimeout(this.timeoutId);
      if (show) {
        var alreadyOpenModalNum = getOpenModalNum();
        document.body.appendChild(backdrop);
        if (this.appendToBody) {
          document.body.appendChild(modal);
        }
        modal.style.display = this.displayStyle;
        modal.scrollTop = 0;
        backdrop.offsetHeight; // force repaint
        toggleBodyOverflow(false);
        addClass(backdrop, IN$1);
        addClass(modal, IN$1);
        // fix z-index for nested modals
        // no need to calculate if no modal is already open
        if (alreadyOpenModalNum > 0) {
          var modalBaseZ = parseInt(getComputedStyle(modal).zIndex) || 1050; // 1050 is default modal z-Index
          var backdropBaseZ = parseInt(getComputedStyle(backdrop).zIndex) || 1040; // 1040 is default backdrop z-Index
          var offset = alreadyOpenModalNum * this.zOffset;
          modal.style.zIndex = '' + (modalBaseZ + offset);
          backdrop.style.zIndex = '' + (backdropBaseZ + offset);
        }
        // z-index fix end
        this.timeoutId = setTimeout(function () {
          if (_this.autoFocus) {
            var btn = _this.$el.querySelector('[data-action="auto-focus"]');
            if (btn) {
              btn.focus();
            }
          }
          _this.$emit('show');
          _this.timeoutId = 0;
        }, this.transitionDuration);
      } else {
        removeClass(backdrop, IN$1);
        removeClass(modal, IN$1);
        this.timeoutId = setTimeout(function () {
          modal.style.display = 'none';
          removeFromDom(backdrop);
          if (_this.appendToBody) {
            removeFromDom(modal);
          }
          if (getOpenModalNum() === 0) {
            toggleBodyOverflow(true);
          }
          _this.$emit('hide', _this.msg || 'dismiss');
          _this.msg = '';
          _this.timeoutId = 0;
          // restore z-index for nested modals
          modal.style.zIndex = '';
          backdrop.style.zIndex = '';
          // z-index fix end
        }, this.transitionDuration);
      }
    },
    backdropClicked: function backdropClicked(event) {
      if (this.backdrop) {
        this.toggle(false);
      }
    }
  }
};

var ACTIVE_CLASS = 'active';
var IN_CLASS = 'in';

var Tab = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "tab-pane", class: { fade: _vm.transition > 0 }, attrs: { "role": "tabpanel" } }, [_vm._t("default")], 2);
  }, staticRenderFns: [],
  props: {
    title: {
      type: String,
      default: 'Tab Title'
    },
    htmlTitle: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    'tab-classes': {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    group: String,
    pullRight: {
      type: Boolean,
      default: false
    }
  },
  data: function data() {
    return {
      active: true,
      transition: 150
    };
  },

  watch: {
    active: function active(_active) {
      var _this = this;

      if (_active) {
        setTimeout(function () {
          addClass(_this.$el, ACTIVE_CLASS);
          _this.$el.offsetHeight;
          addClass(_this.$el, IN_CLASS);
          try {
            _this.$parent.$emit('after-change', _this.$parent.activeIndex);
          } catch (e) {
            throw new Error('<tab> parent must be <tabs>.');
          }
        }, this.transition);
      } else {
        removeClass(this.$el, IN_CLASS);
        setTimeout(function () {
          removeClass(_this.$el, ACTIVE_CLASS);
        }, this.transition);
      }
    }
  },
  created: function created() {
    try {
      this.$parent.tabs.push(this);
    } catch (e) {
      throw new Error('<tab> parent must be <tabs>.');
    }
  },
  beforeDestroy: function beforeDestroy() {
    var tabs = this.$parent && this.$parent.tabs;
    spliceIfExist(tabs, this);
  },

  methods: {
    show: function show() {
      var _this2 = this;

      this.$nextTick(function () {
        addClass(_this2.$el, ACTIVE_CLASS);
        addClass(_this2.$el, IN_CLASS);
      });
    }
  }
};

var BEFORE_CHANGE_EVENT = 'before-change';

var Tabs = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('section', [_c('ul', { class: _vm.navClasses, attrs: { "role": "tablist" } }, [_vm._l(_vm.groupedTabs, function (tab, index) {
      return [tab.tabs ? _c('dropdown', { class: _vm.getTabClasses(tab), attrs: { "role": "presentation", "tag": "li" } }, [_c('a', { staticClass: "dropdown-toggle", attrs: { "role": "tab", "href": "#" }, on: { "click": function click($event) {
            $event.preventDefault();
          } } }, [_vm._v(_vm._s(tab.group) + " "), _c('span', { staticClass: "caret" })]), _vm._v(" "), _c('template', { slot: "dropdown" }, _vm._l(tab.tabs, function (subTab) {
        return _c('li', { class: _vm.getTabClasses(subTab, true) }, [_c('a', { attrs: { "href": "#" }, on: { "click": function click($event) {
              $event.preventDefault();_vm.select(_vm.tabs.indexOf(subTab));
            } } }, [_vm._v(_vm._s(subTab.title))])]);
      }), 0)], 2) : _c('li', { class: _vm.getTabClasses(tab), attrs: { "role": "presentation" } }, [tab.htmlTitle ? _c('a', { attrs: { "role": "tab", "href": "#" }, domProps: { "innerHTML": _vm._s(tab.title) }, on: { "click": function click($event) {
            $event.preventDefault();_vm.select(_vm.tabs.indexOf(tab));
          } } }) : _c('a', { attrs: { "role": "tab", "href": "#" }, domProps: { "textContent": _vm._s(tab.title) }, on: { "click": function click($event) {
            $event.preventDefault();_vm.select(_vm.tabs.indexOf(tab));
          } } })])];
    }), _vm._v(" "), !_vm.justified && _vm.$slots['nav-right'] ? _c('li', { staticClass: "pull-right" }, [_vm._t("nav-right")], 2) : _vm._e()], 2), _vm._v(" "), _c('div', { staticClass: "tab-content" }, [_vm._t("default")], 2)]);
  }, staticRenderFns: [],
  components: { Dropdown: Dropdown },
  props: {
    value: {
      type: Number,
      validator: function validator(v) {
        return v >= 0;
      }
    },
    transitionDuration: {
      type: Number,
      default: 150
    },
    justified: Boolean,
    pills: Boolean,
    stacked: Boolean,
    customNavClass: null
  },
  data: function data() {
    return {
      tabs: [],
      activeIndex: 0 // Make v-model not required
    };
  },

  watch: {
    value: {
      immediate: true,
      handler: function handler(value) {
        if (isNumber(value)) {
          this.activeIndex = value;
          this.selectCurrent();
        }
      }
    },
    tabs: function tabs(_tabs) {
      var _this = this;

      _tabs.forEach(function (tab, index) {
        tab.transition = _this.transitionDuration;
        if (index === _this.activeIndex) {
          tab.show();
        }
      });
      this.selectCurrent();
    }
  },
  computed: {
    navClasses: function navClasses() {
      var tabClasses = {
        'nav': true,
        'nav-justified': this.justified,
        'nav-tabs': !this.pills,
        'nav-pills': this.pills,
        'nav-stacked': this.stacked && this.pills
      };
      var customNavClass = this.customNavClass;
      if (isExist(customNavClass)) {
        if (isString(customNavClass)) {
          return _extends({}, tabClasses, defineProperty({}, customNavClass, true));
        } else {
          return _extends({}, tabClasses, customNavClass);
        }
      } else {
        return tabClasses;
      }
    },
    groupedTabs: function groupedTabs() {
      var tabs = [];
      var hash = {};
      this.tabs.forEach(function (tab) {
        if (tab.group) {
          if (hash.hasOwnProperty(tab.group)) {
            tabs[hash[tab.group]].tabs.push(tab);
          } else {
            tabs.push({
              tabs: [tab],
              group: tab.group
            });
            hash[tab.group] = tabs.length - 1;
          }
          if (tab.active) {
            tabs[hash[tab.group]].active = true;
          }
          if (tab.pullRight) {
            tabs[hash[tab.group]].pullRight = true;
          }
        } else {
          tabs.push(tab);
        }
      });
      return tabs;
    }
  },
  methods: {
    getTabClasses: function getTabClasses(tab) {
      var isSubTab = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      var defaultClasses = {
        active: tab.active,
        disabled: tab.disabled,
        'pull-right': tab.pullRight && !isSubTab

        // return with new classes added to tab
      };return _extends(defaultClasses, tab['tabClasses']);
    },
    selectCurrent: function selectCurrent() {
      var _this2 = this;

      var found = false;
      this.tabs.forEach(function (tab, index) {
        if (index === _this2.activeIndex) {
          found = !tab.active;
          tab.active = true;
        } else {
          tab.active = false;
        }
      });
      if (found) {
        this.$emit('change', this.activeIndex);
      }
    },
    selectValidate: function selectValidate(index) {
      var _this3 = this;

      if (isFunction(this.$listeners[BEFORE_CHANGE_EVENT])) {
        this.$emit(BEFORE_CHANGE_EVENT, this.activeIndex, index, function (result) {
          if (!isExist(result)) {
            _this3.$select(index);
          }
        });
      } else {
        this.$select(index);
      }
    },
    select: function select(index) {
      if (!this.tabs[index].disabled && index !== this.activeIndex) {
        this.selectValidate(index);
      }
    },
    $select: function $select(index) {
      if (isNumber(this.value)) {
        this.$emit('input', index);
      } else {
        this.activeIndex = index;
        this.selectCurrent();
      }
    }
  }
};

function pad(value, num) {
  value = value + '';
  for (var i = num - value.length; i > 0; i--) {
    value = '0' + value;
  }
  return value;
}

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function daysInMonth(month, year) {
  return new Date(year, month + 1, 0).getDate();
}

function stringify(date, format) {
  try {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var monthName = monthNames[month - 1];
    return format.replace(/yyyy/g, year).replace(/MMMM/g, monthName).replace(/MMM/g, monthName.substring(0, 3)).replace(/MM/g, pad(month, 2)).replace(/dd/g, pad(day, 2)).replace(/yy/g, year).replace(/M(?!a)/g, month).replace(/d/g, day);
  } catch (e) {
    return '';
  }
}

function convertDateToUTC(date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
}

/* https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
 *
 * For a given date, get the ISO week number
 *
 * Based on information at:
 *
 *    http://www.merlyn.demon.co.uk/weekcalc.htm#WNR
 *
 * Algorithm is to find nearest thursday, it's year
 * is the year of the week number. Then get weeks
 * between that date and the first day of that year.
 *
 * Note that dates in one year can be weeks of previous
 * or next year, overlap is up to 3 days.
 *
 * e.g. 2014/12/29 is Monday in week  1 of 2015
 *      2012/1/1   is Sunday in week 52 of 2011
 */
function getWeekNumber(d) {
  // Copy date so don't modify original
  d = new Date(Date.UTC(d.year, d.month, d.date));
  // Set to nearest Thursday: current date + 4 - current day number
  // Make Sunday's day number 7
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  // Get first day of year
  var yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  // Calculate full weeks to nearest Thursday
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

var DateView = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('table', { staticStyle: { "width": "100%" }, attrs: { "role": "grid" } }, [_c('thead', [_c('tr', [_c('td', [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.goPrevMonth } }, [_c('i', { class: _vm.iconControlLeft })])], 1), _vm._v(" "), _c('td', { attrs: { "colspan": _vm.weekNumbers ? 6 : 5 } }, [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.changeView } }, [_c('b', [_vm._v(_vm._s(_vm.yearMonthStr))])])], 1), _vm._v(" "), _c('td', [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.goNextMonth } }, [_c('i', { class: _vm.iconControlRight })])], 1)]), _vm._v(" "), _c('tr', { attrs: { "align": "center" } }, [_vm.weekNumbers ? _c('td') : _vm._e(), _vm._v(" "), _vm._l(_vm.weekDays, function (day) {
      return _c('td', { attrs: { "width": "14.2857142857%" } }, [_c('small', [_vm._v(_vm._s(_vm.tWeekName(day === 0 ? 7 : day)))])]);
    })], 2)]), _vm._v(" "), _c('tbody', _vm._l(_vm.monthDayRows, function (row) {
      return _c('tr', [_vm.weekNumbers ? _c('td', { staticClass: "text-center", staticStyle: { "border-right": "1px solid #eee" } }, [_c('small', { staticClass: "text-muted" }, [_vm._v(_vm._s(_vm.getWeekNumber(row[_vm.weekStartsWith])))])]) : _vm._e(), _vm._v(" "), _vm._l(row, function (date) {
        return _c('td', [_c('btn', { class: date.classes, staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm", "data-action": "select", "type": _vm.getBtnType(date), "disabled": date.disabled }, on: { "click": function click($event) {
              return _vm.select(date);
            } } }, [_c('span', { class: { 'text-muted': _vm.month !== date.month }, attrs: { "data-action": "select" } }, [_vm._v(_vm._s(date.date))])])], 1);
      })], 2);
    }), 0)]);
  }, staticRenderFns: [],
  mixins: [Local],
  props: {
    month: Number,
    year: Number,
    date: Date,
    today: Date,
    limit: Object,
    weekStartsWith: Number,
    iconControlLeft: String,
    iconControlRight: String,
    dateClass: Function,
    yearMonthFormatter: Function,
    weekNumbers: Boolean
  },
  components: { Btn: Btn },
  computed: {
    weekDays: function weekDays() {
      var days = [];
      var firstDay = this.weekStartsWith;
      while (days.length < 7) {
        days.push(firstDay++);
        if (firstDay > 6) {
          firstDay = 0;
        }
      }
      return days;
    },
    yearMonthStr: function yearMonthStr() {
      if (this.yearMonthFormatter) {
        return this.yearMonthFormatter(this.year, this.month);
      } else {
        return isExist(this.month) ? this.year + ' ' + this.t('uiv.datePicker.month' + (this.month + 1)) : this.year;
      }
    },
    monthDayRows: function monthDayRows() {
      var rows = [];
      var firstDay = new Date(this.year, this.month, 1);
      var prevMonthLastDate = new Date(this.year, this.month, 0).getDate();
      var startIndex = firstDay.getDay();
      // console.log(startIndex)
      var daysNum = daysInMonth(this.month, this.year);
      var weekOffset = 0;
      if (this.weekStartsWith > startIndex) {
        weekOffset = 7 - this.weekStartsWith;
      } else {
        weekOffset = 0 - this.weekStartsWith;
      }
      // console.log(prevMonthLastDate, startIndex, daysNum)
      for (var i = 0; i < 6; i++) {
        rows.push([]);
        for (var j = 0 - weekOffset; j < 7 - weekOffset; j++) {
          var currentIndex = i * 7 + j;
          var date = { year: this.year, disabled: false
            // date in and not in current month
          };if (currentIndex < startIndex) {
            date.date = prevMonthLastDate - startIndex + currentIndex + 1;
            if (this.month > 0) {
              date.month = this.month - 1;
            } else {
              date.month = 11;
              date.year--;
            }
          } else if (currentIndex < startIndex + daysNum) {
            date.date = currentIndex - startIndex + 1;
            date.month = this.month;
          } else {
            date.date = currentIndex - startIndex - daysNum + 1;
            if (this.month < 11) {
              date.month = this.month + 1;
            } else {
              date.month = 0;
              date.year++;
            }
          }
          // process limit dates
          var dateObj = new Date(date.year, date.month, date.date);
          var afterFrom = true;
          var beforeTo = true;
          if (this.limit && this.limit.from) {
            afterFrom = dateObj >= this.limit.from;
          }
          if (this.limit && this.limit.to) {
            beforeTo = dateObj < this.limit.to;
          }
          date.disabled = !afterFrom || !beforeTo;
          date.classes = isFunction(this.dateClass) ? this.dateClass(dateObj) : '';
          rows[i].push(date);
        }
      }
      return rows;
    }
  },
  methods: {
    getWeekNumber: getWeekNumber,
    tWeekName: function tWeekName(index) {
      return this.t('uiv.datePicker.week' + index);
    },
    getBtnType: function getBtnType(date) {
      if (this.date && date.date === this.date.getDate() && date.month === this.date.getMonth() && date.year === this.date.getFullYear()) {
        return 'primary';
      } else if (date.date === this.today.getDate() && date.month === this.today.getMonth() && date.year === this.today.getFullYear()) {
        return 'info';
      } else {
        return 'default';
      }
    },
    select: function select(date) {
      this.$emit('date-change', date);
    },
    goPrevMonth: function goPrevMonth() {
      var month = this.month;
      var year = this.year;
      if (this.month > 0) {
        month--;
      } else {
        month = 11;
        year--;
        this.$emit('year-change', year);
      }
      this.$emit('month-change', month);
    },
    goNextMonth: function goNextMonth() {
      var month = this.month;
      var year = this.year;
      if (this.month < 11) {
        month++;
      } else {
        month = 0;
        year++;
        this.$emit('year-change', year);
      }
      this.$emit('month-change', month);
    },
    changeView: function changeView() {
      this.$emit('view-change', 'm');
    }
  }
};

var MonthView = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('table', { staticStyle: { "width": "100%" }, attrs: { "role": "grid" } }, [_c('thead', [_c('tr', [_c('td', [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.goPrevYear } }, [_c('i', { class: _vm.iconControlLeft })])], 1), _vm._v(" "), _c('td', { attrs: { "colspan": "4" } }, [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": function click($event) {
          return _vm.changeView();
        } } }, [_c('b', [_vm._v(_vm._s(_vm.year))])])], 1), _vm._v(" "), _c('td', [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.goNextYear } }, [_c('i', { class: _vm.iconControlRight })])], 1)])]), _vm._v(" "), _c('tbody', _vm._l(_vm.rows, function (row, i) {
      return _c('tr', _vm._l(row, function (month, j) {
        return _c('td', { attrs: { "colspan": "2", "width": "33.333333%" } }, [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm", "type": _vm.getBtnClass(i * 3 + j) }, on: { "click": function click($event) {
              return _vm.changeView(i * 3 + j);
            } } }, [_c('span', [_vm._v(_vm._s(_vm.tCell(month)))])])], 1);
      }), 0);
    }), 0)]);
  }, staticRenderFns: [],
  components: { Btn: Btn },
  mixins: [Local],
  props: {
    month: Number,
    year: Number,
    iconControlLeft: String,
    iconControlRight: String
  },
  data: function data() {
    return {
      rows: []
    };
  },
  mounted: function mounted() {
    for (var i = 0; i < 4; i++) {
      this.rows.push([]);
      for (var j = 0; j < 3; j++) {
        this.rows[i].push(i * 3 + j + 1);
      }
    }
  },

  methods: {
    tCell: function tCell(cell) {
      return this.t('uiv.datePicker.month' + cell);
    },
    getBtnClass: function getBtnClass(month) {
      if (month === this.month) {
        return 'primary';
      } else {
        return 'default';
      }
    },
    goPrevYear: function goPrevYear() {
      this.$emit('year-change', this.year - 1);
    },
    goNextYear: function goNextYear() {
      this.$emit('year-change', this.year + 1);
    },
    changeView: function changeView(monthIndex) {
      if (isExist(monthIndex)) {
        this.$emit('month-change', monthIndex);
        this.$emit('view-change', 'd');
      } else {
        this.$emit('view-change', 'y');
      }
    }
  }
};

var YearView = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('table', { staticStyle: { "width": "100%" }, attrs: { "role": "grid" } }, [_c('thead', [_c('tr', [_c('td', [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.goPrevYear } }, [_c('i', { class: _vm.iconControlLeft })])], 1), _vm._v(" "), _c('td', { attrs: { "colspan": "3" } }, [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" } }, [_c('b', [_vm._v(_vm._s(_vm.yearStr))])])], 1), _vm._v(" "), _c('td', [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm" }, on: { "click": _vm.goNextYear } }, [_c('i', { class: _vm.iconControlRight })])], 1)])]), _vm._v(" "), _c('tbody', _vm._l(_vm.rows, function (row) {
      return _c('tr', _vm._l(row, function (year) {
        return _c('td', { attrs: { "width": "20%" } }, [_c('btn', { staticStyle: { "border": "none" }, attrs: { "block": "", "size": "sm", "type": _vm.getBtnClass(year) }, on: { "click": function click($event) {
              return _vm.changeView(year);
            } } }, [_c('span', [_vm._v(_vm._s(year))])])], 1);
      }), 0);
    }), 0)]);
  }, staticRenderFns: [],
  components: { Btn: Btn },
  props: {
    year: Number,
    iconControlLeft: String,
    iconControlRight: String
  },
  computed: {
    rows: function rows() {
      var rows = [];
      var yearGroupStart = this.year - this.year % 20;
      for (var i = 0; i < 4; i++) {
        rows.push([]);
        for (var j = 0; j < 5; j++) {
          rows[i].push(yearGroupStart + i * 5 + j);
        }
      }
      return rows;
    },
    yearStr: function yearStr() {
      var start = this.year - this.year % 20;
      return start + ' ~ ' + (start + 19);
    }
  },
  methods: {
    getBtnClass: function getBtnClass(year) {
      if (year === this.year) {
        return 'primary';
      } else {
        return 'default';
      }
    },
    goPrevYear: function goPrevYear() {
      this.$emit('year-change', this.year - 20);
    },
    goNextYear: function goNextYear() {
      this.$emit('year-change', this.year + 20);
    },
    changeView: function changeView(year) {
      this.$emit('year-change', year);
      this.$emit('view-change', 'm');
    }
  }
};

var DatePicker = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { style: _vm.pickerStyle, attrs: { "data-role": "date-picker" }, on: { "click": _vm.onPickerClick } }, [_c('date-view', { directives: [{ name: "show", rawName: "v-show", value: _vm.view === 'd', expression: "view==='d'" }], attrs: { "month": _vm.currentMonth, "year": _vm.currentYear, "date": _vm.valueDateObj, "today": _vm.now, "limit": _vm.limit, "week-starts-with": _vm.weekStartsWith, "icon-control-left": _vm.iconControlLeft, "icon-control-right": _vm.iconControlRight, "date-class": _vm.dateClass, "year-month-formatter": _vm.yearMonthFormatter, "week-numbers": _vm.weekNumbers, "locale": _vm.locale }, on: { "month-change": _vm.onMonthChange, "year-change": _vm.onYearChange, "date-change": _vm.onDateChange, "view-change": _vm.onViewChange } }), _vm._v(" "), _c('month-view', { directives: [{ name: "show", rawName: "v-show", value: _vm.view === 'm', expression: "view==='m'" }], attrs: { "month": _vm.currentMonth, "year": _vm.currentYear, "icon-control-left": _vm.iconControlLeft, "icon-control-right": _vm.iconControlRight, "locale": _vm.locale }, on: { "month-change": _vm.onMonthChange, "year-change": _vm.onYearChange, "view-change": _vm.onViewChange } }), _vm._v(" "), _c('year-view', { directives: [{ name: "show", rawName: "v-show", value: _vm.view === 'y', expression: "view==='y'" }], attrs: { "year": _vm.currentYear, "icon-control-left": _vm.iconControlLeft, "icon-control-right": _vm.iconControlRight }, on: { "year-change": _vm.onYearChange, "view-change": _vm.onViewChange } }), _vm._v(" "), _vm.todayBtn || _vm.clearBtn ? _c('div', [_c('br'), _vm._v(" "), _c('div', { staticClass: "text-center" }, [_vm.todayBtn ? _c('btn', { attrs: { "data-action": "select", "type": "info", "size": "sm" }, domProps: { "textContent": _vm._s(_vm.t('uiv.datePicker.today')) }, on: { "click": _vm.selectToday } }) : _vm._e(), _vm._v(" "), _vm.clearBtn ? _c('btn', { attrs: { "data-action": "select", "size": "sm" }, domProps: { "textContent": _vm._s(_vm.t('uiv.datePicker.clear')) }, on: { "click": _vm.clearSelect } }) : _vm._e()], 1)]) : _vm._e()], 1);
  }, staticRenderFns: [],
  mixins: [Local],
  components: { DateView: DateView, MonthView: MonthView, YearView: YearView, Btn: Btn },
  props: {
    value: null,
    width: {
      type: Number,
      default: 270
    },
    todayBtn: {
      type: Boolean,
      default: true
    },
    clearBtn: {
      type: Boolean,
      default: true
    },
    closeOnSelected: {
      type: Boolean,
      default: true
    },
    limitFrom: null,
    limitTo: null,
    format: {
      type: String,
      default: 'yyyy-MM-dd'
    },
    initialView: {
      type: String,
      default: 'd'
    },
    dateParser: {
      type: Function,
      default: Date.parse
    },
    dateClass: Function,
    yearMonthFormatter: Function,
    weekStartsWith: {
      type: Number,
      default: 0,
      validator: function validator(value) {
        return value >= 0 && value <= 6;
      }
    },
    weekNumbers: Boolean,
    iconControlLeft: {
      type: String,
      default: 'glyphicon glyphicon-chevron-left'
    },
    iconControlRight: {
      type: String,
      default: 'glyphicon glyphicon-chevron-right'
    }
  },
  data: function data() {
    return {
      show: false,
      now: new Date(),
      currentMonth: 0,
      currentYear: 0,
      view: 'd'
    };
  },

  computed: {
    valueDateObj: function valueDateObj() {
      var ts = this.dateParser(this.value);
      if (isNaN(ts)) {
        return null;
      } else {
        var date = new Date(ts);
        if (date.getHours() !== 0) {
          date = new Date(ts + date.getTimezoneOffset() * 60 * 1000);
        }
        return date;
      }
    },
    pickerStyle: function pickerStyle() {
      return {
        width: this.width + 'px'
      };
    },
    limit: function limit() {
      var limit = {};
      if (this.limitFrom) {
        var limitFrom = this.dateParser(this.limitFrom);
        if (!isNaN(limitFrom)) {
          limitFrom = convertDateToUTC(new Date(limitFrom));
          limitFrom.setHours(0, 0, 0, 0);
          limit.from = limitFrom;
        }
      }
      if (this.limitTo) {
        var limitTo = this.dateParser(this.limitTo);
        if (!isNaN(limitTo)) {
          limitTo = convertDateToUTC(new Date(limitTo));
          limitTo.setHours(0, 0, 0, 0);
          limit.to = limitTo;
        }
      }
      return limit;
    }
  },
  mounted: function mounted() {
    if (this.value) {
      this.setMonthAndYearByValue(this.value);
    } else {
      this.currentMonth = this.now.getMonth();
      this.currentYear = this.now.getFullYear();
      this.view = this.initialView;
    }
  },

  watch: {
    value: function value(val, oldVal) {
      this.setMonthAndYearByValue(val, oldVal);
    }
  },
  methods: {
    setMonthAndYearByValue: function setMonthAndYearByValue(val, oldVal) {
      var ts = this.dateParser(val);
      if (!isNaN(ts)) {
        var date = new Date(ts);
        if (date.getHours() !== 0) {
          date = new Date(ts + date.getTimezoneOffset() * 60 * 1000);
        }
        if (this.limit && (this.limit.from && date < this.limit.from || this.limit.to && date >= this.limit.to)) {
          this.$emit('input', oldVal || '');
        } else {
          this.currentMonth = date.getMonth();
          this.currentYear = date.getFullYear();
        }
      }
    },
    onMonthChange: function onMonthChange(month) {
      this.currentMonth = month;
    },
    onYearChange: function onYearChange(year) {
      this.currentYear = year;
      this.currentMonth = undefined;
    },
    onDateChange: function onDateChange(date) {
      if (date && isNumber(date.date) && isNumber(date.month) && isNumber(date.year)) {
        var _date = new Date(date.year, date.month, date.date);
        this.$emit('input', this.format ? stringify(_date, this.format) : _date);
        // if the input event trigger nothing (same value)
        // manually correct
        this.currentMonth = date.month;
        this.currentYear = date.year;
      } else {
        this.$emit('input', '');
      }
    },
    onViewChange: function onViewChange(view) {
      this.view = view;
    },
    selectToday: function selectToday() {
      this.view = 'd';
      this.onDateChange({
        date: this.now.getDate(),
        month: this.now.getMonth(),
        year: this.now.getFullYear()
      });
    },
    clearSelect: function clearSelect() {
      this.currentMonth = this.now.getMonth();
      this.currentYear = this.now.getFullYear();
      this.view = this.initialView;
      this.onDateChange();
    },
    onPickerClick: function onPickerClick(event) {
      if (event.target.getAttribute('data-action') !== 'select' || !this.closeOnSelected) {
        event.stopPropagation();
      }
    }
  }
};

var HANDLER = '_uiv_scroll_handler';
var events = [EVENTS.RESIZE, EVENTS.SCROLL];

var bind = function bind(el, binding) {
  var callback = binding.value;
  if (!isFunction(callback)) {
    return;
  }
  unbind(el);
  el[HANDLER] = callback;
  events.forEach(function (event) {
    on(window, event, el[HANDLER]);
  });
};

var unbind = function unbind(el) {
  events.forEach(function (event) {
    off(window, event, el[HANDLER]);
  });
  delete el[HANDLER];
};

var update = function update(el, binding) {
  if (binding.value !== binding.oldValue) {
    bind(el, binding);
  }
};

var scroll = { bind: bind, unbind: unbind, update: update };

var Affix = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { staticClass: "hidden-print" }, [_c('div', { directives: [{ name: "scroll", rawName: "v-scroll", value: _vm.onScroll, expression: "onScroll" }], class: _vm.classes, style: _vm.styles }, [_vm._t("default")], 2)]);
  }, staticRenderFns: [],
  directives: {
    scroll: scroll
  },
  props: {
    offset: {
      type: Number,
      default: 0
    }
  },
  data: function data() {
    return {
      affixed: false
    };
  },

  computed: {
    classes: function classes() {
      return {
        affix: this.affixed
      };
    },
    styles: function styles() {
      return {
        top: this.affixed ? this.offset + 'px' : null
      };
    }
  },
  methods: {
    // from https://github.com/ant-design/ant-design/blob/master/components/affix/index.jsx#L20
    onScroll: function onScroll() {
      var _this = this;

      // if is hidden don't calculate anything
      if (!(this.$el.offsetWidth || this.$el.offsetHeight || this.$el.getClientRects().length)) {
        return;
      }
      // get window scroll and element position to detect if have to be normal or affixed
      var scroll$$1 = {};
      var element = {};
      var rect = this.$el.getBoundingClientRect();
      var body = document.body;
      var _arr = ['Top', 'Left'];
      for (var _i = 0; _i < _arr.length; _i++) {
        var type = _arr[_i];
        var t = type.toLowerCase();
        scroll$$1[t] = window['page' + (type === 'Top' ? 'Y' : 'X') + 'Offset'];
        element[t] = scroll$$1[t] + rect[t] - (this.$el['client' + type] || body['client' + type] || 0);
      }
      var fix = scroll$$1.top > element.top - this.offset;
      if (this.affixed !== fix) {
        this.affixed = fix;
        if (this.affixed) {
          this.$emit('affix');
          this.$nextTick(function () {
            _this.$emit('affixed');
          });
        }
      }
    }
  }
};

var Alert = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('div', { class: _vm.alertClass, attrs: { "role": "alert" } }, [_vm.dismissible ? _c('button', { staticClass: "close", attrs: { "type": "button", "aria-label": "Close" }, on: { "click": _vm.closeAlert } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("×")])]) : _vm._e(), _vm._v(" "), _vm._t("default")], 2);
  }, staticRenderFns: [],
  props: {
    dismissible: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: 'info'
    }
  },
  data: function data() {
    return {
      timeout: 0
    };
  },

  computed: {
    alertClass: function alertClass() {
      var _ref;

      return _ref = {
        'alert': true
      }, defineProperty(_ref, "alert-" + this.type, Boolean(this.type)), defineProperty(_ref, 'alert-dismissible', this.dismissible), _ref;
    }
  },
  methods: {
    closeAlert: function closeAlert() {
      clearTimeout(this.timeout);
      this.$emit('dismissed');
    }
  },
  mounted: function mounted() {
    if (this.duration > 0) {
      this.timeout = setTimeout(this.closeAlert, this.duration);
    }
  },
  destroyed: function destroyed() {
    clearTimeout(this.timeout);
  }
};

var Pagination = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('nav', { class: _vm.navClasses, attrs: { "aria-label": "Page navigation" } }, [_c('ul', { staticClass: "pagination", class: _vm.classes }, [_vm.boundaryLinks ? _c('li', { class: { disabled: _vm.value <= 1 || _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button", "aria-label": "First" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.onPageChange(1);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("«")])])]) : _vm._e(), _vm._v(" "), _vm.directionLinks ? _c('li', { class: { disabled: _vm.value <= 1 || _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button", "aria-label": "Previous" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.onPageChange(_vm.value - 1);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("‹")])])]) : _vm._e(), _vm._v(" "), _vm.sliceStart > 0 ? _c('li', { class: { disabled: _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button", "aria-label": "Previous group" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.toPage(1);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("…")])])]) : _vm._e(), _vm._v(" "), _vm._l(_vm.sliceArray, function (item) {
      return _c('li', { key: item, class: { active: _vm.value === item + 1, disabled: _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button" }, on: { "click": function click($event) {
            $event.preventDefault();return _vm.onPageChange(item + 1);
          } } }, [_vm._v(_vm._s(item + 1))])]);
    }), _vm._v(" "), _vm.sliceStart < _vm.totalPage - _vm.maxSize ? _c('li', { class: { disabled: _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button", "aria-label": "Next group" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.toPage(0);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("…")])])]) : _vm._e(), _vm._v(" "), _vm.directionLinks ? _c('li', { class: { disabled: _vm.value >= _vm.totalPage || _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button", "aria-label": "Next" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.onPageChange(_vm.value + 1);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("›")])])]) : _vm._e(), _vm._v(" "), _vm.boundaryLinks ? _c('li', { class: { disabled: _vm.value >= _vm.totalPage || _vm.disabled } }, [_c('a', { attrs: { "href": "#", "role": "button", "aria-label": "Last" }, on: { "click": function click($event) {
          $event.preventDefault();return _vm.onPageChange(_vm.totalPage);
        } } }, [_c('span', { attrs: { "aria-hidden": "true" } }, [_vm._v("»")])])]) : _vm._e()], 2)]);
  }, staticRenderFns: [],
  props: {
    value: {
      type: Number,
      required: true,
      validator: function validator(v) {
        return v >= 1;
      }
    },
    boundaryLinks: {
      type: Boolean,
      default: false
    },
    directionLinks: {
      type: Boolean,
      default: true
    },
    size: String,
    align: String,
    totalPage: {
      type: Number,
      required: true,
      validator: function validator(v) {
        return v >= 0;
      }
    },
    maxSize: {
      type: Number,
      default: 5,
      validator: function validator(v) {
        return v >= 0;
      }
    },
    disabled: Boolean
  },
  data: function data() {
    return {
      sliceStart: 0
    };
  },

  computed: {
    navClasses: function navClasses() {
      return defineProperty({}, 'text-' + this.align, Boolean(this.align));
    },
    classes: function classes() {
      return defineProperty({}, 'pagination-' + this.size, Boolean(this.size));
    },
    sliceArray: function sliceArray() {
      return range(this.totalPage).slice(this.sliceStart, this.sliceStart + this.maxSize);
    }
  },
  methods: {
    calculateSliceStart: function calculateSliceStart() {
      var currentPage = this.value;
      var chunkSize = this.maxSize;
      var currentChunkStart = this.sliceStart;
      var currentChunkEnd = currentChunkStart + chunkSize;
      if (currentPage > currentChunkEnd) {
        var lastChunkStart = this.totalPage - chunkSize;
        if (currentPage > lastChunkStart) {
          this.sliceStart = lastChunkStart;
        } else {
          this.sliceStart = currentPage - 1;
        }
      } else if (currentPage < currentChunkStart + 1) {
        if (currentPage > chunkSize) {
          this.sliceStart = currentPage - chunkSize;
        } else {
          this.sliceStart = 0;
        }
      }
    },
    onPageChange: function onPageChange(page) {
      if (!this.disabled && page > 0 && page <= this.totalPage && page !== this.value) {
        this.$emit('input', page);
        this.$emit('change', page);
      }
    },
    toPage: function toPage(pre) {
      if (this.disabled) {
        return;
      }
      var chunkSize = this.maxSize;
      var currentChunkStart = this.sliceStart;
      var lastChunkStart = this.totalPage - chunkSize;
      var start = pre ? currentChunkStart - chunkSize : currentChunkStart + chunkSize;
      if (start < 0) {
        this.sliceStart = 0;
      } else if (start > lastChunkStart) {
        this.sliceStart = lastChunkStart;
      } else {
        this.sliceStart = start;
      }
    }
  },
  created: function created() {
    this.$watch(function (vm) {
      return [vm.value, vm.maxSize, vm.totalPage].join();
    }, this.calculateSliceStart, {
      immediate: true
    });
  }
};

var SHOW_CLASS = 'in';

var popupMixin = {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: 'span'
    },
    placement: {
      type: String,
      default: PLACEMENTS.TOP
    },
    autoPlacement: {
      type: Boolean,
      default: true
    },
    appendTo: {
      type: String,
      default: 'body'
    },
    transitionDuration: {
      type: Number,
      default: 150
    },
    hideDelay: {
      type: Number,
      default: 0
    },
    showDelay: {
      type: Number,
      default: 0
    },
    enable: {
      type: Boolean,
      default: true
    },
    enterable: {
      type: Boolean,
      default: true
    },
    target: null,
    viewport: null
  },
  data: function data() {
    return {
      triggerEl: null,
      hideTimeoutId: 0,
      showTimeoutId: 0,
      transitionTimeoutId: 0
    };
  },

  watch: {
    value: function value(v) {
      v ? this.show() : this.hide();
    },
    trigger: function trigger() {
      this.clearListeners();
      this.initListeners();
    },
    target: function target(value) {
      this.clearListeners();
      this.initTriggerElByTarget(value);
      this.initListeners();
    },
    allContent: function allContent(value) {
      var _this = this;

      // can not use value because it can not detect slot changes
      if (this.isNotEmpty()) {
        // reset position while content changed & is shown
        // nextTick is required
        this.$nextTick(function () {
          if (_this.isShown()) {
            _this.resetPosition();
          }
        });
      } else {
        this.hide();
      }
    },
    enable: function enable(value) {
      // hide if enable changed to false
      if (!value) {
        this.hide();
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    ensureElementMatchesFunction();
    removeFromDom(this.$refs.popup);
    this.$nextTick(function () {
      _this2.initTriggerElByTarget(_this2.target);
      _this2.initListeners();
      if (_this2.value) {
        _this2.show();
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.clearListeners();
    removeFromDom(this.$refs.popup);
  },

  methods: {
    initTriggerElByTarget: function initTriggerElByTarget(target) {
      if (target) {
        // target exist
        if (isString(target)) {
          // is selector
          this.triggerEl = document.querySelector(target);
        } else if (isElement(target)) {
          // is element
          this.triggerEl = target;
        } else if (isElement(target.$el)) {
          // is component
          this.triggerEl = target.$el;
        }
      } else {
        // find special element
        var trigger = this.$el.querySelector('[data-role="trigger"]');
        if (trigger) {
          this.triggerEl = trigger;
        } else {
          // use the first child
          var firstChild = this.$el.firstChild;
          this.triggerEl = firstChild === this.$refs.popup ? null : firstChild;
        }
      }
    },
    initListeners: function initListeners() {
      if (this.triggerEl) {
        if (this.trigger === TRIGGERS.HOVER) {
          on(this.triggerEl, EVENTS.MOUSE_ENTER, this.show);
          on(this.triggerEl, EVENTS.MOUSE_LEAVE, this.hide);
        } else if (this.trigger === TRIGGERS.FOCUS) {
          on(this.triggerEl, EVENTS.FOCUS, this.show);
          on(this.triggerEl, EVENTS.BLUR, this.hide);
        } else if (this.trigger === TRIGGERS.HOVER_FOCUS) {
          on(this.triggerEl, EVENTS.MOUSE_ENTER, this.handleAuto);
          on(this.triggerEl, EVENTS.MOUSE_LEAVE, this.handleAuto);
          on(this.triggerEl, EVENTS.FOCUS, this.handleAuto);
          on(this.triggerEl, EVENTS.BLUR, this.handleAuto);
        } else if (this.trigger === TRIGGERS.CLICK || this.trigger === TRIGGERS.OUTSIDE_CLICK) {
          on(this.triggerEl, EVENTS.CLICK, this.toggle);
        }
      }
      on(window, EVENTS.CLICK, this.windowClicked);
    },
    clearListeners: function clearListeners() {
      if (this.triggerEl) {
        off(this.triggerEl, EVENTS.FOCUS, this.show);
        off(this.triggerEl, EVENTS.BLUR, this.hide);
        off(this.triggerEl, EVENTS.MOUSE_ENTER, this.show);
        off(this.triggerEl, EVENTS.MOUSE_LEAVE, this.hide);
        off(this.triggerEl, EVENTS.CLICK, this.toggle);
        off(this.triggerEl, EVENTS.MOUSE_ENTER, this.handleAuto);
        off(this.triggerEl, EVENTS.MOUSE_LEAVE, this.handleAuto);
        off(this.triggerEl, EVENTS.FOCUS, this.handleAuto);
        off(this.triggerEl, EVENTS.BLUR, this.handleAuto);
      }
      off(window, EVENTS.CLICK, this.windowClicked);
    },
    resetPosition: function resetPosition() {
      var popup = this.$refs.popup;
      setTooltipPosition(popup, this.triggerEl, this.placement, this.autoPlacement, this.appendTo, this.viewport);
      popup.offsetHeight;
    },
    hideOnLeave: function hideOnLeave() {
      if (this.trigger === TRIGGERS.HOVER || this.trigger === TRIGGERS.HOVER_FOCUS && !this.triggerEl.matches(':focus')) {
        this.$hide();
      }
    },
    toggle: function toggle() {
      if (this.isShown()) {
        this.hide();
      } else {
        this.show();
      }
    },
    show: function show() {
      var _this3 = this;

      if (this.enable && this.triggerEl && this.isNotEmpty() && !this.isShown()) {
        var popup = this.$refs.popup;
        var popUpAppendedContainer = this.hideTimeoutId > 0; // weird condition
        if (popUpAppendedContainer) {
          clearTimeout(this.hideTimeoutId);
          this.hideTimeoutId = 0;
        }
        if (this.transitionTimeoutId > 0) {
          clearTimeout(this.transitionTimeoutId);
          this.transitionTimeoutId = 0;
        }
        this.showTimeoutId = setTimeout(function () {
          // add to dom
          if (!popUpAppendedContainer) {
            popup.className = _this3.name + ' ' + _this3.placement + ' fade';
            var container = document.querySelector(_this3.appendTo);
            container.appendChild(popup);
            _this3.resetPosition();
          }
          addClass(popup, SHOW_CLASS);
          _this3.$emit('input', true);
          _this3.$emit('show');
        }, this.showDelay);
      }
    },
    hide: function hide() {
      var _this4 = this;

      if (this.showTimeoutId > 0) {
        clearTimeout(this.showTimeoutId);
        this.showTimeoutId = 0;
      }

      if (!this.isShown()) {
        return;
      }
      if (this.enterable && (this.trigger === TRIGGERS.HOVER || this.trigger === TRIGGERS.HOVER_FOCUS)) {
        setTimeout(function () {
          if (!_this4.$refs.popup.matches(':hover')) {
            _this4.$hide();
          }
        }, 100);
      } else {
        this.$hide();
      }
    },
    $hide: function $hide() {
      var _this5 = this;

      if (this.isShown()) {
        clearTimeout(this.hideTimeoutId);
        this.hideTimeoutId = setTimeout(function () {
          _this5.hideTimeoutId = 0;
          removeClass(_this5.$refs.popup, SHOW_CLASS);
          // gives fade out time
          _this5.transitionTimeoutId = setTimeout(function () {
            _this5.transitionTimeoutId = 0;
            removeFromDom(_this5.$refs.popup);
            _this5.$emit('input', false);
            _this5.$emit('hide');
          }, _this5.transitionDuration);
        }, this.hideDelay);
      }
    },
    isShown: function isShown() {
      return hasClass(this.$refs.popup, SHOW_CLASS);
    },
    windowClicked: function windowClicked(event) {
      if (this.triggerEl && isFunction(this.triggerEl.contains) && !this.triggerEl.contains(event.target) && this.trigger === TRIGGERS.OUTSIDE_CLICK && !this.$refs.popup.contains(event.target) && this.isShown()) {
        this.hide();
      }
    },
    handleAuto: function handleAuto() {
      var _this6 = this;

      setTimeout(function () {
        if (_this6.triggerEl.matches(':hover, :focus')) {
          _this6.show();
        } else {
          _this6.hide();
        }
      }, 20); // 20ms make firefox happy
    }
  }
};

var Tooltip = {
  mixins: [popupMixin],
  data: function data() {
    return {
      name: 'tooltip'
    };
  },
  render: function render(h) {
    return h(this.tag, [this.$slots.default, h('div', {
      ref: 'popup',
      attrs: {
        role: 'tooltip'
      },
      on: {
        mouseleave: this.hideOnLeave
      }
    }, [h('div', { 'class': 'tooltip-arrow' }), h('div', {
      'class': 'tooltip-inner',
      domProps: { innerHTML: this.text }
    })])]);
  },

  props: {
    text: {
      type: String,
      default: ''
    },
    trigger: {
      type: String,
      default: TRIGGERS.HOVER_FOCUS
    }
  },
  computed: {
    allContent: function allContent() {
      return this.text;
    }
  },
  methods: {
    isNotEmpty: function isNotEmpty() {
      return this.text;
    }
  }
};

var Popover = {
  mixins: [popupMixin],
  data: function data() {
    return {
      name: 'popover'
    };
  },
  render: function render(h) {
    return h(this.tag, [this.$slots.default, h('div', {
      style: {
        display: 'block'
      },
      ref: 'popup',
      on: {
        mouseleave: this.hideOnLeave
      }
    }, [h('div', { 'class': 'arrow' }), h('h3', {
      'class': 'popover-title',
      directives: [{ name: 'show', value: this.title }]
    }, this.title), h('div', { 'class': 'popover-content' }, [this.content || this.$slots.popover])])]);
  },

  props: {
    title: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    },
    trigger: {
      type: String,
      default: TRIGGERS.OUTSIDE_CLICK
    }
  },
  computed: {
    allContent: function allContent() {
      return this.title + this.content;
    }
  },
  methods: {
    isNotEmpty: function isNotEmpty() {
      return this.title || this.content || this.$slots.popover;
    }
  }
};

var maxHours = 23;
var zero = 0;
var maxMinutes = 59;
var cutUpAmAndPm = 12;

var TimePicker = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('section', { on: { "click": function click($event) {
          $event.stopPropagation();
        } } }, [_c('table', [_c('tbody', [_vm.controls ? _c('tr', { staticClass: "text-center" }, [_c('td', [_c('btn', { attrs: { "type": "link", "size": "sm", "disabled": _vm.readonly }, on: { "click": function click($event) {
          return _vm.changeTime(1, 1);
        } } }, [_c('i', { class: _vm.iconControlUp })])], 1), _vm._v(" "), _c('td', [_vm._v(" ")]), _vm._v(" "), _c('td', [_c('btn', { attrs: { "type": "link", "size": "sm", "disabled": _vm.readonly }, on: { "click": function click($event) {
          return _vm.changeTime(0, 1);
        } } }, [_c('i', { class: _vm.iconControlUp })])], 1), _vm._v(" "), _vm.showMeridian ? _c('td') : _vm._e()]) : _vm._e(), _vm._v(" "), _c('tr', [_c('td', { staticClass: "form-group" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.lazy", value: _vm.hoursText, expression: "hoursText", modifiers: { "lazy": true } }], ref: "hoursInput", staticClass: "form-control text-center", staticStyle: { "width": "50px" }, attrs: { "type": "tel", "pattern": "\\d*", "placeholder": "HH", "readonly": _vm.readonly, "maxlength": "2", "size": "2" }, domProps: { "value": _vm.hoursText }, on: { "mouseup": _vm.selectInputValue, "keydown": [function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
            return null;
          }$event.preventDefault();return _vm.changeTime(1, 1);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
            return null;
          }$event.preventDefault();return _vm.changeTime(1, 0);
        }], "wheel": function wheel($event) {
          return _vm.onWheel($event, true);
        }, "change": function change($event) {
          _vm.hoursText = $event.target.value;
        } } })]), _vm._v(" "), _vm._m(0), _vm._v(" "), _c('td', { staticClass: "form-group" }, [_c('input', { directives: [{ name: "model", rawName: "v-model.lazy", value: _vm.minutesText, expression: "minutesText", modifiers: { "lazy": true } }], ref: "minutesInput", staticClass: "form-control text-center", staticStyle: { "width": "50px" }, attrs: { "type": "tel", "pattern": "\\d*", "placeholder": "MM", "readonly": _vm.readonly, "maxlength": "2", "size": "2" }, domProps: { "value": _vm.minutesText }, on: { "mouseup": _vm.selectInputValue, "keydown": [function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
            return null;
          }$event.preventDefault();return _vm.changeTime(0, 1);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
            return null;
          }$event.preventDefault();return _vm.changeTime(0, 0);
        }], "wheel": function wheel($event) {
          return _vm.onWheel($event, false);
        }, "change": function change($event) {
          _vm.minutesText = $event.target.value;
        } } })]), _vm._v(" "), _vm.showMeridian ? _c('td', [_vm._v("   "), _c('btn', { attrs: { "data-action": "toggleMeridian", "disabled": _vm.readonly }, domProps: { "textContent": _vm._s(_vm.meridian ? _vm.t('uiv.timePicker.am') : _vm.t('uiv.timePicker.pm')) }, on: { "click": _vm.toggleMeridian } })], 1) : _vm._e()]), _vm._v(" "), _vm.controls ? _c('tr', { staticClass: "text-center" }, [_c('td', [_c('btn', { attrs: { "type": "link", "size": "sm", "disabled": _vm.readonly }, on: { "click": function click($event) {
          return _vm.changeTime(1, 0);
        } } }, [_c('i', { class: _vm.iconControlDown })])], 1), _vm._v(" "), _c('td', [_vm._v(" ")]), _vm._v(" "), _c('td', [_c('btn', { attrs: { "type": "link", "size": "sm", "disabled": _vm.readonly }, on: { "click": function click($event) {
          return _vm.changeTime(0, 0);
        } } }, [_c('i', { class: _vm.iconControlDown })])], 1), _vm._v(" "), _vm.showMeridian ? _c('td') : _vm._e()]) : _vm._e()])])]);
  }, staticRenderFns: [function () {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('td', [_vm._v(" "), _c('b', [_vm._v(":")]), _vm._v(" ")]);
  }],
  components: { Btn: Btn },
  mixins: [Local],
  props: {
    value: {
      type: Date,
      required: true
    },
    showMeridian: {
      type: Boolean,
      default: true
    },
    min: Date,
    max: Date,
    hourStep: {
      type: Number,
      default: 1
    },
    minStep: {
      type: Number,
      default: 1
    },
    readonly: {
      type: Boolean,
      default: false
    },
    controls: {
      type: Boolean,
      default: true
    },
    iconControlUp: {
      type: String,
      default: 'glyphicon glyphicon-chevron-up'
    },
    iconControlDown: {
      type: String,
      default: 'glyphicon glyphicon-chevron-down'
    }
  },
  data: function data() {
    return {
      hours: 0,
      minutes: 0,
      meridian: true,
      hoursText: '',
      minutesText: ''
    };
  },
  mounted: function mounted() {
    this.updateByValue(this.value);
  },

  watch: {
    value: function value(_value) {
      this.updateByValue(_value);
    },
    showMeridian: function showMeridian(value) {
      this.setTime();
    },
    hoursText: function hoursText(value) {
      if (this.hours === 0 && value === '') {
        // Prevent a runtime reset from being overwritten
        return;
      }
      var hour = parseInt(value);
      if (this.showMeridian) {
        if (hour >= 1 && hour <= cutUpAmAndPm) {
          if (this.meridian) {
            this.hours = hour === cutUpAmAndPm ? 0 : hour;
          } else {
            this.hours = hour === cutUpAmAndPm ? cutUpAmAndPm : hour + cutUpAmAndPm;
          }
        }
      } else if (hour >= zero && hour <= maxHours) {
        this.hours = hour;
      }
      this.setTime();
    },
    minutesText: function minutesText(value) {
      if (this.minutes === 0 && value === '') {
        // Prevent a runtime reset from being overwritten
        return;
      }
      var minutesStr = parseInt(value);
      if (minutesStr >= zero && minutesStr <= maxMinutes) {
        this.minutes = minutesStr;
      }
      this.setTime();
    }
  },
  methods: {
    updateByValue: function updateByValue(value) {
      if (isNaN(value.getTime())) {
        this.hours = 0;
        this.minutes = 0;
        this.hoursText = '';
        this.minutesText = '';
        this.meridian = true;
        return;
      }
      this.hours = value.getHours();
      this.minutes = value.getMinutes();
      if (!this.showMeridian) {
        this.hoursText = pad(this.hours, 2);
      } else {
        if (this.hours >= cutUpAmAndPm) {
          if (this.hours === cutUpAmAndPm) {
            this.hoursText = this.hours + '';
          } else {
            this.hoursText = pad(this.hours - cutUpAmAndPm, 2);
          }
          this.meridian = false;
        } else {
          if (this.hours === zero) {
            this.hoursText = cutUpAmAndPm.toString();
          } else {
            this.hoursText = pad(this.hours, 2);
          }
          this.meridian = true;
        }
      }
      this.minutesText = pad(this.minutes, 2);
      // lazy model won't update when using keyboard up/down
      this.$refs.hoursInput.value = this.hoursText;
      this.$refs.minutesInput.value = this.minutesText;
    },
    addHour: function addHour(step) {
      step = step || this.hourStep;
      this.hours = this.hours >= maxHours ? zero : this.hours + step;
    },
    reduceHour: function reduceHour(step) {
      step = step || this.hourStep;
      this.hours = this.hours <= zero ? maxHours : this.hours - step;
    },
    addMinute: function addMinute() {
      if (this.minutes >= maxMinutes) {
        this.minutes = zero;
        this.addHour(1);
      } else {
        this.minutes += this.minStep;
      }
    },
    reduceMinute: function reduceMinute() {
      if (this.minutes <= zero) {
        this.minutes = maxMinutes + 1 - this.minStep;
        this.reduceHour(1);
      } else {
        this.minutes -= this.minStep;
      }
    },
    changeTime: function changeTime(isHour, isPlus) {
      if (!this.readonly) {
        if (isHour && isPlus) {
          this.addHour();
        } else if (isHour && !isPlus) {
          this.reduceHour();
        } else if (!isHour && isPlus) {
          this.addMinute();
        } else {
          this.reduceMinute();
        }
        this.setTime();
      }
    },
    toggleMeridian: function toggleMeridian() {
      this.meridian = !this.meridian;
      if (this.meridian) {
        this.hours -= cutUpAmAndPm;
      } else {
        this.hours += cutUpAmAndPm;
      }
      this.setTime();
    },
    onWheel: function onWheel(e, isHour) {
      if (!this.readonly) {
        e.preventDefault();
        this.changeTime(isHour, e.deltaY < 0);
      }
    },
    setTime: function setTime() {
      var time = this.value;
      if (isNaN(time.getTime())) {
        time = new Date();
        time.setHours(0);
        time.setMinutes(0);
      }
      time.setHours(this.hours);
      time.setMinutes(this.minutes);
      if (this.max) {
        var max = new Date(time);
        max.setHours(this.max.getHours());
        max.setMinutes(this.max.getMinutes());
        time = time > max ? max : time;
      }
      if (this.min) {
        var min = new Date(time);
        min.setHours(this.min.getHours());
        min.setMinutes(this.min.getMinutes());
        time = time < min ? min : time;
      }
      this.$emit('input', new Date(time));
    },
    selectInputValue: function selectInputValue(e) {
      // mouseup should be prevented!
      // See various comments in https://stackoverflow.com/questions/3272089/programmatically-selecting-text-in-an-input-field-on-ios-devices-mobile-safari
      e.target.setSelectionRange(0, 2);
    }
  }
};

function getRequest(url) {
  var request = new window.XMLHttpRequest();
  var data = {};
  var p = {
    then: function then(fn1, fn2) {
      return p.done(fn1).fail(fn2);
    },
    catch: function _catch(fn) {
      return p.fail(fn);
    },
    always: function always(fn) {
      return p.done(fn).fail(fn);
    }
  };
  var statuses = ['done', 'fail'];
  statuses.forEach(function (name) {
    data[name] = [];
    p[name] = function (fn) {
      if (fn instanceof Function) data[name].push(fn);
      return p;
    };
  });
  p.done(JSON.parse);
  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      var e = { status: request.status };
      if (request.status === 200) {
        var response = request.responseText;
        for (var i in data.done) {
          if (data.done.hasOwnProperty(i) && isFunction(data.done[i])) {
            var value = data.done[i](response);
            if (isExist(value)) {
              response = value;
            }
          }
        }
      } else {
        data.fail.forEach(function (fail) {
          return fail(e);
        });
      }
    }
  };
  request.open('GET', url);
  request.setRequestHeader('Accept', 'application/json');
  request.send();
  return p;
}

var Typeahead = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('dropdown', { ref: "dropdown", attrs: { "tag": "section", "append-to-body": _vm.appendToBody, "not-close-elements": _vm.elements, "position-element": _vm.inputEl }, model: { value: _vm.open, callback: function callback($$v) {
          _vm.open = $$v;
        }, expression: "open" } }, [_c('template', { slot: "dropdown" }, [_vm._t("item", _vm._l(_vm.items, function (item, index) {
      return _c('li', { class: { active: _vm.activeIndex === index } }, [_c('a', { attrs: { "href": "#" }, on: { "click": function click($event) {
            $event.preventDefault();return _vm.selectItem(item);
          } } }, [_c('span', { domProps: { "innerHTML": _vm._s(_vm.highlight(item)) } })])]);
    }), { "items": _vm.items, "activeIndex": _vm.activeIndex, "select": _vm.selectItem, "highlight": _vm.highlight }), _vm._v(" "), !_vm.items || _vm.items.length === 0 ? _vm._t("empty") : _vm._e()], 2)], 2);
  }, staticRenderFns: [],
  components: { Dropdown: Dropdown },
  props: {
    value: {
      required: true
    },
    data: Array,
    itemKey: String,
    appendToBody: {
      type: Boolean,
      default: false
    },
    ignoreCase: {
      type: Boolean,
      default: true
    },
    matchStart: {
      type: Boolean,
      default: false
    },
    forceSelect: {
      type: Boolean,
      default: false
    },
    forceClear: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 10
    },
    asyncSrc: String,
    asyncKey: String,
    asyncFunction: Function,
    debounce: {
      type: Number,
      default: 200
    },
    openOnFocus: {
      type: Boolean,
      default: true
    },
    openOnEmpty: {
      type: Boolean,
      default: false
    },
    target: {
      required: true
    },
    preselect: {
      type: Boolean,
      default: true
    }
  },
  data: function data() {
    return {
      inputEl: null,
      items: [],
      activeIndex: 0,
      timeoutID: 0,
      elements: [],
      open: false,
      dropdownMenuEl: null
    };
  },

  computed: {
    regexOptions: function regexOptions() {
      var options = '';
      if (this.ignoreCase) {
        options += 'i';
      }
      if (!this.matchStart) {
        options += 'g';
      }
      return options;
    }
  },
  mounted: function mounted() {
    var _this = this;

    ensureElementMatchesFunction();
    this.$nextTick(function () {
      _this.initInputElByTarget(_this.target);
      _this.initListeners();
      _this.dropdownMenuEl = _this.$refs.dropdown.$el.querySelector('.dropdown-menu');
      // set input text if v-model not empty
      if (_this.value) {
        _this.setInputTextByValue(_this.value);
      }
    });
  },
  beforeDestroy: function beforeDestroy() {
    this.removeListeners();
  },

  watch: {
    target: function target(el) {
      this.removeListeners();
      this.initInputElByTarget(el);
      this.initListeners();
    },
    value: function value(_value) {
      this.setInputTextByValue(_value);
    }
  },
  methods: {
    setInputTextByValue: function setInputTextByValue(value) {
      if (isString(value)) {
        // direct
        this.inputEl.value = value;
      } else if (value) {
        // is object
        this.inputEl.value = this.itemKey ? value[this.itemKey] : value;
      } else if (value === null) {
        // is null or undefined or something else not valid
        this.inputEl.value = '';
      }
    },
    hasEmptySlot: function hasEmptySlot() {
      return !!this.$slots['empty'] || !!this.$scopedSlots['empty'];
    },
    initInputElByTarget: function initInputElByTarget(target) {
      if (!target) {
        return;
      }
      if (isString(target)) {
        // is selector
        this.inputEl = document.querySelector(target);
      } else if (isElement(target)) {
        // is element
        this.inputEl = target;
      } else if (isElement(target.$el)) {
        // is component
        this.inputEl = target.$el;
      }
    },
    initListeners: function initListeners() {
      if (this.inputEl) {
        this.elements = [this.inputEl];
        on(this.inputEl, EVENTS.FOCUS, this.inputFocused);
        on(this.inputEl, EVENTS.BLUR, this.inputBlured);
        on(this.inputEl, EVENTS.INPUT, this.inputChanged);
        on(this.inputEl, EVENTS.KEY_DOWN, this.inputKeyPressed);
      }
    },
    removeListeners: function removeListeners() {
      this.elements = [];
      if (this.inputEl) {
        off(this.inputEl, EVENTS.FOCUS, this.inputFocused);
        off(this.inputEl, EVENTS.BLUR, this.inputBlured);
        off(this.inputEl, EVENTS.INPUT, this.inputChanged);
        off(this.inputEl, EVENTS.KEY_DOWN, this.inputKeyPressed);
      }
    },
    prepareItems: function prepareItems(data) {
      var disableFilters = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      if (disableFilters) {
        this.items = data.slice(0, this.limit);
        return;
      }
      this.items = [];
      this.activeIndex = this.preselect ? 0 : -1;
      for (var i = 0, l = data.length; i < l; i++) {
        var item = data[i];
        var key = this.itemKey ? item[this.itemKey] : item;
        key = key.toString();
        var index = -1;
        if (this.ignoreCase) {
          index = key.toLowerCase().indexOf(this.inputEl.value.toLowerCase());
        } else {
          index = key.indexOf(this.inputEl.value);
        }
        if (this.matchStart ? index === 0 : index >= 0) {
          this.items.push(item);
        }
        if (this.items.length >= this.limit) {
          break;
        }
      }
    },
    fetchItems: function fetchItems(value, debounce) {
      var _this2 = this;

      clearTimeout(this.timeoutID);
      if (value === '' && !this.openOnEmpty) {
        this.open = false;
      } else if (this.data) {
        this.prepareItems(this.data);
        this.open = this.hasEmptySlot() || Boolean(this.items.length);
      } else if (this.asyncSrc) {
        this.timeoutID = setTimeout(function () {
          _this2.$emit('loading');
          getRequest(_this2.asyncSrc + encodeURIComponent(value)).then(function (data) {
            if (_this2.inputEl.matches(':focus')) {
              _this2.prepareItems(_this2.asyncKey ? data[_this2.asyncKey] : data, true);
              _this2.open = _this2.hasEmptySlot() || Boolean(_this2.items.length);
            }
            _this2.$emit('loaded');
          }).catch(function (err) {
            console.error(err);
            _this2.$emit('loaded-error');
          });
        }, debounce);
      } else if (this.asyncFunction) {
        var cb = function cb(data) {
          if (_this2.inputEl.matches(':focus')) {
            _this2.prepareItems(data, true);
            _this2.open = _this2.hasEmptySlot() || Boolean(_this2.items.length);
          }
          _this2.$emit('loaded');
        };
        this.timeoutID = setTimeout(function () {
          _this2.$emit('loading');
          _this2.asyncFunction(value, cb);
        }, debounce);
      }
    },
    inputChanged: function inputChanged() {
      var value = this.inputEl.value;
      this.fetchItems(value, this.debounce);
      this.$emit('input', this.forceSelect ? undefined : value);
    },
    inputFocused: function inputFocused() {
      if (this.openOnFocus) {
        var value = this.inputEl.value;
        this.fetchItems(value, 0);
      }
    },
    inputBlured: function inputBlured() {
      var _this3 = this;

      if (!this.dropdownMenuEl.matches(':hover')) {
        this.open = false;
      }
      if (this.inputEl && this.forceClear) {
        this.$nextTick(function () {
          if (typeof _this3.value === 'undefined') {
            _this3.inputEl.value = '';
          }
        });
      }
    },
    inputKeyPressed: function inputKeyPressed(event) {
      event.stopPropagation();
      if (this.open) {
        switch (event.keyCode) {
          case 13:
            if (this.activeIndex >= 0) {
              this.selectItem(this.items[this.activeIndex]);
            } else {
              this.open = false;
            }
            break;
          case 27:
            this.open = false;
            break;
          case 38:
            this.activeIndex = this.activeIndex > 0 ? this.activeIndex - 1 : 0;
            break;
          case 40:
            var maxIndex = this.items.length - 1;
            this.activeIndex = this.activeIndex < maxIndex ? this.activeIndex + 1 : maxIndex;
            break;
        }
      }
    },
    selectItem: function selectItem(item) {
      this.$emit('input', item);
      this.open = false;
    },
    highlight: function highlight(item) {
      var value = this.itemKey ? item[this.itemKey] : item;
      var inputValue = this.inputEl.value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
      return value.replace(new RegExp('' + inputValue, this.regexOptions), '<b>$&</b>');
    }
  }
};

var ProgressBarStack = {
  functional: true,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data;

    return h('div', mergeData(data, {
      class: defineProperty({
        'progress-bar': true,
        'progress-bar-striped': props.striped,
        'active': props.striped && props.active
      }, 'progress-bar-' + props.type, Boolean(props.type)),
      style: {
        minWidth: props.minWidth ? '2em' : null,
        width: props.value + '%'
      },
      attrs: {
        role: 'progressbar',
        'aria-valuemin': 0,
        'aria-valuenow': props.value,
        'aria-valuemax': 100
      }
    }), props.label ? props.labelText ? props.labelText : props.value + '%' : null);
  },

  props: {
    value: {
      type: Number,
      required: true,
      validator: function validator(value) {
        return value >= 0 && value <= 100;
      }
    },
    labelText: String,
    type: String,
    label: {
      type: Boolean,
      default: false
    },
    minWidth: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    }
  }
};

var ProgressBar = {
  functional: true,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;

    return h('div', mergeData(data, { class: 'progress' }), children && children.length ? children : [h(ProgressBarStack, { props: props })]);
  }
};

var BreadcrumbItem = {
  functional: true,
  mixins: [linkMixin],
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;

    var slot = void 0;
    if (props.active) {
      slot = children;
    } else if (props.to) {
      slot = [h('router-link', {
        props: {
          to: props.to,
          replace: props.replace,
          append: props.append,
          exact: props.exact
        }
      }, children)];
    } else {
      slot = [h('a', {
        attrs: {
          href: props.href,
          target: props.target
        }
      }, children)];
    }
    return h('li', mergeData(data, { class: { active: props.active } }), slot);
  },

  props: {
    active: {
      type: Boolean,
      default: false
    }
  }
};

var Breadcrumbs = {
  functional: true,
  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;

    var slot = [];
    if (children && children.length) {
      slot = children;
    } else if (props.items) {
      slot = props.items.map(function (item, index) {
        return h(BreadcrumbItem, {
          key: item.hasOwnProperty('key') ? item.key : index,
          props: {
            active: item.hasOwnProperty('active') ? item.active : index === props.items.length - 1,
            href: item.href,
            target: item.target,
            to: item.to,
            replace: item.replace,
            append: item.append,
            exact: item.exact
          }
        }, item.text);
      });
    }
    return h('ol', mergeData(data, { class: 'breadcrumb' }), slot);
  },

  props: {
    items: Array
  }
};

var BtnToolbar = {
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children,
        data = _ref.data;

    return h('div', mergeData(data, {
      class: {
        'btn-toolbar': true
      },
      attrs: {
        role: 'toolbar'
      }
    }), children);
  }
};

var MultiSelect = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('dropdown', { ref: "dropdown", style: _vm.containerStyles, attrs: { "not-close-elements": _vm.els, "append-to-body": _vm.appendToBody, "disabled": _vm.disabled }, nativeOn: { "keydown": function keydown($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "esc", 27, $event.key, ["Esc", "Escape"])) {
            return null;
          }_vm.showDropdown = false;
        } }, model: { value: _vm.showDropdown, callback: function callback($$v) {
          _vm.showDropdown = $$v;
        }, expression: "showDropdown" } }, [_c('div', { staticClass: "form-control dropdown-toggle clearfix", class: _vm.selectClasses, attrs: { "disabled": _vm.disabled, "tabindex": "0", "data-role": "trigger" }, on: { "focus": function focus($event) {
          return _vm.$emit('focus', $event);
        }, "blur": function blur($event) {
          return _vm.$emit('blur', $event);
        }, "keydown": [function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
            return null;
          }$event.preventDefault();$event.stopPropagation();return _vm.goNextOption($event);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
            return null;
          }$event.preventDefault();$event.stopPropagation();return _vm.goPrevOption($event);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
            return null;
          }$event.preventDefault();$event.stopPropagation();return _vm.selectOption($event);
        }] } }, [_c('div', { class: _vm.selectTextClasses, staticStyle: { "display": "inline-block", "vertical-align": "middle" } }, [_vm._v(_vm._s(_vm.selectedText))]), _vm._v(" "), _c('div', { staticClass: "pull-right", staticStyle: { "display": "inline-block", "vertical-align": "middle" } }, [_c('span', [_vm._v(" ")]), _vm._v(" "), _c('span', { staticClass: "caret" })])]), _vm._v(" "), _c('template', { slot: "dropdown" }, [_vm.filterable ? _c('li', { staticStyle: { "padding": "4px 8px" } }, [_c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.filterInput, expression: "filterInput" }], ref: "filterInput", staticClass: "form-control input-sm", attrs: { "aria-label": "Filter...", "type": "text", "placeholder": _vm.filterPlaceholder || _vm.t('uiv.multiSelect.filterPlaceholder') }, domProps: { "value": _vm.filterInput }, on: { "keydown": [function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
            return null;
          }$event.preventDefault();$event.stopPropagation();return _vm.goNextOption($event);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
            return null;
          }$event.preventDefault();$event.stopPropagation();return _vm.goPrevOption($event);
        }, function ($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
            return null;
          }$event.preventDefault();$event.stopPropagation();return _vm.selectOption($event);
        }], "input": function input($event) {
          if ($event.target.composing) {
            return;
          }_vm.filterInput = $event.target.value;
        } } })]) : _vm._e(), _vm._v(" "), _vm._l(_vm.groupedOptions, function (item) {
      return [item.$group ? _c('li', { staticClass: "dropdown-header", domProps: { "textContent": _vm._s(item.$group) } }) : _vm._e(), _vm._v(" "), _vm._l(item.options, function (_item) {
        return [_c('li', { class: _vm.itemClasses(_item), staticStyle: { "outline": "0" }, on: { "keydown": [function ($event) {
              if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "down", 40, $event.key, ["Down", "ArrowDown"])) {
                return null;
              }$event.preventDefault();$event.stopPropagation();return _vm.goNextOption($event);
            }, function ($event) {
              if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "up", 38, $event.key, ["Up", "ArrowUp"])) {
                return null;
              }$event.preventDefault();$event.stopPropagation();return _vm.goPrevOption($event);
            }, function ($event) {
              if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
                return null;
              }$event.preventDefault();$event.stopPropagation();return _vm.selectOption($event);
            }], "click": function click($event) {
              $event.stopPropagation();return _vm.toggle(_item);
            }, "mouseenter": function mouseenter($event) {
              _vm.currentActive = -1;
            } } }, [_vm.isItemSelected(_item) ? _c('a', { staticStyle: { "outline": "0" }, attrs: { "role": "button" } }, [_c('b', [_vm._v(_vm._s(_item[_vm.labelKey]))]), _vm._v(" "), _vm.selectedIcon ? _c('span', { class: _vm.selectedIconClasses }) : _vm._e()]) : _c('a', { staticStyle: { "outline": "0" }, attrs: { "role": "button" } }, [_c('span', [_vm._v(_vm._s(_item[_vm.labelKey]))])])])];
      })];
    })], 2)], 2);
  }, staticRenderFns: [],
  mixins: [Local],
  components: { Dropdown: Dropdown },
  props: {
    value: {
      type: Array,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    limit: {
      type: Number,
      default: 0
    },
    size: String,
    placeholder: String,
    split: {
      type: String,
      default: ', '
    },
    disabled: {
      type: Boolean,
      default: false
    },
    appendToBody: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    collapseSelected: {
      type: Boolean,
      default: false
    },
    filterable: {
      type: Boolean,
      default: false
    },
    filterAutoFocus: {
      type: Boolean,
      default: true
    },
    filterFunction: Function,
    filterPlaceholder: String,
    selectedIcon: {
      type: String,
      default: 'glyphicon glyphicon-ok'
    },
    itemSelectedClass: String
  },
  data: function data() {
    return {
      showDropdown: false,
      els: [],
      filterInput: '',
      currentActive: -1
    };
  },

  computed: {
    containerStyles: function containerStyles() {
      return {
        width: this.block ? '100%' : ''
      };
    },
    filteredOptions: function filteredOptions() {
      var _this = this;

      if (this.filterable && this.filterInput) {
        if (this.filterFunction) {
          return this.filterFunction(this.filterInput);
        } else {
          var filterInput = this.filterInput.toLowerCase();
          return this.options.filter(function (v) {
            return v[_this.valueKey].toString().toLowerCase().indexOf(filterInput) >= 0 || v[_this.labelKey].toString().toLowerCase().indexOf(filterInput) >= 0;
          });
        }
      } else {
        return this.options;
      }
    },
    groupedOptions: function groupedOptions() {
      var _this2 = this;

      return this.filteredOptions.map(function (v) {
        return v.group;
      }).filter(onlyUnique).map(function (v) {
        return {
          options: _this2.filteredOptions.filter(function (option) {
            return option.group === v;
          }),
          $group: v
        };
      });
    },
    flatternGroupedOptions: function flatternGroupedOptions() {
      if (this.groupedOptions && this.groupedOptions.length) {
        var result = [];
        this.groupedOptions.forEach(function (v) {
          result = result.concat(v.options);
        });
        return result;
      } else {
        return [];
      }
    },
    selectClasses: function selectClasses() {
      return defineProperty({}, 'input-' + this.size, this.size);
    },
    selectedIconClasses: function selectedIconClasses() {
      var _ref2;

      return _ref2 = {}, defineProperty(_ref2, this.selectedIcon, true), defineProperty(_ref2, 'pull-right', true), _ref2;
    },
    selectTextClasses: function selectTextClasses() {
      return {
        'text-muted': this.value.length === 0
      };
    },
    labelValue: function labelValue() {
      var _this3 = this;

      var optionsByValue = this.options.map(function (v) {
        return v[_this3.valueKey];
      });
      return this.value.map(function (v) {
        var index = optionsByValue.indexOf(v);
        return index >= 0 ? _this3.options[index][_this3.labelKey] : v;
      });
    },
    selectedText: function selectedText() {
      if (this.value.length) {
        var labelValue = this.labelValue;
        if (this.collapseSelected) {
          var str = labelValue[0];
          str += labelValue.length > 1 ? this.split + '+' + (labelValue.length - 1) : '';
          return str;
        } else {
          return labelValue.join(this.split);
        }
      } else {
        return this.placeholder || this.t('uiv.multiSelect.placeholder');
      }
    }
  },
  watch: {
    showDropdown: function showDropdown(v) {
      var _this4 = this;

      // clear filter input when dropdown toggles
      this.filterInput = '';
      this.currentActive = -1;
      this.$emit('visible-change', v);
      if (v && this.filterable && this.filterAutoFocus) {
        this.$nextTick(function () {
          _this4.$refs.filterInput.focus();
        });
      }
    }
  },
  mounted: function mounted() {
    this.els = [this.$el];
  },

  methods: {
    goPrevOption: function goPrevOption() {
      if (!this.showDropdown) {
        return;
      }
      this.currentActive > 0 ? this.currentActive-- : this.currentActive = this.flatternGroupedOptions.length - 1;
    },
    goNextOption: function goNextOption() {
      if (!this.showDropdown) {
        return;
      }
      this.currentActive < this.flatternGroupedOptions.length - 1 ? this.currentActive++ : this.currentActive = 0;
    },
    selectOption: function selectOption() {
      var index = this.currentActive;
      var options = this.flatternGroupedOptions;
      if (!this.showDropdown) {
        this.showDropdown = true;
      } else if (index >= 0 && index < options.length) {
        this.toggle(options[index]);
      }
    },
    itemClasses: function itemClasses(item) {
      var result = {
        disabled: item.disabled,
        active: this.currentActive === this.flatternGroupedOptions.indexOf(item)
      };
      if (this.itemSelectedClass) {
        result[this.itemSelectedClass] = this.isItemSelected(item);
      }
      return result;
    },
    isItemSelected: function isItemSelected(item) {
      return this.value.indexOf(item[this.valueKey]) >= 0;
    },
    toggle: function toggle(item) {
      if (item.disabled) {
        return;
      }
      var value = item[this.valueKey];
      var index = this.value.indexOf(value);
      if (this.limit === 1) {
        var newValue = index >= 0 ? [] : [value];
        this.$emit('input', newValue);
        this.$emit('change', newValue);
      } else {
        if (index >= 0) {
          this.value.splice(index, 1);
          this.$emit('change', this.value);
        } else if (this.limit === 0 || this.value.length < this.limit) {
          this.value.push(value);
          this.$emit('change', this.value);
        } else {
          this.$emit('limit-exceed');
        }
      }
    }
  }
};

var Navbar = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('nav', { class: _vm.navClasses }, [_c('div', { class: _vm.fluid ? 'container-fluid' : 'container' }, [_c('div', { staticClass: "navbar-header" }, [_vm._t("collapse-btn", [_c('button', { staticClass: "navbar-toggle collapsed", attrs: { "type": "button" }, on: { "click": _vm.toggle } }, [_c('span', { staticClass: "sr-only" }, [_vm._v("Toggle navigation")]), _vm._v(" "), _c('span', { staticClass: "icon-bar" }), _vm._v(" "), _c('span', { staticClass: "icon-bar" }), _vm._v(" "), _c('span', { staticClass: "icon-bar" })])]), _vm._v(" "), _vm._t("brand")], 2), _vm._v(" "), _vm._t("default"), _vm._v(" "), _c('collapse', { staticClass: "navbar-collapse", model: { value: _vm.show, callback: function callback($$v) {
          _vm.show = $$v;
        }, expression: "show" } }, [_vm._t("collapse")], 2)], 2)]);
  }, staticRenderFns: [],
  components: { Collapse: Collapse },
  props: {
    value: Boolean,
    fluid: {
      type: Boolean,
      default: true
    },
    fixedTop: Boolean,
    fixedBottom: Boolean,
    staticTop: Boolean,
    inverse: Boolean
  },
  data: function data() {
    return {
      show: false
    };
  },

  computed: {
    navClasses: function navClasses() {
      return {
        navbar: true,
        'navbar-default': !this.inverse,
        'navbar-inverse': this.inverse,
        'navbar-static-top': this.staticTop,
        'navbar-fixed-bottom': this.fixedBottom,
        'navbar-fixed-top': this.fixedTop
      };
    }
  },
  mounted: function mounted() {
    this.show = !!this.value;
  },

  watch: {
    value: function value(v) {
      this.show = v;
    }
  },
  methods: {
    toggle: function toggle() {
      this.show = !this.show;
      this.$emit('input', this.show);
    }
  }
};

var NavbarNav = {
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children,
        data = _ref.data,
        props = _ref.props;

    return h('ul', mergeData(data, {
      class: {
        nav: true,
        'navbar-nav': true,
        'navbar-left': props.left,
        'navbar-right': props.right
      }
    }), children);
  },

  props: {
    left: Boolean,
    right: Boolean
  }
};

var NavbarForm = {
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children,
        data = _ref.data,
        props = _ref.props;

    return h('form', mergeData(data, {
      class: {
        'navbar-form': true,
        'navbar-left': props.left,
        'navbar-right': props.right
      }
    }), children);
  },

  props: {
    left: Boolean,
    right: Boolean
  }
};

var NavbarText = {
  functional: true,
  render: function render(h, _ref) {
    var children = _ref.children,
        data = _ref.data,
        props = _ref.props;

    return h('p', mergeData(data, {
      class: {
        'navbar-text': true,
        'navbar-left': props.left,
        'navbar-right': props.right
      }
    }), children);
  },

  props: {
    left: Boolean,
    right: Boolean
  }
};



var components = Object.freeze({
	Carousel: Carousel,
	Slide: Slide,
	Collapse: Collapse,
	Dropdown: Dropdown,
	Modal: Modal,
	Tab: Tab,
	Tabs: Tabs,
	DatePicker: DatePicker,
	Affix: Affix,
	Alert: Alert,
	Pagination: Pagination,
	Tooltip: Tooltip,
	Popover: Popover,
	TimePicker: TimePicker,
	Typeahead: Typeahead,
	ProgressBar: ProgressBar,
	ProgressBarStack: ProgressBarStack,
	Breadcrumbs: Breadcrumbs,
	BreadcrumbItem: BreadcrumbItem,
	Btn: Btn,
	BtnGroup: BtnGroup,
	BtnToolbar: BtnToolbar,
	MultiSelect: MultiSelect,
	Navbar: Navbar,
	NavbarNav: NavbarNav,
	NavbarForm: NavbarForm,
	NavbarText: NavbarText
});

var INSTANCE = '_uiv_tooltip_instance';

var bind$1 = function bind(el, binding) {
  // console.log('bind')
  unbind$1(el);
  var Constructor = vue__WEBPACK_IMPORTED_MODULE_0___default.a.extend(Tooltip);
  var vm = new Constructor({
    propsData: {
      target: el,
      appendTo: binding.arg && '#' + binding.arg,
      text: typeof binding.value === 'string' ? binding.value && binding.value.toString() : binding.value && binding.value.text && binding.value.text.toString(),
      viewport: binding.value && binding.value.viewport && binding.value.viewport.toString()
    }
  });
  var options = [];
  for (var key in binding.modifiers) {
    if (binding.modifiers.hasOwnProperty(key) && binding.modifiers[key]) {
      options.push(key);
    }
  }
  options.forEach(function (option) {
    if (/(top)|(left)|(right)|(bottom)/.test(option)) {
      vm.placement = option;
    } else if (/(hover)|(focus)|(click)/.test(option)) {
      vm.trigger = option;
    } else if (/unenterable/.test(option)) {
      vm.enterable = false;
    }
  });
  vm.$mount();
  el[INSTANCE] = vm;
};

var unbind$1 = function unbind(el) {
  // console.log('unbind')
  var vm = el[INSTANCE];
  if (vm) {
    vm.$destroy();
  }
  delete el[INSTANCE];
};

var update$1 = function update(el, binding) {
  // console.log('update')
  if (binding.value !== binding.oldValue) {
    bind$1(el, binding);
  }
};

var tooltip = { bind: bind$1, unbind: unbind$1, update: update$1 };

var INSTANCE$1 = '_uiv_popover_instance';

var bind$2 = function bind(el, binding) {
  // console.log('bind')
  unbind$2(el);
  var Constructor = vue__WEBPACK_IMPORTED_MODULE_0___default.a.extend(Popover);
  var vm = new Constructor({
    propsData: {
      target: el,
      appendTo: binding.arg && '#' + binding.arg,
      title: binding.value && binding.value.title && binding.value.title.toString(),
      content: binding.value && binding.value.content && binding.value.content.toString(),
      viewport: binding.value && binding.value.viewport && binding.value.viewport.toString()
    }
  });
  var options = [];
  for (var key in binding.modifiers) {
    if (binding.modifiers.hasOwnProperty(key) && binding.modifiers[key]) {
      options.push(key);
    }
  }
  options.forEach(function (option) {
    if (/(top)|(left)|(right)|(bottom)/.test(option)) {
      vm.placement = option;
    } else if (/(hover)|(focus)|(click)/.test(option)) {
      vm.trigger = option;
    } else if (/unenterable/.test(option)) {
      vm.enterable = false;
    }
  });
  vm.$mount();
  el[INSTANCE$1] = vm;
};

var unbind$2 = function unbind(el) {
  // console.log('unbind')
  var vm = el[INSTANCE$1];
  if (vm) {
    vm.$destroy();
  }
  delete el[INSTANCE$1];
};

var update$2 = function update(el, binding) {
  // console.log('update')
  if (binding.value !== binding.oldValue) {
    bind$2(el, binding);
  }
};

var popover = { bind: bind$2, unbind: unbind$2, update: update$2 };

function ScrollSpy(element) {
  var target = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'body';
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  this.el = element;
  this.opts = _extends({}, ScrollSpy.DEFAULTS, options);
  this.opts.target = target;
  if (target === 'body') {
    this.scrollElement = window;
  } else {
    this.scrollElement = document.querySelector('[id=' + target + ']');
  }
  this.selector = 'li > a';
  this.offsets = [];
  this.targets = [];
  this.activeTarget = null;
  this.scrollHeight = 0;
  if (this.scrollElement) {
    this.refresh();
    this.process();
  }
}

ScrollSpy.DEFAULTS = {
  offset: 10,
  callback: function callback(ele) {
    return 0;
  }
};

ScrollSpy.prototype.getScrollHeight = function () {
  return this.scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
};

ScrollSpy.prototype.refresh = function () {
  var _this = this;

  this.offsets = [];
  this.targets = [];
  this.scrollHeight = this.getScrollHeight();
  var list = nodeListToArray(this.el.querySelectorAll(this.selector));
  var isWindow = this.scrollElement === window;
  list.map(function (ele) {
    var href = ele.getAttribute('href');
    if (/^#./.test(href)) {
      var doc = document.documentElement;
      var rootEl = isWindow ? document : _this.scrollElement;
      var hrefEl = rootEl.querySelector('[id=\'' + href.slice(1) + '\']');
      var windowScrollTop = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
      var offset = isWindow ? hrefEl.getBoundingClientRect().top + windowScrollTop : hrefEl.offsetTop + _this.scrollElement.scrollTop;
      return [offset, href];
    } else {
      return null;
    }
  }).filter(function (item) {
    return item;
  }).sort(function (a, b) {
    return a[0] - b[0];
  }).forEach(function (item) {
    _this.offsets.push(item[0]);
    _this.targets.push(item[1]);
  });
  // console.log(this.offsets, this.targets)
};

ScrollSpy.prototype.process = function () {
  var isWindow = this.scrollElement === window;
  var scrollTop = (isWindow ? window.pageYOffset : this.scrollElement.scrollTop) + this.opts.offset;
  var scrollHeight = this.getScrollHeight();
  var scrollElementHeight = isWindow ? getViewportSize().height : this.scrollElement.getBoundingClientRect().height;
  var maxScroll = this.opts.offset + scrollHeight - scrollElementHeight;
  var offsets = this.offsets;
  var targets = this.targets;
  var activeTarget = this.activeTarget;
  var i = void 0;
  if (this.scrollHeight !== scrollHeight) {
    this.refresh();
  }
  if (scrollTop >= maxScroll) {
    return activeTarget !== (i = targets[targets.length - 1]) && this.activate(i);
  }
  if (activeTarget && scrollTop < offsets[0]) {
    this.activeTarget = null;
    return this.clear();
  }
  for (i = offsets.length; i--;) {
    activeTarget !== targets[i] && scrollTop >= offsets[i] && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1]) && this.activate(targets[i]);
  }
};

ScrollSpy.prototype.activate = function (target) {
  this.activeTarget = target;
  this.clear();
  var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
  var activeCallback = this.opts.callback;
  var active = nodeListToArray(this.el.querySelectorAll(selector));
  active.forEach(function (ele) {
    getParents(ele, 'li').forEach(function (item) {
      addClass(item, 'active');
      activeCallback(item);
    });
    if (getParents(ele, '.dropdown-menu').length) {
      addClass(getClosest(ele, 'li.dropdown'), 'active');
    }
  });
};

ScrollSpy.prototype.clear = function () {
  var _this2 = this;

  var list = nodeListToArray(this.el.querySelectorAll(this.selector));
  list.forEach(function (ele) {
    getParents(ele, '.active', _this2.opts.target).forEach(function (item) {
      removeClass(item, 'active');
    });
  });
};

var INSTANCE$2 = '_uiv_scrollspy_instance';
var events$1 = [EVENTS.RESIZE, EVENTS.SCROLL];

var bind$3 = function bind(el, binding) {
  // console.log('bind')
  unbind$3(el);
};

var inserted = function inserted(el, binding) {
  var scrollSpy = new ScrollSpy(el, binding.arg, binding.value);
  if (scrollSpy.scrollElement) {
    scrollSpy.handler = function () {
      scrollSpy.process();
    };
    events$1.forEach(function (event) {
      on(scrollSpy.scrollElement, event, scrollSpy.handler);
    });
  }
  el[INSTANCE$2] = scrollSpy;
};

var unbind$3 = function unbind(el) {
  // console.log('unbind')
  var instance = el[INSTANCE$2];
  if (instance && instance.scrollElement) {
    events$1.forEach(function (event) {
      off(instance.scrollElement, event, instance.handler);
    });
    delete el[INSTANCE$2];
  }
};

var update$3 = function update(el, binding) {
  // console.log('update')
  if (binding.value !== binding.oldValue) {
    bind$3(el, binding);
    inserted(el, binding);
  }
};

var scrollspy = { bind: bind$3, unbind: unbind$3, update: update$3, inserted: inserted };



var directives = Object.freeze({
	tooltip: tooltip,
	popover: popover,
	scrollspy: scrollspy
});

var TYPES = {
  ALERT: 0,
  CONFIRM: 1,
  PROMPT: 2
};

var MessageBox = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('modal', { ref: "modal", class: _vm.customClass, attrs: { "auto-focus": "", "size": _vm.size, "title": _vm.title, "header": !!_vm.title, "backdrop": _vm.closeOnBackdropClick, "cancel-text": _vm.cancelText, "ok-text": _vm.okText }, on: { "hide": _vm.cb }, model: { value: _vm.show, callback: function callback($$v) {
          _vm.show = $$v;
        }, expression: "show" } }, [_vm.html ? _c('div', { domProps: { "innerHTML": _vm._s(_vm.content) } }) : _c('p', [_vm._v(_vm._s(_vm.content))]), _vm._v(" "), _vm.type === _vm.TYPES.PROMPT ? _c('div', [_c('div', { staticClass: "form-group", class: { 'has-error': _vm.inputNotValid } }, [_vm.inputType === 'checkbox' ? _c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.input, expression: "input" }], ref: "input", staticClass: "form-control", attrs: { "required": "", "data-action": "auto-focus", "type": "checkbox" }, domProps: { "checked": Array.isArray(_vm.input) ? _vm._i(_vm.input, null) > -1 : _vm.input }, on: { "change": [function ($event) {
          var $$a = _vm.input,
              $$el = $event.target,
              $$c = $$el.checked ? true : false;if (Array.isArray($$a)) {
            var $$v = null,
                $$i = _vm._i($$a, $$v);if ($$el.checked) {
              $$i < 0 && (_vm.input = $$a.concat([$$v]));
            } else {
              $$i > -1 && (_vm.input = $$a.slice(0, $$i).concat($$a.slice($$i + 1)));
            }
          } else {
            _vm.input = $$c;
          }
        }, function ($event) {
          _vm.dirty = true;
        }], "keyup": function keyup($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
            return null;
          }return _vm.validate($event);
        } } }) : _vm.inputType === 'radio' ? _c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.input, expression: "input" }], ref: "input", staticClass: "form-control", attrs: { "required": "", "data-action": "auto-focus", "type": "radio" }, domProps: { "checked": _vm._q(_vm.input, null) }, on: { "change": [function ($event) {
          _vm.input = null;
        }, function ($event) {
          _vm.dirty = true;
        }], "keyup": function keyup($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
            return null;
          }return _vm.validate($event);
        } } }) : _c('input', { directives: [{ name: "model", rawName: "v-model", value: _vm.input, expression: "input" }], ref: "input", staticClass: "form-control", attrs: { "required": "", "data-action": "auto-focus", "type": _vm.inputType }, domProps: { "value": _vm.input }, on: { "change": function change($event) {
          _vm.dirty = true;
        }, "keyup": function keyup($event) {
          if (!$event.type.indexOf('key') && _vm._k($event.keyCode, "enter", 13, $event.key, "Enter")) {
            return null;
          }return _vm.validate($event);
        }, "input": function input($event) {
          if ($event.target.composing) {
            return;
          }_vm.input = $event.target.value;
        } } }), _vm._v(" "), _c('span', { directives: [{ name: "show", rawName: "v-show", value: _vm.inputNotValid, expression: "inputNotValid" }], staticClass: "help-block" }, [_vm._v(_vm._s(_vm.inputError))])])]) : _vm._e(), _vm._v(" "), _vm.type === _vm.TYPES.ALERT ? _c('template', { slot: "footer" }, [_c('btn', { attrs: { "type": _vm.okType, "data-action": _vm.autoFocus === 'ok' ? 'auto-focus' : '' }, domProps: { "textContent": _vm._s(_vm.okBtnText) }, on: { "click": function click($event) {
          return _vm.toggle(false, 'ok');
        } } })], 1) : _c('template', { slot: "footer" }, [_c('btn', { attrs: { "type": _vm.cancelType, "data-action": _vm.autoFocus === 'cancel' ? 'auto-focus' : '' }, domProps: { "textContent": _vm._s(_vm.cancelBtnText) }, on: { "click": function click($event) {
          return _vm.toggle(false, 'cancel');
        } } }), _vm._v(" "), _vm.type === _vm.TYPES.CONFIRM ? _c('btn', { attrs: { "type": _vm.okType, "data-action": _vm.autoFocus === 'ok' ? 'auto-focus' : '' }, domProps: { "textContent": _vm._s(_vm.okBtnText) }, on: { "click": function click($event) {
          return _vm.toggle(false, 'ok');
        } } }) : _c('btn', { attrs: { "type": _vm.okType }, domProps: { "textContent": _vm._s(_vm.okBtnText) }, on: { "click": _vm.validate } })], 1)], 2);
  }, staticRenderFns: [],
  mixins: [Local],
  components: { Modal: Modal, Btn: Btn },
  props: {
    backdrop: null,
    title: String,
    content: String,
    html: {
      type: Boolean,
      default: false
    },
    okText: String,
    okType: {
      type: String,
      default: 'primary'
    },
    cancelText: String,
    cancelType: {
      type: String,
      default: 'default'
    },
    type: {
      type: Number,
      default: TYPES.ALERT
    },
    size: {
      type: String,
      default: 'sm'
    },
    cb: {
      type: Function,
      required: true
    },
    validator: {
      type: Function,
      default: function _default() {
        return null;
      }
    },
    customClass: null,
    defaultValue: String,
    inputType: {
      type: String,
      default: 'text'
    },
    autoFocus: {
      type: String,
      default: 'ok'
    }
  },
  data: function data() {
    return {
      TYPES: TYPES,
      show: false,
      input: '',
      dirty: false
    };
  },
  mounted: function mounted() {
    if (this.defaultValue) {
      this.input = this.defaultValue;
    }
  },

  computed: {
    closeOnBackdropClick: function closeOnBackdropClick() {
      // use backdrop prop if exist
      // otherwise, only not available if render as alert
      return isExist(this.backdrop) ? Boolean(this.backdrop) : this.type !== TYPES.ALERT;
    },
    inputError: function inputError() {
      return this.validator(this.input);
    },
    inputNotValid: function inputNotValid() {
      return this.dirty && this.inputError;
    },
    okBtnText: function okBtnText() {
      return this.okText || this.t('uiv.modal.ok');
    },
    cancelBtnText: function cancelBtnText() {
      return this.cancelText || this.t('uiv.modal.cancel');
    }
  },
  methods: {
    toggle: function toggle(show, msg) {
      this.$refs.modal.toggle(show, msg);
    },
    validate: function validate() {
      this.dirty = true;
      if (!isExist(this.inputError)) {
        this.toggle(false, { value: this.input });
      }
    }
  }
};

var queue = [];

var destroy = function destroy(instance) {
  // console.log('destroyModal')
  removeFromDom(instance.$el);
  instance.$destroy();
  spliceIfExist(queue, instance);
};

// handel cancel or ok for confirm & prompt
var shallResolve = function shallResolve(type, msg) {
  if (type === TYPES.CONFIRM) {
    // is confirm
    return msg === 'ok';
  } else {
    // is prompt
    return isExist(msg) && isString(msg.value);
  }
};

var init = function init(type, options, _cb) {
  var resolve = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  var reject = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : null;

  var i18n = this.$i18n;
  var instance = new vue__WEBPACK_IMPORTED_MODULE_0___default.a({
    extends: MessageBox,
    i18n: i18n,
    propsData: _extends({
      type: type
    }, options, {
      cb: function cb(msg) {
        destroy(instance);
        if (isFunction(_cb)) {
          if (type === TYPES.CONFIRM) {
            shallResolve(type, msg) ? _cb(null, msg) : _cb(msg);
          } else if (type === TYPES.PROMPT) {
            shallResolve(type, msg) ? _cb(null, msg.value) : _cb(msg);
          } else {
            _cb(msg);
          }
        } else if (resolve && reject) {
          if (type === TYPES.CONFIRM) {
            shallResolve(type, msg) ? resolve(msg) : reject(msg);
          } else if (type === TYPES.PROMPT) {
            shallResolve(type, msg) ? resolve(msg.value) : reject(msg);
          } else {
            resolve(msg);
          }
        }
      }
    })
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  instance.show = true;
  queue.push(instance);
};

var initModal = function initModal(type) {
  var _this = this;

  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var cb = arguments[2];

  if (isPromiseSupported()) {
    return new Promise(function (resolve, reject) {
      init.apply(_this, [type, options, cb, resolve, reject]);
    });
  } else {
    init.apply(this, [type, options, cb]);
  }
};

var alert = function alert(options, cb) {
  return initModal.apply(this, [TYPES.ALERT, options, cb]);
};

var confirm = function confirm(options, cb) {
  return initModal.apply(this, [TYPES.CONFIRM, options, cb]);
};

var prompt = function prompt(options, cb) {
  return initModal.apply(this, [TYPES.PROMPT, options, cb]);
};

var messageBox = { alert: alert, confirm: confirm, prompt: prompt };

var TYPES$1 = {
  SUCCESS: 'success',
  INFO: 'info',
  DANGER: 'danger',
  WARNING: 'warning'
};

var PLACEMENTS$1 = {
  TOP_LEFT: 'top-left',
  TOP_RIGHT: 'top-right',
  BOTTOM_LEFT: 'bottom-left',
  BOTTOM_RIGHT: 'bottom-right'
};

var IN_CLASS$1 = 'in';
var ICON = 'glyphicon';
var WIDTH = 300;
var TRANSITION_DURATION = 300;

var Notification = { render: function render() {
    var _vm = this;var _h = _vm.$createElement;var _c = _vm._self._c || _h;return _c('alert', { staticClass: "fade", class: _vm.customClass, style: _vm.styles, attrs: { "type": _vm.type, "duration": _vm.duration, "dismissible": _vm.dismissible }, on: { "dismissed": _vm.onDismissed } }, [_c('div', { staticClass: "media", staticStyle: { "margin": "0" } }, [_vm.icons ? _c('div', { staticClass: "media-left" }, [_c('span', { class: _vm.icons, staticStyle: { "font-size": "1.5em" } })]) : _vm._e(), _vm._v(" "), _c('div', { staticClass: "media-body" }, [_vm.title ? _c('div', { staticClass: "media-heading" }, [_c('b', [_vm._v(_vm._s(_vm.title))])]) : _vm._e(), _vm._v(" "), _vm.html ? _c('div', { domProps: { "innerHTML": _vm._s(_vm.content) } }) : _c('div', [_vm._v(_vm._s(_vm.content))])])])]);
  }, staticRenderFns: [],
  components: { Alert: Alert },
  props: {
    title: String,
    content: String,
    html: {
      type: Boolean,
      default: false
    },
    duration: {
      type: Number,
      default: 5000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    type: String,
    placement: String,
    icon: String,
    customClass: null,
    cb: {
      type: Function,
      required: true
    },
    queue: {
      type: Array,
      required: true
    },
    offsetY: {
      type: Number,
      default: 15
    },
    offsetX: {
      type: Number,
      default: 15
    },
    offset: {
      type: Number,
      default: 15
    }
  },
  data: function data() {
    return {
      height: 0,
      top: 0,
      horizontal: this.placement === PLACEMENTS$1.TOP_LEFT || this.placement === PLACEMENTS$1.BOTTOM_LEFT ? 'left' : 'right',
      vertical: this.placement === PLACEMENTS$1.TOP_LEFT || this.placement === PLACEMENTS$1.TOP_RIGHT ? 'top' : 'bottom'
    };
  },
  created: function created() {
    // get prev notifications total height in the queue
    this.top = this.getTotalHeightOfQueue(this.queue);
  },
  mounted: function mounted() {
    var _this = this;

    var el = this.$el;
    el.style[this.vertical] = this.top + 'px';
    this.$nextTick(function () {
      el.style[_this.horizontal] = '-' + WIDTH + 'px';
      _this.height = el.offsetHeight;
      el.style[_this.horizontal] = _this.offsetX + 'px';
      addClass(el, IN_CLASS$1);
    });
  },

  computed: {
    styles: function styles() {
      var _ref;

      var queue = this.queue;
      var thisIndex = queue.indexOf(this);
      return _ref = {
        position: 'fixed'
      }, defineProperty(_ref, this.vertical, this.getTotalHeightOfQueue(queue, thisIndex) + 'px'), defineProperty(_ref, 'width', WIDTH + 'px'), defineProperty(_ref, 'transition', 'all ' + TRANSITION_DURATION / 1000 + 's ease-in-out'), _ref;
    },
    icons: function icons() {
      if (isString(this.icon)) {
        return this.icon;
      }
      switch (this.type) {
        case TYPES$1.INFO:
        case TYPES$1.WARNING:
          return ICON + ' ' + ICON + '-info-sign';
        case TYPES$1.SUCCESS:
          return ICON + ' ' + ICON + '-ok-sign';
        case TYPES$1.DANGER:
          return ICON + ' ' + ICON + '-remove-sign';
        default:
          return null;
      }
    }
  },
  methods: {
    getTotalHeightOfQueue: function getTotalHeightOfQueue(queue) {
      var lastIndex = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : queue.length;

      var totalHeight = this.offsetY;
      for (var i = 0; i < lastIndex; i++) {
        totalHeight += queue[i].height + this.offset;
      }
      return totalHeight;
    },
    onDismissed: function onDismissed() {
      removeClass(this.$el, IN_CLASS$1);
      setTimeout(this.cb, TRANSITION_DURATION);
    }
  }
};

var _queues;

var queues = (_queues = {}, defineProperty(_queues, PLACEMENTS$1.TOP_LEFT, []), defineProperty(_queues, PLACEMENTS$1.TOP_RIGHT, []), defineProperty(_queues, PLACEMENTS$1.BOTTOM_LEFT, []), defineProperty(_queues, PLACEMENTS$1.BOTTOM_RIGHT, []), _queues);

var destroy$1 = function destroy(queue, instance) {
  // console.log('destroyNotification')
  removeFromDom(instance.$el);
  instance.$destroy();
  spliceIfExist(queue, instance);
};

var init$1 = function init(options, _cb) {
  var resolve = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var reject = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var placement = options.placement;
  var queue = queues[placement];
  // check if placement is valid
  if (!isExist(queue)) {
    return;
  }
  var instance = new vue__WEBPACK_IMPORTED_MODULE_0___default.a({
    extends: Notification,
    propsData: _extends({
      queue: queue,
      placement: placement
    }, options, {
      cb: function cb(msg) {
        destroy$1(queue, instance);
        if (isFunction(_cb)) {
          _cb(msg);
        } else if (resolve && reject) {
          resolve(msg);
        }
      }
    })
  });
  instance.$mount();
  document.body.appendChild(instance.$el);
  queue.push(instance);
};

var notify = function notify() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var cb = arguments[1];

  // simplify usage: pass string as option.content
  if (isString(options)) {
    options = {
      content: options
    };
  }
  // set default placement as top-right
  if (!isExist(options.placement)) {
    options.placement = PLACEMENTS$1.TOP_RIGHT;
  }
  if (isPromiseSupported()) {
    return new Promise(function (resolve, reject) {
      init$1(options, cb, resolve, reject);
    });
  } else {
    init$1(options, cb);
  }
};

var notification = { notify: notify };



var services = Object.freeze({
	MessageBox: messageBox,
	Notification: notification
});

var install = function install(Vue$$1) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  // Setup language, en-US for default
  locale.use(options.locale);
  locale.i18n(options.i18n);
  // Register components
  Object.keys(components).forEach(function (key) {
    var _key = options.prefix ? options.prefix + key : key;
    Vue$$1.component(_key, components[key]);
  });
  // Register directives
  Object.keys(directives).forEach(function (key) {
    var _key = options.prefix ? options.prefix + '-' + key : key;
    Vue$$1.directive(_key, directives[key]);
  });
  // Register services
  Object.keys(services).forEach(function (key) {
    var service = services[key];
    Object.keys(service).forEach(function (serviceKey) {
      var _key = options.prefix ? options.prefix + '_' + serviceKey : serviceKey;
      Vue$$1.prototype['$' + _key] = service[serviceKey];
    });
  });
};


//# sourceMappingURL=uiv.esm.js.map


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ((function (x) { return x.default || x })(__webpack_require__(/*! ./autocompleteImpl.js */ "./node_modules/vue2-google-maps/dist/components/autocompleteImpl.js")));


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ((function (x) { return x.default || x })(__webpack_require__(/*! ./infoWindowImpl.js */ "./node_modules/vue2-google-maps/dist/components/infoWindowImpl.js")));


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=script&lang=js&":
/*!******************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=script&lang=js& ***!
  \******************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ((function (x) { return x.default || x })(__webpack_require__(/*! ./mapImpl.js */ "./node_modules/vue2-google-maps/dist/components/mapImpl.js")));


/***/ }),

/***/ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=script&lang=js&":
/*!*********************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=script&lang=js& ***!
  \*********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ((function (x) { return x.default || x })(__webpack_require__(/*! ./streetViewPanoramaImpl.js */ "./node_modules/vue2-google-maps/dist/components/streetViewPanoramaImpl.js")));


/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=template&id=2c922d06&":
/*!*************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=template&id=2c922d06& ***!
  \*************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "input",
    _vm._g(_vm._b({ ref: "input" }, "input", _vm.$attrs, false), _vm.$listeners)
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=template&id=17fc7ddc&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=template&id=17fc7ddc& ***!
  \***********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", [_c("div", { ref: "flyaway" }, [_vm._t("default")], 2)])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=template&id=85ca06a4&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=template&id=85ca06a4& ***!
  \****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "vue-map-container" },
    [
      _c("div", { ref: "vue-map", staticClass: "vue-map" }),
      _vm._v(" "),
      _c("div", { staticClass: "vue-map-hidden" }, [_vm._t("default")], 2),
      _vm._v(" "),
      _vm._t("visible")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/placeInput.vue?vue&type=template&id=c1ab87be&":
/*!***********************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/placeInput.vue?vue&type=template&id=c1ab87be& ***!
  \***********************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("label", [
    _c("span", { domProps: { textContent: _vm._s(_vm.label) } }),
    _vm._v(" "),
    _c("input", {
      ref: "input",
      class: _vm.className,
      attrs: { type: "text", placeholder: _vm.placeholder }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=template&id=ed35740a&":
/*!*******************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=template&id=ed35740a& ***!
  \*******************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "vue-street-view-pano-container" },
    [
      _c("div", {
        ref: "vue-street-view-pano",
        staticClass: "vue-street-view-pano"
      }),
      _vm._v(" "),
      _vm._t("default")
    ],
    2
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true&":
/*!*********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true& ***!
  \*********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c("br"),
      _vm._v(" "),
      _c(
        "gmap-map",
        {
          staticStyle: { width: "100%", height: "400px" },
          attrs: { center: _vm.center, zoom: 12 }
        },
        _vm._l(_vm.markers, function(m, index) {
          return _c("gmap-marker", {
            key: index,
            attrs: { position: m.position },
            on: {
              click: function($event) {
                _vm.center = m.position
              }
            }
          })
        }),
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=template&id=04509bdb&scoped=true&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/IconBase.vue?vue&type=template&id=04509bdb&scoped=true& ***!
  \********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "svg",
    {
      attrs: {
        xmlns: "http://www.w3.org/2000/svg",
        width: _vm.width,
        height: _vm.height,
        viewBox: "0 0 1920 1080",
        "aria-labelledby": _vm.iconName,
        role: "presentation"
      }
    },
    [
      _c("title", { attrs: { id: _vm.iconName, lang: "en" } }, [
        _vm._v(_vm._s(_vm.iconName) + " icon")
      ]),
      _vm._v(" "),
      _c("g", { attrs: { fill: _vm.iconColor } }, [_vm._t("default")], 2)
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true&":
/*!*****************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true& ***!
  \*****************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "leaseplanButton", on: { click: _vm.onClick } },
    [
      _c("div", [_vm._v(_vm._s(_vm.text))]),
      _vm._v(" "),
      _c(
        "span",
        [
          _c(
            "IconBase",
            { attrs: { "icon-name": "location" } },
            [_c(_vm.child_component, { tag: "Location" })],
            1
          )
        ],
        1
      )
    ]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/start.vue?vue&type=template&id=5266bd5a&scoped=true&":
/*!*************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/buttons/start.vue?vue&type=template&id=5266bd5a&scoped=true& ***!
  \*************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "startRouteBtn", on: { click: _vm.onStartRoute } },
    [_c("div", [_vm._v(_vm._s(_vm.text))])]
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/icons/Location.vue?vue&type=template&id=b60b958a&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/icons/Location.vue?vue&type=template&id=b60b958a& ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("g", { attrs: { fill: "#231F20" } }, [
    _c("path", {
      staticClass: "active-path",
      attrs: {
        d:
          "m313.9,376.7c41.3-68.5 93.5-164.8 93.5-214.3 0-83.5-67.9-151.4-151.4-151.4-83.5,0-151.4,67.9-151.4,151.4 0,49.5 52.2,145.8 93.5,214.3-49,3.7-160.5,17-160.5,61.1 0,43.4 113.2,63.2 218.5,63.2 105.2,0 218.5-19.8 218.5-63.2-0.1-44.1-111.7-57.4-160.7-61.1zm-188.4-214.3c0-72 58.6-130.6 130.5-130.6 72,0 130.6,58.6 130.6,130.6 0,62.9-100.2,220.7-130.6,267.1-30.4-46.4-130.5-204.2-130.5-267.1zm130.5,317.7c-127.9,0-197.6-28-197.6-42.4 0-11.1 46-35 152-41.1 19.9,32.1 35,54.8 37,57.5 2.7,3.6 10.6,7.9 17.3,0 2.1-2.5 17.1-25.4 37-57.5 106,6.1 152,29.9 152,41.1-0.1,14.5-69.8,42.4-197.7,42.4z",
        "data-original": "#000000",
        "data-old_color": "#EEEAEA",
        fill: "#FFFFFF"
      }
    }),
    _vm._v(" "),
    _c("path", {
      staticClass: "active-path",
      attrs: {
        d:
          "m321.9,162.4c0-36.4-29.5-65.9-65.9-65.9-36.4,0-65.9,29.5-65.9,65.9 0,36.4 29.5,65.9 65.9,65.9 36.4,0 65.9-29.5 65.9-65.9zm-111,0c0-24.9 20.2-45.1 45.1-45.1s45.1,20.2 45.1,45.1c0,24.9-20.2,45.1-45.1,45.1s-45.1-20.2-45.1-45.1z",
        "data-original": "#000000",
        "data-old_color": "#EEEAEA",
        fill: "#FFFFFF"
      }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/icons/Logo.vue?vue&type=template&id=4d15519e&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/icons/Logo.vue?vue&type=template&id=4d15519e& ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("g", [
    _c("path", {
      staticStyle: { fill: "#3FA9F5" },
      attrs: {
        id: "ql",
        d:
          "M201.14,381.67c-10.51,0-15.18-1.17-18.1-8.76c8.17-15.18,12.27-34.45,12.27-57.23V103.13\n\tc0-65.39-34.45-102.77-97.52-102.77c-63.06,0-97.52,37.37-97.52,102.77v265.48c12.82,21.91,32.66,36.96,58.98,44.26\n\tc12.14,3.39,25.66,5.12,40.5,5.12c6.23,0,12.27-0.33,18.08-0.96c9.04-1.29,17.39-3.43,24.92-6.17c0.22,0.43,0.44,0.86,0.68,1.29\n\tc0.5,0.93,1.03,1.84,1.59,2.73c8.48,13.59,23.44,22.16,45.56,23.75c0.01,0,0.01,0,0.01,0c2.46,0.18,5.01,0.26,7.64,0.26h8.76v-57.22\n\tH201.14z M131.06,319.77c0,29.2-12.84,40.29-33.29,40.29c-20.44,0-33.28-11.09-33.28-40.29V99.04c0-29.19,12.84-40.29,33.28-40.29\n\tc20.44,0,33.29,11.1,33.29,40.29V319.77z M64.5,426.12c-1.78-0.25-3.53-0.53-5.26-0.83c-24.66-4.34-46.05-14.95-58.98-34.81v324.74\n\th193.29v-58.39H64.5V426.12z"
      }
    }),
    _vm._v(" "),
    _c("g", { attrs: { id: "uick" } }, [
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M281.47,107.3v228.36c0,21.14,9.3,28.76,24.1,28.76c14.8,0,24.1-7.61,24.1-28.76V107.3h43.98v225.4\n\t\tc0,47.36-23.68,74.43-69.35,74.43c-45.67,0-69.35-27.06-69.35-74.43V107.3H281.47z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: { d: "M405.37,107.3h46.52v296.02h-46.52V107.3z" }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M620.61,292.95v39.33c0,47.36-23.68,74.43-69.35,74.43s-69.35-27.06-69.35-74.43V178.35\n\t\tc0-47.36,23.68-74.43,69.35-74.43s69.35,27.06,69.35,74.43v28.76h-43.98v-31.72c0-21.14-9.3-29.18-24.1-29.18\n\t\ts-24.1,8.03-24.1,29.18v159.85c0,21.14,9.3,28.76,24.1,28.76s24.1-7.61,24.1-28.76v-42.29H620.61z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M709.83,285.34l-14.38,27.06v90.92h-46.52V107.3h46.52v128.13h0.85l60.05-128.13h46.52l-64.7,131.94\n\t\tl64.7,164.08h-47.79L709.83,285.34z"
        }
      })
    ]),
    _vm._v(" "),
    _c("g", { attrs: { id: "ease" } }, [
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M279.65,558.15h59.01v39.08h-59.01v80.12h74.26v39.08H236.66V442.86h117.25v39.08h-74.26V558.15z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M519.61,716.43h-43.38l-7.43-49.63h-52.76l-7.43,49.63h-39.47l43.77-273.58h62.92L519.61,716.43z\n\t\t M421.52,629.67h41.43l-20.32-138.35h-0.78L421.52,629.67z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M597.38,439.73c41.82,0,63.31,25.01,63.31,68.79v8.6h-40.65v-11.33c0-19.54-7.82-26.97-21.5-26.97\n\t\ts-21.5,7.43-21.5,26.97c0,19.93,8.6,34.78,36.74,59.4c35.96,31.66,47.29,54.33,47.29,85.59c0,43.77-21.89,68.79-64.09,68.79\n\t\ts-64.09-25.01-64.09-68.79v-16.81h40.65v19.54c0,19.54,8.6,26.58,22.28,26.58s22.28-7.04,22.28-26.58\n\t\tc0-19.93-8.6-34.78-36.74-59.41c-35.96-31.66-47.29-54.32-47.29-85.59C534.07,464.74,555.57,439.73,597.38,439.73z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#3FA9F5" },
        attrs: {
          d:
            "M728.7,558.15h59.01v39.08H728.7v80.12h74.26v39.08H685.71V442.86h117.25v39.08H728.7V558.15z"
        }
      })
    ]),
    _vm._v(" "),
    _c("g", { staticStyle: {}, attrs: { id: "fleet" } }, [
      _c("path", {
        staticStyle: { fill: "#FF931E" },
        attrs: {
          d:
            "M399.3,806.24h35.38v24.91H399.3v72h-27.4V728.76h72.5v24.91H399.3V806.24z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#FF931E" },
        attrs: { d: "M457.59,728.76H485v149.48h45.09v24.91h-72.5V728.76z" }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#FF931E" },
        attrs: {
          d:
            "M569.45,802.25h37.62v24.91h-37.62v51.07h47.33v24.91h-74.74V728.76h74.74v24.91h-47.33V802.25z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#FF931E" },
        attrs: {
          d:
            "M661.12,802.25h37.62v24.91h-37.62v51.07h47.33v24.91h-74.74V728.76h74.74v24.91h-47.33V802.25z"
        }
      }),
      _vm._v(" "),
      _c("path", {
        staticStyle: { fill: "#FF931E" },
        attrs: {
          d:
            "M717.42,728.76h84.7v24.91h-28.65v149.48h-27.4V753.67h-28.65V728.76z"
        }
      })
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/icons/bicycle.vue?vue&type=template&id=e1512dee&":
/*!*************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/icons/bicycle.vue?vue&type=template&id=e1512dee& ***!
  \*************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("g", [
    _c("path", {
      staticClass: "active-path",
      attrs: {
        d:
          "M379.876,182.566c-12.402,0-24.269,2.328-35.194,6.561l-35.573-75.513l28.007,0.001c6.052,0,10.977,4.925,10.977,10.979   v1.064c0,6.054-4.924,10.979-10.977,10.979c-3.866,0-7,3.134-7,7c0,3.866,3.134,7,7,7c13.772,0,24.977-11.206,24.977-24.979v-1.064   c0-13.773-11.205-24.979-24.977-24.979l-38.952,0.007c-0.051,0,0.051-0.001,0,0c-1.03-0.015-2.079,0.191-3.074,0.66   c-3.497,1.647-4.997,5.818-3.349,9.316l14.358,30.477h-127.42l-11.899-26.46h7.857c3.866,0,7-3.134,7-7s-3.134-7-7-7l-38.801-0.001   c-3.866,0-7,3.134-7,7s3.134,7,7,7l15.593,0l13.833,30.761c-0.256,0.315-0.493,0.652-0.697,1.02l-25.694,46.282   c-12.519-5.841-26.468-9.112-41.17-9.112C43.828,182.566,0,226.392,0,280.262c0,53.868,43.828,97.693,97.701,97.693h0.002   c53.869,0,97.694-43.825,97.694-97.693c0-34.177-17.644-64.305-44.297-81.77l21.269-38.311l43.576,96.903   c-9.379,5.935-15.626,16.394-15.626,28.29c0,18.449,15.011,33.459,33.463,33.459c18.448,0,33.456-15.01,33.456-33.459   c0-8.389-3.109-16.06-8.227-21.939l65.641-83.976l7.374,15.653c-29.727,16.771-49.848,48.652-49.848,85.149   c0,53.869,43.827,97.694,97.698,97.694c53.869,0,97.695-43.826,97.695-97.694C477.571,226.392,433.745,182.566,379.876,182.566z    M181.396,280.262c0,46.148-37.545,83.693-83.694,83.693h-0.002C51.548,363.956,14,326.411,14,280.262   c0-46.15,37.548-83.696,83.701-83.696c12.237,0,23.858,2.662,34.346,7.402l-31.207,56.212c-1.026-0.16-2.07-0.268-3.141-0.268   c-11.22,0-20.349,9.129-20.349,20.35c0,11.219,9.128,20.347,20.349,20.347c11.221,0,20.349-9.127,20.349-20.347   c0-5.078-1.882-9.716-4.969-13.285l31.206-56.212C166.651,225.806,181.396,251.343,181.396,280.262z M233.782,304.833   c-10.732,0-19.463-8.729-19.463-19.459c0-10.731,8.731-19.461,19.463-19.461c10.728,0,19.456,8.73,19.456,19.461   C253.238,296.104,244.51,304.833,233.782,304.833z M247.823,255.014c-4.273-1.984-9.028-3.101-14.042-3.101   c-1.583,0-3.138,0.118-4.663,0.332l-44.145-98.17h127.72l5.276,11.2L247.823,255.014z M379.876,363.957   c-46.151,0-83.698-37.545-83.698-83.694c0-30.907,16.853-57.935,41.839-72.431l27.39,58.141c-3.633,3.678-5.882,8.724-5.882,14.29   c0,11.219,9.129,20.347,20.35,20.347c11.22,0,20.348-9.127,20.348-20.347c0-11.221-9.128-20.35-20.348-20.35   c-0.608,0-1.208,0.039-1.803,0.092l-27.403-58.17c9.099-3.399,18.938-5.268,29.208-5.268c46.15,0,83.695,37.546,83.695,83.696   C463.571,326.412,426.026,363.957,379.876,363.957z",
        "data-original": "#000000",
        "data-old_color": "#FFF4F4",
        fill: "#FFFFFF"
      }
    }),
    _vm._v(" "),
    _c("path", {
      staticClass: "active-path",
      attrs: {
        d:
          "M233.779,275.48c-5.455,0-9.892,4.438-9.892,9.893c0,5.454,4.438,9.892,9.892,9.892c5.454,0,9.892-4.438,9.892-9.892   C243.671,279.918,239.234,275.48,233.779,275.48z",
        "data-original": "#000000",
        "data-old_color": "#FFF4F4",
        fill: "#FFFFFF"
      }
    })
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=template&id=11c1c004&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/components/locations_holder.vue?vue&type=template&id=11c1c004&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "locations_holder" })
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=template&id=e1aead0a&scoped=true&":
/*!*******************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/dashboard.vue?vue&type=template&id=e1aead0a&scoped=true& ***!
  \*******************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("section", [
    _c("div", { staticClass: "container" }, [
      _vm._m(0),
      _vm._v(" "),
      _c("div", { staticClass: "row" }, [
        _c("div", { staticClass: "col-sm-6 remove-padding" }, [
          _c("div", { staticClass: "row" }, [
            _c(
              "div",
              { staticClass: "col-sm-12 col-md-12 col-lg-12" },
              [_c("start")],
              1
            )
          ]),
          _vm._v(" "),
          _c("div", { staticClass: "row margin-top-30" }, [
            _c(
              "div",
              { staticClass: "col-sm-12 col-md-12 col-lg-12 remove-padding" },
              [
                _c("leaseplanButtonOrange", {
                  staticClass: "leaseplanButtonLeft",
                  attrs: {
                    width: "90",
                    height: "90",
                    text: "Locatie",
                    iconName: "Location"
                  }
                }),
                _vm._v(" "),
                _c("leaseplanButtonOrange", {
                  attrs: {
                    width: "90",
                    height: "90",
                    text: "Onderhoud",
                    iconName: "bicycle"
                  }
                })
              ],
              1
            )
          ])
        ]),
        _vm._v(" "),
        _c("div", { staticClass: "col-sm-1" }),
        _vm._v(" "),
        _c("div", { staticClass: "col-sm-5" }, [_c("loactions_holder")], 1)
      ])
    ]),
    _vm._v(" "),
    _c("div", { staticClass: "google-map" }, [_c("google-map")], 1)
  ])
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", { staticClass: "row" }, [
      _c("div", { staticClass: "col-sm-12 col-md-12 col-lg-12" }, [
        _c("div", { staticClass: "header" })
      ])
    ])
  }
]
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=template&id=780e8960&scoped=true&":
/*!***************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/login.vue?vue&type=template&id=780e8960&scoped=true& ***!
  \***************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c("div", { staticClass: "background" }, [
    _c("div", { staticClass: "container" }, [
      _c("div", { staticClass: "circle" }),
      _vm._v(" "),
      _c(
        "div",
        { staticClass: "logo" },
        [
          _c(
            "IconBase",
            {
              attrs: {
                x: "0px",
                y: "0px",
                width: "100%",
                height: "100%",
                viewBox: "0 0 803 903",
                icon: "Logo"
              }
            },
            [_c("Logo", { staticClass: "logosvg" })],
            1
          )
        ],
        1
      )
    ])
  ])
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return normalizeComponent; });
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}


/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/autocomplete.vue":
/*!************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/autocomplete.vue ***!
  \************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _autocomplete_vue_vue_type_template_id_2c922d06___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./autocomplete.vue?vue&type=template&id=2c922d06& */ "./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=template&id=2c922d06&");
/* harmony import */ var _autocomplete_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./autocomplete.vue?vue&type=script&lang=js& */ "./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _autocomplete_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _autocomplete_vue_vue_type_template_id_2c922d06___WEBPACK_IMPORTED_MODULE_0__["render"],
  _autocomplete_vue_vue_type_template_id_2c922d06___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue2-google-maps/dist/components/autocomplete.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=script&lang=js&":
/*!*************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=script&lang=js& ***!
  \*************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_autocomplete_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./autocomplete.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_autocomplete_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=template&id=2c922d06&":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=template&id=2c922d06& ***!
  \*******************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_autocomplete_vue_vue_type_template_id_2c922d06___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./autocomplete.vue?vue&type=template&id=2c922d06& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/autocomplete.vue?vue&type=template&id=2c922d06&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_autocomplete_vue_vue_type_template_id_2c922d06___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_autocomplete_vue_vue_type_template_id_2c922d06___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/autocompleteImpl.js":
/*!***************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/autocompleteImpl.js ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bindProps = __webpack_require__(/*! ../utils/bindProps.js */ "./node_modules/vue2-google-maps/dist/utils/bindProps.js");

var _simulateArrowDown = __webpack_require__(/*! ../utils/simulateArrowDown.js */ "./node_modules/vue2-google-maps/dist/utils/simulateArrowDown.js");

var _simulateArrowDown2 = _interopRequireDefault(_simulateArrowDown);

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mappedProps = {
  bounds: {
    type: Object
  },
  componentRestrictions: {
    type: Object,
    // Do not bind -- must check for undefined
    // in the property
    noBind: true
  },
  types: {
    type: Array,
    default: function _default() {
      return [];
    }
  }
};

var props = {
  selectFirstOnEnter: {
    required: false,
    type: Boolean,
    default: false
  },
  options: {
    type: Object
  }
};

exports.default = {
  mounted: function mounted() {
    var _this = this;

    this.$gmapApiPromiseLazy().then(function () {
      if (_this.selectFirstOnEnter) {
        (0, _simulateArrowDown2.default)(_this.$refs.input);
      }

      if (typeof google.maps.places.Autocomplete !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?');
      }

      /* eslint-disable no-unused-vars */
      var finalOptions = _extends({}, (0, _bindProps.getPropsValues)(_this, mappedProps), _this.options);

      _this.$autocomplete = new google.maps.places.Autocomplete(_this.$refs.input, finalOptions);
      (0, _bindProps.bindProps)(_this, _this.$autocomplete, mappedProps);

      _this.$watch('componentRestrictions', function (v) {
        if (v !== undefined) {
          _this.$autocomplete.setComponentRestrictions(v);
        }
      });

      // Not using `bindEvents` because we also want
      // to return the result of `getPlace()`
      _this.$autocomplete.addListener('place_changed', function () {
        _this.$emit('place_changed', _this.$autocomplete.getPlace());
      });
    });
  },

  props: _extends({}, (0, _mapElementFactory.mappedPropsToVueProps)(mappedProps), props)
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/circle.js":
/*!*****************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/circle.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  center: {
    type: Object,
    twoWay: true,
    required: true
  },
  radius: {
    type: Number,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    twoWay: false
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  name: 'circle',
  ctr: function ctr() {
    return google.maps.Circle;
  },
  events: events
});

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/infoWindow.vue":
/*!**********************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/infoWindow.vue ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _infoWindow_vue_vue_type_template_id_17fc7ddc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./infoWindow.vue?vue&type=template&id=17fc7ddc& */ "./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=template&id=17fc7ddc&");
/* harmony import */ var _infoWindow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./infoWindow.vue?vue&type=script&lang=js& */ "./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _infoWindow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _infoWindow_vue_vue_type_template_id_17fc7ddc___WEBPACK_IMPORTED_MODULE_0__["render"],
  _infoWindow_vue_vue_type_template_id_17fc7ddc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue2-google-maps/dist/components/infoWindow.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=script&lang=js&":
/*!***********************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=script&lang=js& ***!
  \***********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_infoWindow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./infoWindow.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_infoWindow_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=template&id=17fc7ddc&":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=template&id=17fc7ddc& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_infoWindow_vue_vue_type_template_id_17fc7ddc___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./infoWindow.vue?vue&type=template&id=17fc7ddc& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/infoWindow.vue?vue&type=template&id=17fc7ddc&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_infoWindow_vue_vue_type_template_id_17fc7ddc___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_infoWindow_vue_vue_type_template_id_17fc7ddc___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/infoWindowImpl.js":
/*!*************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/infoWindowImpl.js ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  options: {
    type: Object,
    required: false,
    default: function _default() {
      return {};
    }
  },
  position: {
    type: Object,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  }
};

var events = ['domready', 'closeclick', 'content_changed'];

exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  events: events,
  name: 'infoWindow',
  ctr: function ctr() {
    return google.maps.InfoWindow;
  },
  props: {
    opened: {
      type: Boolean,
      default: true
    }
  },

  inject: {
    '$markerPromise': {
      default: null
    }
  },

  mounted: function mounted() {
    var el = this.$refs.flyaway;
    el.parentNode.removeChild(el);
  },
  beforeCreate: function beforeCreate(options) {
    var _this = this;

    options.content = this.$refs.flyaway;

    if (this.$markerPromise) {
      delete options.position;
      return this.$markerPromise.then(function (mo) {
        _this.$markerObject = mo;
        return mo;
      });
    }
  },


  methods: {
    _openInfoWindow: function _openInfoWindow() {
      if (this.opened) {
        if (this.$markerObject !== null) {
          this.$infoWindowObject.open(this.$map, this.$markerObject);
        } else {
          this.$infoWindowObject.open(this.$map);
        }
      } else {
        this.$infoWindowObject.close();
      }
    }
  },

  afterCreate: function afterCreate() {
    var _this2 = this;

    this._openInfoWindow();
    this.$watch('opened', function () {
      _this2._openInfoWindow();
    });
  }
});

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/map.vue":
/*!***************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/map.vue ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _map_vue_vue_type_template_id_85ca06a4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./map.vue?vue&type=template&id=85ca06a4& */ "./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=template&id=85ca06a4&");
/* harmony import */ var _map_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./map.vue?vue&type=script&lang=js& */ "./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./map.vue?vue&type=style&index=0&lang=css& */ "./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _map_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _map_vue_vue_type_template_id_85ca06a4___WEBPACK_IMPORTED_MODULE_0__["render"],
  _map_vue_vue_type_template_id_85ca06a4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue2-google-maps/dist/components/map.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=script&lang=js&":
/*!****************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./map.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css&":
/*!************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css& ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader!../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./map.vue?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=template&id=85ca06a4&":
/*!**********************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=template&id=85ca06a4& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_template_id_85ca06a4___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./map.vue?vue&type=template&id=85ca06a4& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/map.vue?vue&type=template&id=85ca06a4&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_template_id_85ca06a4___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_map_vue_vue_type_template_id_85ca06a4___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js":
/*!****************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/mapElementFactory.js ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = function (options) {
  var mappedProps = options.mappedProps,
      name = options.name,
      ctr = options.ctr,
      ctrArgs = options.ctrArgs,
      events = options.events,
      beforeCreate = options.beforeCreate,
      afterCreate = options.afterCreate,
      props = options.props,
      rest = _objectWithoutProperties(options, ['mappedProps', 'name', 'ctr', 'ctrArgs', 'events', 'beforeCreate', 'afterCreate', 'props']);

  var promiseName = '$' + name + 'Promise';
  var instanceName = '$' + name + 'Object';

  assert(!(rest.props instanceof Array), '`props` should be an object, not Array');

  return _extends({}, typeof GENERATE_DOC !== 'undefined' ? { $vgmOptions: options } : {}, {
    mixins: [_mapElementMixin2.default],
    props: _extends({}, props, mappedPropsToVueProps(mappedProps)),
    render: function render() {
      return '';
    },
    provide: function provide() {
      var _this = this;

      var promise = this.$mapPromise.then(function (map) {
        // Infowindow needs this to be immediately available
        _this.$map = map;

        // Initialize the maps with the given options
        var options = _extends({}, _this.options, {
          map: map
        }, (0, _bindProps.getPropsValues)(_this, mappedProps));
        delete options.options; // delete the extra options

        if (beforeCreate) {
          var result = beforeCreate.bind(_this)(options);

          if (result instanceof Promise) {
            return result.then(function () {
              return { options: options };
            });
          }
        }
        return { options: options };
      }).then(function (_ref) {
        var _Function$prototype$b;

        var options = _ref.options;

        var ConstructorObject = ctr();
        // https://stackoverflow.com/questions/1606797/use-of-apply-with-new-operator-is-this-possible
        _this[instanceName] = ctrArgs ? new ((_Function$prototype$b = Function.prototype.bind).call.apply(_Function$prototype$b, [ConstructorObject, null].concat(_toConsumableArray(ctrArgs(options, (0, _bindProps.getPropsValues)(_this, props || {}))))))() : new ConstructorObject(options);

        (0, _bindProps.bindProps)(_this, _this[instanceName], mappedProps);
        (0, _bindEvents2.default)(_this, _this[instanceName], events);

        if (afterCreate) {
          afterCreate.bind(_this)(_this[instanceName]);
        }
        return _this[instanceName];
      });
      this[promiseName] = promise;
      return _defineProperty({}, promiseName, promise);
    },
    destroyed: function destroyed() {
      // Note: not all Google Maps components support maps
      if (this[instanceName] && this[instanceName].setMap) {
        this[instanceName].setMap(null);
      }
    }
  }, rest);
};

exports.mappedPropsToVueProps = mappedPropsToVueProps;

var _bindEvents = __webpack_require__(/*! ../utils/bindEvents.js */ "./node_modules/vue2-google-maps/dist/utils/bindEvents.js");

var _bindEvents2 = _interopRequireDefault(_bindEvents);

var _bindProps = __webpack_require__(/*! ../utils/bindProps.js */ "./node_modules/vue2-google-maps/dist/utils/bindProps.js");

var _mapElementMixin = __webpack_require__(/*! ./mapElementMixin */ "./node_modules/vue2-google-maps/dist/components/mapElementMixin.js");

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 *
 * @param {Object} options
 * @param {Object} options.mappedProps - Definitions of props
 * @param {Object} options.mappedProps.PROP.type - Value type
 * @param {Boolean} options.mappedProps.PROP.twoWay
 *  - Whether the prop has a corresponding PROP_changed
 *   event
 * @param {Boolean} options.mappedProps.PROP.noBind
 *  - If true, do not apply the default bindProps / bindEvents.
 * However it will still be added to the list of component props
 * @param {Object} options.props - Regular Vue-style props.
 *  Note: must be in the Object form because it will be
 *  merged with the `mappedProps`
 *
 * @param {Object} options.events - Google Maps API events
 *  that are not bound to a corresponding prop
 * @param {String} options.name - e.g. `polyline`
 * @param {=> String} options.ctr - constructor, e.g.
 *  `google.maps.Polyline`. However, since this is not
 *  generally available during library load, this becomes
 *  a function instead, e.g. () => google.maps.Polyline
 *  which will be called only after the API has been loaded
 * @param {(MappedProps, OtherVueProps) => Array} options.ctrArgs -
 *   If the constructor in `ctr` needs to be called with
 *   arguments other than a single `options` object, e.g. for
 *   GroundOverlay, we call `new GroundOverlay(url, bounds, options)`
 *   then pass in a function that returns the argument list as an array
 *
 * Otherwise, the constructor will be called with an `options` object,
 *   with property and values merged from:
 *
 *   1. the `options` property, if any
 *   2. a `map` property with the Google Maps
 *   3. all the properties passed to the component in `mappedProps`
 * @param {Object => Any} options.beforeCreate -
 *  Hook to modify the options passed to the initializer
 * @param {(options.ctr, Object) => Any} options.afterCreate -
 *  Hook called when
 *
 */


function assert(v, message) {
  if (!v) throw new Error(message);
}

/**
 * Strips out the extraneous properties we have in our
 * props definitions
 * @param {Object} props
 */
function mappedPropsToVueProps(mappedProps) {
  return Object.entries(mappedProps).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        key = _ref4[0],
        prop = _ref4[1];

    var value = {};

    if ('type' in prop) value.type = prop.type;
    if ('default' in prop) value.default = prop.default;
    if ('required' in prop) value.required = prop.required;

    return [key, value];
  }).reduce(function (acc, _ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        key = _ref6[0],
        val = _ref6[1];

    acc[key] = val;
    return acc;
  }, {});
}

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/mapElementMixin.js":
/*!**************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/mapElementMixin.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * @class MapElementMixin
 *
 * Extends components to include the following fields:
 *
 * @property $map        The Google map (valid only after the promise returns)
 *
 *
 * */
exports.default = {
  inject: {
    '$mapPromise': { default: 'abcdef' }
  },

  provide: function provide() {
    var _this = this;

    // Note: although this mixin is not "providing" anything,
    // components' expect the `$map` property to be present on the component.
    // In order for that to happen, this mixin must intercept the $mapPromise
    // .then(() =>) first before its component does so.
    //
    // Since a provide() on a mixin is executed before a provide() on the
    // component, putting this code in provide() ensures that the $map is
    // already set by the time the
    // component's provide() is called.
    this.$mapPromise.then(function (map) {
      _this.$map = map;
    });

    return {};
  }
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/mapImpl.js":
/*!******************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/mapImpl.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bindEvents = __webpack_require__(/*! ../utils/bindEvents.js */ "./node_modules/vue2-google-maps/dist/utils/bindEvents.js");

var _bindEvents2 = _interopRequireDefault(_bindEvents);

var _bindProps = __webpack_require__(/*! ../utils/bindProps.js */ "./node_modules/vue2-google-maps/dist/utils/bindProps.js");

var _mountableMixin = __webpack_require__(/*! ../utils/mountableMixin.js */ "./node_modules/vue2-google-maps/dist/utils/mountableMixin.js");

var _mountableMixin2 = _interopRequireDefault(_mountableMixin);

var _TwoWayBindingWrapper = __webpack_require__(/*! ../utils/TwoWayBindingWrapper.js */ "./node_modules/vue2-google-maps/dist/utils/TwoWayBindingWrapper.js");

var _TwoWayBindingWrapper2 = _interopRequireDefault(_TwoWayBindingWrapper);

var _WatchPrimitiveProperties = __webpack_require__(/*! ../utils/WatchPrimitiveProperties.js */ "./node_modules/vue2-google-maps/dist/utils/WatchPrimitiveProperties.js");

var _WatchPrimitiveProperties2 = _interopRequireDefault(_WatchPrimitiveProperties);

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  center: {
    required: true,
    twoWay: true,
    type: Object,
    noBind: true
  },
  zoom: {
    required: false,
    twoWay: true,
    type: Number,
    noBind: true
  },
  heading: {
    type: Number,
    twoWay: true
  },
  mapTypeId: {
    twoWay: true,
    type: String
  },
  tilt: {
    twoWay: true,
    type: Number
  },
  options: {
    type: Object,
    default: function _default() {
      return {};
    }
  }
};

var events = ['bounds_changed', 'click', 'dblclick', 'drag', 'dragend', 'dragstart', 'idle', 'mousemove', 'mouseout', 'mouseover', 'resize', 'rightclick', 'tilesloaded'];

// Plain Google Maps methods exposed here for convenience
var linkedMethods = ['panBy', 'panTo', 'panToBounds', 'fitBounds'].reduce(function (all, methodName) {
  all[methodName] = function () {
    if (this.$mapObject) {
      this.$mapObject[methodName].apply(this.$mapObject, arguments);
    }
  };
  return all;
}, {});

// Other convenience methods exposed by Vue Google Maps
var customMethods = {
  resize: function resize() {
    if (this.$mapObject) {
      google.maps.event.trigger(this.$mapObject, 'resize');
    }
  },
  resizePreserveCenter: function resizePreserveCenter() {
    if (!this.$mapObject) {
      return;
    }

    var oldCenter = this.$mapObject.getCenter();
    google.maps.event.trigger(this.$mapObject, 'resize');
    this.$mapObject.setCenter(oldCenter);
  },


  /// Override mountableMixin::_resizeCallback
  /// because resizePreserveCenter is usually the
  /// expected behaviour
  _resizeCallback: function _resizeCallback() {
    this.resizePreserveCenter();
  }
};

exports.default = {
  mixins: [_mountableMixin2.default],
  props: (0, _mapElementFactory.mappedPropsToVueProps)(props),

  provide: function provide() {
    var _this = this;

    this.$mapPromise = new Promise(function (resolve, reject) {
      _this.$mapPromiseDeferred = { resolve: resolve, reject: reject };
    });
    return {
      '$mapPromise': this.$mapPromise
    };
  },


  computed: {
    finalLat: function finalLat() {
      return this.center && typeof this.center.lat === 'function' ? this.center.lat() : this.center.lat;
    },
    finalLng: function finalLng() {
      return this.center && typeof this.center.lng === 'function' ? this.center.lng() : this.center.lng;
    },
    finalLatLng: function finalLatLng() {
      return { lat: this.finalLat, lng: this.finalLng };
    }
  },

  watch: {
    zoom: function zoom(_zoom) {
      if (this.$mapObject) {
        this.$mapObject.setZoom(_zoom);
      }
    }
  },

  mounted: function mounted() {
    var _this2 = this;

    return this.$gmapApiPromiseLazy().then(function () {
      // getting the DOM element where to create the map
      var element = _this2.$refs['vue-map'];

      // creating the map
      var options = _extends({}, _this2.options, (0, _bindProps.getPropsValues)(_this2, props));
      delete options.options;
      _this2.$mapObject = new google.maps.Map(element, options);

      // binding properties (two and one way)
      (0, _bindProps.bindProps)(_this2, _this2.$mapObject, props);
      // binding events
      (0, _bindEvents2.default)(_this2, _this2.$mapObject, events);

      // manually trigger center and zoom
      (0, _TwoWayBindingWrapper2.default)(function (increment, decrement, shouldUpdate) {
        _this2.$mapObject.addListener('center_changed', function () {
          if (shouldUpdate()) {
            _this2.$emit('center_changed', _this2.$mapObject.getCenter());
          }
          decrement();
        });

        (0, _WatchPrimitiveProperties2.default)(_this2, ['finalLat', 'finalLng'], function updateCenter() {
          increment();
          _this2.$mapObject.setCenter(_this2.finalLatLng);
        });
      });
      _this2.$mapObject.addListener('zoom_changed', function () {
        _this2.$emit('zoom_changed', _this2.$mapObject.getZoom());
      });
      _this2.$mapObject.addListener('bounds_changed', function () {
        _this2.$emit('bounds_changed', _this2.$mapObject.getBounds());
      });

      _this2.$mapPromiseDeferred.resolve(_this2.$mapObject);

      return _this2.$mapObject;
    }).catch(function (error) {
      throw error;
    });
  },

  methods: _extends({}, customMethods, linkedMethods)
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/marker.js":
/*!*****************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/marker.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  animation: {
    twoWay: true,
    type: Number
  },
  attribution: {
    type: Object
  },
  clickable: {
    type: Boolean,
    twoWay: true,
    default: true
  },
  cursor: {
    type: String,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    twoWay: true,
    default: false
  },
  icon: {
    twoWay: true
  },
  label: {},
  opacity: {
    type: Number,
    default: 1
  },
  options: {
    type: Object
  },
  place: {
    type: Object
  },
  position: {
    type: Object,
    twoWay: true
  },
  shape: {
    type: Object,
    twoWay: true
  },
  title: {
    type: String,
    twoWay: true
  },
  zIndex: {
    type: Number,
    twoWay: true
  },
  visible: {
    twoWay: true,
    default: true
  }
};

var events = ['click', 'rightclick', 'dblclick', 'drag', 'dragstart', 'dragend', 'mouseup', 'mousedown', 'mouseover', 'mouseout'];

/**
 * @class Marker
 *
 * Marker class with extra support for
 *
 * - Embedded info windows
 * - Clustered markers
 *
 * Support for clustered markers is for backward-compatability
 * reasons. Otherwise we should use a cluster-marker mixin or
 * subclass.
 */
exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  events: events,
  name: 'marker',
  ctr: function ctr() {
    return google.maps.Marker;
  },

  inject: {
    '$clusterPromise': {
      default: null
    }
  },

  render: function render(h) {
    if (!this.$slots.default || this.$slots.default.length === 0) {
      return '';
    } else if (this.$slots.default.length === 1) {
      // So that infowindows can have a marker parent
      return this.$slots.default[0];
    } else {
      return h('div', this.$slots.default);
    }
  },
  destroyed: function destroyed() {
    if (!this.$markerObject) {
      return;
    }

    if (this.$clusterObject) {
      // Repaint will be performed in `updated()` of cluster
      this.$clusterObject.removeMarker(this.$markerObject, true);
    } else {
      this.$markerObject.setMap(null);
    }
  },
  beforeCreate: function beforeCreate(options) {
    if (this.$clusterPromise) {
      options.map = null;
    }

    return this.$clusterPromise;
  },
  afterCreate: function afterCreate(inst) {
    var _this = this;

    if (this.$clusterPromise) {
      this.$clusterPromise.then(function (co) {
        co.addMarker(inst);
        _this.$clusterObject = co;
      });
    }
  }
});

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/placeInput.vue":
/*!**********************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/placeInput.vue ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _placeInput_vue_vue_type_template_id_c1ab87be___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./placeInput.vue?vue&type=template&id=c1ab87be& */ "./node_modules/vue2-google-maps/dist/components/placeInput.vue?vue&type=template&id=c1ab87be&");
/* harmony import */ var _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./placeInputImpl.js?vue&type=script&lang=js& */ "./node_modules/vue2-google-maps/dist/components/placeInputImpl.js?vue&type=script&lang=js&?bfef");
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _placeInput_vue_vue_type_template_id_c1ab87be___WEBPACK_IMPORTED_MODULE_0__["render"],
  _placeInput_vue_vue_type_template_id_c1ab87be___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue2-google-maps/dist/components/placeInput.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/placeInput.vue?vue&type=template&id=c1ab87be&":
/*!*****************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/placeInput.vue?vue&type=template&id=c1ab87be& ***!
  \*****************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_placeInput_vue_vue_type_template_id_c1ab87be___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./placeInput.vue?vue&type=template&id=c1ab87be& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/placeInput.vue?vue&type=template&id=c1ab87be&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_placeInput_vue_vue_type_template_id_c1ab87be___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_placeInput_vue_vue_type_template_id_c1ab87be___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/placeInputImpl.js?vue&type=script&lang=js&?0c5e":
/*!**************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/placeInputImpl.js?vue&type=script&lang=js& ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bindProps = __webpack_require__(/*! ../utils/bindProps.js */ "./node_modules/vue2-google-maps/dist/utils/bindProps.js");

var _simulateArrowDown = __webpack_require__(/*! ../utils/simulateArrowDown.js */ "./node_modules/vue2-google-maps/dist/utils/simulateArrowDown.js");

var _simulateArrowDown2 = _interopRequireDefault(_simulateArrowDown);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var props = {
  bounds: {
    type: Object
  },
  defaultPlace: {
    type: String,
    default: ''
  },
  componentRestrictions: {
    type: Object,
    default: null
  },
  types: {
    type: Array,
    default: function _default() {
      return [];
    }
  },
  placeholder: {
    required: false,
    type: String
  },
  className: {
    required: false,
    type: String
  },
  label: {
    required: false,
    type: String,
    default: null
  },
  selectFirstOnEnter: {
    require: false,
    type: Boolean,
    default: false
  }
};

exports.default = {
  mounted: function mounted() {
    var _this = this;

    var input = this.$refs.input;

    // Allow default place to be set
    input.value = this.defaultPlace;
    this.$watch('defaultPlace', function () {
      input.value = _this.defaultPlace;
    });

    this.$gmapApiPromiseLazy().then(function () {
      var options = (0, _bindProps.getPropsValues)(_this, props);
      if (_this.selectFirstOnEnter) {
        (0, _simulateArrowDown2.default)(_this.$refs.input);
      }

      if (typeof google.maps.places.Autocomplete !== 'function') {
        throw new Error('google.maps.places.Autocomplete is undefined. Did you add \'places\' to libraries when loading Google Maps?');
      }

      _this.autoCompleter = new google.maps.places.Autocomplete(_this.$refs.input, options);

      var placeholder = props.placeholder,
          place = props.place,
          defaultPlace = props.defaultPlace,
          className = props.className,
          label = props.label,
          selectFirstOnEnter = props.selectFirstOnEnter,
          rest = _objectWithoutProperties(props, ['placeholder', 'place', 'defaultPlace', 'className', 'label', 'selectFirstOnEnter']); // eslint-disable-line


      (0, _bindProps.bindProps)(_this, _this.autoCompleter, rest);

      _this.autoCompleter.addListener('place_changed', function () {
        _this.$emit('place_changed', _this.autoCompleter.getPlace());
      });
    });
  },
  created: function created() {
    console.warn('The PlaceInput class is deprecated! Please consider using the Autocomplete input instead'); // eslint-disable-line no-console
  },

  props: props
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/placeInputImpl.js?vue&type=script&lang=js&?bfef":
/*!**************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/placeInputImpl.js?vue&type=script&lang=js& ***!
  \**************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!./placeInputImpl.js?vue&type=script&lang=js& */ "./node_modules/vue2-google-maps/dist/components/placeInputImpl.js?vue&type=script&lang=js&?0c5e");
/* harmony import */ var _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_placeInputImpl_js_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/polygon.js":
/*!******************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/polygon.js ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    type: Object
  },
  path: {
    type: Array,
    twoWay: true,
    noBind: true
  },
  paths: {
    type: Array,
    twoWay: true,
    noBind: true
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = (0, _mapElementFactory2.default)({
  props: {
    deepWatch: {
      type: Boolean,
      default: false
    }
  },
  events: events,
  mappedProps: props,
  name: 'polygon',
  ctr: function ctr() {
    return google.maps.Polygon;
  },

  beforeCreate: function beforeCreate(options) {
    if (!options.path) delete options.path;
    if (!options.paths) delete options.paths;
  },
  afterCreate: function afterCreate(inst) {
    var _this = this;

    var clearEvents = function () {};

    // Watch paths, on our own, because we do not want to set either when it is
    // empty
    this.$watch('paths', function (paths) {
      if (paths) {
        clearEvents();

        inst.setPaths(paths);

        var updatePaths = function () {
          _this.$emit('paths_changed', inst.getPaths());
        };
        var eventListeners = [];

        var mvcArray = inst.getPaths();
        for (var i = 0; i < mvcArray.getLength(); i++) {
          var mvcPath = mvcArray.getAt(i);
          eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)]);
          eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)]);
          eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)]);
        }
        eventListeners.push([mvcArray, mvcArray.addListener('insert_at', updatePaths)]);
        eventListeners.push([mvcArray, mvcArray.addListener('remove_at', updatePaths)]);
        eventListeners.push([mvcArray, mvcArray.addListener('set_at', updatePaths)]);

        clearEvents = function () {
          eventListeners.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                obj = _ref2[0],
                listenerHandle = _ref2[1];

            return (// eslint-disable-line no-unused-vars
              google.maps.event.removeListener(listenerHandle)
            );
          });
        };
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    });

    this.$watch('path', function (path) {
      if (path) {
        clearEvents();

        inst.setPaths(path);

        var mvcPath = inst.getPath();
        var eventListeners = [];

        var updatePaths = function () {
          _this.$emit('path_changed', inst.getPath());
        };

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)]);
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)]);
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)]);

        clearEvents = function () {
          eventListeners.map(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
                obj = _ref4[0],
                listenerHandle = _ref4[1];

            return (// eslint-disable-line no-unused-vars
              google.maps.event.removeListener(listenerHandle)
            );
          });
        };
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    });
  }
});

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/polyline.js":
/*!*******************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/polyline.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  draggable: {
    type: Boolean
  },
  editable: {
    type: Boolean
  },
  options: {
    twoWay: false,
    type: Object
  },
  path: {
    type: Array,
    twoWay: true
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  props: {
    deepWatch: {
      type: Boolean,
      default: false
    }
  },
  events: events,

  name: 'polyline',
  ctr: function ctr() {
    return google.maps.Polyline;
  },

  afterCreate: function afterCreate() {
    var _this = this;

    var clearEvents = function () {};

    this.$watch('path', function (path) {
      if (path) {
        clearEvents();

        _this.$polylineObject.setPath(path);

        var mvcPath = _this.$polylineObject.getPath();
        var eventListeners = [];

        var updatePaths = function () {
          _this.$emit('path_changed', _this.$polylineObject.getPath());
        };

        eventListeners.push([mvcPath, mvcPath.addListener('insert_at', updatePaths)]);
        eventListeners.push([mvcPath, mvcPath.addListener('remove_at', updatePaths)]);
        eventListeners.push([mvcPath, mvcPath.addListener('set_at', updatePaths)]);

        clearEvents = function () {
          eventListeners.map(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                obj = _ref2[0],
                listenerHandle = _ref2[1];

            return (// eslint-disable-line no-unused-vars
              google.maps.event.removeListener(listenerHandle)
            );
          });
        };
      }
    }, {
      deep: this.deepWatch,
      immediate: true
    });
  }
});

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/rectangle.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/rectangle.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  bounds: {
    type: Object,
    twoWay: true
  },
  draggable: {
    type: Boolean,
    default: false
  },
  editable: {
    type: Boolean,
    default: false
  },
  options: {
    type: Object,
    twoWay: false
  }
};

var events = ['click', 'dblclick', 'drag', 'dragend', 'dragstart', 'mousedown', 'mousemove', 'mouseout', 'mouseover', 'mouseup', 'rightclick'];

exports.default = (0, _mapElementFactory2.default)({
  mappedProps: props,
  name: 'rectangle',
  ctr: function ctr() {
    return google.maps.Rectangle;
  },
  events: events
});

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue":
/*!******************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue ***!
  \******************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _streetViewPanorama_vue_vue_type_template_id_ed35740a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./streetViewPanorama.vue?vue&type=template&id=ed35740a& */ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=template&id=ed35740a&");
/* harmony import */ var _streetViewPanorama_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./streetViewPanorama.vue?vue&type=script&lang=js& */ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./streetViewPanorama.vue?vue&type=style&index=0&lang=css& */ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _streetViewPanorama_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _streetViewPanorama_vue_vue_type_template_id_ed35740a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _streetViewPanorama_vue_vue_type_template_id_ed35740a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=script&lang=js&":
/*!*******************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=script&lang=js& ***!
  \*******************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib??vue-loader-options!./streetViewPanorama.vue?vue&type=script&lang=js& */ "./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css&":
/*!***************************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css& ***!
  \***************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../style-loader!../../../css-loader??ref--6-1!../../../vue-loader/lib/loaders/stylePostLoader.js!../../../postcss-loader/src??ref--6-2!../../../vue-loader/lib??vue-loader-options!./streetViewPanorama.vue?vue&type=style&index=0&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=style&index=0&lang=css&");
/* harmony import */ var _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_style_loader_index_js_css_loader_index_js_ref_6_1_vue_loader_lib_loaders_stylePostLoader_js_postcss_loader_src_index_js_ref_6_2_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_style_index_0_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=template&id=ed35740a&":
/*!*************************************************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=template&id=ed35740a& ***!
  \*************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_template_id_ed35740a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../vue-loader/lib??vue-loader-options!./streetViewPanorama.vue?vue&type=template&id=ed35740a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue?vue&type=template&id=ed35740a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_template_id_ed35740a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _vue_loader_lib_loaders_templateLoader_js_vue_loader_options_vue_loader_lib_index_js_vue_loader_options_streetViewPanorama_vue_vue_type_template_id_ed35740a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/components/streetViewPanoramaImpl.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/components/streetViewPanoramaImpl.js ***!
  \*********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _bindEvents = __webpack_require__(/*! ../utils/bindEvents.js */ "./node_modules/vue2-google-maps/dist/utils/bindEvents.js");

var _bindEvents2 = _interopRequireDefault(_bindEvents);

var _bindProps = __webpack_require__(/*! ../utils/bindProps.js */ "./node_modules/vue2-google-maps/dist/utils/bindProps.js");

var _mountableMixin = __webpack_require__(/*! ../utils/mountableMixin.js */ "./node_modules/vue2-google-maps/dist/utils/mountableMixin.js");

var _mountableMixin2 = _interopRequireDefault(_mountableMixin);

var _TwoWayBindingWrapper = __webpack_require__(/*! ../utils/TwoWayBindingWrapper.js */ "./node_modules/vue2-google-maps/dist/utils/TwoWayBindingWrapper.js");

var _TwoWayBindingWrapper2 = _interopRequireDefault(_TwoWayBindingWrapper);

var _WatchPrimitiveProperties = __webpack_require__(/*! ../utils/WatchPrimitiveProperties.js */ "./node_modules/vue2-google-maps/dist/utils/WatchPrimitiveProperties.js");

var _WatchPrimitiveProperties2 = _interopRequireDefault(_WatchPrimitiveProperties);

var _mapElementFactory = __webpack_require__(/*! ./mapElementFactory.js */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var props = {
  zoom: {
    twoWay: true,
    type: Number
  },
  pov: {
    twoWay: true,
    type: Object,
    trackProperties: ['pitch', 'heading']
  },
  position: {
    twoWay: true,
    type: Object,
    noBind: true
  },
  pano: {
    twoWay: true,
    type: String
  },
  motionTracking: {
    twoWay: false,
    type: Boolean
  },
  visible: {
    twoWay: true,
    type: Boolean,
    default: true
  },
  options: {
    twoWay: false,
    type: Object,
    default: function _default() {
      return {};
    }
  }
};

var events = ['closeclick', 'status_changed'];

exports.default = {
  mixins: [_mountableMixin2.default],
  props: (0, _mapElementFactory.mappedPropsToVueProps)(props),
  replace: false, // necessary for css styles
  methods: {
    resize: function resize() {
      if (this.$panoObject) {
        google.maps.event.trigger(this.$panoObject, 'resize');
      }
    }
  },

  provide: function provide() {
    var _this = this;

    var promise = new Promise(function (resolve, reject) {
      _this.$panoPromiseDeferred = { resolve: resolve, reject: reject };
    });
    return {
      '$panoPromise': promise,
      '$mapPromise': promise // so that we can use it with markers
    };
  },


  computed: {
    finalLat: function finalLat() {
      return this.position && typeof this.position.lat === 'function' ? this.position.lat() : this.position.lat;
    },
    finalLng: function finalLng() {
      return this.position && typeof this.position.lng === 'function' ? this.position.lng() : this.position.lng;
    },
    finalLatLng: function finalLatLng() {
      return {
        lat: this.finalLat,
        lng: this.finalLng
      };
    }
  },

  watch: {
    zoom: function zoom(_zoom) {
      if (this.$panoObject) {
        this.$panoObject.setZoom(_zoom);
      }
    }
  },

  mounted: function mounted() {
    var _this2 = this;

    return this.$gmapApiPromiseLazy().then(function () {
      // getting the DOM element where to create the map
      var element = _this2.$refs['vue-street-view-pano'];

      // creating the map
      var options = _extends({}, _this2.options, (0, _bindProps.getPropsValues)(_this2, props));
      delete options.options;

      _this2.$panoObject = new google.maps.StreetViewPanorama(element, options);

      // binding properties (two and one way)
      (0, _bindProps.bindProps)(_this2, _this2.$panoObject, props);
      // binding events
      (0, _bindEvents2.default)(_this2, _this2.$panoObject, events);

      // manually trigger position
      (0, _TwoWayBindingWrapper2.default)(function (increment, decrement, shouldUpdate) {
        // Panos take a while to load
        increment();

        _this2.$panoObject.addListener('position_changed', function () {
          if (shouldUpdate()) {
            _this2.$emit('position_changed', _this2.$panoObject.getPosition());
          }
          decrement();
        });

        (0, _WatchPrimitiveProperties2.default)(_this2, ['finalLat', 'finalLng'], function updateCenter() {
          increment();
          _this2.$panoObject.setPosition(_this2.finalLatLng);
        });
      });

      _this2.$panoPromiseDeferred.resolve(_this2.$panoObject);

      return _this2.$panoPromise;
    }).catch(function (error) {
      throw error;
    });
  }
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/main.js":
/*!****************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/main.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StreetViewPanorama = exports.MountableMixin = exports.Autocomplete = exports.MapElementFactory = exports.MapElementMixin = exports.PlaceInput = exports.Map = exports.InfoWindow = exports.Rectangle = exports.Cluster = exports.Circle = exports.Polygon = exports.Polyline = exports.Marker = exports.loadGmapApi = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Vue component imports


exports.install = install;
exports.gmapApi = gmapApi;

var _lazyValue = __webpack_require__(/*! ./utils/lazyValue */ "./node_modules/vue2-google-maps/dist/utils/lazyValue.js");

var _lazyValue2 = _interopRequireDefault(_lazyValue);

var _manager = __webpack_require__(/*! ./manager */ "./node_modules/vue2-google-maps/dist/manager.js");

var _marker = __webpack_require__(/*! ./components/marker */ "./node_modules/vue2-google-maps/dist/components/marker.js");

var _marker2 = _interopRequireDefault(_marker);

var _polyline = __webpack_require__(/*! ./components/polyline */ "./node_modules/vue2-google-maps/dist/components/polyline.js");

var _polyline2 = _interopRequireDefault(_polyline);

var _polygon = __webpack_require__(/*! ./components/polygon */ "./node_modules/vue2-google-maps/dist/components/polygon.js");

var _polygon2 = _interopRequireDefault(_polygon);

var _circle = __webpack_require__(/*! ./components/circle */ "./node_modules/vue2-google-maps/dist/components/circle.js");

var _circle2 = _interopRequireDefault(_circle);

var _rectangle = __webpack_require__(/*! ./components/rectangle */ "./node_modules/vue2-google-maps/dist/components/rectangle.js");

var _rectangle2 = _interopRequireDefault(_rectangle);

var _infoWindow = __webpack_require__(/*! ./components/infoWindow.vue */ "./node_modules/vue2-google-maps/dist/components/infoWindow.vue");

var _infoWindow2 = _interopRequireDefault(_infoWindow);

var _map = __webpack_require__(/*! ./components/map.vue */ "./node_modules/vue2-google-maps/dist/components/map.vue");

var _map2 = _interopRequireDefault(_map);

var _streetViewPanorama = __webpack_require__(/*! ./components/streetViewPanorama.vue */ "./node_modules/vue2-google-maps/dist/components/streetViewPanorama.vue");

var _streetViewPanorama2 = _interopRequireDefault(_streetViewPanorama);

var _placeInput = __webpack_require__(/*! ./components/placeInput.vue */ "./node_modules/vue2-google-maps/dist/components/placeInput.vue");

var _placeInput2 = _interopRequireDefault(_placeInput);

var _autocomplete = __webpack_require__(/*! ./components/autocomplete.vue */ "./node_modules/vue2-google-maps/dist/components/autocomplete.vue");

var _autocomplete2 = _interopRequireDefault(_autocomplete);

var _mapElementMixin = __webpack_require__(/*! ./components/mapElementMixin */ "./node_modules/vue2-google-maps/dist/components/mapElementMixin.js");

var _mapElementMixin2 = _interopRequireDefault(_mapElementMixin);

var _mapElementFactory = __webpack_require__(/*! ./components/mapElementFactory */ "./node_modules/vue2-google-maps/dist/components/mapElementFactory.js");

var _mapElementFactory2 = _interopRequireDefault(_mapElementFactory);

var _mountableMixin = __webpack_require__(/*! ./utils/mountableMixin */ "./node_modules/vue2-google-maps/dist/utils/mountableMixin.js");

var _mountableMixin2 = _interopRequireDefault(_mountableMixin);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// HACK: Cluster should be loaded conditionally
// However in the web version, it's not possible to write
// `import 'vue2-google-maps/src/components/cluster'`, so we need to
// import it anyway (but we don't have to register it)
// Therefore we use babel-plugin-transform-inline-environment-variables to
// set BUILD_DEV to truthy / falsy
var Cluster = undefined;

var GmapApi = null;

// export everything
exports.loadGmapApi = _manager.loadGmapApi;
exports.Marker = _marker2.default;
exports.Polyline = _polyline2.default;
exports.Polygon = _polygon2.default;
exports.Circle = _circle2.default;
exports.Cluster = Cluster;
exports.Rectangle = _rectangle2.default;
exports.InfoWindow = _infoWindow2.default;
exports.Map = _map2.default;
exports.PlaceInput = _placeInput2.default;
exports.MapElementMixin = _mapElementMixin2.default;
exports.MapElementFactory = _mapElementFactory2.default;
exports.Autocomplete = _autocomplete2.default;
exports.MountableMixin = _mountableMixin2.default;
exports.StreetViewPanorama = _streetViewPanorama2.default;
function install(Vue, options) {
  // Set defaults
  options = _extends({
    installComponents: true,
    autobindAllEvents: false
  }, options);

  // Update the global `GmapApi`. This will allow
  // components to use the `google` global reactively
  // via:
  //   import {gmapApi} from 'vue2-google-maps'
  //   export default {  computed: { google: gmapApi }  }
  GmapApi = new Vue({ data: { gmapApi: null } });

  var defaultResizeBus = new Vue();

  // Use a lazy to only load the API when
  // a VGM component is loaded
  var gmapApiPromiseLazy = makeGmapApiPromiseLazy(options);

  Vue.mixin({
    created: function created() {
      this.$gmapDefaultResizeBus = defaultResizeBus;
      this.$gmapOptions = options;
      this.$gmapApiPromiseLazy = gmapApiPromiseLazy;
    }
  });
  Vue.$gmapDefaultResizeBus = defaultResizeBus;
  Vue.$gmapApiPromiseLazy = gmapApiPromiseLazy;

  if (options.installComponents) {
    Vue.component('GmapMap', _map2.default);
    Vue.component('GmapMarker', _marker2.default);
    Vue.component('GmapInfoWindow', _infoWindow2.default);
    Vue.component('GmapPolyline', _polyline2.default);
    Vue.component('GmapPolygon', _polygon2.default);
    Vue.component('GmapCircle', _circle2.default);
    Vue.component('GmapRectangle', _rectangle2.default);
    Vue.component('GmapAutocomplete', _autocomplete2.default);
    Vue.component('GmapPlaceInput', _placeInput2.default);
    Vue.component('GmapStreetViewPanorama', _streetViewPanorama2.default);
  }
}

function makeGmapApiPromiseLazy(options) {
  // Things to do once the API is loaded
  function onApiLoaded() {
    GmapApi.gmapApi = {};
    return window.google;
  }

  if (options.load) {
    // If library should load the API
    return (0, _lazyValue2.default)(function () {
      // Load the
      // This will only be evaluated once
      if (typeof window === 'undefined') {
        // server side -- never resolve this promise
        return new Promise(function () {}).then(onApiLoaded);
      } else {
        return new Promise(function (resolve, reject) {
          try {
            window['vueGoogleMapsInit'] = resolve;
            (0, _manager.loadGmapApi)(options.load, options.loadCn);
          } catch (err) {
            reject(err);
          }
        }).then(onApiLoaded);
      }
    });
  } else {
    // If library should not handle API, provide
    // end-users with the global `vueGoogleMapsInit: () => undefined`
    // when the Google Maps API has been loaded
    var promise = new Promise(function (resolve) {
      if (typeof window === 'undefined') {
        // Do nothing if run from server-side
        return;
      }
      window['vueGoogleMapsInit'] = resolve;
    }).then(onApiLoaded);

    return (0, _lazyValue2.default)(function () {
      return promise;
    });
  }
}

function gmapApi() {
  return GmapApi.gmapApi && window.google;
}

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/manager.js":
/*!*******************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/manager.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var isApiSetUp = false;

/**
 * @param apiKey    API Key, or object with the URL parameters. For example
 *                  to use Google Maps Premium API, pass
 *                    `{ client: <YOUR-CLIENT-ID> }`.
 *                  You may pass the libraries and/or version (as `v`) parameter into
 *                  this parameter and skip the next two parameters
 * @param version   Google Maps version
 * @param libraries Libraries to load (@see
 *                  https://developers.google.com/maps/documentation/javascript/libraries)
 * @param loadCn    Boolean. If set to true, the map will be loaded from google maps China
 *                  (@see https://developers.google.com/maps/documentation/javascript/basics#GoogleMapsChina)
 *
 * Example:
 * ```
 *      import {load} from 'vue-google-maps'
 *
 *      load(<YOUR-API-KEY>)
 *
 *      load({
 *              key: <YOUR-API-KEY>,
 *      })
 *
 *      load({
 *              client: <YOUR-CLIENT-ID>,
 *              channel: <YOUR CHANNEL>
 *      })
 * ```
 */
var loadGmapApi = exports.loadGmapApi = function (options, loadCn) {
  if (typeof document === 'undefined') {
    // Do nothing if run from server-side
    return;
  }
  if (!isApiSetUp) {
    isApiSetUp = true;

    var googleMapScript = document.createElement('SCRIPT');

    // Allow options to be an object.
    // This is to support more esoteric means of loading Google Maps,
    // such as Google for business
    // https://developers.google.com/maps/documentation/javascript/get-api-key#premium-auth
    if ((typeof options === 'undefined' ? 'undefined' : _typeof(options)) !== 'object') {
      throw new Error('options should  be an object');
    }

    // libraries
    if (Array.prototype.isPrototypeOf(options.libraries)) {
      options.libraries = options.libraries.join(',');
    }
    options['callback'] = 'vueGoogleMapsInit';

    var baseUrl = 'https://maps.googleapis.com/';

    if (typeof loadCn === 'boolean' && loadCn === true) {
      baseUrl = 'https://maps.google.cn/';
    }

    var url = baseUrl + 'maps/api/js?' + Object.keys(options).map(function (key) {
      return encodeURIComponent(key) + '=' + encodeURIComponent(options[key]);
    }).join('&');

    googleMapScript.setAttribute('src', url);
    googleMapScript.setAttribute('async', '');
    googleMapScript.setAttribute('defer', '');
    document.head.appendChild(googleMapScript);
  } else {
    throw new Error('You already started the loading of google maps');
  }
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/TwoWayBindingWrapper.js":
/*!**************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/TwoWayBindingWrapper.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = TwoWayBindingWrapper;
/**
 * When you have two-way bindings, but the actual bound value will not equal
 * the value you initially passed in, then to avoid an infinite loop you
 * need to increment a counter every time you pass in a value, decrement the
 * same counter every time the bound value changed, but only bubble up
 * the event when the counter is zero.
 *
Example:

Let's say DrawingRecognitionCanvas is a deep-learning backed canvas
that, when given the name of an object (e.g. 'dog'), draws a dog.
But whenever the drawing on it changes, it also sends back its interpretation
of the image by way of the @newObjectRecognized event.

<input
  type="text"
  placeholder="an object, e.g. Dog, Cat, Frog"
  v-model="identifiedObject" />
<DrawingRecognitionCanvas
  :object="identifiedObject"
  @newObjectRecognized="identifiedObject = $event"
  />

new TwoWayBindingWrapper((increment, decrement, shouldUpdate) => {
  this.$watch('identifiedObject', () => {
    // new object passed in
    increment()
  })
  this.$deepLearningBackend.on('drawingChanged', () => {
    recognizeObject(this.$deepLearningBackend)
      .then((object) => {
        decrement()
        if (shouldUpdate()) {
          this.$emit('newObjectRecognized', object.name)
        }
      })
  })
})
 */
function TwoWayBindingWrapper(fn) {
  var counter = 0;

  fn(function () {
    counter += 1;
  }, function () {
    counter = Math.max(0, counter - 1);
  }, function () {
    return counter === 0;
  });
}

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/WatchPrimitiveProperties.js":
/*!******************************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/WatchPrimitiveProperties.js ***!
  \******************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = WatchPrimitiveProperties;
/**
 * Watch the individual properties of a PoD object, instead of the object
 * per se. This is different from a deep watch where both the reference
 * and the individual values are watched.
 *
 * In effect, it throttles the multiple $watch to execute at most once per tick.
 */
function WatchPrimitiveProperties(vueInst, propertiesToTrack, handler) {
  var immediate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

  var isHandled = false;

  function requestHandle() {
    if (!isHandled) {
      isHandled = true;
      vueInst.$nextTick(function () {
        isHandled = false;
        handler();
      });
    }
  }

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = propertiesToTrack[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var prop = _step.value;

      vueInst.$watch(prop, requestHandle, { immediate: immediate });
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/bindEvents.js":
/*!****************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/bindEvents.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (vueInst, googleMapsInst, events) {
  var _loop = function (eventName) {
    if (vueInst.$gmapOptions.autobindAllEvents || vueInst.$listeners[eventName]) {
      googleMapsInst.addListener(eventName, function (ev) {
        vueInst.$emit(eventName, ev);
      });
    }
  };

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = events[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var eventName = _step.value;

      _loop(eventName);
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/bindProps.js":
/*!***************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/bindProps.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPropsValues = getPropsValues;
exports.bindProps = bindProps;

var _WatchPrimitiveProperties = __webpack_require__(/*! ../utils/WatchPrimitiveProperties */ "./node_modules/vue2-google-maps/dist/utils/WatchPrimitiveProperties.js");

var _WatchPrimitiveProperties2 = _interopRequireDefault(_WatchPrimitiveProperties);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getPropsValues(vueInst, props) {
  return Object.keys(props).reduce(function (acc, prop) {
    if (vueInst[prop] !== undefined) {
      acc[prop] = vueInst[prop];
    }
    return acc;
  }, {});
}

/**
  * Binds the properties defined in props to the google maps instance.
  * If the prop is an Object type, and we wish to track the properties
  * of the object (e.g. the lat and lng of a LatLng), then we do a deep
  * watch. For deep watch, we also prevent the _changed event from being
  * emitted if the data source was external.
  */
function bindProps(vueInst, googleMapsInst, props) {
  var _loop = function (attribute) {
    var _props$attribute = props[attribute],
        twoWay = _props$attribute.twoWay,
        type = _props$attribute.type,
        trackProperties = _props$attribute.trackProperties,
        noBind = _props$attribute.noBind;


    if (noBind) return 'continue';

    var setMethodName = 'set' + capitalizeFirstLetter(attribute);
    var getMethodName = 'get' + capitalizeFirstLetter(attribute);
    var eventName = attribute.toLowerCase() + '_changed';
    var initialValue = vueInst[attribute];

    if (typeof googleMapsInst[setMethodName] === 'undefined') {
      throw new Error(setMethodName + ' is not a method of (the Maps object corresponding to) ' + vueInst.$options._componentTag);
    }

    // We need to avoid an endless
    // propChanged -> event emitted -> propChanged -> event emitted loop
    // although this may really be the user's responsibility
    if (type !== Object || !trackProperties) {
      // Track the object deeply
      vueInst.$watch(attribute, function () {
        var attributeValue = vueInst[attribute];

        googleMapsInst[setMethodName](attributeValue);
      }, {
        immediate: typeof initialValue !== 'undefined',
        deep: type === Object
      });
    } else {
      (0, _WatchPrimitiveProperties2.default)(vueInst, trackProperties.map(function (prop) {
        return attribute + '.' + prop;
      }), function () {
        googleMapsInst[setMethodName](vueInst[attribute]);
      }, vueInst[attribute] !== undefined);
    }

    if (twoWay && (vueInst.$gmapOptions.autobindAllEvents || vueInst.$listeners[eventName])) {
      googleMapsInst.addListener(eventName, function () {
        // eslint-disable-line no-unused-vars
        vueInst.$emit(eventName, googleMapsInst[getMethodName]());
      });
    }
  };

  for (var attribute in props) {
    var _ret = _loop(attribute);

    if (_ret === 'continue') continue;
  }
}

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/lazyValue.js":
/*!***************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/lazyValue.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

// This piece of code was orignally written by sindresorhus and can be seen here
// https://github.com/sindresorhus/lazy-value/blob/master/index.js

exports.default = function (fn) {
  var called = false;
  var ret = void 0;

  return function () {
    if (!called) {
      called = true;
      ret = fn();
    }

    return ret;
  };
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/mountableMixin.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/mountableMixin.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
Mixin for objects that are mounted by Google Maps
Javascript API.

These are objects that are sensitive to element resize
operations so it exposes a property which accepts a bus

*/

exports.default = {
  props: ['resizeBus'],

  data: function data() {
    return {
      _actualResizeBus: null
    };
  },
  created: function created() {
    if (typeof this.resizeBus === 'undefined') {
      this.$data._actualResizeBus = this.$gmapDefaultResizeBus;
    } else {
      this.$data._actualResizeBus = this.resizeBus;
    }
  },


  methods: {
    _resizeCallback: function _resizeCallback() {
      this.resize();
    },
    _delayedResizeCallback: function _delayedResizeCallback() {
      var _this = this;

      this.$nextTick(function () {
        return _this._resizeCallback();
      });
    }
  },

  watch: {
    resizeBus: function resizeBus(newVal) {
      // eslint-disable-line no-unused-vars
      this.$data._actualResizeBus = newVal;
    },
    '$data._actualResizeBus': function $data_actualResizeBus(newVal, oldVal) {
      if (oldVal) {
        oldVal.$off('resize', this._delayedResizeCallback);
      }
      if (newVal) {
        newVal.$on('resize', this._delayedResizeCallback);
      }
    }
  },

  destroyed: function destroyed() {
    if (this.$data._actualResizeBus) {
      this.$data._actualResizeBus.$off('resize', this._delayedResizeCallback);
    }
  }
};

/***/ }),

/***/ "./node_modules/vue2-google-maps/dist/utils/simulateArrowDown.js":
/*!***********************************************************************!*\
  !*** ./node_modules/vue2-google-maps/dist/utils/simulateArrowDown.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

// This piece of code was orignally written by amirnissim and can be seen here
// http://stackoverflow.com/a/11703018/2694653
// This has been ported to Vanilla.js by GuillaumeLeclerc
exports.default = function (input) {
  var _addEventListener = input.addEventListener ? input.addEventListener : input.attachEvent;

  function addEventListenerWrapper(type, listener) {
    // Simulate a 'down arrow' keypress on hitting 'return' when no pac suggestion is selected,
    // and then trigger the original listener.
    if (type === 'keydown') {
      var origListener = listener;
      listener = function (event) {
        var suggestionSelected = document.getElementsByClassName('pac-item-selected').length > 0;
        if (event.which === 13 && !suggestionSelected) {
          var simulatedEvent = document.createEvent('Event');
          simulatedEvent.keyCode = 40;
          simulatedEvent.which = 40;
          origListener.apply(input, [simulatedEvent]);
        }
        origListener.apply(input, [event]);
      };
    }
    _addEventListener.apply(input, [type, listener]);
  }

  input.addEventListener = addEventListenerWrapper;
  input.attachEvent = addEventListenerWrapper;
};

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./resources/components/GoogleMap.vue":
/*!********************************************!*\
  !*** ./resources/components/GoogleMap.vue ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _GoogleMap_vue_vue_type_template_id_6c4e9142_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true& */ "./resources/components/GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true&");
/* harmony import */ var _GoogleMap_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./GoogleMap.vue?vue&type=script&lang=js& */ "./resources/components/GoogleMap.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _GoogleMap_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _GoogleMap_vue_vue_type_template_id_6c4e9142_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _GoogleMap_vue_vue_type_template_id_6c4e9142_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "6c4e9142",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/GoogleMap.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/GoogleMap.vue?vue&type=script&lang=js&":
/*!*********************************************************************!*\
  !*** ./resources/components/GoogleMap.vue?vue&type=script&lang=js& ***!
  \*********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GoogleMap_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--4-0!../../node_modules/vue-loader/lib??vue-loader-options!./GoogleMap.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/GoogleMap.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_GoogleMap_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/components/GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true&":
/*!***************************************************************************************!*\
  !*** ./resources/components/GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true& ***!
  \***************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_GoogleMap_vue_vue_type_template_id_6c4e9142_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/GoogleMap.vue?vue&type=template&id=6c4e9142&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_GoogleMap_vue_vue_type_template_id_6c4e9142_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_GoogleMap_vue_vue_type_template_id_6c4e9142_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/IconBase.vue":
/*!*******************************************!*\
  !*** ./resources/components/IconBase.vue ***!
  \*******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _IconBase_vue_vue_type_template_id_04509bdb_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./IconBase.vue?vue&type=template&id=04509bdb&scoped=true& */ "./resources/components/IconBase.vue?vue&type=template&id=04509bdb&scoped=true&");
/* harmony import */ var _IconBase_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./IconBase.vue?vue&type=script&lang=js& */ "./resources/components/IconBase.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css& */ "./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _IconBase_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _IconBase_vue_vue_type_template_id_04509bdb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _IconBase_vue_vue_type_template_id_04509bdb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "04509bdb",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/IconBase.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/IconBase.vue?vue&type=script&lang=js&":
/*!********************************************************************!*\
  !*** ./resources/components/IconBase.vue?vue&type=script&lang=js& ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--4-0!../../node_modules/vue-loader/lib??vue-loader-options!./IconBase.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css&":
/*!****************************************************************************************************!*\
  !*** ./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css& ***!
  \****************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader!../../node_modules/css-loader??ref--6-1!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??ref--6-2!../../node_modules/vue-loader/lib??vue-loader-options!./IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=style&index=0&id=04509bdb&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_style_index_0_id_04509bdb_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/components/IconBase.vue?vue&type=template&id=04509bdb&scoped=true&":
/*!**************************************************************************************!*\
  !*** ./resources/components/IconBase.vue?vue&type=template&id=04509bdb&scoped=true& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_template_id_04509bdb_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./IconBase.vue?vue&type=template&id=04509bdb&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/IconBase.vue?vue&type=template&id=04509bdb&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_template_id_04509bdb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_IconBase_vue_vue_type_template_id_04509bdb_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/buttons/leaseplanButtonOrange.vue":
/*!****************************************************************!*\
  !*** ./resources/components/buttons/leaseplanButtonOrange.vue ***!
  \****************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _leaseplanButtonOrange_vue_vue_type_template_id_77209294_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true& */ "./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true&");
/* harmony import */ var _leaseplanButtonOrange_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./leaseplanButtonOrange.vue?vue&type=script&lang=js& */ "./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css& */ "./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _leaseplanButtonOrange_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _leaseplanButtonOrange_vue_vue_type_template_id_77209294_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _leaseplanButtonOrange_vue_vue_type_template_id_77209294_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "77209294",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/buttons/leaseplanButtonOrange.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=script&lang=js&":
/*!*****************************************************************************************!*\
  !*** ./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=script&lang=js& ***!
  \*****************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./leaseplanButtonOrange.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css&":
/*!*************************************************************************************************************************!*\
  !*** ./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css& ***!
  \*************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=style&index=0&id=77209294&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_style_index_0_id_77209294_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true&":
/*!***********************************************************************************************************!*\
  !*** ./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true& ***!
  \***********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_template_id_77209294_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/leaseplanButtonOrange.vue?vue&type=template&id=77209294&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_template_id_77209294_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_leaseplanButtonOrange_vue_vue_type_template_id_77209294_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/buttons/start.vue":
/*!************************************************!*\
  !*** ./resources/components/buttons/start.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _start_vue_vue_type_template_id_5266bd5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./start.vue?vue&type=template&id=5266bd5a&scoped=true& */ "./resources/components/buttons/start.vue?vue&type=template&id=5266bd5a&scoped=true&");
/* harmony import */ var _start_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./start.vue?vue&type=script&lang=js& */ "./resources/components/buttons/start.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _start_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _start_vue_vue_type_template_id_5266bd5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _start_vue_vue_type_template_id_5266bd5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "5266bd5a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/buttons/start.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/buttons/start.vue?vue&type=script&lang=js&":
/*!*************************************************************************!*\
  !*** ./resources/components/buttons/start.vue?vue&type=script&lang=js& ***!
  \*************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_start_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./start.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/start.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_start_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/components/buttons/start.vue?vue&type=template&id=5266bd5a&scoped=true&":
/*!*******************************************************************************************!*\
  !*** ./resources/components/buttons/start.vue?vue&type=template&id=5266bd5a&scoped=true& ***!
  \*******************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_start_vue_vue_type_template_id_5266bd5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./start.vue?vue&type=template&id=5266bd5a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/buttons/start.vue?vue&type=template&id=5266bd5a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_start_vue_vue_type_template_id_5266bd5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_start_vue_vue_type_template_id_5266bd5a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/icons/Location.vue":
/*!*************************************************!*\
  !*** ./resources/components/icons/Location.vue ***!
  \*************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Location_vue_vue_type_template_id_b60b958a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Location.vue?vue&type=template&id=b60b958a& */ "./resources/components/icons/Location.vue?vue&type=template&id=b60b958a&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");

var script = {}


/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  script,
  _Location_vue_vue_type_template_id_b60b958a___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Location_vue_vue_type_template_id_b60b958a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/icons/Location.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/icons/Location.vue?vue&type=template&id=b60b958a&":
/*!********************************************************************************!*\
  !*** ./resources/components/icons/Location.vue?vue&type=template&id=b60b958a& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Location_vue_vue_type_template_id_b60b958a___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./Location.vue?vue&type=template&id=b60b958a& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/icons/Location.vue?vue&type=template&id=b60b958a&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Location_vue_vue_type_template_id_b60b958a___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Location_vue_vue_type_template_id_b60b958a___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/icons/Logo.vue":
/*!*********************************************!*\
  !*** ./resources/components/icons/Logo.vue ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Logo_vue_vue_type_template_id_4d15519e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Logo.vue?vue&type=template&id=4d15519e& */ "./resources/components/icons/Logo.vue?vue&type=template&id=4d15519e&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");

var script = {}


/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  script,
  _Logo_vue_vue_type_template_id_4d15519e___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Logo_vue_vue_type_template_id_4d15519e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/icons/Logo.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/icons/Logo.vue?vue&type=template&id=4d15519e&":
/*!****************************************************************************!*\
  !*** ./resources/components/icons/Logo.vue?vue&type=template&id=4d15519e& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Logo_vue_vue_type_template_id_4d15519e___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./Logo.vue?vue&type=template&id=4d15519e& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/icons/Logo.vue?vue&type=template&id=4d15519e&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Logo_vue_vue_type_template_id_4d15519e___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Logo_vue_vue_type_template_id_4d15519e___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/icons/bicycle.vue":
/*!************************************************!*\
  !*** ./resources/components/icons/bicycle.vue ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _bicycle_vue_vue_type_template_id_e1512dee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./bicycle.vue?vue&type=template&id=e1512dee& */ "./resources/components/icons/bicycle.vue?vue&type=template&id=e1512dee&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");

var script = {}


/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_1__["default"])(
  script,
  _bicycle_vue_vue_type_template_id_e1512dee___WEBPACK_IMPORTED_MODULE_0__["render"],
  _bicycle_vue_vue_type_template_id_e1512dee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  null,
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/icons/bicycle.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/icons/bicycle.vue?vue&type=template&id=e1512dee&":
/*!*******************************************************************************!*\
  !*** ./resources/components/icons/bicycle.vue?vue&type=template&id=e1512dee& ***!
  \*******************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_bicycle_vue_vue_type_template_id_e1512dee___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./bicycle.vue?vue&type=template&id=e1512dee& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/icons/bicycle.vue?vue&type=template&id=e1512dee&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_bicycle_vue_vue_type_template_id_e1512dee___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_bicycle_vue_vue_type_template_id_e1512dee___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/components/locations_holder.vue":
/*!***************************************************!*\
  !*** ./resources/components/locations_holder.vue ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _locations_holder_vue_vue_type_template_id_11c1c004_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./locations_holder.vue?vue&type=template&id=11c1c004&scoped=true& */ "./resources/components/locations_holder.vue?vue&type=template&id=11c1c004&scoped=true&");
/* harmony import */ var _locations_holder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./locations_holder.vue?vue&type=script&lang=js& */ "./resources/components/locations_holder.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css& */ "./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _locations_holder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _locations_holder_vue_vue_type_template_id_11c1c004_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _locations_holder_vue_vue_type_template_id_11c1c004_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "11c1c004",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/components/locations_holder.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/components/locations_holder.vue?vue&type=script&lang=js&":
/*!****************************************************************************!*\
  !*** ./resources/components/locations_holder.vue?vue&type=script&lang=js& ***!
  \****************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--4-0!../../node_modules/vue-loader/lib??vue-loader-options!./locations_holder.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css&":
/*!************************************************************************************************************!*\
  !*** ./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css& ***!
  \************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/style-loader!../../node_modules/css-loader??ref--6-1!../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/src??ref--6-2!../../node_modules/vue-loader/lib??vue-loader-options!./locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=style&index=0&id=11c1c004&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_style_index_0_id_11c1c004_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/components/locations_holder.vue?vue&type=template&id=11c1c004&scoped=true&":
/*!**********************************************************************************************!*\
  !*** ./resources/components/locations_holder.vue?vue&type=template&id=11c1c004&scoped=true& ***!
  \**********************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_template_id_11c1c004_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./locations_holder.vue?vue&type=template&id=11c1c004&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/components/locations_holder.vue?vue&type=template&id=11c1c004&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_template_id_11c1c004_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_locations_holder_vue_vue_type_template_id_11c1c004_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/bootstrap.js":
/*!***********************************!*\
  !*** ./resources/js/bootstrap.js ***!
  \***********************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue */ "./node_modules/vue/dist/vue.common.js");
/* harmony import */ var vue__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(vue__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue-router */ "./node_modules/vue-router/dist/vue-router.esm.js");
/* harmony import */ var uiv__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! uiv */ "./node_modules/uiv/dist/uiv.esm.js");



window.Vue = vue__WEBPACK_IMPORTED_MODULE_0___default.a;
window.VueRouter = vue_router__WEBPACK_IMPORTED_MODULE_1__["default"];
window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(vue_router__WEBPACK_IMPORTED_MODULE_1__["default"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(uiv__WEBPACK_IMPORTED_MODULE_2__);

/***/ }),

/***/ "./resources/js/main.js":
/*!******************************!*\
  !*** ./resources/js/main.js ***!
  \******************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _routes_routes__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./routes/routes */ "./resources/js/routes/routes.js");
/* harmony import */ var vue2_google_maps__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! vue2-google-maps */ "./node_modules/vue2-google-maps/dist/main.js");
/* harmony import */ var vue2_google_maps__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(vue2_google_maps__WEBPACK_IMPORTED_MODULE_1__);
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");



Vue.use(vue2_google_maps__WEBPACK_IMPORTED_MODULE_1__, {
  load: {
    key: "AIzaSyB3TJYJHakiZKnM2W0q1JuqFlHzel7sKis",
    libraries: "places" // necessary for places input

  }
});
var app = new Vue({
  el: '#app',
  router: _routes_routes__WEBPACK_IMPORTED_MODULE_0__["default"]
});

/***/ }),

/***/ "./resources/js/pages/dashboard.vue":
/*!******************************************!*\
  !*** ./resources/js/pages/dashboard.vue ***!
  \******************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _dashboard_vue_vue_type_template_id_e1aead0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./dashboard.vue?vue&type=template&id=e1aead0a&scoped=true& */ "./resources/js/pages/dashboard.vue?vue&type=template&id=e1aead0a&scoped=true&");
/* harmony import */ var _dashboard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./dashboard.vue?vue&type=script&lang=js& */ "./resources/js/pages/dashboard.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css& */ "./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _dashboard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _dashboard_vue_vue_type_template_id_e1aead0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _dashboard_vue_vue_type_template_id_e1aead0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "e1aead0a",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/dashboard.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/dashboard.vue?vue&type=script&lang=js&":
/*!*******************************************************************!*\
  !*** ./resources/js/pages/dashboard.vue?vue&type=script&lang=js& ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./dashboard.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css&":
/*!***************************************************************************************************!*\
  !*** ./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css& ***!
  \***************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=style&index=0&id=e1aead0a&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_style_index_0_id_e1aead0a_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/dashboard.vue?vue&type=template&id=e1aead0a&scoped=true&":
/*!*************************************************************************************!*\
  !*** ./resources/js/pages/dashboard.vue?vue&type=template&id=e1aead0a&scoped=true& ***!
  \*************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_template_id_e1aead0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./dashboard.vue?vue&type=template&id=e1aead0a&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=template&id=e1aead0a&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_template_id_e1aead0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_dashboard_vue_vue_type_template_id_e1aead0a_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/pages/login.vue":
/*!**************************************!*\
  !*** ./resources/js/pages/login.vue ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _login_vue_vue_type_template_id_780e8960_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./login.vue?vue&type=template&id=780e8960&scoped=true& */ "./resources/js/pages/login.vue?vue&type=template&id=780e8960&scoped=true&");
/* harmony import */ var _login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./login.vue?vue&type=script&lang=js& */ "./resources/js/pages/login.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css& */ "./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css&");
/* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");






/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_3__["default"])(
  _login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _login_vue_vue_type_template_id_780e8960_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _login_vue_vue_type_template_id_780e8960_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "780e8960",
  null
  
)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/pages/login.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/pages/login.vue?vue&type=script&lang=js&":
/*!***************************************************************!*\
  !*** ./resources/js/pages/login.vue?vue&type=script&lang=js& ***!
  \***************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]); 

/***/ }),

/***/ "./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css&":
/*!***********************************************************************************************!*\
  !*** ./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css& ***!
  \***********************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader??ref--6-1!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--6-2!../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js?!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&scoped=true&lang=css&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_ref_6_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_6_2_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_scoped_true_lang_css___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "./resources/js/pages/login.vue?vue&type=template&id=780e8960&scoped=true&":
/*!*********************************************************************************!*\
  !*** ./resources/js/pages/login.vue?vue&type=template&id=780e8960&scoped=true& ***!
  \*********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_template_id_780e8960_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=template&id=780e8960&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=template&id=780e8960&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_template_id_780e8960_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_template_id_780e8960_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ }),

/***/ "./resources/js/routes/routes.js":
/*!***************************************!*\
  !*** ./resources/js/routes/routes.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var vue_router__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! vue-router */ "./node_modules/vue-router/dist/vue-router.esm.js");
/* harmony import */ var _pages_login__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../pages/login */ "./resources/js/pages/login.vue");
/* harmony import */ var _pages_dashboard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../pages/dashboard */ "./resources/js/pages/dashboard.vue");



var routes = [{
  path: '/',
  component: _pages_login__WEBPACK_IMPORTED_MODULE_1__["default"],
  meta: {
    title: "Quiklease - login",
    metaTags: [{
      name: "description",
      content: "De inlogpagina voor QuikLease"
    }, {
      property: "og:description",
      content: "De inlogpagina voor QuikLease"
    }]
  }
}, {
  path: '/dashboard',
  component: _pages_dashboard__WEBPACK_IMPORTED_MODULE_2__["default"],
  meta: {
    title: "Quiklease - dashboard",
    metaTags: [{
      name: "description",
      content: "dashboard"
    }, {
      property: "og:description",
      content: "dashboard"
    }]
  }
}];
var router = new vue_router__WEBPACK_IMPORTED_MODULE_0__["default"]({
  routes: routes // mode: 'history'

});
/* harmony default export */ __webpack_exports__["default"] = (router);

/***/ }),

/***/ "./resources/styles/main.scss":
/*!************************************!*\
  !*** ./resources/styles/main.scss ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),

/***/ 0:
/*!*****************************************************************!*\
  !*** multi ./resources/js/main.js ./resources/styles/main.scss ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! C:\Users\lucas\source\repos\AdriaanGiel\QuikLease\resources\js\main.js */"./resources/js/main.js");
module.exports = __webpack_require__(/*! C:\Users\lucas\source\repos\AdriaanGiel\QuikLease\resources\styles\main.scss */"./resources/styles/main.scss");


/***/ })

},[[0,"/public/javascript/manifest","/public/javascript/vendor"]]]);