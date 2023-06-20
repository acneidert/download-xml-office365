const axios = require('axios');

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint 
 * @param {string} accessToken 
 */
async function callApi(endpoint, accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };

    try {
        const response = await axios.default.get(endpoint, options);
        return response.data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

/**
 * Calls the endpoint with authorization bearer token.
 * @param {string} endpoint 
 * @param {string} accessToken 
 */
async function postApi(endpoint, data,  accessToken) {

    const options = {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    };


    try {
        const response = await axios.default.post(endpoint, data, options);
        return response.data;
    } catch (error) {
        console.log(error)
        return error;
    }
};

module.exports = {
    callApi: callApi,
    postApi: postApi
};