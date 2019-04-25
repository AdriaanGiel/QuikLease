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
            storage: path.resolve(__dirname,'./quicklease.sqlite')
        }
    },
    authentication:{
        jwtSecret: process.env.JWT_SECRET || 'localsecret'
    }
};