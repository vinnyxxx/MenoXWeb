# macOS 应用发布网站

专业的 macOS 应用发布网站，采用简洁专业的设计风格，类似 Sublime Text 官网。

## 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **后端**: AWS Lambda (Node.js) + API Gateway + DynamoDB
- **部署**: AWS CDK (TypeScript)
- **CDN**: CloudFront

## 项目结构

```
macos-app-website/
├── frontend/           # 前端静态文件
├── backend/            # Lambda 函数
├── infrastructure/     # AWS CDK 部署代码
├── tests/              # 测试文件
└── docs/               # 文档
```

## 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- AWS CLI 已配置
- AWS CDK CLI: `npm install -g aws-cdk`

### 安装依赖

```bash
npm install
```

### 本地开发

```bash
# 启动前端开发服务器
npm run dev:frontend

# 启动后端开发服务器
npm run dev:backend
```

### 部署到 AWS

```bash
# 首次部署（需要 bootstrap）
cd infrastructure
cdk bootstrap

# 部署所有资源
npm run deploy

# 仅部署前端
npm run deploy:frontend

# 仅部署后端
npm run deploy:backend
```

### 测试

```bash
# 运行所有测试
npm test

# 运行代码检查
npm run lint

# 格式化代码
npm run format
```

### 清理资源

```bash
# 删除所有 AWS 资源
npm run destroy
```

## 功能特性

- ✅ 应用展示主页
- ✅ 下载功能和统计
- ✅ 应用特性介绍
- ✅ 留言板功能
- ✅ 速率限制
- ✅ 响应式设计
- ✅ 可访问性支持

## 成本估算

- 开发/测试环境: $0-2/月（AWS 免费套餐内）
- 生产环境: $2-3/月（低流量）

## 文档

详细文档请查看 [docs](./docs) 目录。

## License

MIT
