// Forum/Message handler Lambda function
// Handles forum thread submission and retrieval
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const MESSAGES_TABLE = process.env.MESSAGES_TABLE_NAME || 'macos-app-messages';
export const handler = async (event) => {
    console.log('Message handler invoked:', JSON.stringify(event, null, 2));
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
        // Get forum threads
        try {
            const result = await docClient.send(new ScanCommand({
                TableName: MESSAGES_TABLE,
                FilterExpression: '#type = :type',
                ExpressionAttributeNames: {
                    '#type': 'type',
                },
                ExpressionAttributeValues: {
                    ':type': 'THREAD',
                },
                Limit: 50,
            }));
            const items = (result.Items || []);
            // Sort by timestamp descending
            const threads = items
                .sort((a, b) => parseInt(b.timestamp) - parseInt(a.timestamp))
                .map((item) => ({
                id: item.id,
                title: item.title,
                content: item.content,
                author: item.author || 'Anonymous',
                timestamp: parseInt(item.timestamp),
            }));
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    threads,
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalThreads: threads.length,
                    },
                }),
            };
        }
        catch (error) {
            console.error('Error fetching threads:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'INTERNAL_ERROR',
                    message: 'Failed to fetch threads',
                }),
            };
        }
    }
    if (httpMethod === 'POST') {
        // Submit new forum thread
        try {
            const body = JSON.parse(event.body || '{}');
            const { title, content, author } = body;
            // Validate input
            if (!title || !content) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'INVALID_INPUT',
                        message: 'Title and content are required',
                    }),
                };
            }
            if (title.length > 100 || content.length > 1000) {
                return {
                    statusCode: 400,
                    headers,
                    body: JSON.stringify({
                        success: false,
                        error: 'INVALID_INPUT',
                        message: 'Title or content too long',
                    }),
                };
            }
            const timestamp = Date.now().toString();
            const threadId = `THREAD_${timestamp}`;
            await docClient.send(new PutCommand({
                TableName: MESSAGES_TABLE,
                Item: {
                    id: threadId,
                    timestamp: timestamp,
                    type: 'THREAD',
                    title: title.trim(),
                    content: content.trim(),
                    author: author || 'Anonymous',
                },
            }));
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    success: true,
                    message: 'Thread posted successfully',
                    threadId,
                }),
            };
        }
        catch (error) {
            console.error('Error posting thread:', error);
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({
                    success: false,
                    error: 'INTERNAL_ERROR',
                    message: 'Failed to post thread',
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
