import * as cdk from 'aws-cdk-lib';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export interface ApiStackProps extends cdk.StackProps {
  downloadHandler: lambda.Function;
  messageHandler: lambda.Function;
}

export class ApiStack extends cdk.Stack {
  public readonly apiUrl: string;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

    // 创建 REST API
    const api = new apigateway.RestApi(this, 'MacOSAppApi', {
      restApiName: 'macOS App API',
      description: 'API for macOS app website',
      deployOptions: {
        stageName: 'prod',
        throttlingRateLimit: 100,
        throttlingBurstLimit: 200,
      },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    // /api 路径
    const apiResource = api.root.addResource('api');

    // /api/downloads 路径
    const downloadsResource = apiResource.addResource('downloads');
    
    // POST /api/downloads - 记录下载
    downloadsResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.downloadHandler)
    );

    // GET /api/downloads/stats - 获取下载统计
    const statsResource = downloadsResource.addResource('stats');
    statsResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.downloadHandler)
    );

    // /api/messages 路径
    const messagesResource = apiResource.addResource('messages');
    
    // POST /api/messages - 提交留言
    messagesResource.addMethod(
      'POST',
      new apigateway.LambdaIntegration(props.messageHandler)
    );

    // GET /api/messages - 获取留言列表
    messagesResource.addMethod(
      'GET',
      new apigateway.LambdaIntegration(props.messageHandler)
    );

    // 保存 API URL
    this.apiUrl = api.url;

    // 输出 API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'ApiId', {
      value: api.restApiId,
      description: 'API Gateway ID',
    });
  }
}
