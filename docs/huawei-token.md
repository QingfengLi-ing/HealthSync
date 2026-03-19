# 华为健康 Token 获取指南

本文档介绍如何获取华为健康数据的访问令牌（Access Token）。

## 方式一：华为开发者平台（推荐）

### 1. 注册华为开发者账号

1. 访问 [华为开发者联盟](https://developer.huawei.com/consumer/cn/)
2. 点击右上角「注册」
3. 使用手机号或邮箱完成注册
4. 完成实名认证（如需）

### 2. 创建项目和应用

1. 进入 [AppGallery Connect 控制台](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
2. 点击「我的项目」→「创建项目」
3. 填写项目名称，如「HealthSync」
4. 在项目下添加应用，选择「Web应用」或「HarmonyOS应用」

### 3. 开通 Health Kit 服务

1. 在应用详情页，找到「API管理」
2. 搜索并开通「Health Kit」服务
3. 申请所需的数据权限：
   - 步数数据
   - 心率数据
   - 睡眠数据
   - 运动数据
   - 血氧数据
   - 压力数据
4. 等待审核（通常1-3个工作日）

### 4. 获取凭证

审核通过后，在「项目设置」中可以看到：

- **Client ID**: 应用的客户端ID
- **Client Secret**: 应用的客户端密钥

### 5. OAuth 授权获取 Token

使用 OAuth 2.0 授权码流程获取 Token：

#### 步骤1：构造授权URL

```
https://oauth-login.cloud.huawei.com/oauth2/v3/authorize?
  response_type=code&
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://your-redirect-uri&
  scope=https://www.huawei.com/health/step&
  state=STATE_STRING
```

#### 步骤2：用户授权

访问上述URL，使用华为账号登录并授权。

#### 步骤3：获取授权码

授权成功后，页面会跳转到你设置的 `redirect_uri`，URL中会包含 `code` 参数。

#### 步骤4：交换Token

使用授权码交换访问令牌：

```bash
curl -X POST https://oauth-login.cloud.huawei.com/oauth2/v3/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=AUTHORIZATION_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

响应示例：

```json
{
  "access_token": "CF2J...",
  "refresh_token": "CFsJ...",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

### 6. 刷新Token

Access Token 有效期通常为1小时，需要使用 Refresh Token 刷新：

```bash
curl -X POST https://oauth-login.cloud.huawei.com/oauth2/v3/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=refresh_token" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET"
```

---

## 方式二：抓包获取（简单直接）

### 1. 安装抓包工具

- **macOS**: [Charles](https://www.charlesproxy.com/) 或 [Proxyman](https://proxyman.io/)
- **Windows**: [Fiddler](https://www.telerik.com/fiddler)
- **跨平台**: [mitmproxy](https://mitmproxy.org/)

### 2. 配置HTTPS抓包

以 Charles 为例：

1. `Help` → `SSL Proxying` → `Install Charles Root Certificate`
2. 信任证书（macOS需要在钥匙串中设置为「始终信任」）
3. `Proxy` → `SSL Proxying Settings` → 添加 `*:443`

### 3. 手机配置代理

1. 确保手机和电脑在同一WiFi网络
2. 手机WiFi设置中配置HTTP代理：
   - 服务器：电脑IP地址
   - 端口：8888（Charles默认）
3. 手机浏览器访问 `chls.pro/ssl` 安装证书

### 4. 抓取Token

1. 打开华为运动健康App
2. 刷新数据或查看健康详情
3. 在Charles中找到以下域名的请求：
   - `health-api.hicloud.com`（国内）
   - `health-api.huawei.com`（国际）
4. 查看请求头中的 `Authorization` 字段：
   ```
   Authorization: Bearer eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9...
   ```
5. `Bearer ` 后面的就是 Access Token

### 5. 配置到项目

将获取到的Token配置到GitHub Secrets：

1. 进入你的 GitHub 仓库
2. `Settings` → `Secrets and variables` → `Actions`
3. 点击 `New repository secret`
4. Name: `HUAWEI_ACCESS_TOKEN`
5. Value: 粘贴Token（不包含"Bearer "前缀）

---

## 方式三：使用自动化脚本（高级）

项目提供了自动化获取Token的脚本：

```bash
# 安装依赖
pip install playwright
playwright install chromium

# 运行脚本
python run_page/get_huawei_token.py --username YOUR_EMAIL --password YOUR_PASSWORD
```

> ⚠️ 注意：自动化登录可能触发华为的安全验证（滑块验证、短信验证），建议使用方式一或方式二。

---

## 常见问题

### Q: Token 有效期是多久？

- Access Token: 通常1小时
- Refresh Token: 通常30天

### Q: 如何判断Token是否过期？

调用API时返回 `401 Unauthorized` 错误，说明Token已过期。

### Q: Token可以长期使用吗？

建议使用 Refresh Token 机制自动更新 Access Token，在GitHub Actions中配置好 Refresh Token 后会自动刷新。

### Q: 抓包方式会被封号吗？

仅读取自己的健康数据，风险较低。但建议优先使用官方开发者平台方式。

---

## 配置示例

在GitHub仓库中配置以下Secrets：

| Secret名称 | 说明 | 示例值 |
|-----------|------|-------|
| `HUAWEI_ACCESS_TOKEN` | 访问令牌 | `eyJhbGci...` |
| `HUAWEI_REFRESH_TOKEN` | 刷新令牌 | `CFsJ...` |
| `HUAWEI_CLIENT_ID` | 客户端ID（可选） | `123456789` |
| `HUAWEI_CLIENT_SECRET` | 客户端密钥（可选） | `xxxxx` |

配置完成后，GitHub Actions会自动同步你的华为健康数据！