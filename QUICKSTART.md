# 快速开始指南

## 前置要求

确保已安装以下工具：

```bash
# 检查 Node.js 版本（需要 >= 18）
node --version

# 检查 npm 版本
npm --version

# 检查 AWS CLI 配置
aws sts get-caller-identity

# 安装 AWS CDK CLI（全局）
npm install -g aws-cdk
cdk --version
```

## 第一步：安装依赖

```bash
# 安装所有依赖（根目录 + 所有子项目）
npm install
```

## 第二步：配置 AWS 凭证

确保你的 AWS 凭证已配置（使用公司账号）：

```bash
# 方式 1：使用 AWS CLI 配置
aws configure

# 方式 2：设置环境变量
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_DEFAULT_REGION=us-west-2
```

## 第三步：Bootstrap CDK（仅第一次）

```bash
cd infrastructure

# Bootstrap CDK（在你的 AWS 账号中创建必要的资源）
cdk bootstrap

# 查看将要创建的资源
cdk diff
```

## 第四步：部署到 AWS

```bash
# 部署所有资源（约 10-15 分钟）
cdk deploy --all

# 或者分步部署
cdk deploy MacOSAppDatabaseStack    # 数据库
cdk deploy MacOSAppLambdaStack      # Lambda 函数
cdk deploy MacOSAppApiStack         # API Gateway
cdk deploy MacOSAppFrontendStack    # 前端（S3 + CloudFront）
```

部署完成后，CDK 会输出：
- ✅ API Gateway URL
- ✅ CloudFront 网站 URL
- ✅ DynamoDB 表名

## 第五步：访问网站

```bash
# 从 CDK 输出中复制 CloudFront URL
# 例如：https://d1234567890.cloudfront.net

# 在浏览器中打开
open https://d1234567890.cloudfront.net
```

## 本地开发

### 前端开发

```bash
# 启动本地服务器（端口 8000）
npm run dev:frontend

# 访问 http://localhost:8000
```

### 后端开发

```bash
# 启动本地 Lambda 模拟器
npm run dev:backend
```

## 更新部署

### 仅更新前端

```bash
# 修改前端代码后
npm run deploy:frontend
```

### 仅更新后端

```bash
# 修改 Lambda 函数后
npm run deploy:backend
```

### 更新所有资源

```bash
npm run deploy
```

## 清理资源

完成测试后，删除所有 AWS 资源以避免产生费用：

```bash
# 删除所有资源
npm run destroy

# 或者手动删除
cd infrastructure
cdk destroy --all
```

## 常见问题

### 1. CDK Bootstrap 失败

```bash
# 确保有足够的 IAM 权限
# 需要权限：CloudFormation, S3, IAM, ECR

# 指定区域
cdk bootstrap aws://ACCOUNT-ID/us-west-2
```

### 2. 部署超时

```bash
# CloudFront 创建需要 10-15 分钟
# 耐心等待，不要中断

# 查看部署进度
aws cloudformation describe-stacks \
  --stack-name MacOSAppFrontendStack
```

### 3. 权限错误

```bash
# 确保你的 IAM 用户/角色有以下权限：
# - CloudFormation (完全访问)
# - S3 (完全访问)
# - Lambda (完全访问)
# - API Gateway (完全访问)
# - DynamoDB (完全访问)
# - CloudFront (完全访问)
# - IAM (创建角色)
```

### 4. 成本控制

```bash
# 开发环境成本估算：$0-2/月
# 主要成本来源：
# - CloudFront 流量（前 1TB 免费）
# - Lambda 调用（前 100 万次免费）
# - DynamoDB 读写（25GB 免费）

# 不使用时删除资源
npm run destroy
```

## 下一步

1. 查看 [README.md](./README.md) 了解项目结构
2. 查看 [tasks.md](./.kiro/specs/macos-app-website/tasks.md) 开始实现功能
3. 查看 [docs](./docs) 目录了解详细文档

## 项目状态

- ✅ 项目结构已创建
- ✅ CDK 部署代码已完成
- ⏳ 前端页面（待实现）
- ⏳ Lambda 函数（待实现）
- ⏳ 测试（待实现）

开始实现任务 2：前端页面结构和导航
