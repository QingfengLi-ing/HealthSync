# HealthSync 🏃‍♂️

> 个人健康数据同步与可视化系统

[![Sync Health Data](https://github.com/YOUR_USERNAME/HealthSync/actions/workflows/health_sync.yml/badge.svg)](https://github.com/YOUR_USERNAME/HealthSync/actions/workflows/health_sync.yml)
[![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-brightgreen)](https://your_username.github.io/HealthSync)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

## ✨ 特性

- 🔄 **自动同步** - 华为手表、Apple Health 数据自动同步
- 📊 **可视化展示** - 精美的健康数据仪表盘
- 🤖 **AI健康建议** - 支持自定义AI模型生成个性化建议
- 🚀 **一键部署** - GitHub Pages / Vercel 免费部署
- 🔒 **隐私安全** - 数据完全由你掌控

## 📸 预览

![Dashboard Preview](docs/images/dashboard-preview.png)

## 🚀 快速开始

### 1. Fork 本项目

点击右上角 `Fork` 按钮，将项目复制到你的账号下。

### 2. 获取华为健康 Token

详细教程请参考 [华为Token获取指南](docs/huawei-token.md)

#### 方式一：华为开发者平台（推荐）

1. 注册 [华为开发者账号](https://developer.huawei.com/consumer/cn/)
2. 创建项目和应用
3. 开通 Health Kit 服务
4. 获取 Client ID 和 Client Secret
5. 使用 OAuth2 授权获取 Token

#### 方式二：抓包获取

1. 安装抓包工具（Charles / mitmproxy）
2. 手机配置代理
3. 打开华为运动健康 App
4. 找到 `health-api.hicloud.com` 请求
5. 复制 `Authorization: Bearer xxx` 中的 Token

### 3. 配置 Secrets

在 Fork 的仓库中设置 Secrets：

`Settings` → `Secrets and variables` → `Actions` → `New repository secret`

| Secret 名称 | 说明 | 必填 |
|------------|------|------|
| `HUAWEI_ACCESS_TOKEN` | 华为健康访问令牌 | ✅ |
| `HUAWEI_REFRESH_TOKEN` | 华为健康刷新令牌 | 推荐 |
| `AI_API_KEY` | AI API 密钥（用于健康建议） | 可选 |
| `AI_BASE_URL` | AI API 地址 | 可选 |

### 4. 启用 GitHub Pages

`Settings` → `Pages` → `Source: GitHub Actions`

### 5. 触发同步

- 自动：每天 UTC 18:00（北京时间凌晨2点）
- 手动：`Actions` → `Sync Health Data` → `Run workflow`

## 🛠 本地开发

```bash
# 克隆项目
git clone https://github.com/YOUR_USERNAME/HealthSync.git
cd HealthSync

# 安装依赖
pip install -r requirements.txt
npm install -g corepack && corepack enable
pnpm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件

# 同步数据
python run_page/huawei_sync.py

# 启动开发服务器
pnpm dev

# 访问 http://localhost:5173
```

## 📁 项目结构

```
HealthSync/
├── .github/workflows/     # GitHub Actions 配置
├── run_page/              # Python 数据同步脚本
│   ├── huawei_sync.py     # 华为健康同步
│   ├── apple_sync.py      # Apple Health 同步
│   └── data.db            # SQLite 数据库
├── src/                   # 前端源码
│   ├── components/        # React 组件
│   ├── pages/             # 页面
│   └── utils/             # 工具函数
├── docs/                  # 文档
└── public/                # 静态资源
```

## 🔧 配置说明

### AI 健康建议配置

支持多种 AI 服务：

```yaml
# 阿里云百炼
AI_API_KEY=sk-xxx
AI_BASE_URL=https://dashscope.aliyuncs.com/compatible-mode/v1
AI_MODEL=qwen-turbo

# 火山引擎
AI_API_KEY=xxx
AI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
AI_MODEL=doubao-pro-32k

# OpenAI 兼容 API
AI_API_KEY=sk-xxx
AI_BASE_URL=https://api.openai.com/v1
AI_MODEL=gpt-4o-mini
```

### 站点配置

编辑 `src/static/site-metadata.ts`：

```typescript
export const siteMetadata = {
  siteTitle: '我的健康数据',
  siteUrl: 'https://your_username.github.io/HealthSync',
  author: 'Your Name',
  // ...
};
```

## 📊 支持的数据类型

| 数据类型 | 华为 | Apple Health |
|---------|------|--------------|
| 步数 | ✅ | ✅ |
| 心率 | ✅ | ✅ |
| 睡眠 | ✅ | ✅ |
| 运动 | ✅ | ✅ |
| 血氧 | ✅ | ✅ |
| 压力 | ✅ | ❌ |
| 体重 | ✅ | ✅ |

## 🤝 贡献

欢迎贡献代码、报告问题或提出建议！

## 📄 许可证

[MIT License](LICENSE)

## 🙏 致谢

- [running_page](https://github.com/yihong0618/running_page) - 项目架构参考
- [Hitrava](https://github.com/CTHRU/Hitrava) - 华为数据解析参考