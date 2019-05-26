(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["/public/javascript/app"],{

/***/ "./node_modules/@babel/runtime/regenerator/index.js":
/*!**********************************************************!*\
  !*** ./node_modules/@babel/runtime/regenerator/index.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! regenerator-runtime */ "./node_modules/regenerator-runtime/runtime.js");


/***/ }),

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

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/dashboard.vue?vue&type=script&lang=js&":
/*!***************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/dashboard.vue?vue&type=script&lang=js& ***!
  \***************************************************************************************************************************************************************/
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
/* harmony default export */ __webpack_exports__["default"] = ({
  name: "dashboard"
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
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _policies_authenticate__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../policies/authenticate */ "./resources/js/policies/authenticate.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

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

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "login",
  watch: {
    userData: {
      handler: function handler(val) {
        if (this.userData.email !== "" && this.userData.password !== "") {
          this.changeButton(false);
        } else {
          this.changeButton(true);
        }
      },
      deep: true
    }
  },
  data: function data() {
    return {
      showForm: true,
      userData: {
        email: "",
        password: ""
      },
      submitForm: true,
      showLoader: false,
      verificationCode: 0,
      token: ""
    };
  },
  methods: {
    changeButton: function changeButton(val) {
      this.submitForm = val;
    },
    loginAndSwitchToVerification: function () {
      var _loginAndSwitchToVerification = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(e) {
        var _this = this;

        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                e.preventDefault();
                this.showLoader = true;
                _policies_authenticate__WEBPACK_IMPORTED_MODULE_1__["default"].getToken(this.userData).then(function (res) {
                  _this.token = res.data.token;
                  _this.showLoader = false;
                  _this.showForm = false;
                  _this.submitForm = true;
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function loginAndSwitchToVerification(_x) {
        return _loginAndSwitchToVerification.apply(this, arguments);
      }

      return loginAndSwitchToVerification;
    }(),
    verifyCode: function () {
      var _verifyCode = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(e) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                e.preventDefault();
                _policies_authenticate__WEBPACK_IMPORTED_MODULE_1__["default"].handleToken(code, this.token).then(function (res) {});

              case 2:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function verifyCode(_x2) {
        return _verifyCode.apply(this, arguments);
      }

      return verifyCode;
    }()
  }
});

/***/ }),

/***/ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true&":
/*!************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/lib/loader.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true& ***!
  \************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ "./node_modules/css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".login-wrapper[data-v-780e8960] {\n  height: 100vh;\n  width: 100vw;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-form[data-v-780e8960] {\n  width: 50%;\n  height: 50%;\n  background-color: #4cae4c;\n  padding: 0 1.5em;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.login-form .button-box[data-v-780e8960] {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.spin[data-v-780e8960] {\n  -webkit-transform-origin: 50% 58%;\n  transform-origin: 50% 58%;\n  -ms-transform-origin: 50% 58%;\n  /* IE 9 */\n  -webkit-animation: spin 0.2s infinite linear;\n  animation: spin 0.2s infinite linear;\n}", ""]);

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

/***/ "./node_modules/material-components-vue/dist/text-field/index.js":
/*!***********************************************************************!*\
  !*** ./node_modules/material-components-vue/dist/text-field/index.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

(function webpackUniversalModuleDefinition(root, factory) {
	if(true)
		module.exports = factory();
	else { var i, a; }
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./components/text-field/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./components/base/baseComponentMixin.js":
/*!***********************************************!*\
  !*** ./components/base/baseComponentMixin.js ***!
  \***********************************************/
/*! exports provided: baseComponentMixin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return baseComponentMixin; });\nvar baseComponentMixin = {\n  inheritAttrs: false\n};\n\n//# sourceURL=webpack:///./components/base/baseComponentMixin.js?");

/***/ }),

/***/ "./components/base/index.js":
/*!**********************************!*\
  !*** ./components/base/index.js ***!
  \**********************************/
/*! exports provided: baseComponentMixin, themeClassMixin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./baseComponentMixin.js */ \"./components/base/baseComponentMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"baseComponentMixin\", function() { return _baseComponentMixin_js__WEBPACK_IMPORTED_MODULE_0__[\"baseComponentMixin\"]; });\n\n/* harmony import */ var _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./themeClassMixin.js */ \"./components/base/themeClassMixin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return _themeClassMixin_js__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]; });\n\n\n\n\n//# sourceURL=webpack:///./components/base/index.js?");

/***/ }),

/***/ "./components/base/themeClassMixin.js":
/*!********************************************!*\
  !*** ./components/base/themeClassMixin.js ***!
  \********************************************/
/*! exports provided: themeClassMixin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"themeClassMixin\", function() { return themeClassMixin; });\nvar themeProps = ['primary', 'secondary', 'background', 'surface', 'on-primary', 'on-secondary', 'on-surface', 'primary-bg', 'secondary-bg', 'text-primary-on-light', 'text-secondary-on-light', 'text-hint-on-light', 'text-disabled-on-light', 'text-icon-on-light', 'text-primary-on-dark', 'text-secondary-on-dark', 'text-hint-on-dark', 'text-disabled-on-dark', 'text-icon-on-dark'];\nvar themeClassMixin = {\n  props: {\n    theming: {\n      type: String,\n      default: ''\n    }\n  },\n  mounted: function mounted() {\n    if (themeProps.indexOf(this.theming) > -1) {\n      this.$el.classList.add('mdc-theme--' + this.theming);\n    }\n  }\n};\n\n//# sourceURL=webpack:///./components/base/themeClassMixin.js?");

/***/ }),

/***/ "./components/index.js":
/*!*****************************!*\
  !*** ./components/index.js ***!
  \*****************************/
/*! exports provided: initPlugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _initPlugin_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./initPlugin.js */ \"./components/initPlugin.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return _initPlugin_js__WEBPACK_IMPORTED_MODULE_0__[\"initPlugin\"]; });\n\n\n\n//# sourceURL=webpack:///./components/index.js?");

/***/ }),

/***/ "./components/initPlugin.js":
/*!**********************************!*\
  !*** ./components/initPlugin.js ***!
  \**********************************/
/*! exports provided: initPlugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"initPlugin\", function() { return initPlugin; });\nfunction initPlugin(plugin) {\n  if (typeof window !== 'undefined' && window.Vue) {\n    window.Vue.use(plugin);\n  }\n}\n\n//# sourceURL=webpack:///./components/initPlugin.js?");

/***/ }),

/***/ "./components/text-field/TextField.vue":
/*!*********************************************!*\
  !*** ./components/text-field/TextField.vue ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TextField_vue_vue_type_template_id_3bfbbbf3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextField.vue?vue&type=template&id=3bfbbbf3& */ \"./components/text-field/TextField.vue?vue&type=template&id=3bfbbbf3&\");\n/* harmony import */ var _TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextField.vue?vue&type=script&lang=js& */ \"./components/text-field/TextField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _TextField_vue_vue_type_template_id_3bfbbbf3___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _TextField_vue_vue_type_template_id_3bfbbbf3___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/text-field/TextField.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/text-field/TextField.vue?");

/***/ }),

/***/ "./components/text-field/TextField.vue?vue&type=script&lang=js&":
/*!**********************************************************************!*\
  !*** ./components/text-field/TextField.vue?vue&type=script&lang=js& ***!
  \**********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./TextField.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextField.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/text-field/TextField.vue?");

/***/ }),

/***/ "./components/text-field/TextField.vue?vue&type=template&id=3bfbbbf3&":
/*!****************************************************************************!*\
  !*** ./components/text-field/TextField.vue?vue&type=template&id=3bfbbbf3& ***!
  \****************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_template_id_3bfbbbf3___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./TextField.vue?vue&type=template&id=3bfbbbf3& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextField.vue?vue&type=template&id=3bfbbbf3&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_template_id_3bfbbbf3___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextField_vue_vue_type_template_id_3bfbbbf3___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/text-field/TextField.vue?");

/***/ }),

/***/ "./components/text-field/TextFieldCharacterCounter.vue":
/*!*************************************************************!*\
  !*** ./components/text-field/TextFieldCharacterCounter.vue ***!
  \*************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TextFieldCharacterCounter_vue_vue_type_template_id_16c35b26_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true& */ \"./components/text-field/TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true&\");\n/* harmony import */ var _TextFieldCharacterCounter_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextFieldCharacterCounter.vue?vue&type=script&lang=js& */ \"./components/text-field/TextFieldCharacterCounter.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _TextFieldCharacterCounter_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _TextFieldCharacterCounter_vue_vue_type_template_id_16c35b26_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _TextFieldCharacterCounter_vue_vue_type_template_id_16c35b26_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  \"16c35b26\",\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/text-field/TextFieldCharacterCounter.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/text-field/TextFieldCharacterCounter.vue?");

/***/ }),

/***/ "./components/text-field/TextFieldCharacterCounter.vue?vue&type=script&lang=js&":
/*!**************************************************************************************!*\
  !*** ./components/text-field/TextFieldCharacterCounter.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldCharacterCounter_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./TextFieldCharacterCounter.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldCharacterCounter.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldCharacterCounter_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/text-field/TextFieldCharacterCounter.vue?");

/***/ }),

/***/ "./components/text-field/TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true&":
/*!********************************************************************************************************!*\
  !*** ./components/text-field/TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true& ***!
  \********************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldCharacterCounter_vue_vue_type_template_id_16c35b26_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldCharacterCounter_vue_vue_type_template_id_16c35b26_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldCharacterCounter_vue_vue_type_template_id_16c35b26_scoped_true___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/text-field/TextFieldCharacterCounter.vue?");

/***/ }),

/***/ "./components/text-field/TextFieldHelperText.vue":
/*!*******************************************************!*\
  !*** ./components/text-field/TextFieldHelperText.vue ***!
  \*******************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TextFieldHelperText_vue_vue_type_template_id_e894c264___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextFieldHelperText.vue?vue&type=template&id=e894c264& */ \"./components/text-field/TextFieldHelperText.vue?vue&type=template&id=e894c264&\");\n/* harmony import */ var _TextFieldHelperText_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextFieldHelperText.vue?vue&type=script&lang=js& */ \"./components/text-field/TextFieldHelperText.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ \"./node_modules/vue-loader/lib/runtime/componentNormalizer.js\");\n\n\n\n\n\n/* normalize component */\n\nvar component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"])(\n  _TextFieldHelperText_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__[\"default\"],\n  _TextFieldHelperText_vue_vue_type_template_id_e894c264___WEBPACK_IMPORTED_MODULE_0__[\"render\"],\n  _TextFieldHelperText_vue_vue_type_template_id_e894c264___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"],\n  false,\n  null,\n  null,\n  null\n  \n)\n\n/* hot reload */\nif (false) { var api; }\ncomponent.options.__file = \"components/text-field/TextFieldHelperText.vue\"\n/* harmony default export */ __webpack_exports__[\"default\"] = (component.exports);\n\n//# sourceURL=webpack:///./components/text-field/TextFieldHelperText.vue?");

/***/ }),

/***/ "./components/text-field/TextFieldHelperText.vue?vue&type=script&lang=js&":
/*!********************************************************************************!*\
  !*** ./components/text-field/TextFieldHelperText.vue?vue&type=script&lang=js& ***!
  \********************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldHelperText_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/babel-loader/lib??ref--1!../../node_modules/vue-loader/lib??vue-loader-options!./TextFieldHelperText.vue?vue&type=script&lang=js& */ \"./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldHelperText.vue?vue&type=script&lang=js&\");\n/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__[\"default\"] = (_node_modules_babel_loader_lib_index_js_ref_1_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldHelperText_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__[\"default\"]); \n\n//# sourceURL=webpack:///./components/text-field/TextFieldHelperText.vue?");

/***/ }),

/***/ "./components/text-field/TextFieldHelperText.vue?vue&type=template&id=e894c264&":
/*!**************************************************************************************!*\
  !*** ./components/text-field/TextFieldHelperText.vue?vue&type=template&id=e894c264& ***!
  \**************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldHelperText_vue_vue_type_template_id_e894c264___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../node_modules/vue-loader/lib??vue-loader-options!./TextFieldHelperText.vue?vue&type=template&id=e894c264& */ \"./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldHelperText.vue?vue&type=template&id=e894c264&\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldHelperText_vue_vue_type_template_id_e894c264___WEBPACK_IMPORTED_MODULE_0__[\"render\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_TextFieldHelperText_vue_vue_type_template_id_e894c264___WEBPACK_IMPORTED_MODULE_0__[\"staticRenderFns\"]; });\n\n\n\n//# sourceURL=webpack:///./components/text-field/TextFieldHelperText.vue?");

/***/ }),

/***/ "./components/text-field/index.js":
/*!****************************************!*\
  !*** ./components/text-field/index.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _TextField_vue__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./TextField.vue */ \"./components/text-field/TextField.vue\");\n/* harmony import */ var _TextFieldHelperText_vue__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./TextFieldHelperText.vue */ \"./components/text-field/TextFieldHelperText.vue\");\n/* harmony import */ var _TextFieldCharacterCounter__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./TextFieldCharacterCounter */ \"./components/text-field/TextFieldCharacterCounter.vue\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./styles.scss */ \"./components/text-field/styles.scss\");\n/* harmony import */ var _styles_scss__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_styles_scss__WEBPACK_IMPORTED_MODULE_3__);\n/* harmony import */ var ___WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../ */ \"./components/index.js\");\n\n\n\n\n\nvar plugin = {\n  install: function install(vm) {\n    vm.component('m-text-field', _TextField_vue__WEBPACK_IMPORTED_MODULE_0__[\"default\"]);\n    vm.component('m-text-field-helper-text', _TextFieldHelperText_vue__WEBPACK_IMPORTED_MODULE_1__[\"default\"]);\n    vm.component('m-text-field-character-counter', _TextFieldCharacterCounter__WEBPACK_IMPORTED_MODULE_2__[\"default\"]);\n  }\n};\n/* harmony default export */ __webpack_exports__[\"default\"] = (plugin);\nObject(___WEBPACK_IMPORTED_MODULE_4__[\"initPlugin\"])(plugin);\n\n//# sourceURL=webpack:///./components/text-field/index.js?");

/***/ }),

/***/ "./components/text-field/styles.scss":
/*!*******************************************!*\
  !*** ./components/text-field/styles.scss ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("// extracted by mini-css-extract-plugin\n\n//# sourceURL=webpack:///./components/text-field/styles.scss?");

/***/ }),

/***/ "./node_modules/@material/base/component.js":
/*!**************************************************!*\
  !*** ./node_modules/@material/base/component.js ***!
  \**************************************************/
/*! exports provided: MDCComponent, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCComponent\", function() { return MDCComponent; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/base/foundation.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\nvar MDCComponent =\n/** @class */\nfunction () {\n  function MDCComponent(root, foundation) {\n    var args = [];\n\n    for (var _i = 2; _i < arguments.length; _i++) {\n      args[_i - 2] = arguments[_i];\n    }\n\n    this.root_ = root;\n    this.initialize.apply(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__spread\"](args)); // Note that we initialize foundation here and not within the constructor's default param so that\n    // this.root_ is defined and can be used within the foundation class.\n\n    this.foundation_ = foundation === undefined ? this.getDefaultFoundation() : foundation;\n    this.foundation_.init();\n    this.initialSyncWithDOM();\n  }\n\n  MDCComponent.attachTo = function (root) {\n    // Subclasses which extend MDCBase should provide an attachTo() method that takes a root element and\n    // returns an instantiated component with its root set to that element. Also note that in the cases of\n    // subclasses, an explicit foundation class will not have to be passed in; it will simply be initialized\n    // from getDefaultFoundation().\n    return new MDCComponent(root, new _foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]({}));\n  };\n  /* istanbul ignore next: method param only exists for typing purposes; it does not need to be unit tested */\n\n\n  MDCComponent.prototype.initialize = function () {\n    var _args = [];\n\n    for (var _i = 0; _i < arguments.length; _i++) {\n      _args[_i] = arguments[_i];\n    } // Subclasses can override this to do any additional setup work that would be considered part of a\n    // \"constructor\". Essentially, it is a hook into the parent constructor before the foundation is\n    // initialized. Any additional arguments besides root and foundation will be passed in here.\n\n  };\n\n  MDCComponent.prototype.getDefaultFoundation = function () {\n    // Subclasses must override this method to return a properly configured foundation class for the\n    // component.\n    throw new Error('Subclasses must override getDefaultFoundation to return a properly configured ' + 'foundation class');\n  };\n\n  MDCComponent.prototype.initialSyncWithDOM = function () {// Subclasses should override this method if they need to perform work to synchronize with a host DOM\n    // object. An example of this would be a form control wrapper that needs to synchronize its internal state\n    // to some property or attribute of the host DOM. Please note: this is *not* the place to perform DOM\n    // reads/writes that would cause layout / paint, as this is called synchronously from within the constructor.\n  };\n\n  MDCComponent.prototype.destroy = function () {\n    // Subclasses may implement this method to release any resources / deregister any listeners they have\n    // attached. An example of this might be deregistering a resize event from the window object.\n    this.foundation_.destroy();\n  };\n\n  MDCComponent.prototype.listen = function (evtType, handler) {\n    this.root_.addEventListener(evtType, handler);\n  };\n\n  MDCComponent.prototype.unlisten = function (evtType, handler) {\n    this.root_.removeEventListener(evtType, handler);\n  };\n  /**\n   * Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.\n   */\n\n\n  MDCComponent.prototype.emit = function (evtType, evtData, shouldBubble) {\n    if (shouldBubble === void 0) {\n      shouldBubble = false;\n    }\n\n    var evt;\n\n    if (typeof CustomEvent === 'function') {\n      evt = new CustomEvent(evtType, {\n        bubbles: shouldBubble,\n        detail: evtData\n      });\n    } else {\n      evt = document.createEvent('CustomEvent');\n      evt.initCustomEvent(evtType, shouldBubble, false, evtData);\n    }\n\n    this.root_.dispatchEvent(evt);\n  };\n\n  return MDCComponent;\n}();\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCComponent);\n\n//# sourceURL=webpack:///./node_modules/@material/base/component.js?");

/***/ }),

/***/ "./node_modules/@material/base/foundation.js":
/*!***************************************************!*\
  !*** ./node_modules/@material/base/foundation.js ***!
  \***************************************************/
/*! exports provided: MDCFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCFoundation\", function() { return MDCFoundation; });\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar MDCFoundation =\n/** @class */\nfunction () {\n  function MDCFoundation(adapter) {\n    if (adapter === void 0) {\n      adapter = {};\n    }\n\n    this.adapter_ = adapter;\n  }\n\n  Object.defineProperty(MDCFoundation, \"cssClasses\", {\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports every\n      // CSS class the foundation class needs as a property. e.g. {ACTIVE: 'mdc-component--active'}\n      return {};\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCFoundation, \"strings\", {\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // semantic strings as constants. e.g. {ARIA_ROLE: 'tablist'}\n      return {};\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCFoundation, \"numbers\", {\n    get: function get() {\n      // Classes extending MDCFoundation should implement this method to return an object which exports all\n      // of its semantic numbers as constants. e.g. {ANIMATION_DELAY_MS: 350}\n      return {};\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCFoundation, \"defaultAdapter\", {\n    get: function get() {\n      // Classes extending MDCFoundation may choose to implement this getter in order to provide a convenient\n      // way of viewing the necessary methods of an adapter. In the future, this could also be used for adapter\n      // validation.\n      return {};\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCFoundation.prototype.init = function () {// Subclasses should override this method to perform initialization routines (registering events, etc.)\n  };\n\n  MDCFoundation.prototype.destroy = function () {// Subclasses should override this method to perform de-initialization routines (de-registering events, etc.)\n  };\n\n  return MDCFoundation;\n}();\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/base/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/dom/ponyfill.js":
/*!************************************************!*\
  !*** ./node_modules/@material/dom/ponyfill.js ***!
  \************************************************/
/*! exports provided: closest, matches */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"closest\", function() { return closest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"matches\", function() { return matches; });\n/**\n * @license\n * Copyright 2018 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n/**\n * @fileoverview A \"ponyfill\" is a polyfill that doesn't modify the global prototype chain.\n * This makes ponyfills safer than traditional polyfills, especially for libraries like MDC.\n */\nfunction closest(element, selector) {\n  if (element.closest) {\n    return element.closest(selector);\n  }\n\n  var el = element;\n\n  while (el) {\n    if (matches(el, selector)) {\n      return el;\n    }\n\n    el = el.parentElement;\n  }\n\n  return null;\n}\nfunction matches(element, selector) {\n  var nativeMatches = element.matches || element.webkitMatchesSelector || element.msMatchesSelector;\n  return nativeMatches.call(element, selector);\n}\n\n//# sourceURL=webpack:///./node_modules/@material/dom/ponyfill.js?");

/***/ }),

