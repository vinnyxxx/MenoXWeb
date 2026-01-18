import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import * as path from 'path';

export interface LambdaStackProps extends cdk.StackProps {
  downloadsTable: dynamodb.Table;
  messagesTable: dynamodb.Table;
  rateLimitsTable: dynamodb.Table;
}

export class LambdaStack extends cdk.Stack {
  public readonly downloadHandler: lambda.Function;
  public readonly messageHandler: lambda.Function;

  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    // 下载处理 Lambda 函数
    this.downloadHandler = new lambda.Function(this, 'DownloadHandler', {
      functionName: 'macos-app-download-handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/functions/download-handler')),
      environment: {
        DOWNLOADS_TABLE_NAME: props.downloadsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
    });

    // 授予 Lambda 读写 Downloads 表的权限
    props.downloadsTable.grantReadWriteData(this.downloadHandler);

    // 留言处理 Lambda 函数
    this.messageHandler = new lambda.Function(this, 'MessageHandler', {
      functionName: 'macos-app-message-handler',
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset(path.join(__dirname, '../../backend/functions/message-handler')),
      environment: {
        MESSAGES_TABLE_NAME: props.messagesTable.tableName,
        RATE_LIMITS_TABLE_NAME: props.rateLimitsTable.tableName,
      },
      timeout: cdk.Duration.seconds(10),
      memorySize: 256,
    });

    // 授予 Lambda 读写 Messages 和 RateLimits 表的权限
    props.messagesTable.grantReadWriteData(this.messageHandler);
    props.rateLimitsTable.grantReadWriteData(this.messageHandler);

    // 输出 Lambda 函数 ARN
    new cdk.CfnOutput(this, 'DownloadHandlerArn', {
      value: this.downloadHandler.functionArn,
      description: 'Download handler Lambda ARN',
    });

    new cdk.CfnOutput(this, 'MessageHandlerArn', {
      value: this.messageHandler.functionArn,
      description: 'Message handler Lambda ARN',
    });
  }
}
