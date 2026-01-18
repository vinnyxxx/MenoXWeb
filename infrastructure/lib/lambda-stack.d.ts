import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
export interface LambdaStackProps extends cdk.StackProps {
    downloadsTable: dynamodb.Table;
    messagesTable: dynamodb.Table;
    rateLimitsTable: dynamodb.Table;
}
export declare class LambdaStack extends cdk.Stack {
    readonly downloadHandler: lambda.Function;
    readonly messageHandler: lambda.Function;
    constructor(scope: Construct, id: string, props: LambdaStackProps);
}