/***/ "./node_modules/@material/floating-label/component.js":
/*!************************************************************!*\
  !*** ./node_modules/@material/floating-label/component.js ***!
  \************************************************************/
/*! exports provided: MDCFloatingLabel */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCFloatingLabel\", function() { return MDCFloatingLabel; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/floating-label/foundation.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCFloatingLabel =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCFloatingLabel, _super);\n\n  function MDCFloatingLabel() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCFloatingLabel.attachTo = function (root) {\n    return new MDCFloatingLabel(root);\n  };\n  /**\n   * Styles the label to produce the label shake for errors.\n   * @param shouldShake If true, shakes the label by adding a CSS class; otherwise, stops shaking by removing the class.\n   */\n\n\n  MDCFloatingLabel.prototype.shake = function (shouldShake) {\n    this.foundation_.shake(shouldShake);\n  };\n  /**\n   * Styles the label to float/dock.\n   * @param shouldFloat If true, floats the label by adding a CSS class; otherwise, docks it by removing the class.\n   */\n\n\n  MDCFloatingLabel.prototype.float = function (shouldFloat) {\n    this.foundation_.float(shouldFloat);\n  };\n\n  MDCFloatingLabel.prototype.getWidth = function () {\n    return this.foundation_.getWidth();\n  };\n\n  MDCFloatingLabel.prototype.getDefaultFoundation = function () {\n    var _this = this; // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    var adapter = {\n      addClass: function addClass(className) {\n        return _this.root_.classList.add(className);\n      },\n      removeClass: function removeClass(className) {\n        return _this.root_.classList.remove(className);\n      },\n      getWidth: function getWidth() {\n        return _this.root_.scrollWidth;\n      },\n      registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n        return _this.listen(evtType, handler);\n      },\n      deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n        return _this.unlisten(evtType, handler);\n      }\n    }; // tslint:enable:object-literal-sort-keys\n\n    return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCFloatingLabelFoundation\"](adapter);\n  };\n\n  return MDCFloatingLabel;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/component.js?");

/***/ }),

/***/ "./node_modules/@material/floating-label/constants.js":
/*!************************************************************!*\
  !*** ./node_modules/@material/floating-label/constants.js ***!
  \************************************************************/
/*! exports provided: cssClasses */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar cssClasses = {\n  LABEL_FLOAT_ABOVE: 'mdc-floating-label--float-above',\n  LABEL_SHAKE: 'mdc-floating-label--shake',\n  ROOT: 'mdc-floating-label'\n};\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/constants.js?");

/***/ }),

/***/ "./node_modules/@material/floating-label/foundation.js":
/*!*************************************************************!*\
  !*** ./node_modules/@material/floating-label/foundation.js ***!
  \*************************************************************/
/*! exports provided: MDCFloatingLabelFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCFloatingLabelFoundation\", function() { return MDCFloatingLabelFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/floating-label/constants.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCFloatingLabelFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCFloatingLabelFoundation, _super);\n\n  function MDCFloatingLabelFoundation(adapter) {\n    var _this = _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCFloatingLabelFoundation.defaultAdapter, adapter)) || this;\n\n    _this.shakeAnimationEndHandler_ = function () {\n      return _this.handleShakeAnimationEnd_();\n    };\n\n    return _this;\n  }\n\n  Object.defineProperty(MDCFloatingLabelFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCFloatingLabelFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCFloatingLabelAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n      return {\n        addClass: function addClass() {\n          return undefined;\n        },\n        removeClass: function removeClass() {\n          return undefined;\n        },\n        getWidth: function getWidth() {\n          return 0;\n        },\n        registerInteractionHandler: function registerInteractionHandler() {\n          return undefined;\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler() {\n          return undefined;\n        }\n      }; // tslint:enable:object-literal-sort-keys\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCFloatingLabelFoundation.prototype.init = function () {\n    this.adapter_.registerInteractionHandler('animationend', this.shakeAnimationEndHandler_);\n  };\n\n  MDCFloatingLabelFoundation.prototype.destroy = function () {\n    this.adapter_.deregisterInteractionHandler('animationend', this.shakeAnimationEndHandler_);\n  };\n  /**\n   * Returns the width of the label element.\n   */\n\n\n  MDCFloatingLabelFoundation.prototype.getWidth = function () {\n    return this.adapter_.getWidth();\n  };\n  /**\n   * Styles the label to produce a shake animation to indicate an error.\n   * @param shouldShake If true, adds the shake CSS class; otherwise, removes shake class.\n   */\n\n\n  MDCFloatingLabelFoundation.prototype.shake = function (shouldShake) {\n    var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;\n\n    if (shouldShake) {\n      this.adapter_.addClass(LABEL_SHAKE);\n    } else {\n      this.adapter_.removeClass(LABEL_SHAKE);\n    }\n  };\n  /**\n   * Styles the label to float or dock.\n   * @param shouldFloat If true, adds the float CSS class; otherwise, removes float and shake classes to dock the label.\n   */\n\n\n  MDCFloatingLabelFoundation.prototype.float = function (shouldFloat) {\n    var _a = MDCFloatingLabelFoundation.cssClasses,\n        LABEL_FLOAT_ABOVE = _a.LABEL_FLOAT_ABOVE,\n        LABEL_SHAKE = _a.LABEL_SHAKE;\n\n    if (shouldFloat) {\n      this.adapter_.addClass(LABEL_FLOAT_ABOVE);\n    } else {\n      this.adapter_.removeClass(LABEL_FLOAT_ABOVE);\n      this.adapter_.removeClass(LABEL_SHAKE);\n    }\n  };\n\n  MDCFloatingLabelFoundation.prototype.handleShakeAnimationEnd_ = function () {\n    var LABEL_SHAKE = MDCFloatingLabelFoundation.cssClasses.LABEL_SHAKE;\n    this.adapter_.removeClass(LABEL_SHAKE);\n  };\n\n  return MDCFloatingLabelFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCFloatingLabelFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/floating-label/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/line-ripple/component.js":
/*!*********************************************************!*\
  !*** ./node_modules/@material/line-ripple/component.js ***!
  \*********************************************************/
/*! exports provided: MDCLineRipple */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCLineRipple\", function() { return MDCLineRipple; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/line-ripple/foundation.js\");\n/**\n * @license\n * Copyright 2018 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCLineRipple =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCLineRipple, _super);\n\n  function MDCLineRipple() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCLineRipple.attachTo = function (root) {\n    return new MDCLineRipple(root);\n  };\n  /**\n   * Activates the line ripple\n   */\n\n\n  MDCLineRipple.prototype.activate = function () {\n    this.foundation_.activate();\n  };\n  /**\n   * Deactivates the line ripple\n   */\n\n\n  MDCLineRipple.prototype.deactivate = function () {\n    this.foundation_.deactivate();\n  };\n  /**\n   * Sets the transform origin given a user's click location.\n   * The `rippleCenter` is the x-coordinate of the middle of the ripple.\n   */\n\n\n  MDCLineRipple.prototype.setRippleCenter = function (xCoordinate) {\n    this.foundation_.setRippleCenter(xCoordinate);\n  };\n\n  MDCLineRipple.prototype.getDefaultFoundation = function () {\n    var _this = this; // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    var adapter = {\n      addClass: function addClass(className) {\n        return _this.root_.classList.add(className);\n      },\n      removeClass: function removeClass(className) {\n        return _this.root_.classList.remove(className);\n      },\n      hasClass: function hasClass(className) {\n        return _this.root_.classList.contains(className);\n      },\n      setStyle: function setStyle(propertyName, value) {\n        return _this.root_.style.setProperty(propertyName, value);\n      },\n      registerEventHandler: function registerEventHandler(evtType, handler) {\n        return _this.listen(evtType, handler);\n      },\n      deregisterEventHandler: function deregisterEventHandler(evtType, handler) {\n        return _this.unlisten(evtType, handler);\n      }\n    }; // tslint:enable:object-literal-sort-keys\n\n    return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCLineRippleFoundation\"](adapter);\n  };\n\n  return MDCLineRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/component.js?");

/***/ }),

/***/ "./node_modules/@material/line-ripple/constants.js":
/*!*********************************************************!*\
  !*** ./node_modules/@material/line-ripple/constants.js ***!
  \*********************************************************/
/*! exports provided: cssClasses */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2018 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar cssClasses = {\n  LINE_RIPPLE_ACTIVE: 'mdc-line-ripple--active',\n  LINE_RIPPLE_DEACTIVATING: 'mdc-line-ripple--deactivating'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/constants.js?");

/***/ }),

/***/ "./node_modules/@material/line-ripple/foundation.js":
/*!**********************************************************!*\
  !*** ./node_modules/@material/line-ripple/foundation.js ***!
  \**********************************************************/
/*! exports provided: MDCLineRippleFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCLineRippleFoundation\", function() { return MDCLineRippleFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/line-ripple/constants.js\");\n/**\n * @license\n * Copyright 2018 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCLineRippleFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCLineRippleFoundation, _super);\n\n  function MDCLineRippleFoundation(adapter) {\n    var _this = _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCLineRippleFoundation.defaultAdapter, adapter)) || this;\n\n    _this.transitionEndHandler_ = function (evt) {\n      return _this.handleTransitionEnd(evt);\n    };\n\n    return _this;\n  }\n\n  Object.defineProperty(MDCLineRippleFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCLineRippleFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCLineRippleAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n      return {\n        addClass: function addClass() {\n          return undefined;\n        },\n        removeClass: function removeClass() {\n          return undefined;\n        },\n        hasClass: function hasClass() {\n          return false;\n        },\n        setStyle: function setStyle() {\n          return undefined;\n        },\n        registerEventHandler: function registerEventHandler() {\n          return undefined;\n        },\n        deregisterEventHandler: function deregisterEventHandler() {\n          return undefined;\n        }\n      }; // tslint:enable:object-literal-sort-keys\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCLineRippleFoundation.prototype.init = function () {\n    this.adapter_.registerEventHandler('transitionend', this.transitionEndHandler_);\n  };\n\n  MDCLineRippleFoundation.prototype.destroy = function () {\n    this.adapter_.deregisterEventHandler('transitionend', this.transitionEndHandler_);\n  };\n\n  MDCLineRippleFoundation.prototype.activate = function () {\n    this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n    this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_ACTIVE);\n  };\n\n  MDCLineRippleFoundation.prototype.setRippleCenter = function (xCoordinate) {\n    this.adapter_.setStyle('transform-origin', xCoordinate + \"px center\");\n  };\n\n  MDCLineRippleFoundation.prototype.deactivate = function () {\n    this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n  };\n\n  MDCLineRippleFoundation.prototype.handleTransitionEnd = function (evt) {\n    // Wait for the line ripple to be either transparent or opaque\n    // before emitting the animation end event\n    var isDeactivating = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n\n    if (evt.propertyName === 'opacity') {\n      if (isDeactivating) {\n        this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_ACTIVE);\n        this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].LINE_RIPPLE_DEACTIVATING);\n      }\n    }\n  };\n\n  return MDCLineRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCLineRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/line-ripple/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/notched-outline/component.js":
/*!*************************************************************!*\
  !*** ./node_modules/@material/notched-outline/component.js ***!
  \*************************************************************/
/*! exports provided: MDCNotchedOutline */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCNotchedOutline\", function() { return MDCNotchedOutline; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _material_floating_label_foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material/floating-label/foundation */ \"./node_modules/@material/floating-label/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/notched-outline/constants.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/notched-outline/foundation.js\");\n/**\n * @license\n * Copyright 2017 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\n\n\nvar MDCNotchedOutline =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCNotchedOutline, _super);\n\n  function MDCNotchedOutline() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCNotchedOutline.attachTo = function (root) {\n    return new MDCNotchedOutline(root);\n  };\n\n  MDCNotchedOutline.prototype.initialSyncWithDOM = function () {\n    this.notchElement_ = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_3__[\"strings\"].NOTCH_ELEMENT_SELECTOR);\n    var label = this.root_.querySelector('.' + _material_floating_label_foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCFloatingLabelFoundation\"].cssClasses.ROOT);\n\n    if (label) {\n      label.style.transitionDuration = '0s';\n      this.root_.classList.add(_constants__WEBPACK_IMPORTED_MODULE_3__[\"cssClasses\"].OUTLINE_UPGRADED);\n      requestAnimationFrame(function () {\n        label.style.transitionDuration = '';\n      });\n    } else {\n      this.root_.classList.add(_constants__WEBPACK_IMPORTED_MODULE_3__[\"cssClasses\"].NO_LABEL);\n    }\n  };\n  /**\n   * Updates classes and styles to open the notch to the specified width.\n   * @param notchWidth The notch width in the outline.\n   */\n\n\n  MDCNotchedOutline.prototype.notch = function (notchWidth) {\n    this.foundation_.notch(notchWidth);\n  };\n  /**\n   * Updates classes and styles to close the notch.\n   */\n\n\n  MDCNotchedOutline.prototype.closeNotch = function () {\n    this.foundation_.closeNotch();\n  };\n\n  MDCNotchedOutline.prototype.getDefaultFoundation = function () {\n    var _this = this; // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    var adapter = {\n      addClass: function addClass(className) {\n        return _this.root_.classList.add(className);\n      },\n      removeClass: function removeClass(className) {\n        return _this.root_.classList.remove(className);\n      },\n      setNotchWidthProperty: function setNotchWidthProperty(width) {\n        return _this.notchElement_.style.setProperty('width', width + 'px');\n      },\n      removeNotchWidthProperty: function removeNotchWidthProperty() {\n        return _this.notchElement_.style.removeProperty('width');\n      }\n    }; // tslint:enable:object-literal-sort-keys\n\n    return new _foundation__WEBPACK_IMPORTED_MODULE_4__[\"MDCNotchedOutlineFoundation\"](adapter);\n  };\n\n  return MDCNotchedOutline;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/component.js?");

/***/ }),

/***/ "./node_modules/@material/notched-outline/constants.js":
/*!*************************************************************!*\
  !*** ./node_modules/@material/notched-outline/constants.js ***!
  \*************************************************************/
/*! exports provided: cssClasses, numbers, strings */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/**\n * @license\n * Copyright 2018 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar strings = {\n  NOTCH_ELEMENT_SELECTOR: '.mdc-notched-outline__notch'\n};\nvar numbers = {\n  // This should stay in sync with $mdc-notched-outline-padding * 2.\n  NOTCH_ELEMENT_PADDING: 8\n};\nvar cssClasses = {\n  NO_LABEL: 'mdc-notched-outline--no-label',\n  OUTLINE_NOTCHED: 'mdc-notched-outline--notched',\n  OUTLINE_UPGRADED: 'mdc-notched-outline--upgraded'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/constants.js?");

/***/ }),

/***/ "./node_modules/@material/notched-outline/foundation.js":
/*!**************************************************************!*\
  !*** ./node_modules/@material/notched-outline/foundation.js ***!
  \**************************************************************/
/*! exports provided: MDCNotchedOutlineFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCNotchedOutlineFoundation\", function() { return MDCNotchedOutlineFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/notched-outline/constants.js\");\n/**\n * @license\n * Copyright 2017 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCNotchedOutlineFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCNotchedOutlineFoundation, _super);\n\n  function MDCNotchedOutlineFoundation(adapter) {\n    return _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCNotchedOutlineFoundation.defaultAdapter, adapter)) || this;\n  }\n\n  Object.defineProperty(MDCNotchedOutlineFoundation, \"strings\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCNotchedOutlineFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCNotchedOutlineFoundation, \"numbers\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCNotchedOutlineFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCNotchedOutlineAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n      return {\n        addClass: function addClass() {\n          return undefined;\n        },\n        removeClass: function removeClass() {\n          return undefined;\n        },\n        setNotchWidthProperty: function setNotchWidthProperty() {\n          return undefined;\n        },\n        removeNotchWidthProperty: function removeNotchWidthProperty() {\n          return undefined;\n        }\n      }; // tslint:enable:object-literal-sort-keys\n    },\n    enumerable: true,\n    configurable: true\n  });\n  /**\n   * Adds the outline notched selector and updates the notch width calculated based off of notchWidth.\n   */\n\n  MDCNotchedOutlineFoundation.prototype.notch = function (notchWidth) {\n    var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;\n\n    if (notchWidth > 0) {\n      notchWidth += _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].NOTCH_ELEMENT_PADDING; // Add padding from left/right.\n    }\n\n    this.adapter_.setNotchWidthProperty(notchWidth);\n    this.adapter_.addClass(OUTLINE_NOTCHED);\n  };\n  /**\n   * Removes notched outline selector to close the notch in the outline.\n   */\n\n\n  MDCNotchedOutlineFoundation.prototype.closeNotch = function () {\n    var OUTLINE_NOTCHED = MDCNotchedOutlineFoundation.cssClasses.OUTLINE_NOTCHED;\n    this.adapter_.removeClass(OUTLINE_NOTCHED);\n    this.adapter_.removeNotchWidthProperty();\n  };\n\n  return MDCNotchedOutlineFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCNotchedOutlineFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/notched-outline/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/ripple/component.js":
/*!****************************************************!*\
  !*** ./node_modules/@material/ripple/component.js ***!
  \****************************************************/
/*! exports provided: MDCRipple */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCRipple\", function() { return MDCRipple; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _material_dom_ponyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material/dom/ponyfill */ \"./node_modules/@material/dom/ponyfill.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/ripple/foundation.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\n\n\nvar MDCRipple =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCRipple, _super);\n\n  function MDCRipple() {\n    var _this = _super !== null && _super.apply(this, arguments) || this;\n\n    _this.disabled = false;\n    return _this;\n  }\n\n  MDCRipple.attachTo = function (root, opts) {\n    if (opts === void 0) {\n      opts = {\n        isUnbounded: undefined\n      };\n    }\n\n    var ripple = new MDCRipple(root); // Only override unbounded behavior if option is explicitly specified\n\n    if (opts.isUnbounded !== undefined) {\n      ripple.unbounded = opts.isUnbounded;\n    }\n\n    return ripple;\n  };\n\n  MDCRipple.createAdapter = function (instance) {\n    return {\n      addClass: function addClass(className) {\n        return instance.root_.classList.add(className);\n      },\n      browserSupportsCssVars: function browserSupportsCssVars() {\n        return _util__WEBPACK_IMPORTED_MODULE_4__[\"supportsCssVariables\"](window);\n      },\n      computeBoundingRect: function computeBoundingRect() {\n        return instance.root_.getBoundingClientRect();\n      },\n      containsEventTarget: function containsEventTarget(target) {\n        return instance.root_.contains(target);\n      },\n      deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler(evtType, handler) {\n        return document.documentElement.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_4__[\"applyPassive\"]());\n      },\n      deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n        return instance.root_.removeEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_4__[\"applyPassive\"]());\n      },\n      deregisterResizeHandler: function deregisterResizeHandler(handler) {\n        return window.removeEventListener('resize', handler);\n      },\n      getWindowPageOffset: function getWindowPageOffset() {\n        return {\n          x: window.pageXOffset,\n          y: window.pageYOffset\n        };\n      },\n      isSurfaceActive: function isSurfaceActive() {\n        return Object(_material_dom_ponyfill__WEBPACK_IMPORTED_MODULE_2__[\"matches\"])(instance.root_, ':active');\n      },\n      isSurfaceDisabled: function isSurfaceDisabled() {\n        return Boolean(instance.disabled);\n      },\n      isUnbounded: function isUnbounded() {\n        return Boolean(instance.unbounded);\n      },\n      registerDocumentInteractionHandler: function registerDocumentInteractionHandler(evtType, handler) {\n        return document.documentElement.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_4__[\"applyPassive\"]());\n      },\n      registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n        return instance.root_.addEventListener(evtType, handler, _util__WEBPACK_IMPORTED_MODULE_4__[\"applyPassive\"]());\n      },\n      registerResizeHandler: function registerResizeHandler(handler) {\n        return window.addEventListener('resize', handler);\n      },\n      removeClass: function removeClass(className) {\n        return instance.root_.classList.remove(className);\n      },\n      updateCssVariable: function updateCssVariable(varName, value) {\n        return instance.root_.style.setProperty(varName, value);\n      }\n    };\n  };\n\n  Object.defineProperty(MDCRipple.prototype, \"unbounded\", {\n    get: function get() {\n      return Boolean(this.unbounded_);\n    },\n    set: function set(unbounded) {\n      this.unbounded_ = Boolean(unbounded);\n      this.setUnbounded_();\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCRipple.prototype.activate = function () {\n    this.foundation_.activate();\n  };\n\n  MDCRipple.prototype.deactivate = function () {\n    this.foundation_.deactivate();\n  };\n\n  MDCRipple.prototype.layout = function () {\n    this.foundation_.layout();\n  };\n\n  MDCRipple.prototype.getDefaultFoundation = function () {\n    return new _foundation__WEBPACK_IMPORTED_MODULE_3__[\"MDCRippleFoundation\"](MDCRipple.createAdapter(this));\n  };\n\n  MDCRipple.prototype.initialSyncWithDOM = function () {\n    var root = this.root_;\n    this.unbounded = 'mdcRippleIsUnbounded' in root.dataset;\n  };\n  /**\n   * Closure Compiler throws an access control error when directly accessing a\n   * protected or private property inside a getter/setter, like unbounded above.\n   * By accessing the protected property inside a method, we solve that problem.\n   * That's why this function exists.\n   */\n\n\n  MDCRipple.prototype.setUnbounded_ = function () {\n    this.foundation_.setUnbounded(Boolean(this.unbounded_));\n  };\n\n  return MDCRipple;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/component.js?");

