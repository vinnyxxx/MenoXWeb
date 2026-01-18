import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { Construct } from 'constructs';
import * as path from 'path';

export interface FrontendStackProps extends cdk.StackProps {
  apiUrl: string;
}

export class FrontendStack extends cdk.Stack {
  public readonly websiteUrl: string;
  public readonly downloadsBucket: s3.Bucket;

  constructor(scope: Construct, id: string, props: FrontendStackProps) {
    super(scope, id, props);

    // 创建 S3 存储桶
    const websiteBucket = new s3.Bucket(this, 'WebsiteBucket', {
      bucketName: `macos-app-website-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // 导入现有的 SSL 证书
    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'Certificate',
      'arn:aws:acm:us-east-1:625418298742:certificate/fb1301c9-eef6-43c3-8e30-4bb62f2cdd0c'
    );

    // 创建专用的下载文件存储桶
    this.downloadsBucket = new s3.Bucket(this, 'DownloadsBucket', {
      bucketName: `macos-app-downloads-${this.account}`,
      publicReadAccess: false,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN, // 保留下载文件，即使删除 stack
      versioned: true, // 启用版本控制，保留历史版本
      lifecycleRules: [
        {
          // 旧版本 90 天后删除
          noncurrentVersionExpiration: cdk.Duration.days(90),
        },
      ],
    });

    // 创建 CloudFront 分发
    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(websiteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
      },
      additionalBehaviors: {
        // /downloads/* 路径使用下载桶
        '/downloads/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(this.downloadsBucket),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: false, // 不压缩二进制文件
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        },
      },
      domainNames: ['menox.us', 'www.menox.us'],
      certificate: certificate,
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
        },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_100, // 仅使用北美和欧洲边缘节点（降低成本）
    });

    // 部署前端文件到 S3
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [
        s3deploy.Source.asset(path.join(__dirname, '../../frontend')),
        // 注入 API URL 到前端配置
        s3deploy.Source.jsonData('config.json', {
          apiUrl: props.apiUrl,
        }),
      ],
      destinationBucket: websiteBucket,
      distribution,
      distributionPaths: ['/*'],
    });

    // 保存网站 URL
    this.websiteUrl = `https://${distribution.distributionDomainName}`;

    // 输出网站 URL
    new cdk.CfnOutput(this, 'WebsiteUrl', {
      value: this.websiteUrl,
      description: 'CloudFront website URL',
    });

    new cdk.CfnOutput(this, 'BucketName', {
      value: websiteBucket.bucketName,
      description: 'S3 bucket name',
    });

    new cdk.CfnOutput(this, 'DistributionId', {
      value: distribution.distributionId,
      description: 'CloudFront distribution ID',
    });

    new cdk.CfnOutput(this, 'DownloadsBucketName', {
      value: this.downloadsBucket.bucketName,
      description: 'S3 downloads bucket name',
    });

    new cdk.CfnOutput(this, 'DownloadsBucketArn', {
      value: this.downloadsBucket.bucketArn,
      description: 'S3 downloads bucket ARN',
    });

    new cdk.CfnOutput(this, 'DownloadsUrl', {
      value: `https://menox.us/downloads/`,
      description: 'Downloads base URL (put files in S3 downloads bucket root)',
    });
  }
}
