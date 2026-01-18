import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
export interface FrontendStackProps extends cdk.StackProps {
    apiUrl: string;
}
export declare class FrontendStack extends cdk.Stack {
    readonly websiteUrl: string;
    readonly downloadsBucket: s3.Bucket;
    constructor(scope: Construct, id: string, props: FrontendStackProps);
}