/***/ }),

/***/ "./node_modules/@material/ripple/constants.js":
/*!****************************************************!*\
  !*** ./node_modules/@material/ripple/constants.js ***!
  \****************************************************/
/*! exports provided: cssClasses, strings, numbers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar cssClasses = {\n  // Ripple is a special case where the \"root\" component is really a \"mixin\" of sorts,\n  // given that it's an 'upgrade' to an existing component. That being said it is the root\n  // CSS class that all other CSS classes derive from.\n  BG_FOCUSED: 'mdc-ripple-upgraded--background-focused',\n  FG_ACTIVATION: 'mdc-ripple-upgraded--foreground-activation',\n  FG_DEACTIVATION: 'mdc-ripple-upgraded--foreground-deactivation',\n  ROOT: 'mdc-ripple-upgraded',\n  UNBOUNDED: 'mdc-ripple-upgraded--unbounded'\n};\nvar strings = {\n  VAR_FG_SCALE: '--mdc-ripple-fg-scale',\n  VAR_FG_SIZE: '--mdc-ripple-fg-size',\n  VAR_FG_TRANSLATE_END: '--mdc-ripple-fg-translate-end',\n  VAR_FG_TRANSLATE_START: '--mdc-ripple-fg-translate-start',\n  VAR_LEFT: '--mdc-ripple-left',\n  VAR_TOP: '--mdc-ripple-top'\n};\nvar numbers = {\n  DEACTIVATION_TIMEOUT_MS: 225,\n  FG_DEACTIVATION_MS: 150,\n  INITIAL_ORIGIN_SCALE: 0.6,\n  PADDING: 10,\n  TAP_DELAY_MS: 300\n};\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/constants.js?");

/***/ }),

/***/ "./node_modules/@material/ripple/foundation.js":
/*!*****************************************************!*\
  !*** ./node_modules/@material/ripple/foundation.js ***!
  \*****************************************************/
/*! exports provided: MDCRippleFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCRippleFoundation\", function() { return MDCRippleFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/ripple/constants.js\");\n/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util */ \"./node_modules/@material/ripple/util.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n // Activation events registered on the root element of each instance for activation\n\nvar ACTIVATION_EVENT_TYPES = ['touchstart', 'pointerdown', 'mousedown', 'keydown']; // Deactivation events registered on documentElement when a pointer-related down event occurs\n\nvar POINTER_DEACTIVATION_EVENT_TYPES = ['touchend', 'pointerup', 'mouseup', 'contextmenu']; // simultaneous nested activations\n\nvar activatedTargets = [];\n\nvar MDCRippleFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCRippleFoundation, _super);\n\n  function MDCRippleFoundation(adapter) {\n    var _this = _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCRippleFoundation.defaultAdapter, adapter)) || this;\n\n    _this.activationAnimationHasEnded_ = false;\n    _this.activationTimer_ = 0;\n    _this.fgDeactivationRemovalTimer_ = 0;\n    _this.fgScale_ = '0';\n    _this.frame_ = {\n      width: 0,\n      height: 0\n    };\n    _this.initialSize_ = 0;\n    _this.layoutFrame_ = 0;\n    _this.maxRadius_ = 0;\n    _this.unboundedCoords_ = {\n      left: 0,\n      top: 0\n    };\n    _this.activationState_ = _this.defaultActivationState_();\n\n    _this.activationTimerCallback_ = function () {\n      _this.activationAnimationHasEnded_ = true;\n\n      _this.runDeactivationUXLogicIfReady_();\n    };\n\n    _this.activateHandler_ = function (e) {\n      return _this.activate_(e);\n    };\n\n    _this.deactivateHandler_ = function () {\n      return _this.deactivate_();\n    };\n\n    _this.focusHandler_ = function () {\n      return _this.handleFocus();\n    };\n\n    _this.blurHandler_ = function () {\n      return _this.handleBlur();\n    };\n\n    _this.resizeHandler_ = function () {\n      return _this.layout();\n    };\n\n    return _this;\n  }\n\n  Object.defineProperty(MDCRippleFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCRippleFoundation, \"strings\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCRippleFoundation, \"numbers\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCRippleFoundation, \"defaultAdapter\", {\n    get: function get() {\n      return {\n        addClass: function addClass() {\n          return undefined;\n        },\n        browserSupportsCssVars: function browserSupportsCssVars() {\n          return true;\n        },\n        computeBoundingRect: function computeBoundingRect() {\n          return {\n            top: 0,\n            right: 0,\n            bottom: 0,\n            left: 0,\n            width: 0,\n            height: 0\n          };\n        },\n        containsEventTarget: function containsEventTarget() {\n          return true;\n        },\n        deregisterDocumentInteractionHandler: function deregisterDocumentInteractionHandler() {\n          return undefined;\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler() {\n          return undefined;\n        },\n        deregisterResizeHandler: function deregisterResizeHandler() {\n          return undefined;\n        },\n        getWindowPageOffset: function getWindowPageOffset() {\n          return {\n            x: 0,\n            y: 0\n          };\n        },\n        isSurfaceActive: function isSurfaceActive() {\n          return true;\n        },\n        isSurfaceDisabled: function isSurfaceDisabled() {\n          return true;\n        },\n        isUnbounded: function isUnbounded() {\n          return true;\n        },\n        registerDocumentInteractionHandler: function registerDocumentInteractionHandler() {\n          return undefined;\n        },\n        registerInteractionHandler: function registerInteractionHandler() {\n          return undefined;\n        },\n        registerResizeHandler: function registerResizeHandler() {\n          return undefined;\n        },\n        removeClass: function removeClass() {\n          return undefined;\n        },\n        updateCssVariable: function updateCssVariable() {\n          return undefined;\n        }\n      };\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCRippleFoundation.prototype.init = function () {\n    var _this = this;\n\n    var supportsPressRipple = this.supportsPressRipple_();\n    this.registerRootHandlers_(supportsPressRipple);\n\n    if (supportsPressRipple) {\n      var _a = MDCRippleFoundation.cssClasses,\n          ROOT_1 = _a.ROOT,\n          UNBOUNDED_1 = _a.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this.adapter_.addClass(ROOT_1);\n\n        if (_this.adapter_.isUnbounded()) {\n          _this.adapter_.addClass(UNBOUNDED_1); // Unbounded ripples need layout logic applied immediately to set coordinates for both shade and ripple\n\n\n          _this.layoutInternal_();\n        }\n      });\n    }\n  };\n\n  MDCRippleFoundation.prototype.destroy = function () {\n    var _this = this;\n\n    if (this.supportsPressRipple_()) {\n      if (this.activationTimer_) {\n        clearTimeout(this.activationTimer_);\n        this.activationTimer_ = 0;\n        this.adapter_.removeClass(MDCRippleFoundation.cssClasses.FG_ACTIVATION);\n      }\n\n      if (this.fgDeactivationRemovalTimer_) {\n        clearTimeout(this.fgDeactivationRemovalTimer_);\n        this.fgDeactivationRemovalTimer_ = 0;\n        this.adapter_.removeClass(MDCRippleFoundation.cssClasses.FG_DEACTIVATION);\n      }\n\n      var _a = MDCRippleFoundation.cssClasses,\n          ROOT_2 = _a.ROOT,\n          UNBOUNDED_2 = _a.UNBOUNDED;\n      requestAnimationFrame(function () {\n        _this.adapter_.removeClass(ROOT_2);\n\n        _this.adapter_.removeClass(UNBOUNDED_2);\n\n        _this.removeCssVars_();\n      });\n    }\n\n    this.deregisterRootHandlers_();\n    this.deregisterDeactivationHandlers_();\n  };\n  /**\n   * @param evt Optional event containing position information.\n   */\n\n\n  MDCRippleFoundation.prototype.activate = function (evt) {\n    this.activate_(evt);\n  };\n\n  MDCRippleFoundation.prototype.deactivate = function () {\n    this.deactivate_();\n  };\n\n  MDCRippleFoundation.prototype.layout = function () {\n    var _this = this;\n\n    if (this.layoutFrame_) {\n      cancelAnimationFrame(this.layoutFrame_);\n    }\n\n    this.layoutFrame_ = requestAnimationFrame(function () {\n      _this.layoutInternal_();\n\n      _this.layoutFrame_ = 0;\n    });\n  };\n\n  MDCRippleFoundation.prototype.setUnbounded = function (unbounded) {\n    var UNBOUNDED = MDCRippleFoundation.cssClasses.UNBOUNDED;\n\n    if (unbounded) {\n      this.adapter_.addClass(UNBOUNDED);\n    } else {\n      this.adapter_.removeClass(UNBOUNDED);\n    }\n  };\n\n  MDCRippleFoundation.prototype.handleFocus = function () {\n    var _this = this;\n\n    requestAnimationFrame(function () {\n      return _this.adapter_.addClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n    });\n  };\n\n  MDCRippleFoundation.prototype.handleBlur = function () {\n    var _this = this;\n\n    requestAnimationFrame(function () {\n      return _this.adapter_.removeClass(MDCRippleFoundation.cssClasses.BG_FOCUSED);\n    });\n  };\n  /**\n   * We compute this property so that we are not querying information about the client\n   * until the point in time where the foundation requests it. This prevents scenarios where\n   * client-side feature-detection may happen too early, such as when components are rendered on the server\n   * and then initialized at mount time on the client.\n   */\n\n\n  MDCRippleFoundation.prototype.supportsPressRipple_ = function () {\n    return this.adapter_.browserSupportsCssVars();\n  };\n\n  MDCRippleFoundation.prototype.defaultActivationState_ = function () {\n    return {\n      activationEvent: undefined,\n      hasDeactivationUXRun: false,\n      isActivated: false,\n      isProgrammatic: false,\n      wasActivatedByPointer: false,\n      wasElementMadeActive: false\n    };\n  };\n  /**\n   * supportsPressRipple Passed from init to save a redundant function call\n   */\n\n\n  MDCRippleFoundation.prototype.registerRootHandlers_ = function (supportsPressRipple) {\n    var _this = this;\n\n    if (supportsPressRipple) {\n      ACTIVATION_EVENT_TYPES.forEach(function (evtType) {\n        _this.adapter_.registerInteractionHandler(evtType, _this.activateHandler_);\n      });\n\n      if (this.adapter_.isUnbounded()) {\n        this.adapter_.registerResizeHandler(this.resizeHandler_);\n      }\n    }\n\n    this.adapter_.registerInteractionHandler('focus', this.focusHandler_);\n    this.adapter_.registerInteractionHandler('blur', this.blurHandler_);\n  };\n\n  MDCRippleFoundation.prototype.registerDeactivationHandlers_ = function (evt) {\n    var _this = this;\n\n    if (evt.type === 'keydown') {\n      this.adapter_.registerInteractionHandler('keyup', this.deactivateHandler_);\n    } else {\n      POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {\n        _this.adapter_.registerDocumentInteractionHandler(evtType, _this.deactivateHandler_);\n      });\n    }\n  };\n\n  MDCRippleFoundation.prototype.deregisterRootHandlers_ = function () {\n    var _this = this;\n\n    ACTIVATION_EVENT_TYPES.forEach(function (evtType) {\n      _this.adapter_.deregisterInteractionHandler(evtType, _this.activateHandler_);\n    });\n    this.adapter_.deregisterInteractionHandler('focus', this.focusHandler_);\n    this.adapter_.deregisterInteractionHandler('blur', this.blurHandler_);\n\n    if (this.adapter_.isUnbounded()) {\n      this.adapter_.deregisterResizeHandler(this.resizeHandler_);\n    }\n  };\n\n  MDCRippleFoundation.prototype.deregisterDeactivationHandlers_ = function () {\n    var _this = this;\n\n    this.adapter_.deregisterInteractionHandler('keyup', this.deactivateHandler_);\n    POINTER_DEACTIVATION_EVENT_TYPES.forEach(function (evtType) {\n      _this.adapter_.deregisterDocumentInteractionHandler(evtType, _this.deactivateHandler_);\n    });\n  };\n\n  MDCRippleFoundation.prototype.removeCssVars_ = function () {\n    var _this = this;\n\n    var rippleStrings = MDCRippleFoundation.strings;\n    var keys = Object.keys(rippleStrings);\n    keys.forEach(function (key) {\n      if (key.indexOf('VAR_') === 0) {\n        _this.adapter_.updateCssVariable(rippleStrings[key], null);\n      }\n    });\n  };\n\n  MDCRippleFoundation.prototype.activate_ = function (evt) {\n    var _this = this;\n\n    if (this.adapter_.isSurfaceDisabled()) {\n      return;\n    }\n\n    var activationState = this.activationState_;\n\n    if (activationState.isActivated) {\n      return;\n    } // Avoid reacting to follow-on events fired by touch device after an already-processed user interaction\n\n\n    var previousActivationEvent = this.previousActivationEvent_;\n    var isSameInteraction = previousActivationEvent && evt !== undefined && previousActivationEvent.type !== evt.type;\n\n    if (isSameInteraction) {\n      return;\n    }\n\n    activationState.isActivated = true;\n    activationState.isProgrammatic = evt === undefined;\n    activationState.activationEvent = evt;\n    activationState.wasActivatedByPointer = activationState.isProgrammatic ? false : evt !== undefined && (evt.type === 'mousedown' || evt.type === 'touchstart' || evt.type === 'pointerdown');\n    var hasActivatedChild = evt !== undefined && activatedTargets.length > 0 && activatedTargets.some(function (target) {\n      return _this.adapter_.containsEventTarget(target);\n    });\n\n    if (hasActivatedChild) {\n      // Immediately reset activation state, while preserving logic that prevents touch follow-on events\n      this.resetActivationState_();\n      return;\n    }\n\n    if (evt !== undefined) {\n      activatedTargets.push(evt.target);\n      this.registerDeactivationHandlers_(evt);\n    }\n\n    activationState.wasElementMadeActive = this.checkElementMadeActive_(evt);\n\n    if (activationState.wasElementMadeActive) {\n      this.animateActivation_();\n    }\n\n    requestAnimationFrame(function () {\n      // Reset array on next frame after the current event has had a chance to bubble to prevent ancestor ripples\n      activatedTargets = [];\n\n      if (!activationState.wasElementMadeActive && evt !== undefined && (evt.key === ' ' || evt.keyCode === 32)) {\n        // If space was pressed, try again within an rAF call to detect :active, because different UAs report\n        // active states inconsistently when they're called within event handling code:\n        // - https://bugs.chromium.org/p/chromium/issues/detail?id=635971\n        // - https://bugzilla.mozilla.org/show_bug.cgi?id=1293741\n        // We try first outside rAF to support Edge, which does not exhibit this problem, but will crash if a CSS\n        // variable is set within a rAF callback for a submit button interaction (#2241).\n        activationState.wasElementMadeActive = _this.checkElementMadeActive_(evt);\n\n        if (activationState.wasElementMadeActive) {\n          _this.animateActivation_();\n        }\n      }\n\n      if (!activationState.wasElementMadeActive) {\n        // Reset activation state immediately if element was not made active.\n        _this.activationState_ = _this.defaultActivationState_();\n      }\n    });\n  };\n\n  MDCRippleFoundation.prototype.checkElementMadeActive_ = function (evt) {\n    return evt !== undefined && evt.type === 'keydown' ? this.adapter_.isSurfaceActive() : true;\n  };\n\n  MDCRippleFoundation.prototype.animateActivation_ = function () {\n    var _this = this;\n\n    var _a = MDCRippleFoundation.strings,\n        VAR_FG_TRANSLATE_START = _a.VAR_FG_TRANSLATE_START,\n        VAR_FG_TRANSLATE_END = _a.VAR_FG_TRANSLATE_END;\n    var _b = MDCRippleFoundation.cssClasses,\n        FG_DEACTIVATION = _b.FG_DEACTIVATION,\n        FG_ACTIVATION = _b.FG_ACTIVATION;\n    var DEACTIVATION_TIMEOUT_MS = MDCRippleFoundation.numbers.DEACTIVATION_TIMEOUT_MS;\n    this.layoutInternal_();\n    var translateStart = '';\n    var translateEnd = '';\n\n    if (!this.adapter_.isUnbounded()) {\n      var _c = this.getFgTranslationCoordinates_(),\n          startPoint = _c.startPoint,\n          endPoint = _c.endPoint;\n\n      translateStart = startPoint.x + \"px, \" + startPoint.y + \"px\";\n      translateEnd = endPoint.x + \"px, \" + endPoint.y + \"px\";\n    }\n\n    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_START, translateStart);\n    this.adapter_.updateCssVariable(VAR_FG_TRANSLATE_END, translateEnd); // Cancel any ongoing activation/deactivation animations\n\n    clearTimeout(this.activationTimer_);\n    clearTimeout(this.fgDeactivationRemovalTimer_);\n    this.rmBoundedActivationClasses_();\n    this.adapter_.removeClass(FG_DEACTIVATION); // Force layout in order to re-trigger the animation.\n\n    this.adapter_.computeBoundingRect();\n    this.adapter_.addClass(FG_ACTIVATION);\n    this.activationTimer_ = setTimeout(function () {\n      return _this.activationTimerCallback_();\n    }, DEACTIVATION_TIMEOUT_MS);\n  };\n\n  MDCRippleFoundation.prototype.getFgTranslationCoordinates_ = function () {\n    var _a = this.activationState_,\n        activationEvent = _a.activationEvent,\n        wasActivatedByPointer = _a.wasActivatedByPointer;\n    var startPoint;\n\n    if (wasActivatedByPointer) {\n      startPoint = Object(_util__WEBPACK_IMPORTED_MODULE_3__[\"getNormalizedEventCoords\"])(activationEvent, this.adapter_.getWindowPageOffset(), this.adapter_.computeBoundingRect());\n    } else {\n      startPoint = {\n        x: this.frame_.width / 2,\n        y: this.frame_.height / 2\n      };\n    } // Center the element around the start point.\n\n\n    startPoint = {\n      x: startPoint.x - this.initialSize_ / 2,\n      y: startPoint.y - this.initialSize_ / 2\n    };\n    var endPoint = {\n      x: this.frame_.width / 2 - this.initialSize_ / 2,\n      y: this.frame_.height / 2 - this.initialSize_ / 2\n    };\n    return {\n      startPoint: startPoint,\n      endPoint: endPoint\n    };\n  };\n\n  MDCRippleFoundation.prototype.runDeactivationUXLogicIfReady_ = function () {\n    var _this = this; // This method is called both when a pointing device is released, and when the activation animation ends.\n    // The deactivation animation should only run after both of those occur.\n\n\n    var FG_DEACTIVATION = MDCRippleFoundation.cssClasses.FG_DEACTIVATION;\n    var _a = this.activationState_,\n        hasDeactivationUXRun = _a.hasDeactivationUXRun,\n        isActivated = _a.isActivated;\n    var activationHasEnded = hasDeactivationUXRun || !isActivated;\n\n    if (activationHasEnded && this.activationAnimationHasEnded_) {\n      this.rmBoundedActivationClasses_();\n      this.adapter_.addClass(FG_DEACTIVATION);\n      this.fgDeactivationRemovalTimer_ = setTimeout(function () {\n        _this.adapter_.removeClass(FG_DEACTIVATION);\n      }, _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].FG_DEACTIVATION_MS);\n    }\n  };\n\n  MDCRippleFoundation.prototype.rmBoundedActivationClasses_ = function () {\n    var FG_ACTIVATION = MDCRippleFoundation.cssClasses.FG_ACTIVATION;\n    this.adapter_.removeClass(FG_ACTIVATION);\n    this.activationAnimationHasEnded_ = false;\n    this.adapter_.computeBoundingRect();\n  };\n\n  MDCRippleFoundation.prototype.resetActivationState_ = function () {\n    var _this = this;\n\n    this.previousActivationEvent_ = this.activationState_.activationEvent;\n    this.activationState_ = this.defaultActivationState_(); // Touch devices may fire additional events for the same interaction within a short time.\n    // Store the previous event until it's safe to assume that subsequent events are for new interactions.\n\n    setTimeout(function () {\n      return _this.previousActivationEvent_ = undefined;\n    }, MDCRippleFoundation.numbers.TAP_DELAY_MS);\n  };\n\n  MDCRippleFoundation.prototype.deactivate_ = function () {\n    var _this = this;\n\n    var activationState = this.activationState_; // This can happen in scenarios such as when you have a keyup event that blurs the element.\n\n    if (!activationState.isActivated) {\n      return;\n    }\n\n    var state = tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, activationState);\n\n    if (activationState.isProgrammatic) {\n      requestAnimationFrame(function () {\n        return _this.animateDeactivation_(state);\n      });\n      this.resetActivationState_();\n    } else {\n      this.deregisterDeactivationHandlers_();\n      requestAnimationFrame(function () {\n        _this.activationState_.hasDeactivationUXRun = true;\n\n        _this.animateDeactivation_(state);\n\n        _this.resetActivationState_();\n      });\n    }\n  };\n\n  MDCRippleFoundation.prototype.animateDeactivation_ = function (_a) {\n    var wasActivatedByPointer = _a.wasActivatedByPointer,\n        wasElementMadeActive = _a.wasElementMadeActive;\n\n    if (wasActivatedByPointer || wasElementMadeActive) {\n      this.runDeactivationUXLogicIfReady_();\n    }\n  };\n\n  MDCRippleFoundation.prototype.layoutInternal_ = function () {\n    var _this = this;\n\n    this.frame_ = this.adapter_.computeBoundingRect();\n    var maxDim = Math.max(this.frame_.height, this.frame_.width); // Surface diameter is treated differently for unbounded vs. bounded ripples.\n    // Unbounded ripple diameter is calculated smaller since the surface is expected to already be padded appropriately\n    // to extend the hitbox, and the ripple is expected to meet the edges of the padded hitbox (which is typically\n    // square). Bounded ripples, on the other hand, are fully expected to expand beyond the surface's longest diameter\n    // (calculated based on the diagonal plus a constant padding), and are clipped at the surface's border via\n    // `overflow: hidden`.\n\n    var getBoundedRadius = function getBoundedRadius() {\n      var hypotenuse = Math.sqrt(Math.pow(_this.frame_.width, 2) + Math.pow(_this.frame_.height, 2));\n      return hypotenuse + MDCRippleFoundation.numbers.PADDING;\n    };\n\n    this.maxRadius_ = this.adapter_.isUnbounded() ? maxDim : getBoundedRadius(); // Ripple is sized as a fraction of the largest dimension of the surface, then scales up using a CSS scale transform\n\n    this.initialSize_ = Math.floor(maxDim * MDCRippleFoundation.numbers.INITIAL_ORIGIN_SCALE);\n    this.fgScale_ = \"\" + this.maxRadius_ / this.initialSize_;\n    this.updateLayoutCssVars_();\n  };\n\n  MDCRippleFoundation.prototype.updateLayoutCssVars_ = function () {\n    var _a = MDCRippleFoundation.strings,\n        VAR_FG_SIZE = _a.VAR_FG_SIZE,\n        VAR_LEFT = _a.VAR_LEFT,\n        VAR_TOP = _a.VAR_TOP,\n        VAR_FG_SCALE = _a.VAR_FG_SCALE;\n    this.adapter_.updateCssVariable(VAR_FG_SIZE, this.initialSize_ + \"px\");\n    this.adapter_.updateCssVariable(VAR_FG_SCALE, this.fgScale_);\n\n    if (this.adapter_.isUnbounded()) {\n      this.unboundedCoords_ = {\n        left: Math.round(this.frame_.width / 2 - this.initialSize_ / 2),\n        top: Math.round(this.frame_.height / 2 - this.initialSize_ / 2)\n      };\n      this.adapter_.updateCssVariable(VAR_LEFT, this.unboundedCoords_.left + \"px\");\n      this.adapter_.updateCssVariable(VAR_TOP, this.unboundedCoords_.top + \"px\");\n    }\n  };\n\n  return MDCRippleFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCRippleFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/ripple/util.js":
/*!***********************************************!*\
  !*** ./node_modules/@material/ripple/util.js ***!
  \***********************************************/
