import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class DatabaseStack extends cdk.Stack {
  public readonly downloadsTable: dynamodb.Table;
  public readonly messagesTable: dynamodb.Table;
  public readonly rateLimitsTable: dynamodb.Table;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Downloads 表 - 存储下载统计
    this.downloadsTable = new dynamodb.Table(this, 'DownloadsTable', {
      tableName: 'macos-app-downloads',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // 开发环境，生产环境改为 RETAIN
      pointInTimeRecovery: false, // 生产环境建议启用
    });

    // Messages 表 - 存储留言
    this.messagesTable = new dynamodb.Table(this, 'MessagesTable', {
      tableName: 'macos-app-messages',
      partitionKey: {
        name: 'id',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      pointInTimeRecovery: false,
    });

    // 添加全局二级索引 - 按时间倒序查询留言
    this.messagesTable.addGlobalSecondaryIndex({
      indexName: 'timestamp-index',
      partitionKey: {
        name: 'type',
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: 'timestamp',
        type: dynamodb.AttributeType.STRING,
      },
      projectionType: dynamodb.ProjectionType.ALL,
    });

    // RateLimits 表 - 速率限制
    this.rateLimitsTable = new dynamodb.Table(this, 'RateLimitsTable', {
      tableName: 'macos-app-rate-limits',
      partitionKey: {
        name: 'identifier',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      timeToLiveAttribute: 'expiresAt', // TTL 自动清理过期记录
    });

    // 输出表名
    new cdk.CfnOutput(this, 'DownloadsTableName', {
      value: this.downloadsTable.tableName,
      description: 'Downloads table name',
    });

    new cdk.CfnOutput(this, 'MessagesTableName', {
      value: this.messagesTable.tableName,
      description: 'Messages table name',
    });

    new cdk.CfnOutput(this, 'RateLimitsTableName', {
      value: this.rateLimitsTable.tableName,
      description: 'Rate limits table name',
    });
  }
}
