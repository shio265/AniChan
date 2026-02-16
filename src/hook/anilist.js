const axios = require('axios');

const API_URL = 'https://graphql.anilist.co';

/**
 * Make a GraphQL request to AniList API
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Query variables
 * @param {Object} options - Additional options (timeout, etc.)
 * @returns {Promise<Object>} Response data
 */
async function queryAnilist(query, variables = {}, options = {}) {
    const { timeout = 10000 } = options;

    try {
        const response = await axios.post(
            API_URL,
            {
                query,
                variables
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                timeout
            }
        );

        return response.data;
    } catch (error) {
        // Re-throw with more context
        if (error.response) {
            throw new Error(`AniList API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`, { cause: error });
        } else if (error.request) {
            throw new Error('AniList API: No response received', { cause: error });
        } else {
            throw error;
        }
    }
}

/**
 * Read GraphQL query from file and execute
 * @param {string} queryFilePath - Path to .graphql file
 * @param {Object} variables - Query variables
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
async function queryAnilistFromFile(queryFilePath, variables = {}, options = {}) {
    const fs = require('fs');
    const query = fs.readFileSync(queryFilePath, 'utf8');
    return queryAnilist(query, variables, options);
}

module.exports = {
    queryAnilist,
    queryAnilistFromFile,
    API_URL
};