/*! exports provided: supportsCssVariables, applyPassive, getNormalizedEventCoords */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"supportsCssVariables\", function() { return supportsCssVariables; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"applyPassive\", function() { return applyPassive; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getNormalizedEventCoords\", function() { return getNormalizedEventCoords; });\n/**\n * Stores result from supportsCssVariables to avoid redundant processing to\n * detect CSS custom variable support.\n */\nvar supportsCssVariables_;\n/**\n * Stores result from applyPassive to avoid redundant processing to detect\n * passive event listener support.\n */\n\nvar supportsPassive_;\n\nfunction detectEdgePseudoVarBug(windowObj) {\n  // Detect versions of Edge with buggy var() support\n  // See: https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/\n  var document = windowObj.document;\n  var node = document.createElement('div');\n  node.className = 'mdc-ripple-surface--test-edge-var-bug';\n  document.body.appendChild(node); // The bug exists if ::before style ends up propagating to the parent element.\n  // Additionally, getComputedStyle returns null in iframes with display: \"none\" in Firefox,\n  // but Firefox is known to support CSS custom properties correctly.\n  // See: https://bugzilla.mozilla.org/show_bug.cgi?id=548397\n\n  var computedStyle = windowObj.getComputedStyle(node);\n  var hasPseudoVarBug = computedStyle !== null && computedStyle.borderTopStyle === 'solid';\n\n  if (node.parentNode) {\n    node.parentNode.removeChild(node);\n  }\n\n  return hasPseudoVarBug;\n}\n\nfunction supportsCssVariables(windowObj, forceRefresh) {\n  if (forceRefresh === void 0) {\n    forceRefresh = false;\n  }\n\n  var CSS = windowObj.CSS;\n  var supportsCssVars = supportsCssVariables_;\n\n  if (typeof supportsCssVariables_ === 'boolean' && !forceRefresh) {\n    return supportsCssVariables_;\n  }\n\n  var supportsFunctionPresent = CSS && typeof CSS.supports === 'function';\n\n  if (!supportsFunctionPresent) {\n    return false;\n  }\n\n  var explicitlySupportsCssVars = CSS.supports('--css-vars', 'yes'); // See: https://bugs.webkit.org/show_bug.cgi?id=154669\n  // See: README section on Safari\n\n  var weAreFeatureDetectingSafari10plus = CSS.supports('(--css-vars: yes)') && CSS.supports('color', '#00000000');\n\n  if (explicitlySupportsCssVars || weAreFeatureDetectingSafari10plus) {\n    supportsCssVars = !detectEdgePseudoVarBug(windowObj);\n  } else {\n    supportsCssVars = false;\n  }\n\n  if (!forceRefresh) {\n    supportsCssVariables_ = supportsCssVars;\n  }\n\n  return supportsCssVars;\n}\n/**\n * Determine whether the current browser supports passive event listeners, and\n * if so, use them.\n */\n\nfunction applyPassive(globalObj, forceRefresh) {\n  if (globalObj === void 0) {\n    globalObj = window;\n  }\n\n  if (forceRefresh === void 0) {\n    forceRefresh = false;\n  }\n\n  if (supportsPassive_ === undefined || forceRefresh) {\n    var isSupported_1 = false;\n\n    try {\n      globalObj.document.addEventListener('test', function () {\n        return undefined;\n      }, {\n        get passive() {\n          isSupported_1 = true;\n          return isSupported_1;\n        }\n\n      });\n    } catch (e) {} // tslint:disable-line:no-empty cannot throw error due to tests. tslint also disables console.log.\n\n\n    supportsPassive_ = isSupported_1;\n  }\n\n  return supportsPassive_ ? {\n    passive: true\n  } : false;\n}\nfunction getNormalizedEventCoords(evt, pageOffset, clientRect) {\n  if (!evt) {\n    return {\n      x: 0,\n      y: 0\n    };\n  }\n\n  var x = pageOffset.x,\n      y = pageOffset.y;\n  var documentX = x + clientRect.left;\n  var documentY = y + clientRect.top;\n  var normalizedX;\n  var normalizedY; // Determine touch point relative to the ripple container.\n\n  if (evt.type === 'touchstart') {\n    var touchEvent = evt;\n    normalizedX = touchEvent.changedTouches[0].pageX - documentX;\n    normalizedY = touchEvent.changedTouches[0].pageY - documentY;\n  } else {\n    var mouseEvent = evt;\n    normalizedX = mouseEvent.pageX - documentX;\n    normalizedY = mouseEvent.pageY - documentY;\n  }\n\n  return {\n    x: normalizedX,\n    y: normalizedY\n  };\n}\n\n//# sourceURL=webpack:///./node_modules/@material/ripple/util.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/character-counter/component.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@material/textfield/character-counter/component.js ***!
  \*************************************************************************/
/*! exports provided: MDCTextFieldCharacterCounter */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldCharacterCounter\", function() { return MDCTextFieldCharacterCounter; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/character-counter/foundation.js\");\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCTextFieldCharacterCounter =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldCharacterCounter, _super);\n\n  function MDCTextFieldCharacterCounter() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCTextFieldCharacterCounter.attachTo = function (root) {\n    return new MDCTextFieldCharacterCounter(root);\n  };\n\n  Object.defineProperty(MDCTextFieldCharacterCounter.prototype, \"foundation\", {\n    get: function get() {\n      return this.foundation_;\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCTextFieldCharacterCounter.prototype.getDefaultFoundation = function () {\n    var _this = this; // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n\n\n    var adapter = {\n      setContent: function setContent(content) {\n        _this.root_.textContent = content;\n      }\n    };\n    return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCTextFieldCharacterCounterFoundation\"](adapter);\n  };\n\n  return MDCTextFieldCharacterCounter;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/character-counter/component.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/character-counter/constants.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@material/textfield/character-counter/constants.js ***!
  \*************************************************************************/
