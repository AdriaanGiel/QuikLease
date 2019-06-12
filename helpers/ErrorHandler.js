
module.exports = {
    /**
     * Method to run code in a try and catch
     * @param method
     * @param res
     * @returns {Promise<*>}
     */
    async handleTryAndCatch(method,res)
    {
        try {
            // run method send in params
            return await method();
        }catch (e) {
            // If error; return status code 400
            res.status(400);
            return res.json({error: e.message})
        }
    }
};