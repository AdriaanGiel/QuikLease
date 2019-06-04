module.exports = {
    // Setup CORS
    setupCorsConfig(app) {
        app.use((req, res, next) => {

            // Check if incoming method is a GET
            if(req.method === "GET"){

                let accept = req.headers['accept'];
                // Check if the incoming "Accept" header is "application/json"
                if (accept && !accept.includes('application/json')) {

                    // If "accept" header is not "application/json" return status 415
                    return res.status(415).json({message: "unsupported content-type"});
                }
            }

            // TODO set only fleetmanagement web application
            // Allow traffic from any website
            res.header('Access-Control-Allow-Origin', '*');

            // Setup allow headers
            res.header(
                'Access-Control-Allow-Headers',
                'Origin, X-Requested-With, Content-Type, Accept, Authorization'
            );

            // Continue
            next();
        });
    }
};