/*! exports provided: strings, cssClasses */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar cssClasses = {\n  ROOT: 'mdc-text-field-character-counter'\n};\nvar strings = {\n  ROOT_SELECTOR: \".\" + cssClasses.ROOT\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/character-counter/constants.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/character-counter/foundation.js":
/*!**************************************************************************!*\
  !*** ./node_modules/@material/textfield/character-counter/foundation.js ***!
  \**************************************************************************/
/*! exports provided: MDCTextFieldCharacterCounterFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldCharacterCounterFoundation\", function() { return MDCTextFieldCharacterCounterFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/character-counter/constants.js\");\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCTextFieldCharacterCounterFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldCharacterCounterFoundation, _super);\n\n  function MDCTextFieldCharacterCounterFoundation(adapter) {\n    return _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCTextFieldCharacterCounterFoundation.defaultAdapter, adapter)) || this;\n  }\n\n  Object.defineProperty(MDCTextFieldCharacterCounterFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldCharacterCounterFoundation, \"strings\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldCharacterCounterFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCTextFieldCharacterCounterAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      return {\n        setContent: function setContent() {\n          return undefined;\n        }\n      };\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCTextFieldCharacterCounterFoundation.prototype.setCounterValue = function (currentLength, maxLength) {\n    currentLength = Math.min(currentLength, maxLength);\n    this.adapter_.setContent(currentLength + \" / \" + maxLength);\n  };\n\n  return MDCTextFieldCharacterCounterFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldCharacterCounterFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/character-counter/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/character-counter/index.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@material/textfield/character-counter/index.js ***!
  \*********************************************************************/
/*! exports provided: MDCTextFieldCharacterCounter, MDCTextFieldCharacterCounterFoundation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ \"./node_modules/@material/textfield/character-counter/component.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldCharacterCounter\", function() { return _component__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextFieldCharacterCounter\"]; });\n\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/character-counter/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldCharacterCounterFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCTextFieldCharacterCounterFoundation\"]; });\n\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/character-counter/index.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/component.js":
/*!*******************************************************!*\
  !*** ./node_modules/@material/textfield/component.js ***!
  \*******************************************************/
/*! exports provided: MDCTextField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextField\", function() { return MDCTextField; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _material_dom_ponyfill__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @material/dom/ponyfill */ \"./node_modules/@material/dom/ponyfill.js\");\n/* harmony import */ var _material_floating_label_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @material/floating-label/component */ \"./node_modules/@material/floating-label/component.js\");\n/* harmony import */ var _material_line_ripple_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @material/line-ripple/component */ \"./node_modules/@material/line-ripple/component.js\");\n/* harmony import */ var _material_notched_outline_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @material/notched-outline/component */ \"./node_modules/@material/notched-outline/component.js\");\n/* harmony import */ var _material_ripple_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @material/ripple/component */ \"./node_modules/@material/ripple/component.js\");\n/* harmony import */ var _material_ripple_foundation__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @material/ripple/foundation */ \"./node_modules/@material/ripple/foundation.js\");\n/* harmony import */ var _character_counter_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./character-counter/component */ \"./node_modules/@material/textfield/character-counter/component.js\");\n/* harmony import */ var _character_counter_foundation__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./character-counter/foundation */ \"./node_modules/@material/textfield/character-counter/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/constants.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/foundation.js\");\n/* harmony import */ var _helper_text_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./helper-text/component */ \"./node_modules/@material/textfield/helper-text/component.js\");\n/* harmony import */ var _helper_text_foundation__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./helper-text/foundation */ \"./node_modules/@material/textfield/helper-text/foundation.js\");\n/* harmony import */ var _icon_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./icon/component */ \"./node_modules/@material/textfield/icon/component.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\nvar MDCTextField =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextField, _super);\n\n  function MDCTextField() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCTextField.attachTo = function (root) {\n    return new MDCTextField(root);\n  };\n\n  MDCTextField.prototype.initialize = function (rippleFactory, lineRippleFactory, helperTextFactory, characterCounterFactory, iconFactory, labelFactory, outlineFactory) {\n    if (rippleFactory === void 0) {\n      rippleFactory = function rippleFactory(el, foundation) {\n        return new _material_ripple_component__WEBPACK_IMPORTED_MODULE_6__[\"MDCRipple\"](el, foundation);\n      };\n    }\n\n    if (lineRippleFactory === void 0) {\n      lineRippleFactory = function lineRippleFactory(el) {\n        return new _material_line_ripple_component__WEBPACK_IMPORTED_MODULE_4__[\"MDCLineRipple\"](el);\n      };\n    }\n\n    if (helperTextFactory === void 0) {\n      helperTextFactory = function helperTextFactory(el) {\n        return new _helper_text_component__WEBPACK_IMPORTED_MODULE_12__[\"MDCTextFieldHelperText\"](el);\n      };\n    }\n\n    if (characterCounterFactory === void 0) {\n      characterCounterFactory = function characterCounterFactory(el) {\n        return new _character_counter_component__WEBPACK_IMPORTED_MODULE_8__[\"MDCTextFieldCharacterCounter\"](el);\n      };\n    }\n\n    if (iconFactory === void 0) {\n      iconFactory = function iconFactory(el) {\n        return new _icon_component__WEBPACK_IMPORTED_MODULE_14__[\"MDCTextFieldIcon\"](el);\n      };\n    }\n\n    if (labelFactory === void 0) {\n      labelFactory = function labelFactory(el) {\n        return new _material_floating_label_component__WEBPACK_IMPORTED_MODULE_3__[\"MDCFloatingLabel\"](el);\n      };\n    }\n\n    if (outlineFactory === void 0) {\n      outlineFactory = function outlineFactory(el) {\n        return new _material_notched_outline_component__WEBPACK_IMPORTED_MODULE_5__[\"MDCNotchedOutline\"](el);\n      };\n    }\n\n    this.input_ = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_10__[\"strings\"].INPUT_SELECTOR);\n    var labelElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_10__[\"strings\"].LABEL_SELECTOR);\n    this.label_ = labelElement ? labelFactory(labelElement) : null;\n    var lineRippleElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_10__[\"strings\"].LINE_RIPPLE_SELECTOR);\n    this.lineRipple_ = lineRippleElement ? lineRippleFactory(lineRippleElement) : null;\n    var outlineElement = this.root_.querySelector(_constants__WEBPACK_IMPORTED_MODULE_10__[\"strings\"].OUTLINE_SELECTOR);\n    this.outline_ = outlineElement ? outlineFactory(outlineElement) : null; // Helper text\n\n    var helperTextStrings = _helper_text_foundation__WEBPACK_IMPORTED_MODULE_13__[\"MDCTextFieldHelperTextFoundation\"].strings;\n    var nextElementSibling = this.root_.nextElementSibling;\n    var hasHelperLine = nextElementSibling && nextElementSibling.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_10__[\"cssClasses\"].HELPER_LINE);\n    var helperTextEl = hasHelperLine && nextElementSibling && nextElementSibling.querySelector(helperTextStrings.ROOT_SELECTOR);\n    this.helperText_ = helperTextEl ? helperTextFactory(helperTextEl) : null; // Character counter\n\n    var characterCounterStrings = _character_counter_foundation__WEBPACK_IMPORTED_MODULE_9__[\"MDCTextFieldCharacterCounterFoundation\"].strings;\n    var characterCounterEl = this.root_.querySelector(characterCounterStrings.ROOT_SELECTOR); // If character counter is not found in root element search in sibling element.\n\n    if (!characterCounterEl && hasHelperLine && nextElementSibling) {\n      characterCounterEl = nextElementSibling.querySelector(characterCounterStrings.ROOT_SELECTOR);\n    }\n\n    this.characterCounter_ = characterCounterEl ? characterCounterFactory(characterCounterEl) : null;\n    this.leadingIcon_ = null;\n    this.trailingIcon_ = null;\n    var iconElements = this.root_.querySelectorAll(_constants__WEBPACK_IMPORTED_MODULE_10__[\"strings\"].ICON_SELECTOR);\n\n    if (iconElements.length > 0) {\n      if (iconElements.length > 1) {\n        // Has both icons.\n        this.leadingIcon_ = iconFactory(iconElements[0]);\n        this.trailingIcon_ = iconFactory(iconElements[1]);\n      } else {\n        if (this.root_.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_10__[\"cssClasses\"].WITH_LEADING_ICON)) {\n          this.leadingIcon_ = iconFactory(iconElements[0]);\n        } else {\n          this.trailingIcon_ = iconFactory(iconElements[0]);\n        }\n      }\n    }\n\n    this.ripple = this.createRipple_(rippleFactory);\n  };\n\n  MDCTextField.prototype.destroy = function () {\n    if (this.ripple) {\n      this.ripple.destroy();\n    }\n\n    if (this.lineRipple_) {\n      this.lineRipple_.destroy();\n    }\n\n    if (this.helperText_) {\n      this.helperText_.destroy();\n    }\n\n    if (this.characterCounter_) {\n      this.characterCounter_.destroy();\n    }\n\n    if (this.leadingIcon_) {\n      this.leadingIcon_.destroy();\n    }\n\n    if (this.trailingIcon_) {\n      this.trailingIcon_.destroy();\n    }\n\n    if (this.label_) {\n      this.label_.destroy();\n    }\n\n    if (this.outline_) {\n      this.outline_.destroy();\n    }\n\n    _super.prototype.destroy.call(this);\n  };\n  /**\n   * Initializes the Text Field's internal state based on the environment's\n   * state.\n   */\n\n\n  MDCTextField.prototype.initialSyncWithDOM = function () {\n    this.disabled = this.input_.disabled;\n  };\n\n  Object.defineProperty(MDCTextField.prototype, \"value\", {\n    get: function get() {\n      return this.foundation_.getValue();\n    },\n\n    /**\n     * @param value The value to set on the input.\n     */\n    set: function set(value) {\n      this.foundation_.setValue(value);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"disabled\", {\n    get: function get() {\n      return this.foundation_.isDisabled();\n    },\n\n    /**\n     * @param disabled Sets the Text Field disabled or enabled.\n     */\n    set: function set(disabled) {\n      this.foundation_.setDisabled(disabled);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"valid\", {\n    get: function get() {\n      return this.foundation_.isValid();\n    },\n\n    /**\n     * @param valid Sets the Text Field valid or invalid.\n     */\n    set: function set(valid) {\n      this.foundation_.setValid(valid);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"required\", {\n    get: function get() {\n      return this.input_.required;\n    },\n\n    /**\n     * @param required Sets the Text Field to required.\n     */\n    set: function set(required) {\n      this.input_.required = required;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"pattern\", {\n    get: function get() {\n      return this.input_.pattern;\n    },\n\n    /**\n     * @param pattern Sets the input element's validation pattern.\n     */\n    set: function set(pattern) {\n      this.input_.pattern = pattern;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"minLength\", {\n    get: function get() {\n      return this.input_.minLength;\n    },\n\n    /**\n     * @param minLength Sets the input element's minLength.\n     */\n    set: function set(minLength) {\n      this.input_.minLength = minLength;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"maxLength\", {\n    get: function get() {\n      return this.input_.maxLength;\n    },\n\n    /**\n     * @param maxLength Sets the input element's maxLength.\n     */\n    set: function set(maxLength) {\n      // Chrome throws exception if maxLength is set to a value less than zero\n      if (maxLength < 0) {\n        this.input_.removeAttribute('maxLength');\n      } else {\n        this.input_.maxLength = maxLength;\n      }\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"min\", {\n    get: function get() {\n      return this.input_.min;\n    },\n\n    /**\n     * @param min Sets the input element's min.\n     */\n    set: function set(min) {\n      this.input_.min = min;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"max\", {\n    get: function get() {\n      return this.input_.max;\n    },\n\n    /**\n     * @param max Sets the input element's max.\n     */\n    set: function set(max) {\n      this.input_.max = max;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"step\", {\n    get: function get() {\n      return this.input_.step;\n    },\n\n    /**\n     * @param step Sets the input element's step.\n     */\n    set: function set(step) {\n      this.input_.step = step;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"helperTextContent\", {\n    /**\n     * Sets the helper text element content.\n     */\n    set: function set(content) {\n      this.foundation_.setHelperTextContent(content);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"leadingIconAriaLabel\", {\n    /**\n     * Sets the aria label of the leading icon.\n     */\n    set: function set(label) {\n      this.foundation_.setLeadingIconAriaLabel(label);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"leadingIconContent\", {\n    /**\n     * Sets the text content of the leading icon.\n     */\n    set: function set(content) {\n      this.foundation_.setLeadingIconContent(content);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"trailingIconAriaLabel\", {\n    /**\n     * Sets the aria label of the trailing icon.\n     */\n    set: function set(label) {\n      this.foundation_.setTrailingIconAriaLabel(label);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"trailingIconContent\", {\n    /**\n     * Sets the text content of the trailing icon.\n     */\n    set: function set(content) {\n      this.foundation_.setTrailingIconContent(content);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextField.prototype, \"useNativeValidation\", {\n    /**\n     * Enables or disables the use of native validation. Use this for custom validation.\n     * @param useNativeValidation Set this to false to ignore native input validation.\n     */\n    set: function set(useNativeValidation) {\n      this.foundation_.setUseNativeValidation(useNativeValidation);\n    },\n    enumerable: true,\n    configurable: true\n  });\n  /**\n   * Focuses the input element.\n   */\n\n  MDCTextField.prototype.focus = function () {\n    this.input_.focus();\n  };\n  /**\n   * Recomputes the outline SVG path for the outline element.\n   */\n\n\n  MDCTextField.prototype.layout = function () {\n    var openNotch = this.foundation_.shouldFloat;\n    this.foundation_.notchOutline(openNotch);\n  };\n\n  MDCTextField.prototype.getDefaultFoundation = function () {\n    // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n    var adapter = tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, this.getRootAdapterMethods_(), this.getInputAdapterMethods_(), this.getLabelAdapterMethods_(), this.getLineRippleAdapterMethods_(), this.getOutlineAdapterMethods_()); // tslint:enable:object-literal-sort-keys\n\n\n    return new _foundation__WEBPACK_IMPORTED_MODULE_11__[\"MDCTextFieldFoundation\"](adapter, this.getFoundationMap_());\n  };\n\n  MDCTextField.prototype.getRootAdapterMethods_ = function () {\n    var _this = this; // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    return {\n      addClass: function addClass(className) {\n        return _this.root_.classList.add(className);\n      },\n      removeClass: function removeClass(className) {\n        return _this.root_.classList.remove(className);\n      },\n      hasClass: function hasClass(className) {\n        return _this.root_.classList.contains(className);\n      },\n      registerTextFieldInteractionHandler: function registerTextFieldInteractionHandler(evtType, handler) {\n        return _this.listen(evtType, handler);\n      },\n      deregisterTextFieldInteractionHandler: function deregisterTextFieldInteractionHandler(evtType, handler) {\n        return _this.unlisten(evtType, handler);\n      },\n      registerValidationAttributeChangeHandler: function registerValidationAttributeChangeHandler(handler) {\n        var getAttributesList = function getAttributesList(mutationsList) {\n          return mutationsList.map(function (mutation) {\n            return mutation.attributeName;\n          }).filter(function (attributeName) {\n            return attributeName;\n          });\n        };\n\n        var observer = new MutationObserver(function (mutationsList) {\n          return handler(getAttributesList(mutationsList));\n        });\n        var config = {\n          attributes: true\n        };\n        observer.observe(_this.input_, config);\n        return observer;\n      },\n      deregisterValidationAttributeChangeHandler: function deregisterValidationAttributeChangeHandler(observer) {\n        return observer.disconnect();\n      }\n    }; // tslint:enable:object-literal-sort-keys\n  };\n\n  MDCTextField.prototype.getInputAdapterMethods_ = function () {\n    var _this = this; // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    return {\n      getNativeInput: function getNativeInput() {\n        return _this.input_;\n      },\n      isFocused: function isFocused() {\n        return document.activeElement === _this.input_;\n      },\n      registerInputInteractionHandler: function registerInputInteractionHandler(evtType, handler) {\n        return _this.input_.addEventListener(evtType, handler);\n      },\n      deregisterInputInteractionHandler: function deregisterInputInteractionHandler(evtType, handler) {\n        return _this.input_.removeEventListener(evtType, handler);\n      }\n    }; // tslint:enable:object-literal-sort-keys\n  };\n\n  MDCTextField.prototype.getLabelAdapterMethods_ = function () {\n    var _this = this;\n\n    return {\n      floatLabel: function floatLabel(shouldFloat) {\n        return _this.label_ && _this.label_.float(shouldFloat);\n      },\n      getLabelWidth: function getLabelWidth() {\n        return _this.label_ ? _this.label_.getWidth() : 0;\n      },\n      hasLabel: function hasLabel() {\n        return Boolean(_this.label_);\n      },\n      shakeLabel: function shakeLabel(shouldShake) {\n        return _this.label_ && _this.label_.shake(shouldShake);\n      }\n    };\n  };\n\n  MDCTextField.prototype.getLineRippleAdapterMethods_ = function () {\n    var _this = this;\n\n    return {\n      activateLineRipple: function activateLineRipple() {\n        if (_this.lineRipple_) {\n          _this.lineRipple_.activate();\n        }\n      },\n      deactivateLineRipple: function deactivateLineRipple() {\n        if (_this.lineRipple_) {\n          _this.lineRipple_.deactivate();\n        }\n      },\n      setLineRippleTransformOrigin: function setLineRippleTransformOrigin(normalizedX) {\n        if (_this.lineRipple_) {\n          _this.lineRipple_.setRippleCenter(normalizedX);\n        }\n      }\n    };\n  };\n\n  MDCTextField.prototype.getOutlineAdapterMethods_ = function () {\n    var _this = this;\n\n    return {\n      closeOutline: function closeOutline() {\n        return _this.outline_ && _this.outline_.closeNotch();\n      },\n      hasOutline: function hasOutline() {\n        return Boolean(_this.outline_);\n      },\n      notchOutline: function notchOutline(labelWidth) {\n        return _this.outline_ && _this.outline_.notch(labelWidth);\n      }\n    };\n  };\n  /**\n   * @return A map of all subcomponents to subfoundations.\n   */\n\n\n  MDCTextField.prototype.getFoundationMap_ = function () {\n    return {\n      characterCounter: this.characterCounter_ ? this.characterCounter_.foundation : undefined,\n      helperText: this.helperText_ ? this.helperText_.foundation : undefined,\n      leadingIcon: this.leadingIcon_ ? this.leadingIcon_.foundation : undefined,\n      trailingIcon: this.trailingIcon_ ? this.trailingIcon_.foundation : undefined\n    };\n  };\n\n  MDCTextField.prototype.createRipple_ = function (rippleFactory) {\n    var _this = this;\n\n    var isTextArea = this.root_.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_10__[\"cssClasses\"].TEXTAREA);\n    var isOutlined = this.root_.classList.contains(_constants__WEBPACK_IMPORTED_MODULE_10__[\"cssClasses\"].OUTLINED);\n\n    if (isTextArea || isOutlined) {\n      return null;\n    } // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    var adapter = tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, _material_ripple_component__WEBPACK_IMPORTED_MODULE_6__[\"MDCRipple\"].createAdapter(this), {\n      isSurfaceActive: function isSurfaceActive() {\n        return _material_dom_ponyfill__WEBPACK_IMPORTED_MODULE_2__[\"matches\"](_this.input_, ':active');\n      },\n      registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n        return _this.input_.addEventListener(evtType, handler);\n      },\n      deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n        return _this.input_.removeEventListener(evtType, handler);\n      }\n    }); // tslint:enable:object-literal-sort-keys\n\n\n    return rippleFactory(this.root_, new _material_ripple_foundation__WEBPACK_IMPORTED_MODULE_7__[\"MDCRippleFoundation\"](adapter));\n  };\n\n  return MDCTextField;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/component.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/constants.js":
/*!*******************************************************!*\
  !*** ./node_modules/@material/textfield/constants.js ***!
  \*******************************************************/
/*! exports provided: cssClasses, strings, numbers, VALIDATION_ATTR_WHITELIST, ALWAYS_FLOAT_TYPES */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"numbers\", function() { return numbers; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"VALIDATION_ATTR_WHITELIST\", function() { return VALIDATION_ATTR_WHITELIST; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"ALWAYS_FLOAT_TYPES\", function() { return ALWAYS_FLOAT_TYPES; });\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar strings = {\n  ARIA_CONTROLS: 'aria-controls',\n  ICON_SELECTOR: '.mdc-text-field__icon',\n  INPUT_SELECTOR: '.mdc-text-field__input',\n  LABEL_SELECTOR: '.mdc-floating-label',\n  LINE_RIPPLE_SELECTOR: '.mdc-line-ripple',\n  OUTLINE_SELECTOR: '.mdc-notched-outline'\n};\nvar cssClasses = {\n  DENSE: 'mdc-text-field--dense',\n  DISABLED: 'mdc-text-field--disabled',\n  FOCUSED: 'mdc-text-field--focused',\n  FULLWIDTH: 'mdc-text-field--fullwidth',\n  HELPER_LINE: 'mdc-text-field-helper-line',\n  INVALID: 'mdc-text-field--invalid',\n  NO_LABEL: 'mdc-text-field--no-label',\n  OUTLINED: 'mdc-text-field--outlined',\n  ROOT: 'mdc-text-field',\n  TEXTAREA: 'mdc-text-field--textarea',\n  WITH_LEADING_ICON: 'mdc-text-field--with-leading-icon',\n  WITH_TRAILING_ICON: 'mdc-text-field--with-trailing-icon'\n};\nvar numbers = {\n  DENSE_LABEL_SCALE: 0.923,\n  LABEL_SCALE: 0.75\n};\n/**\n * Whitelist based off of https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation\n * under the \"Validation-related attributes\" section.\n */\n\nvar VALIDATION_ATTR_WHITELIST = ['pattern', 'min', 'max', 'required', 'step', 'minlength', 'maxlength'];\n/**\n * Label should always float for these types as they show some UI even if value is empty.\n */\n\nvar ALWAYS_FLOAT_TYPES = ['color', 'date', 'datetime-local', 'month', 'range', 'time', 'week'];\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/constants.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/foundation.js":
/*!********************************************************!*\
  !*** ./node_modules/@material/textfield/foundation.js ***!
  \********************************************************/
/*! exports provided: MDCTextFieldFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldFoundation\", function() { return MDCTextFieldFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/constants.js\");\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\nvar POINTERDOWN_EVENTS = ['mousedown', 'touchstart'];\nvar INTERACTION_EVENTS = ['click', 'keydown'];\n\nvar MDCTextFieldFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldFoundation, _super);\n  /**\n   * @param adapter\n   * @param foundationMap Map from subcomponent names to their subfoundations.\n   */\n\n\n  function MDCTextFieldFoundation(adapter, foundationMap) {\n    if (foundationMap === void 0) {\n      foundationMap = {};\n    }\n\n    var _this = _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCTextFieldFoundation.defaultAdapter, adapter)) || this;\n\n    _this.isFocused_ = false;\n    _this.receivedUserInput_ = false;\n    _this.isValid_ = true;\n    _this.useNativeValidation_ = true;\n    _this.helperText_ = foundationMap.helperText;\n    _this.characterCounter_ = foundationMap.characterCounter;\n    _this.leadingIcon_ = foundationMap.leadingIcon;\n    _this.trailingIcon_ = foundationMap.trailingIcon;\n\n    _this.inputFocusHandler_ = function () {\n      return _this.activateFocus();\n    };\n\n    _this.inputBlurHandler_ = function () {\n      return _this.deactivateFocus();\n    };\n\n    _this.inputInputHandler_ = function () {\n      return _this.handleInput();\n    };\n\n    _this.setPointerXOffset_ = function (evt) {\n      return _this.setTransformOrigin(evt);\n    };\n\n    _this.textFieldInteractionHandler_ = function () {\n      return _this.handleTextFieldInteraction();\n    };\n\n    _this.validationAttributeChangeHandler_ = function (attributesList) {\n      return _this.handleValidationAttributeChange(attributesList);\n    };\n\n    return _this;\n  }\n\n  Object.defineProperty(MDCTextFieldFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldFoundation, \"strings\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldFoundation, \"numbers\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldFoundation.prototype, \"shouldAlwaysFloat_\", {\n    get: function get() {\n      var type = this.getNativeInput_().type;\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"ALWAYS_FLOAT_TYPES\"].indexOf(type) >= 0;\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldFoundation.prototype, \"shouldFloat\", {\n    get: function get() {\n      return this.shouldAlwaysFloat_ || this.isFocused_ || Boolean(this.getValue()) || this.isBadInput_();\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldFoundation.prototype, \"shouldShake\", {\n    get: function get() {\n      return !this.isFocused_ && !this.isValid() && Boolean(this.getValue());\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCTextFieldAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n      return {\n        addClass: function addClass() {\n          return undefined;\n        },\n        removeClass: function removeClass() {\n          return undefined;\n        },\n        hasClass: function hasClass() {\n          return true;\n        },\n        registerTextFieldInteractionHandler: function registerTextFieldInteractionHandler() {\n          return undefined;\n        },\n        deregisterTextFieldInteractionHandler: function deregisterTextFieldInteractionHandler() {\n          return undefined;\n        },\n        registerInputInteractionHandler: function registerInputInteractionHandler() {\n          return undefined;\n        },\n        deregisterInputInteractionHandler: function deregisterInputInteractionHandler() {\n          return undefined;\n        },\n        registerValidationAttributeChangeHandler: function registerValidationAttributeChangeHandler() {\n          return new MutationObserver(function () {\n            return undefined;\n          });\n        },\n        deregisterValidationAttributeChangeHandler: function deregisterValidationAttributeChangeHandler() {\n          return undefined;\n        },\n        getNativeInput: function getNativeInput() {\n          return null;\n        },\n        isFocused: function isFocused() {\n          return false;\n        },\n        activateLineRipple: function activateLineRipple() {\n          return undefined;\n        },\n        deactivateLineRipple: function deactivateLineRipple() {\n          return undefined;\n        },\n        setLineRippleTransformOrigin: function setLineRippleTransformOrigin() {\n          return undefined;\n        },\n        shakeLabel: function shakeLabel() {\n          return undefined;\n        },\n        floatLabel: function floatLabel() {\n          return undefined;\n        },\n        hasLabel: function hasLabel() {\n          return false;\n        },\n        getLabelWidth: function getLabelWidth() {\n          return 0;\n        },\n        hasOutline: function hasOutline() {\n          return false;\n        },\n        notchOutline: function notchOutline() {\n          return undefined;\n        },\n        closeOutline: function closeOutline() {\n          return undefined;\n        }\n      }; // tslint:enable:object-literal-sort-keys\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCTextFieldFoundation.prototype.init = function () {\n    var _this = this;\n\n    if (this.adapter_.isFocused()) {\n      this.inputFocusHandler_();\n    } else if (this.adapter_.hasLabel() && this.shouldFloat) {\n      this.notchOutline(true);\n      this.adapter_.floatLabel(true);\n    }\n\n    this.adapter_.registerInputInteractionHandler('focus', this.inputFocusHandler_);\n    this.adapter_.registerInputInteractionHandler('blur', this.inputBlurHandler_);\n    this.adapter_.registerInputInteractionHandler('input', this.inputInputHandler_);\n    POINTERDOWN_EVENTS.forEach(function (evtType) {\n      _this.adapter_.registerInputInteractionHandler(evtType, _this.setPointerXOffset_);\n    });\n    INTERACTION_EVENTS.forEach(function (evtType) {\n      _this.adapter_.registerTextFieldInteractionHandler(evtType, _this.textFieldInteractionHandler_);\n    });\n    this.validationObserver_ = this.adapter_.registerValidationAttributeChangeHandler(this.validationAttributeChangeHandler_);\n    this.setCharacterCounter_(this.getValue().length);\n  };\n\n  MDCTextFieldFoundation.prototype.destroy = function () {\n    var _this = this;\n\n    this.adapter_.deregisterInputInteractionHandler('focus', this.inputFocusHandler_);\n    this.adapter_.deregisterInputInteractionHandler('blur', this.inputBlurHandler_);\n    this.adapter_.deregisterInputInteractionHandler('input', this.inputInputHandler_);\n    POINTERDOWN_EVENTS.forEach(function (evtType) {\n      _this.adapter_.deregisterInputInteractionHandler(evtType, _this.setPointerXOffset_);\n    });\n    INTERACTION_EVENTS.forEach(function (evtType) {\n      _this.adapter_.deregisterTextFieldInteractionHandler(evtType, _this.textFieldInteractionHandler_);\n    });\n    this.adapter_.deregisterValidationAttributeChangeHandler(this.validationObserver_);\n  };\n  /**\n   * Handles user interactions with the Text Field.\n   */\n\n\n  MDCTextFieldFoundation.prototype.handleTextFieldInteraction = function () {\n    var nativeInput = this.adapter_.getNativeInput();\n\n    if (nativeInput && nativeInput.disabled) {\n      return;\n    }\n\n    this.receivedUserInput_ = true;\n  };\n  /**\n   * Handles validation attribute changes\n   */\n\n\n  MDCTextFieldFoundation.prototype.handleValidationAttributeChange = function (attributesList) {\n    var _this = this;\n\n    attributesList.some(function (attributeName) {\n      if (_constants__WEBPACK_IMPORTED_MODULE_2__[\"VALIDATION_ATTR_WHITELIST\"].indexOf(attributeName) > -1) {\n        _this.styleValidity_(true);\n\n        return true;\n      }\n\n      return false;\n    });\n\n    if (attributesList.indexOf('maxlength') > -1) {\n      this.setCharacterCounter_(this.getValue().length);\n    }\n  };\n  /**\n   * Opens/closes the notched outline.\n   */\n\n\n  MDCTextFieldFoundation.prototype.notchOutline = function (openNotch) {\n    if (!this.adapter_.hasOutline()) {\n      return;\n    }\n\n    if (openNotch) {\n      var isDense = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].DENSE);\n      var labelScale = isDense ? _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].DENSE_LABEL_SCALE : _constants__WEBPACK_IMPORTED_MODULE_2__[\"numbers\"].LABEL_SCALE;\n      var labelWidth = this.adapter_.getLabelWidth() * labelScale;\n      this.adapter_.notchOutline(labelWidth);\n    } else {\n      this.adapter_.closeOutline();\n    }\n  };\n  /**\n   * Activates the text field focus state.\n   */\n\n\n  MDCTextFieldFoundation.prototype.activateFocus = function () {\n    this.isFocused_ = true;\n    this.styleFocused_(this.isFocused_);\n    this.adapter_.activateLineRipple();\n\n    if (this.adapter_.hasLabel()) {\n      this.notchOutline(this.shouldFloat);\n      this.adapter_.floatLabel(this.shouldFloat);\n      this.adapter_.shakeLabel(this.shouldShake);\n    }\n\n    if (this.helperText_) {\n      this.helperText_.showToScreenReader();\n    }\n  };\n  /**\n   * Sets the line ripple's transform origin, so that the line ripple activate\n   * animation will animate out from the user's click location.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setTransformOrigin = function (evt) {\n    var touches = evt.touches;\n    var targetEvent = touches ? touches[0] : evt;\n    var targetClientRect = targetEvent.target.getBoundingClientRect();\n    var normalizedX = targetEvent.clientX - targetClientRect.left;\n    this.adapter_.setLineRippleTransformOrigin(normalizedX);\n  };\n  /**\n   * Handles input change of text input and text area.\n   */\n\n\n  MDCTextFieldFoundation.prototype.handleInput = function () {\n    this.autoCompleteFocus();\n    this.setCharacterCounter_(this.getValue().length);\n  };\n  /**\n   * Activates the Text Field's focus state in cases when the input value\n   * changes without user input (e.g. programmatically).\n   */\n\n\n  MDCTextFieldFoundation.prototype.autoCompleteFocus = function () {\n    if (!this.receivedUserInput_) {\n      this.activateFocus();\n    }\n  };\n  /**\n   * Deactivates the Text Field's focus state.\n   */\n\n\n  MDCTextFieldFoundation.prototype.deactivateFocus = function () {\n    this.isFocused_ = false;\n    this.adapter_.deactivateLineRipple();\n    var isValid = this.isValid();\n    this.styleValidity_(isValid);\n    this.styleFocused_(this.isFocused_);\n\n    if (this.adapter_.hasLabel()) {\n      this.notchOutline(this.shouldFloat);\n      this.adapter_.floatLabel(this.shouldFloat);\n      this.adapter_.shakeLabel(this.shouldShake);\n    }\n\n    if (!this.shouldFloat) {\n      this.receivedUserInput_ = false;\n    }\n  };\n\n  MDCTextFieldFoundation.prototype.getValue = function () {\n    return this.getNativeInput_().value;\n  };\n  /**\n   * @param value The value to set on the input Element.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setValue = function (value) {\n    // Prevent Safari from moving the caret to the end of the input when the value has not changed.\n    if (this.getValue() !== value) {\n      this.getNativeInput_().value = value;\n    }\n\n    this.setCharacterCounter_(value.length);\n    var isValid = this.isValid();\n    this.styleValidity_(isValid);\n\n    if (this.adapter_.hasLabel()) {\n      this.notchOutline(this.shouldFloat);\n      this.adapter_.floatLabel(this.shouldFloat);\n      this.adapter_.shakeLabel(this.shouldShake);\n    }\n  };\n  /**\n   * @return The custom validity state, if set; otherwise, the result of a native validity check.\n   */\n\n\n  MDCTextFieldFoundation.prototype.isValid = function () {\n    return this.useNativeValidation_ ? this.isNativeInputValid_() : this.isValid_;\n  };\n  /**\n   * @param isValid Sets the custom validity state of the Text Field.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setValid = function (isValid) {\n    this.isValid_ = isValid;\n    this.styleValidity_(isValid);\n    var shouldShake = !isValid && !this.isFocused_;\n\n    if (this.adapter_.hasLabel()) {\n      this.adapter_.shakeLabel(shouldShake);\n    }\n  };\n  /**\n   * Enables or disables the use of native validation. Use this for custom validation.\n   * @param useNativeValidation Set this to false to ignore native input validation.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setUseNativeValidation = function (useNativeValidation) {\n    this.useNativeValidation_ = useNativeValidation;\n  };\n\n  MDCTextFieldFoundation.prototype.isDisabled = function () {\n    return this.getNativeInput_().disabled;\n  };\n  /**\n   * @param disabled Sets the text-field disabled or enabled.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setDisabled = function (disabled) {\n    this.getNativeInput_().disabled = disabled;\n    this.styleDisabled_(disabled);\n  };\n  /**\n   * @param content Sets the content of the helper text.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setHelperTextContent = function (content) {\n    if (this.helperText_) {\n      this.helperText_.setContent(content);\n    }\n  };\n  /**\n   * Sets the aria label of the leading icon.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setLeadingIconAriaLabel = function (label) {\n    if (this.leadingIcon_) {\n      this.leadingIcon_.setAriaLabel(label);\n    }\n  };\n  /**\n   * Sets the text content of the leading icon.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setLeadingIconContent = function (content) {\n    if (this.leadingIcon_) {\n      this.leadingIcon_.setContent(content);\n    }\n  };\n  /**\n   * Sets the aria label of the trailing icon.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setTrailingIconAriaLabel = function (label) {\n    if (this.trailingIcon_) {\n      this.trailingIcon_.setAriaLabel(label);\n    }\n  };\n  /**\n   * Sets the text content of the trailing icon.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setTrailingIconContent = function (content) {\n    if (this.trailingIcon_) {\n      this.trailingIcon_.setContent(content);\n    }\n  };\n  /**\n   * Sets character counter values that shows characters used and the total character limit.\n   */\n\n\n  MDCTextFieldFoundation.prototype.setCharacterCounter_ = function (currentLength) {\n    if (!this.characterCounter_) {\n      return;\n    }\n\n    var maxLength = this.getNativeInput_().maxLength;\n\n    if (maxLength === -1) {\n      throw new Error('MDCTextFieldFoundation: Expected maxlength html property on text input or textarea.');\n    }\n\n    this.characterCounter_.setCounterValue(currentLength, maxLength);\n  };\n  /**\n   * @return True if the Text Field input fails in converting the user-supplied value.\n   */\n\n\n  MDCTextFieldFoundation.prototype.isBadInput_ = function () {\n    // The badInput property is not supported in IE 11 💩.\n    return this.getNativeInput_().validity.badInput || false;\n  };\n  /**\n   * @return The result of native validity checking (ValidityState.valid).\n   */\n\n\n  MDCTextFieldFoundation.prototype.isNativeInputValid_ = function () {\n    return this.getNativeInput_().validity.valid;\n  };\n  /**\n   * Styles the component based on the validity state.\n   */\n\n\n  MDCTextFieldFoundation.prototype.styleValidity_ = function (isValid) {\n    var INVALID = MDCTextFieldFoundation.cssClasses.INVALID;\n\n    if (isValid) {\n      this.adapter_.removeClass(INVALID);\n    } else {\n      this.adapter_.addClass(INVALID);\n    }\n\n    if (this.helperText_) {\n      this.helperText_.setValidity(isValid);\n    }\n  };\n  /**\n   * Styles the component based on the focused state.\n   */\n\n\n  MDCTextFieldFoundation.prototype.styleFocused_ = function (isFocused) {\n    var FOCUSED = MDCTextFieldFoundation.cssClasses.FOCUSED;\n\n    if (isFocused) {\n      this.adapter_.addClass(FOCUSED);\n    } else {\n      this.adapter_.removeClass(FOCUSED);\n    }\n  };\n  /**\n   * Styles the component based on the disabled state.\n   */\n\n\n  MDCTextFieldFoundation.prototype.styleDisabled_ = function (isDisabled) {\n    var _a = MDCTextFieldFoundation.cssClasses,\n        DISABLED = _a.DISABLED,\n        INVALID = _a.INVALID;\n\n    if (isDisabled) {\n      this.adapter_.addClass(DISABLED);\n      this.adapter_.removeClass(INVALID);\n    } else {\n      this.adapter_.removeClass(DISABLED);\n    }\n\n    if (this.leadingIcon_) {\n      this.leadingIcon_.setDisabled(isDisabled);\n    }\n\n    if (this.trailingIcon_) {\n      this.trailingIcon_.setDisabled(isDisabled);\n    }\n  };\n  /**\n   * @return The native text input element from the host environment, or an object with the same shape for unit tests.\n   */\n\n\n  MDCTextFieldFoundation.prototype.getNativeInput_ = function () {\n    // this.adapter_ may be undefined in foundation unit tests. This happens when testdouble is creating a mock object\n    // and invokes the shouldShake/shouldFloat getters (which in turn call getValue(), which calls this method) before\n    // init() has been called from the MDCTextField constructor. To work around that issue, we return a dummy object.\n    var nativeInput = this.adapter_ ? this.adapter_.getNativeInput() : null;\n    return nativeInput || {\n      disabled: false,\n      maxLength: -1,\n      type: 'input',\n      validity: {\n        badInput: false,\n        valid: true\n      },\n      value: ''\n    };\n  };\n\n  return MDCTextFieldFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/helper-text/component.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@material/textfield/helper-text/component.js ***!
  \*******************************************************************/
/*! exports provided: MDCTextFieldHelperText */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperText\", function() { return MDCTextFieldHelperText; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/helper-text/foundation.js\");\n/**\n * @license\n * Copyright 2017 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCTextFieldHelperText =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldHelperText, _super);\n\n  function MDCTextFieldHelperText() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCTextFieldHelperText.attachTo = function (root) {\n    return new MDCTextFieldHelperText(root);\n  };\n\n  Object.defineProperty(MDCTextFieldHelperText.prototype, \"foundation\", {\n    get: function get() {\n      return this.foundation_;\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCTextFieldHelperText.prototype.getDefaultFoundation = function () {\n    var _this = this; // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    var adapter = {\n      addClass: function addClass(className) {\n        return _this.root_.classList.add(className);\n      },\n      removeClass: function removeClass(className) {\n        return _this.root_.classList.remove(className);\n      },\n      hasClass: function hasClass(className) {\n        return _this.root_.classList.contains(className);\n      },\n      setAttr: function setAttr(attr, value) {\n        return _this.root_.setAttribute(attr, value);\n      },\n      removeAttr: function removeAttr(attr) {\n        return _this.root_.removeAttribute(attr);\n      },\n      setContent: function setContent(content) {\n        _this.root_.textContent = content;\n      }\n    }; // tslint:enable:object-literal-sort-keys\n\n    return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCTextFieldHelperTextFoundation\"](adapter);\n  };\n\n  return MDCTextFieldHelperText;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/component.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/helper-text/constants.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@material/textfield/helper-text/constants.js ***!
  \*******************************************************************/
/*! exports provided: strings, cssClasses */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar cssClasses = {\n  HELPER_TEXT_PERSISTENT: 'mdc-text-field-helper-text--persistent',\n  HELPER_TEXT_VALIDATION_MSG: 'mdc-text-field-helper-text--validation-msg',\n  ROOT: 'mdc-text-field-helper-text'\n};\nvar strings = {\n  ARIA_HIDDEN: 'aria-hidden',\n  ROLE: 'role',\n  ROOT_SELECTOR: \".\" + cssClasses.ROOT\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/constants.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/helper-text/foundation.js":
/*!********************************************************************!*\
  !*** ./node_modules/@material/textfield/helper-text/foundation.js ***!
  \********************************************************************/
/*! exports provided: MDCTextFieldHelperTextFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperTextFoundation\", function() { return MDCTextFieldHelperTextFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/helper-text/constants.js\");\n/**\n * @license\n * Copyright 2017 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCTextFieldHelperTextFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldHelperTextFoundation, _super);\n\n  function MDCTextFieldHelperTextFoundation(adapter) {\n    return _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCTextFieldHelperTextFoundation.defaultAdapter, adapter)) || this;\n  }\n\n  Object.defineProperty(MDCTextFieldHelperTextFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldHelperTextFoundation, \"strings\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldHelperTextFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCTextFieldHelperTextAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n      return {\n        addClass: function addClass() {\n          return undefined;\n        },\n        removeClass: function removeClass() {\n          return undefined;\n        },\n        hasClass: function hasClass() {\n          return false;\n        },\n        setAttr: function setAttr() {\n          return undefined;\n        },\n        removeAttr: function removeAttr() {\n          return undefined;\n        },\n        setContent: function setContent() {\n          return undefined;\n        }\n      }; // tslint:enable:object-literal-sort-keys\n    },\n    enumerable: true,\n    configurable: true\n  });\n  /**\n   * Sets the content of the helper text field.\n   */\n\n  MDCTextFieldHelperTextFoundation.prototype.setContent = function (content) {\n    this.adapter_.setContent(content);\n  };\n  /**\n   * @param isPersistent Sets the persistency of the helper text.\n   */\n\n\n  MDCTextFieldHelperTextFoundation.prototype.setPersistent = function (isPersistent) {\n    if (isPersistent) {\n      this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_PERSISTENT);\n    } else {\n      this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_PERSISTENT);\n    }\n  };\n  /**\n   * @param isValidation True to make the helper text act as an error validation message.\n   */\n\n\n  MDCTextFieldHelperTextFoundation.prototype.setValidation = function (isValidation) {\n    if (isValidation) {\n      this.adapter_.addClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_VALIDATION_MSG);\n    } else {\n      this.adapter_.removeClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_VALIDATION_MSG);\n    }\n  };\n  /**\n   * Makes the helper text visible to the screen reader.\n   */\n\n\n  MDCTextFieldHelperTextFoundation.prototype.showToScreenReader = function () {\n    this.adapter_.removeAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ARIA_HIDDEN);\n  };\n  /**\n   * Sets the validity of the helper text based on the input validity.\n   */\n\n\n  MDCTextFieldHelperTextFoundation.prototype.setValidity = function (inputIsValid) {\n    var helperTextIsPersistent = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_PERSISTENT);\n    var helperTextIsValidationMsg = this.adapter_.hasClass(_constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"].HELPER_TEXT_VALIDATION_MSG);\n    var validationMsgNeedsDisplay = helperTextIsValidationMsg && !inputIsValid;\n\n    if (validationMsgNeedsDisplay) {\n      this.adapter_.setAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ROLE, 'alert');\n    } else {\n      this.adapter_.removeAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ROLE);\n    }\n\n    if (!helperTextIsPersistent && !validationMsgNeedsDisplay) {\n      this.hide_();\n    }\n  };\n  /**\n   * Hides the help text from screen readers.\n   */\n\n\n  MDCTextFieldHelperTextFoundation.prototype.hide_ = function () {\n    this.adapter_.setAttr(_constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ARIA_HIDDEN, 'true');\n  };\n\n  return MDCTextFieldHelperTextFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldHelperTextFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/helper-text/index.js":
/*!***************************************************************!*\
  !*** ./node_modules/@material/textfield/helper-text/index.js ***!
  \***************************************************************/
/*! exports provided: MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ \"./node_modules/@material/textfield/helper-text/component.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperText\", function() { return _component__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextFieldHelperText\"]; });\n\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/helper-text/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperTextFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCTextFieldHelperTextFoundation\"]; });\n\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/helper-text/index.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/icon/component.js":
/*!************************************************************!*\
  !*** ./node_modules/@material/textfield/icon/component.js ***!
  \************************************************************/
/*! exports provided: MDCTextFieldIcon */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIcon\", function() { return MDCTextFieldIcon; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/component */ \"./node_modules/@material/base/component.js\");\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/icon/foundation.js\");\n/**\n * @license\n * Copyright 2017 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\nvar MDCTextFieldIcon =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldIcon, _super);\n\n  function MDCTextFieldIcon() {\n    return _super !== null && _super.apply(this, arguments) || this;\n  }\n\n  MDCTextFieldIcon.attachTo = function (root) {\n    return new MDCTextFieldIcon(root);\n  };\n\n  Object.defineProperty(MDCTextFieldIcon.prototype, \"foundation\", {\n    get: function get() {\n      return this.foundation_;\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCTextFieldIcon.prototype.getDefaultFoundation = function () {\n    var _this = this; // DO NOT INLINE this variable. For backward compatibility, foundations take a Partial<MDCFooAdapter>.\n    // To ensure we don't accidentally omit any methods, we need a separate, strongly typed adapter variable.\n    // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n\n\n    var adapter = {\n      getAttr: function getAttr(attr) {\n        return _this.root_.getAttribute(attr);\n      },\n      setAttr: function setAttr(attr, value) {\n        return _this.root_.setAttribute(attr, value);\n      },\n      removeAttr: function removeAttr(attr) {\n        return _this.root_.removeAttribute(attr);\n      },\n      setContent: function setContent(content) {\n        _this.root_.textContent = content;\n      },\n      registerInteractionHandler: function registerInteractionHandler(evtType, handler) {\n        return _this.listen(evtType, handler);\n      },\n      deregisterInteractionHandler: function deregisterInteractionHandler(evtType, handler) {\n        return _this.unlisten(evtType, handler);\n      },\n      notifyIconAction: function notifyIconAction() {\n        return _this.emit(_foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCTextFieldIconFoundation\"].strings.ICON_EVENT, {}\n        /* evtData */\n        , true\n        /* shouldBubble */\n        );\n      }\n    }; // tslint:enable:object-literal-sort-keys\n\n    return new _foundation__WEBPACK_IMPORTED_MODULE_2__[\"MDCTextFieldIconFoundation\"](adapter);\n  };\n\n  return MDCTextFieldIcon;\n}(_material_base_component__WEBPACK_IMPORTED_MODULE_1__[\"MDCComponent\"]);\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/component.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/icon/constants.js":
/*!************************************************************!*\
  !*** ./node_modules/@material/textfield/icon/constants.js ***!
  \************************************************************/
/*! exports provided: strings, cssClasses */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"strings\", function() { return strings; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"cssClasses\", function() { return cssClasses; });\n/**\n * @license\n * Copyright 2016 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\nvar strings = {\n  ICON_EVENT: 'MDCTextField:icon',\n  ICON_ROLE: 'button'\n};\nvar cssClasses = {\n  ROOT: 'mdc-text-field__icon'\n};\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/constants.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/icon/foundation.js":
/*!*************************************************************!*\
  !*** ./node_modules/@material/textfield/icon/foundation.js ***!
  \*************************************************************/
/*! exports provided: MDCTextFieldIconFoundation, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIconFoundation\", function() { return MDCTextFieldIconFoundation; });\n/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ \"./node_modules/tslib/tslib.es6.js\");\n/* harmony import */ var _material_base_foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @material/base/foundation */ \"./node_modules/@material/base/foundation.js\");\n/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants */ \"./node_modules/@material/textfield/icon/constants.js\");\n/**\n * @license\n * Copyright 2017 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\nvar INTERACTION_EVENTS = ['click', 'keydown'];\n\nvar MDCTextFieldIconFoundation =\n/** @class */\nfunction (_super) {\n  tslib__WEBPACK_IMPORTED_MODULE_0__[\"__extends\"](MDCTextFieldIconFoundation, _super);\n\n  function MDCTextFieldIconFoundation(adapter) {\n    var _this = _super.call(this, tslib__WEBPACK_IMPORTED_MODULE_0__[\"__assign\"]({}, MDCTextFieldIconFoundation.defaultAdapter, adapter)) || this;\n\n    _this.savedTabIndex_ = null;\n\n    _this.interactionHandler_ = function (evt) {\n      return _this.handleInteraction(evt);\n    };\n\n    return _this;\n  }\n\n  Object.defineProperty(MDCTextFieldIconFoundation, \"strings\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldIconFoundation, \"cssClasses\", {\n    get: function get() {\n      return _constants__WEBPACK_IMPORTED_MODULE_2__[\"cssClasses\"];\n    },\n    enumerable: true,\n    configurable: true\n  });\n  Object.defineProperty(MDCTextFieldIconFoundation, \"defaultAdapter\", {\n    /**\n     * See {@link MDCTextFieldIconAdapter} for typing information on parameters and return types.\n     */\n    get: function get() {\n      // tslint:disable:object-literal-sort-keys Methods should be in the same order as the adapter interface.\n      return {\n        getAttr: function getAttr() {\n          return null;\n        },\n        setAttr: function setAttr() {\n          return undefined;\n        },\n        removeAttr: function removeAttr() {\n          return undefined;\n        },\n        setContent: function setContent() {\n          return undefined;\n        },\n        registerInteractionHandler: function registerInteractionHandler() {\n          return undefined;\n        },\n        deregisterInteractionHandler: function deregisterInteractionHandler() {\n          return undefined;\n        },\n        notifyIconAction: function notifyIconAction() {\n          return undefined;\n        }\n      }; // tslint:enable:object-literal-sort-keys\n    },\n    enumerable: true,\n    configurable: true\n  });\n\n  MDCTextFieldIconFoundation.prototype.init = function () {\n    var _this = this;\n\n    this.savedTabIndex_ = this.adapter_.getAttr('tabindex');\n    INTERACTION_EVENTS.forEach(function (evtType) {\n      _this.adapter_.registerInteractionHandler(evtType, _this.interactionHandler_);\n    });\n  };\n\n  MDCTextFieldIconFoundation.prototype.destroy = function () {\n    var _this = this;\n\n    INTERACTION_EVENTS.forEach(function (evtType) {\n      _this.adapter_.deregisterInteractionHandler(evtType, _this.interactionHandler_);\n    });\n  };\n\n  MDCTextFieldIconFoundation.prototype.setDisabled = function (disabled) {\n    if (!this.savedTabIndex_) {\n      return;\n    }\n\n    if (disabled) {\n      this.adapter_.setAttr('tabindex', '-1');\n      this.adapter_.removeAttr('role');\n    } else {\n      this.adapter_.setAttr('tabindex', this.savedTabIndex_);\n      this.adapter_.setAttr('role', _constants__WEBPACK_IMPORTED_MODULE_2__[\"strings\"].ICON_ROLE);\n    }\n  };\n\n  MDCTextFieldIconFoundation.prototype.setAriaLabel = function (label) {\n    this.adapter_.setAttr('aria-label', label);\n  };\n\n  MDCTextFieldIconFoundation.prototype.setContent = function (content) {\n    this.adapter_.setContent(content);\n  };\n\n  MDCTextFieldIconFoundation.prototype.handleInteraction = function (evt) {\n    var isEnterKey = evt.key === 'Enter' || evt.keyCode === 13;\n\n    if (evt.type === 'click' || isEnterKey) {\n      this.adapter_.notifyIconAction();\n    }\n  };\n\n  return MDCTextFieldIconFoundation;\n}(_material_base_foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCFoundation\"]);\n\n // tslint:disable-next-line:no-default-export Needed for backward compatibility with MDC Web v0.44.0 and earlier.\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MDCTextFieldIconFoundation);\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/foundation.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/icon/index.js":
/*!********************************************************!*\
  !*** ./node_modules/@material/textfield/icon/index.js ***!
  \********************************************************/
/*! exports provided: MDCTextFieldIcon, MDCTextFieldIconFoundation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ \"./node_modules/@material/textfield/icon/component.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIcon\", function() { return _component__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextFieldIcon\"]; });\n\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/icon/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIconFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCTextFieldIconFoundation\"]; });\n\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/icon/index.js?");

/***/ }),

