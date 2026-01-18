#!/usr/bin/env node
"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("source-map-support/register");
const cdk = __importStar(require("aws-cdk-lib"));
const database_stack_1 = require("../lib/database-stack");
const lambda_stack_1 = require("../lib/lambda-stack");
const api_stack_1 = require("../lib/api-stack");
const frontend_stack_1 = require("../lib/frontend-stack");
const app = new cdk.App();
// 从环境变量或使用默认值
const env = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION || 'us-west-2',
};
// 数据库层（DynamoDB 表）
const databaseStack = new database_stack_1.DatabaseStack(app, 'MacOSAppDatabaseStack', {
    env,
    description: 'DynamoDB tables for macOS app website',
});
// Lambda 函数层
const lambdaStack = new lambda_stack_1.LambdaStack(app, 'MacOSAppLambdaStack', {
    env,
    description: 'Lambda functions for macOS app website',
    downloadsTable: databaseStack.downloadsTable,
    messagesTable: databaseStack.messagesTable,
    rateLimitsTable: databaseStack.rateLimitsTable,
});
// API Gateway 层
const apiStack = new api_stack_1.ApiStack(app, 'MacOSAppApiStack', {
    env,
    description: 'API Gateway for macOS app website',
    downloadHandler: lambdaStack.downloadHandler,
    messageHandler: lambdaStack.messageHandler,
});
// 前端层（S3 + CloudFront）
const frontendStack = new frontend_stack_1.FrontendStack(app, 'MacOSAppFrontendStack', {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXBwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUNBLHVDQUFxQztBQUNyQyxpREFBbUM7QUFDbkMsMERBQXNEO0FBQ3RELHNEQUFrRDtBQUNsRCxnREFBNEM7QUFDNUMsMERBQXNEO0FBRXRELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBRTFCLGNBQWM7QUFDZCxNQUFNLEdBQUcsR0FBRztJQUNWLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFtQjtJQUN4QyxNQUFNLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsSUFBSSxXQUFXO0NBQ3RELENBQUM7QUFFRixtQkFBbUI7QUFDbkIsTUFBTSxhQUFhLEdBQUcsSUFBSSw4QkFBYSxDQUFDLEdBQUcsRUFBRSx1QkFBdUIsRUFBRTtJQUNwRSxHQUFHO0lBQ0gsV0FBVyxFQUFFLHVDQUF1QztDQUNyRCxDQUFDLENBQUM7QUFFSCxhQUFhO0FBQ2IsTUFBTSxXQUFXLEdBQUcsSUFBSSwwQkFBVyxDQUFDLEdBQUcsRUFBRSxxQkFBcUIsRUFBRTtJQUM5RCxHQUFHO0lBQ0gsV0FBVyxFQUFFLHdDQUF3QztJQUNyRCxjQUFjLEVBQUUsYUFBYSxDQUFDLGNBQWM7SUFDNUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxhQUFhO0lBQzFDLGVBQWUsRUFBRSxhQUFhLENBQUMsZUFBZTtDQUMvQyxDQUFDLENBQUM7QUFFSCxnQkFBZ0I7QUFDaEIsTUFBTSxRQUFRLEdBQUcsSUFBSSxvQkFBUSxDQUFDLEdBQUcsRUFBRSxrQkFBa0IsRUFBRTtJQUNyRCxHQUFHO0lBQ0gsV0FBVyxFQUFFLG1DQUFtQztJQUNoRCxlQUFlLEVBQUUsV0FBVyxDQUFDLGVBQWU7SUFDNUMsY0FBYyxFQUFFLFdBQVcsQ0FBQyxjQUFjO0NBQzNDLENBQUMsQ0FBQztBQUVILHVCQUF1QjtBQUN2QixNQUFNLGFBQWEsR0FBRyxJQUFJLDhCQUFhLENBQUMsR0FBRyxFQUFFLHVCQUF1QixFQUFFO0lBQ3BFLEdBQUc7SUFDSCxXQUFXLEVBQUUsd0NBQXdDO0lBQ3JELE1BQU0sRUFBRSxRQUFRLENBQUMsTUFBTTtDQUN4QixDQUFDLENBQUM7QUFFSCxTQUFTO0FBQ1QsV0FBVyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUN6QyxRQUFRLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBQ3BDLGFBQWEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7QUFFdEMsT0FBTztBQUNQLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxTQUFTLEVBQUUsbUJBQW1CLENBQUMsQ0FBQztBQUNyRCxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0ICdzb3VyY2UtbWFwLXN1cHBvcnQvcmVnaXN0ZXInO1xuaW1wb3J0ICogYXMgY2RrIGZyb20gJ2F3cy1jZGstbGliJztcbmltcG9ydCB7IERhdGFiYXNlU3RhY2sgfSBmcm9tICcuLi9saWIvZGF0YWJhc2Utc3RhY2snO1xuaW1wb3J0IHsgTGFtYmRhU3RhY2sgfSBmcm9tICcuLi9saWIvbGFtYmRhLXN0YWNrJztcbmltcG9ydCB7IEFwaVN0YWNrIH0gZnJvbSAnLi4vbGliL2FwaS1zdGFjayc7XG5pbXBvcnQgeyBGcm9udGVuZFN0YWNrIH0gZnJvbSAnLi4vbGliL2Zyb250ZW5kLXN0YWNrJztcblxuY29uc3QgYXBwID0gbmV3IGNkay5BcHAoKTtcblxuLy8g5LuO546v5aKD5Y+Y6YeP5oiW5L2/55So6buY6K6k5YC8XG5jb25zdCBlbnYgPSB7XG4gIGFjY291bnQ6IHByb2Nlc3MuZW52LkNES19ERUZBVUxUX0FDQ09VTlQsXG4gIHJlZ2lvbjogcHJvY2Vzcy5lbnYuQ0RLX0RFRkFVTFRfUkVHSU9OIHx8ICd1cy13ZXN0LTInLFxufTtcblxuLy8g5pWw5o2u5bqT5bGC77yIRHluYW1vREIg6KGo77yJXG5jb25zdCBkYXRhYmFzZVN0YWNrID0gbmV3IERhdGFiYXNlU3RhY2soYXBwLCAnTWFjT1NBcHBEYXRhYmFzZVN0YWNrJywge1xuICBlbnYsXG4gIGRlc2NyaXB0aW9uOiAnRHluYW1vREIgdGFibGVzIGZvciBtYWNPUyBhcHAgd2Vic2l0ZScsXG59KTtcblxuLy8gTGFtYmRhIOWHveaVsOWxglxuY29uc3QgbGFtYmRhU3RhY2sgPSBuZXcgTGFtYmRhU3RhY2soYXBwLCAnTWFjT1NBcHBMYW1iZGFTdGFjaycsIHtcbiAgZW52LFxuICBkZXNjcmlwdGlvbjogJ0xhbWJkYSBmdW5jdGlvbnMgZm9yIG1hY09TIGFwcCB3ZWJzaXRlJyxcbiAgZG93bmxvYWRzVGFibGU6IGRhdGFiYXNlU3RhY2suZG93bmxvYWRzVGFibGUsXG4gIG1lc3NhZ2VzVGFibGU6IGRhdGFiYXNlU3RhY2subWVzc2FnZXNUYWJsZSxcbiAgcmF0ZUxpbWl0c1RhYmxlOiBkYXRhYmFzZVN0YWNrLnJhdGVMaW1pdHNUYWJsZSxcbn0pO1xuXG4vLyBBUEkgR2F0ZXdheSDlsYJcbmNvbnN0IGFwaVN0YWNrID0gbmV3IEFwaVN0YWNrKGFwcCwgJ01hY09TQXBwQXBpU3RhY2snLCB7XG4gIGVudixcbiAgZGVzY3JpcHRpb246ICdBUEkgR2F0ZXdheSBmb3IgbWFjT1MgYXBwIHdlYnNpdGUnLFxuICBkb3dubG9hZEhhbmRsZXI6IGxhbWJkYVN0YWNrLmRvd25sb2FkSGFuZGxlcixcbiAgbWVzc2FnZUhhbmRsZXI6IGxhbWJkYVN0YWNrLm1lc3NhZ2VIYW5kbGVyLFxufSk7XG5cbi8vIOWJjeerr+Wxgu+8iFMzICsgQ2xvdWRGcm9udO+8iVxuY29uc3QgZnJvbnRlbmRTdGFjayA9IG5ldyBGcm9udGVuZFN0YWNrKGFwcCwgJ01hY09TQXBwRnJvbnRlbmRTdGFjaycsIHtcbiAgZW52LFxuICBkZXNjcmlwdGlvbjogJ0Zyb250ZW5kIGhvc3RpbmcgZm9yIG1hY09TIGFwcCB3ZWJzaXRlJyxcbiAgYXBpVXJsOiBhcGlTdGFjay5hcGlVcmwsXG59KTtcblxuLy8g5re75Yqg5L6d6LWW5YWz57O7XG5sYW1iZGFTdGFjay5hZGREZXBlbmRlbmN5KGRhdGFiYXNlU3RhY2spO1xuYXBpU3RhY2suYWRkRGVwZW5kZW5jeShsYW1iZGFTdGFjayk7XG5mcm9udGVuZFN0YWNrLmFkZERlcGVuZGVuY3koYXBpU3RhY2spO1xuXG4vLyDmt7vliqDmoIfnrb5cbmNkay5UYWdzLm9mKGFwcCkuYWRkKCdQcm9qZWN0JywgJ21hY09TLUFwcC1XZWJzaXRlJyk7XG5jZGsuVGFncy5vZihhcHApLmFkZCgnRW52aXJvbm1lbnQnLCAnRGV2ZWxvcG1lbnQnKTtcbiJdfQ==