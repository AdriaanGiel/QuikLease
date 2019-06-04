const tokenMiddleware = require('./tokenMiddleware');

module.exports = (app) => {
    app.use(tokenMiddleware.getToken);
    app.use(tokenMiddleware.verifyToken);
};