#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { DatabaseStack } from '../lib/database-stack';
import { LambdaStack } from '../lib/lambda-stack';
import { ApiStack } from '../lib/api-stack';
import { FrontendStack } from '../lib/frontend-stack';

const app = new cdk.App();

// 从环境变量或使用默认值
const env = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
};

// 数据库层（DynamoDB 表）
const databaseStack = new DatabaseStack(app, 'MacOSAppDatabaseStack', {
  env,
  description: 'DynamoDB tables for macOS app website',
});

// Lambda 函数层
const lambdaStack = new LambdaStack(app, 'MacOSAppLambdaStack', {
  env,
  description: 'Lambda functions for macOS app website',
  downloadsTable: databaseStack.downloadsTable,
  messagesTable: databaseStack.messagesTable,
  rateLimitsTable: databaseStack.rateLimitsTable,
});

// API Gateway 层
const apiStack = new ApiStack(app, 'MacOSAppApiStack', {
  env,
  description: 'API Gateway for macOS app website',
  downloadHandler: lambdaStack.downloadHandler,
  messageHandler: lambdaStack.messageHandler,
});

// 前端层（S3 + CloudFront）
const frontendStack = new FrontendStack(app, 'MacOSAppFrontendStack', {
  env,
  description: 'Frontend hosting for macOS app website',
  apiUrl: apiStack.apiUrl,
});

// 添加依赖关系
lambdaStack.addDependency(databaseStack);
apiStack.addDependency(lambdaStack);
frontendStack.addDependency(apiStack);

// 添加标签
cdk.Tags.of(app).add('Project', 'macOS-App-Website');
cdk.Tags.of(app).add('Environment', 'Development');
