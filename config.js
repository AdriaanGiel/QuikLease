const path = require('path');

module.exports = {
    port: process.env.PORT || 8080,
    db: {
        database: process.env.DB_NAME || 'quicklease',
        user: process.env.DB_USER || 'fleet',
        password: process.env.DB_PASS || 'secret',
        options: {
            dialect: process.env.DIALECT || 'sqlite',
            host: process.env.HOST || 'localhost',
            storage: path.resolve(__dirname,'./quicklease.sqlite'),
            logging:false
        }
    },
    dbs:{
        database: process.env.DB_S_NAME || 'fleetmanager',
        user: process.env.DB_S_USER || 'fleet',
        password: process.env.DB_S_PASS || 'secret',
        options: {
            dialect: process.env.DB_S_DIALECT || 'sqlite',
            host: process.env.DB_S_HOST || 'localhost',
            storage: path.resolve(__dirname,'./quickfleet.sqlite')
        }
    },
    authentication:{
        jwtSecret: process.env.JWT_SECRET || 'localsecret'
    }
};