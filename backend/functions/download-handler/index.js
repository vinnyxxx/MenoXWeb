// Download handler Lambda function
// Handles download statistics and recording
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const DOWNLOADS_TABLE = process.env.DOWNLOADS_TABLE_NAME || 'macos-app-downloads';
export const handler = async (event) => {
    console.log('Download handler invoked:', JSON.stringify(event, null, 2));
    const httpMethod = event.httpMethod;
    // CORS headers
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    // Handle OPTIONS for CORS
    if (httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }
    if (httpMethod === 'GET') {
        // Get download statistics
        try {
            const result = await docClient.send(new GetCommand({
                TableName: DOWNLOADS_TABLE,
                Key: {
                    id: 'TOTAL_DOWNLOADS',
                },
            }));
            const stats = result.Item;
            const totalDownloads = stats?.count || 0;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    totalDownloads,
                }),
            };
        }
        catch (error) {
            console.error('Error fetching download stats:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'INTERNAL_ERROR',
                    message: 'Failed to fetch download statistics',
                }),
            };
        }
    }
    if (httpMethod === 'POST') {
        // Record a download
        try {
            await docClient.send(new UpdateCommand({
                TableName: DOWNLOADS_TABLE,
                Key: {
                    id: 'TOTAL_DOWNLOADS',
                },
                UpdateExpression: 'ADD #count :inc SET #lastUpdated = :timestamp',
                ExpressionAttributeNames: {
                    '#count': 'count',
                    '#lastUpdated': 'lastUpdated',
                },
                ExpressionAttributeValues: {
                    ':inc': 1,
                    ':timestamp': Date.now(),
                },
            }));
            // Get updated count
            const result = await docClient.send(new GetCommand({
                TableName: DOWNLOADS_TABLE,
                Key: {
                    id: 'TOTAL_DOWNLOADS',
                },
            }));
            const stats = result.Item;
            const totalDownloads = stats?.count || 1;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Download recorded',
                    totalDownloads,
                }),
            };
        }
        catch (error) {
            console.error('Error recording download:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'INTERNAL_ERROR',
                    message: 'Failed to record download',
                }),
            };
        }
    }
    // Unsupported method
    return {
        statusCode: 405,
        headers,
        body: JSON.stringify({
            success: false,
            error: 'METHOD_NOT_ALLOWED',
            message: 'Method not allowed',
        }),
    };
};
