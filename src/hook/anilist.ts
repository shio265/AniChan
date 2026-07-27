import axios from 'axios';
import fs from 'node:fs/promises';
import path from 'node:path';

export const API_URL = process.env.API_URL || 'https://graphql.anilist.co';

type QueryVariables = Record<string, unknown>;
type QueryOptions = {
    timeout?: number;
};

async function resolveQueryFilePath(queryFilePath: string): Promise<string> {
    try {
        await fs.access(queryFilePath);
        return queryFilePath;
    } catch {
        return path.join(process.cwd(), 'queries', path.basename(queryFilePath));
    }
}

/**
 * Make a GraphQL request to AniList API
 * @param {string} query - GraphQL query string
 * @param {Object} variables - Query variables
 * @param {Object} options - Additional options (timeout, etc.)
 * @returns {Promise<Object>} Response data
 */
// GraphQL response shape changes per query; callers can pass a stricter generic when needed.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryAnilist<T = any>(query: string, variables: QueryVariables = {}, options: QueryOptions = {}): Promise<T> {
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

        return response.data as T;
    } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
            throw new Error(`AniList API error: ${error.response.status} - ${JSON.stringify(error.response.data)}`, { cause: error });
        } else if (axios.isAxiosError(error) && error.request) {
            throw new Error('AniList API: No response received', { cause: error });
        }

        throw error;
    }
}

/**
 * Read GraphQL query from file and execute
 * @param {string} queryFilePath - Path to .graphql file
 * @param {Object} variables - Query variables
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Response data
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function queryAnilistFromFile<T = any>(queryFilePath: string, variables: QueryVariables = {}, options: QueryOptions = {}): Promise<T> {
    try {
        const resolvedPath = await resolveQueryFilePath(queryFilePath);
        const query = await fs.readFile(resolvedPath, 'utf8');
        return queryAnilist<T>(query, variables, options);
    } catch (error) {
        if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
            throw new Error(`GraphQL query file not found: ${queryFilePath}`, { cause: error });
        }
        throw new Error(`Failed to read GraphQL query file: ${queryFilePath}`, { cause: error });
    }
}
