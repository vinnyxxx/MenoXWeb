import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';
export interface ApiStackProps extends cdk.StackProps {
    downloadHandler: lambda.Function;
    messageHandler: lambda.Function;
}
export declare class ApiStack extends cdk.Stack {
    readonly apiUrl: string;
    constructor(scope: Construct, id: string, props: ApiStackProps);
}