/***/ "./node_modules/@material/textfield/index.js":
/*!***************************************************!*\
  !*** ./node_modules/@material/textfield/index.js ***!
  \***************************************************/
/*! exports provided: MDCTextField, MDCTextFieldFoundation, MDCTextFieldCharacterCounter, MDCTextFieldCharacterCounterFoundation, MDCTextFieldHelperText, MDCTextFieldHelperTextFoundation, MDCTextFieldIcon, MDCTextFieldIconFoundation */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./component */ \"./node_modules/@material/textfield/component.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextField\", function() { return _component__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextField\"]; });\n\n/* harmony import */ var _foundation__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./foundation */ \"./node_modules/@material/textfield/foundation.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldFoundation\", function() { return _foundation__WEBPACK_IMPORTED_MODULE_1__[\"MDCTextFieldFoundation\"]; });\n\n/* harmony import */ var _character_counter_index__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./character-counter/index */ \"./node_modules/@material/textfield/character-counter/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldCharacterCounter\", function() { return _character_counter_index__WEBPACK_IMPORTED_MODULE_2__[\"MDCTextFieldCharacterCounter\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldCharacterCounterFoundation\", function() { return _character_counter_index__WEBPACK_IMPORTED_MODULE_2__[\"MDCTextFieldCharacterCounterFoundation\"]; });\n\n/* harmony import */ var _helper_text_index__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./helper-text/index */ \"./node_modules/@material/textfield/helper-text/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperText\", function() { return _helper_text_index__WEBPACK_IMPORTED_MODULE_3__[\"MDCTextFieldHelperText\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldHelperTextFoundation\", function() { return _helper_text_index__WEBPACK_IMPORTED_MODULE_3__[\"MDCTextFieldHelperTextFoundation\"]; });\n\n/* harmony import */ var _icon_index__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./icon/index */ \"./node_modules/@material/textfield/icon/index.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIcon\", function() { return _icon_index__WEBPACK_IMPORTED_MODULE_4__[\"MDCTextFieldIcon\"]; });\n\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"MDCTextFieldIconFoundation\", function() { return _icon_index__WEBPACK_IMPORTED_MODULE_4__[\"MDCTextFieldIconFoundation\"]; });\n\n/**\n * @license\n * Copyright 2019 Google Inc.\n *\n * Permission is hereby granted, free of charge, to any person obtaining a copy\n * of this software and associated documentation files (the \"Software\"), to deal\n * in the Software without restriction, including without limitation the rights\n * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell\n * copies of the Software, and to permit persons to whom the Software is\n * furnished to do so, subject to the following conditions:\n *\n * The above copyright notice and this permission notice shall be included in\n * all copies or substantial portions of the Software.\n *\n * THE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\n * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\n * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\n * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\n * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\n * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN\n * THE SOFTWARE.\n */\n\n\n\n\n\n\n//# sourceURL=webpack:///./node_modules/@material/textfield/index.js?");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextField.vue?vue&type=script&lang=js&":
/*!****************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/text-field/TextField.vue?vue&type=script&lang=js& ***!
  \****************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_textfield__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/textfield */ \"./node_modules/@material/textfield/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  model: {\n    prop: 'value',\n    event: 'model'\n  },\n  props: {\n    value: {\n      type: String,\n      default: ''\n    },\n    disabled: {\n      type: Boolean,\n      default: false\n    },\n    upgraded: {\n      type: Boolean,\n      default: false\n    },\n    fullWidth: {\n      type: Boolean,\n      default: false\n    },\n    outlined: {\n      type: Boolean,\n      default: false\n    },\n    dense: {\n      type: Boolean,\n      default: false\n    },\n    focused: {\n      type: Boolean,\n      default: false\n    },\n    textarea: {\n      type: Boolean,\n      default: false\n    },\n    useNativeValidation: {\n      type: Boolean,\n      default: true\n    },\n    valid: {\n      type: Boolean,\n      default: true\n    }\n  },\n  data: function data() {\n    return {\n      mdcTextField: undefined,\n      slotObserver: undefined\n    };\n  },\n  computed: {\n    classes: function classes() {\n      return {\n        'mdc-text-field--upgraded': this.upgraded,\n        'mdc-text-field--fullwidth': this.fullWidth,\n        'mdc-text-field--with-leading-icon': this.$slots.leadingIcon,\n        'mdc-text-field--with-trailing-icon': this.$slots.trailingIcon,\n        'mdc-text-field--outlined': this.outlined,\n        'mdc-text-field--dense': this.dense,\n        'mdc-text-field--focused': this.focused,\n        'mdc-text-field--textarea': this.textarea,\n        'mdc-text-field--no-label': !this.$slots['default'] && !this.fullWidth\n      };\n    }\n  },\n  watch: {\n    useNativeValidation: function useNativeValidation() {\n      this.mdcTextField.useNativeValidation = this.useNativeValidation;\n    },\n    valid: function valid() {\n      this.mdcTextField.valid = this.valid;\n    },\n    value: function value() {\n      this.mdcTextField.value = this.value;\n    },\n    disabled: function disabled() {\n      this.mdcTextField.disabled = this.disabled;\n    }\n  },\n  mounted: function mounted() {\n    var _this = this;\n\n    this.updateSlots();\n    this.slotObserver = new MutationObserver(function () {\n      return _this.updateSlots();\n    });\n    this.slotObserver.observe(this.$el, {\n      childList: true,\n      subtree: true\n    });\n    this.mdcTextField = _material_textfield__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextField\"].attachTo(this.$el);\n    this.mdcTextField.useNativeValidation = this.useNativeValidation;\n    this.mdcTextField.valid = this.valid;\n    this.mdcTextField.disabled = this.disabled;\n  },\n  beforeDestroy: function beforeDestroy() {\n    this.slotObserver.disconnect();\n    this.mdcTextField.destroy();\n  },\n  methods: {\n    updateSlots: function updateSlots() {\n      if (this.$slots.leadingIcon) {\n        this.$slots.leadingIcon.map(function (n) {\n          n.elm.classList.add('mdc-text-field__icon');\n          n.elm.setAttribute('tabindex', '0');\n          n.elm.setAttribute('role', 'button');\n        });\n      }\n\n      if (this.$slots.trailingIcon) {\n        this.$slots.trailingIcon.map(function (n) {\n          n.elm.classList.add('mdc-text-field__icon');\n          n.elm.setAttribute('tabindex', '0');\n          n.elm.setAttribute('role', 'button');\n        });\n      }\n    }\n  }\n});\n\n//# sourceURL=webpack:///./components/text-field/TextField.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldCharacterCounter.vue?vue&type=script&lang=js&":
/*!********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/text-field/TextFieldCharacterCounter.vue?vue&type=script&lang=js& ***!
  \********************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_textfield_character_counter__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/textfield/character-counter */ \"./node_modules/@material/textfield/character-counter/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  name: 'TextFieldCharacterCounter',\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  props: {\n    currentLength: {\n      type: Number,\n      default: 0\n    },\n    maxLength: {\n      type: Number,\n      default: 0\n    }\n  },\n  data: function data() {\n    return {\n      mdcTextFieldCharacterCounter: undefined,\n      cl: this.currentLength,\n      ml: this.maxLength\n    };\n  },\n  watch: {\n    currentLength: function currentLength() {\n      this.cl = this.currentLength;\n      this.mdcTextFieldCharacterCounter.foundation.setCounterValue(this.currentLength, this.maxLength);\n    },\n    maxLength: function maxLength() {\n      this.ml = this.maxLength;\n      this.mdcTextFieldCharacterCounter.foundation.setCounterValue(this.currentLength, this.maxLength);\n    }\n  },\n  mounted: function mounted() {\n    var input = this.$el.parentElement.previousElementSibling.querySelector('.mdc-text-field__input');\n\n    if (input) {\n      this.ml = input.getAttribute('maxlength');\n      this.cl = input.value.length;\n    }\n\n    this.mdcTextFieldCharacterCounter = _material_textfield_character_counter__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextFieldCharacterCounter\"].attachTo(this.$el);\n    this.mdcTextFieldCharacterCounter.foundation.setCounterValue(this.cl, this.ml);\n  }\n});\n\n//# sourceURL=webpack:///./components/text-field/TextFieldCharacterCounter.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldHelperText.vue?vue&type=script&lang=js&":
/*!**************************************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options!./components/text-field/TextFieldHelperText.vue?vue&type=script&lang=js& ***!
  \**************************************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _material_textfield_helper_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @material/textfield/helper-text */ \"./node_modules/@material/textfield/helper-text/index.js\");\n/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ \"./components/base/index.js\");\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n//\n\n\n/* harmony default export */ __webpack_exports__[\"default\"] = ({\n  mixins: [_base__WEBPACK_IMPORTED_MODULE_1__[\"baseComponentMixin\"], _base__WEBPACK_IMPORTED_MODULE_1__[\"themeClassMixin\"]],\n  props: {\n    persistent: {\n      type: Boolean,\n      default: false\n    },\n    validationMsg: {\n      type: Boolean,\n      default: false\n    }\n  },\n  data: function data() {\n    return {\n      mdcTextFieldHelperText: undefined\n    };\n  },\n  watch: {\n    persistent: function persistent() {\n      this.mdcTextFieldHelperText.foundation.setPersistent(this.persistent);\n    },\n    validationMsg: function validationMsg() {\n      this.mdcTextFieldHelperText.foundation.setValidation(this.validationMsg);\n    }\n  },\n  mounted: function mounted() {\n    this.mdcTextFieldHelperText = _material_textfield_helper_text__WEBPACK_IMPORTED_MODULE_0__[\"MDCTextFieldHelperText\"].attachTo(this.$el.children[0]);\n    this.mdcTextFieldHelperText.foundation.setPersistent(this.persistent);\n    this.mdcTextFieldHelperText.foundation.setValidation(this.validationMsg);\n  }\n});\n\n//# sourceURL=webpack:///./components/text-field/TextFieldHelperText.vue?./node_modules/babel-loader/lib??ref--1!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/tslib/tslib.es6.js":
/*!*****************************************!*\
  !*** ./node_modules/tslib/tslib.es6.js ***!
  \*****************************************/
/*! exports provided: __extends, __assign, __rest, __decorate, __param, __metadata, __awaiter, __generator, __exportStar, __values, __read, __spread, __await, __asyncGenerator, __asyncDelegator, __asyncValues, __makeTemplateObject, __importStar, __importDefault */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__extends\", function() { return __extends; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__assign\", function() { return __assign; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__rest\", function() { return __rest; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__decorate\", function() { return __decorate; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__param\", function() { return __param; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__metadata\", function() { return __metadata; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__awaiter\", function() { return __awaiter; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__generator\", function() { return __generator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__exportStar\", function() { return __exportStar; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__values\", function() { return __values; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__read\", function() { return __read; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__spread\", function() { return __spread; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__await\", function() { return __await; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__asyncGenerator\", function() { return __asyncGenerator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__asyncDelegator\", function() { return __asyncDelegator; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__asyncValues\", function() { return __asyncValues; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__makeTemplateObject\", function() { return __makeTemplateObject; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__importStar\", function() { return __importStar; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"__importDefault\", function() { return __importDefault; });\n/*! *****************************************************************************\r\nCopyright (c) Microsoft Corporation. All rights reserved.\r\nLicensed under the Apache License, Version 2.0 (the \"License\"); you may not use\r\nthis file except in compliance with the License. You may obtain a copy of the\r\nLicense at http://www.apache.org/licenses/LICENSE-2.0\r\n\r\nTHIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY\r\nKIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED\r\nWARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,\r\nMERCHANTABLITY OR NON-INFRINGEMENT.\r\n\r\nSee the Apache Version 2.0 License for specific language governing permissions\r\nand limitations under the License.\r\n***************************************************************************** */\r\n/* global Reflect, Promise */\r\n\r\nvar extendStatics = function(d, b) {\r\n    extendStatics = Object.setPrototypeOf ||\r\n        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n    return extendStatics(d, b);\r\n};\r\n\r\nfunction __extends(d, b) {\r\n    extendStatics(d, b);\r\n    function __() { this.constructor = d; }\r\n    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n}\r\n\r\nvar __assign = function() {\r\n    __assign = Object.assign || function __assign(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];\r\n        }\r\n        return t;\r\n    }\r\n    return __assign.apply(this, arguments);\r\n}\r\n\r\nfunction __rest(s, e) {\r\n    var t = {};\r\n    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)\r\n        t[p] = s[p];\r\n    if (s != null && typeof Object.getOwnPropertySymbols === \"function\")\r\n        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)\r\n            t[p[i]] = s[p[i]];\r\n    return t;\r\n}\r\n\r\nfunction __decorate(decorators, target, key, desc) {\r\n    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;\r\n    if (typeof Reflect === \"object\" && typeof Reflect.decorate === \"function\") r = Reflect.decorate(decorators, target, key, desc);\r\n    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;\r\n    return c > 3 && r && Object.defineProperty(target, key, r), r;\r\n}\r\n\r\nfunction __param(paramIndex, decorator) {\r\n    return function (target, key) { decorator(target, key, paramIndex); }\r\n}\r\n\r\nfunction __metadata(metadataKey, metadataValue) {\r\n    if (typeof Reflect === \"object\" && typeof Reflect.metadata === \"function\") return Reflect.metadata(metadataKey, metadataValue);\r\n}\r\n\r\nfunction __awaiter(thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n}\r\n\r\nfunction __generator(thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n}\r\n\r\nfunction __exportStar(m, exports) {\r\n    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];\r\n}\r\n\r\nfunction __values(o) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator], i = 0;\r\n    if (m) return m.call(o);\r\n    return {\r\n        next: function () {\r\n            if (o && i >= o.length) o = void 0;\r\n            return { value: o && o[i++], done: !o };\r\n        }\r\n    };\r\n}\r\n\r\nfunction __read(o, n) {\r\n    var m = typeof Symbol === \"function\" && o[Symbol.iterator];\r\n    if (!m) return o;\r\n    var i = m.call(o), r, ar = [], e;\r\n    try {\r\n        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);\r\n    }\r\n    catch (error) { e = { error: error }; }\r\n    finally {\r\n        try {\r\n            if (r && !r.done && (m = i[\"return\"])) m.call(i);\r\n        }\r\n        finally { if (e) throw e.error; }\r\n    }\r\n    return ar;\r\n}\r\n\r\nfunction __spread() {\r\n    for (var ar = [], i = 0; i < arguments.length; i++)\r\n        ar = ar.concat(__read(arguments[i]));\r\n    return ar;\r\n}\r\n\r\nfunction __await(v) {\r\n    return this instanceof __await ? (this.v = v, this) : new __await(v);\r\n}\r\n\r\nfunction __asyncGenerator(thisArg, _arguments, generator) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var g = generator.apply(thisArg, _arguments || []), i, q = [];\r\n    return i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i;\r\n    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }\r\n    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }\r\n    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }\r\n    function fulfill(value) { resume(\"next\", value); }\r\n    function reject(value) { resume(\"throw\", value); }\r\n    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }\r\n}\r\n\r\nfunction __asyncDelegator(o) {\r\n    var i, p;\r\n    return i = {}, verb(\"next\"), verb(\"throw\", function (e) { throw e; }), verb(\"return\"), i[Symbol.iterator] = function () { return this; }, i;\r\n    function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === \"return\" } : f ? f(v) : v; } : f; }\r\n}\r\n\r\nfunction __asyncValues(o) {\r\n    if (!Symbol.asyncIterator) throw new TypeError(\"Symbol.asyncIterator is not defined.\");\r\n    var m = o[Symbol.asyncIterator], i;\r\n    return m ? m.call(o) : (o = typeof __values === \"function\" ? __values(o) : o[Symbol.iterator](), i = {}, verb(\"next\"), verb(\"throw\"), verb(\"return\"), i[Symbol.asyncIterator] = function () { return this; }, i);\r\n    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }\r\n    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }\r\n}\r\n\r\nfunction __makeTemplateObject(cooked, raw) {\r\n    if (Object.defineProperty) { Object.defineProperty(cooked, \"raw\", { value: raw }); } else { cooked.raw = raw; }\r\n    return cooked;\r\n};\r\n\r\nfunction __importStar(mod) {\r\n    if (mod && mod.__esModule) return mod;\r\n    var result = {};\r\n    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];\r\n    result.default = mod;\r\n    return result;\r\n}\r\n\r\nfunction __importDefault(mod) {\r\n    return (mod && mod.__esModule) ? mod : { default: mod };\r\n}\r\n\n\n//# sourceURL=webpack:///./node_modules/tslib/tslib.es6.js?");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextField.vue?vue&type=template&id=3bfbbbf3&":
/*!**********************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/text-field/TextField.vue?vue&type=template&id=3bfbbbf3& ***!
  \**********************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    { staticClass: \"mdc-text-field\", class: _vm.classes },\n    [\n      _vm._t(\"leadingIcon\"),\n      _vm._v(\" \"),\n      !_vm.textarea\n        ? _c(\n            \"input\",\n            _vm._g(\n              _vm._b(\n                {\n                  staticClass: \"mdc-text-field__input\",\n                  domProps: { value: _vm.value },\n                  on: {\n                    input: function($event) {\n                      return _vm.$emit(\"model\", $event.target.value)\n                    }\n                  }\n                },\n                \"input\",\n                _vm.$attrs,\n                false\n              ),\n              _vm.$listeners\n            )\n          )\n        : _vm._e(),\n      _vm._v(\" \"),\n      _vm.textarea\n        ? _c(\n            \"textarea\",\n            _vm._g(\n              _vm._b(\n                {\n                  staticClass: \"mdc-text-field__input\",\n                  domProps: { value: _vm.value },\n                  on: {\n                    input: function($event) {\n                      return _vm.$emit(\"model\", $event.target.value)\n                    }\n                  }\n                },\n                \"textarea\",\n                _vm.$attrs,\n                false\n              ),\n              _vm.$listeners\n            )\n          )\n        : _vm._e(),\n      _vm._v(\" \"),\n      _vm.textarea || _vm.outlined\n        ? _c(\"div\", { staticClass: \"mdc-notched-outline\" }, [\n            _c(\"div\", { staticClass: \"mdc-notched-outline__leading\" }),\n            _vm._v(\" \"),\n            _vm.$slots[\"default\"]\n              ? _c(\n                  \"div\",\n                  { staticClass: \"mdc-notched-outline__notch\" },\n                  [_vm._t(\"default\")],\n                  2\n                )\n              : _vm._e(),\n            _vm._v(\" \"),\n            _c(\"div\", { staticClass: \"mdc-notched-outline__trailing\" })\n          ])\n        : _vm._e(),\n      _vm._v(\" \"),\n      _vm.$slots[\"default\"] && !_vm.fullWidth && !_vm.textarea && !_vm.outlined\n        ? _vm._t(\"default\")\n        : _vm._e(),\n      _vm._v(\" \"),\n      _vm._t(\"trailingIcon\"),\n      _vm._v(\" \"),\n      !_vm.outlined ? _vm._t(\"bottomLine\") : _vm._e()\n    ],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/text-field/TextField.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/text-field/TextFieldCharacterCounter.vue?vue&type=template&id=16c35b26&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\"div\", { staticClass: \"mdc-text-field-character-counter\" }, [\n    _vm._v(\n      \"\\n  \" + _vm._s(_vm.currentLength) + \" / \" + _vm._s(_vm.maxLength) + \"\\n\"\n    )\n  ])\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/text-field/TextFieldCharacterCounter.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./components/text-field/TextFieldHelperText.vue?vue&type=template&id=e894c264&":
/*!********************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./components/text-field/TextFieldHelperText.vue?vue&type=template&id=e894c264& ***!
  \********************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"render\", function() { return render; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"staticRenderFns\", function() { return staticRenderFns; });\nvar render = function() {\n  var _vm = this\n  var _h = _vm.$createElement\n  var _c = _vm._self._c || _h\n  return _c(\n    \"div\",\n    { staticClass: \"mdc-text-field-helper-line\" },\n    [\n      _c(\n        \"div\",\n        _vm._b(\n          {\n            staticClass: \"mdc-text-field-helper-text\",\n            attrs: { \"aria-hidden\": \"true\" }\n          },\n          \"div\",\n          _vm.$attrs,\n          false\n        ),\n        [_vm._t(\"default\")],\n        2\n      ),\n      _vm._v(\" \"),\n      _vm._t(\"characterCounter\")\n    ],\n    2\n  )\n}\nvar staticRenderFns = []\nrender._withStripped = true\n\n\n\n//# sourceURL=webpack:///./components/text-field/TextFieldHelperText.vue?./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options");

/***/ }),

/***/ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js":
/*!********************************************************************!*\
  !*** ./node_modules/vue-loader/lib/runtime/componentNormalizer.js ***!
  \********************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return normalizeComponent; });\n/* globals __VUE_SSR_CONTEXT__ */\n\n// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).\n// This module is a runtime utility for cleaner component module output and will\n// be included in the final webpack user bundle.\n\nfunction normalizeComponent (\n  scriptExports,\n  render,\n  staticRenderFns,\n  functionalTemplate,\n  injectStyles,\n  scopeId,\n  moduleIdentifier, /* server only */\n  shadowMode /* vue-cli only */\n) {\n  // Vue.extend constructor export interop\n  var options = typeof scriptExports === 'function'\n    ? scriptExports.options\n    : scriptExports\n\n  // render functions\n  if (render) {\n    options.render = render\n    options.staticRenderFns = staticRenderFns\n    options._compiled = true\n  }\n\n  // functional template\n  if (functionalTemplate) {\n    options.functional = true\n  }\n\n  // scopedId\n  if (scopeId) {\n    options._scopeId = 'data-v-' + scopeId\n  }\n\n  var hook\n  if (moduleIdentifier) { // server build\n    hook = function (context) {\n      // 2.3 injection\n      context =\n        context || // cached call\n        (this.$vnode && this.$vnode.ssrContext) || // stateful\n        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional\n      // 2.2 with runInNewContext: true\n      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {\n        context = __VUE_SSR_CONTEXT__\n      }\n      // inject component styles\n      if (injectStyles) {\n        injectStyles.call(this, context)\n      }\n      // register component module identifier for async chunk inferrence\n      if (context && context._registeredComponents) {\n        context._registeredComponents.add(moduleIdentifier)\n      }\n    }\n    // used by ssr in case component is cached and beforeCreate\n    // never gets called\n    options._ssrRegister = hook\n  } else if (injectStyles) {\n    hook = shadowMode\n      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }\n      : injectStyles\n  }\n\n  if (hook) {\n    if (options.functional) {\n      // for template-only hot-reload because in that case the render fn doesn't\n      // go through the normalizer\n      options._injectStyles = hook\n      // register for functioal component in vue file\n      var originalRender = options.render\n      options.render = function renderWithStyleInjection (h, context) {\n        hook.call(context)\n        return originalRender(h, context)\n      }\n    } else {\n      // inject component registration as beforeCreate hook\n      var existing = options.beforeCreate\n      options.beforeCreate = existing\n        ? [].concat(existing, hook)\n        : [hook]\n    }\n  }\n\n  return {\n    exports: scriptExports,\n    options: options\n  }\n}\n\n\n//# sourceURL=webpack:///./node_modules/vue-loader/lib/runtime/componentNormalizer.js?");

/***/ })

/******/ });
});

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

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : undefined
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}


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

/***/ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true&":
/*!****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/style-loader!./node_modules/css-loader!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src??ref--7-2!./node_modules/sass-loader/lib/loader.js??ref--7-3!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true& ***!
  \****************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


var content = __webpack_require__(/*! !../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--7-2!../../../node_modules/sass-loader/lib/loader.js??ref--7-3!../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true& */ "./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true&");

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
  return _vm._m(0)
}
var staticRenderFns = [
  function() {
    var _vm = this
    var _h = _vm.$createElement
    var _c = _vm._self._c || _h
    return _c("div", [
      _c("ol", { staticClass: "breadcrumb" }, [
        _c("li", [_c("a", { attrs: { href: "#" } }, [_vm._v("Home")])]),
        _vm._v(" "),
        _c("li", [_c("a", { attrs: { href: "#" } }, [_vm._v("Library")])]),
        _vm._v(" "),
        _c("li", { staticClass: "active" }, [_vm._v("Data")])
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
  return _c("div", { staticClass: "login-wrapper" }, [
    _c("div", { staticClass: "login-form" }, [
      _c("form", [
        _vm.showForm
          ? _c("div", { staticClass: "login-input-box" }, [
              _c("div", { staticClass: "form-group" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.userData.email,
                      expression: "userData.email"
                    }
                  ],
                  staticClass: "form-control",
                  attrs: { type: "email", placeholder: "Email" },
                  domProps: { value: _vm.userData.email },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.userData, "email", $event.target.value)
                    }
                  }
                })
              ]),
              _vm._v(" "),
              _c("div", { staticClass: "form-group" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.userData.password,
                      expression: "userData.password"
                    }
                  ],
                  staticClass: "form-control",
                  attrs: { type: "password", placeholder: "Wachtwoord" },
                  domProps: { value: _vm.userData.password },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.$set(_vm.userData, "password", $event.target.value)
                    }
                  }
                })
              ])
            ])
          : _c("div", { staticClass: "verification-input-box" }, [
              _c("div", { staticClass: "form-group" }, [
                _c("input", {
                  directives: [
                    {
                      name: "model",
                      rawName: "v-model",
                      value: _vm.verificationCode,
                      expression: "verificationCode"
                    }
                  ],
                  staticClass: "form-control",
                  attrs: { type: "number", placeholder: "verificatie code" },
                  domProps: { value: _vm.verificationCode },
                  on: {
                    input: function($event) {
                      if ($event.target.composing) {
                        return
                      }
                      _vm.verificationCode = $event.target.value
                    }
                  }
                })
              ])
            ]),
        _vm._v(" "),
        _c("div", { staticClass: "button-box" }, [
          _c(
            "button",
            {
              staticClass: "btn btn-default",
              attrs: { disabled: _vm.submitForm, type: "submit" },
              on: { click: this.switchToVerification }
            },
            [
              _vm._v("Button "),
              _vm.showLoader
                ? _c("i", { staticClass: "fas fa-spin fa-sync-alt" })
                : _vm._e()
            ]
          )
        ])
      ])
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
/* harmony import */ var material_components_vue_dist_text_field__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! material-components-vue/dist/text-field */ "./node_modules/material-components-vue/dist/text-field/index.js");
/* harmony import */ var material_components_vue_dist_text_field__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(material_components_vue_dist_text_field__WEBPACK_IMPORTED_MODULE_3__);




window.Vue = vue__WEBPACK_IMPORTED_MODULE_0___default.a;
window.VueRouter = vue_router__WEBPACK_IMPORTED_MODULE_1__["default"];
window.axios = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(vue_router__WEBPACK_IMPORTED_MODULE_1__["default"]);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(uiv__WEBPACK_IMPORTED_MODULE_2__);
vue__WEBPACK_IMPORTED_MODULE_0___default.a.use(material_components_vue_dist_text_field__WEBPACK_IMPORTED_MODULE_3___default.a);

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
/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
__webpack_require__(/*! ./bootstrap */ "./resources/js/bootstrap.js");


var app = new Vue({
  el: '#app',
  router: _routes_routes__WEBPACK_IMPORTED_MODULE_0__["default"]
});

/***/ }),

/***/ "./resources/js/models/Api.js":
/*!************************************!*\
  !*** ./resources/js/models/Api.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! axios */ "./node_modules/axios/index.js");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function () {
  return axios__WEBPACK_IMPORTED_MODULE_0___default.a.create({
    baseURL: 'http://localhost:3000',
    headers: {
      'Accept': 'application/json'
    }
  });
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
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
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
/* empty/unused harmony star reexport *//* harmony import */ var _login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true& */ "./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true&");
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

/***/ "./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true&":
/*!************************************************************************************************!*\
  !*** ./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true& ***!
  \************************************************************************************************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_lib_loader_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/style-loader!../../../node_modules/css-loader!../../../node_modules/vue-loader/lib/loaders/stylePostLoader.js!../../../node_modules/postcss-loader/src??ref--7-2!../../../node_modules/sass-loader/lib/loader.js??ref--7-3!../../../node_modules/vue-loader/lib??vue-loader-options!./login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true& */ "./node_modules/style-loader/index.js!./node_modules/css-loader/index.js!./node_modules/vue-loader/lib/loaders/stylePostLoader.js!./node_modules/postcss-loader/src/index.js?!./node_modules/sass-loader/lib/loader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/pages/login.vue?vue&type=style&index=0&id=780e8960&lang=scss&scoped=true&");
/* harmony import */ var _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_lib_loader_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_lib_loader_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_lib_loader_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_lib_loader_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
 /* harmony default export */ __webpack_exports__["default"] = (_node_modules_style_loader_index_js_node_modules_css_loader_index_js_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_src_index_js_ref_7_2_node_modules_sass_loader_lib_loader_js_ref_7_3_node_modules_vue_loader_lib_index_js_vue_loader_options_login_vue_vue_type_style_index_0_id_780e8960_lang_scss_scoped_true___WEBPACK_IMPORTED_MODULE_0___default.a); 

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

/***/ "./resources/js/policies/authenticate.js":
/*!***********************************************!*\
  !*** ./resources/js/policies/authenticate.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Authenticate; });
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/regenerator */ "./node_modules/@babel/runtime/regenerator/index.js");
/* harmony import */ var _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _models_Api__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/Api */ "./resources/js/models/Api.js");


function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }



var Authenticate =
/*#__PURE__*/
function () {
  function Authenticate() {
    _classCallCheck(this, Authenticate);
  }

  _createClass(Authenticate, null, [{
    key: "getToken",
    value: function () {
      var _getToken = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee(userData) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return Object(_models_Api__WEBPACK_IMPORTED_MODULE_1__["default"])().post('/auth/login', userData);

              case 2:
                return _context.abrupt("return", _context.sent);

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      function getToken(_x) {
        return _getToken.apply(this, arguments);
      }

      return getToken;
    }()
  }, {
    key: "handleToken",
    value: function () {
      var _handleToken = _asyncToGenerator(
      /*#__PURE__*/
      _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.mark(function _callee2(code, token) {
        return _babel_runtime_regenerator__WEBPACK_IMPORTED_MODULE_0___default.a.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return Object(_models_Api__WEBPACK_IMPORTED_MODULE_1__["default"])().post('/auth/verification', {
                  code: code
                }, {
                  headers: {
                    Authenticate: "Bearer ".concat(token)
                  }
                });

              case 2:
                return _context2.abrupt("return", _context2.sent);

              case 3:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function handleToken(_x2, _x3) {
        return _handleToken.apply(this, arguments);
      }

      return handleToken;
    }()
  }]);

  return Authenticate;
}();



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

__webpack_require__(/*! C:\Users\adriaan\code\quiklease\resources\js\main.js */"./resources/js/main.js");
module.exports = __webpack_require__(/*! C:\Users\adriaan\code\quiklease\resources\styles\main.scss */"./resources/styles/main.scss");


/***/ })

},[[0,"/public/javascript/manifest","/public/javascript/vendor"]]]);