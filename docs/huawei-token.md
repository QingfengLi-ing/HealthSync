# 华为健康 Token 获取指南（官方开发者平台）

本文档介绍如何通过华为开发者平台获取健康数据访问令牌。

## 优点

- ✅ 官方合规方式
- ✅ 支持自动刷新 Token
- ✅ 长期稳定使用

## 步骤概览

```
注册开发者账号 → 创建应用 → 开通 Health Kit → OAuth 授权 → 获取 Token
```

---

## 1. 注册华为开发者账号

1. 访问 [华为开发者联盟](https://developer.huawei.com/consumer/cn/)
2. 点击右上角「注册」，用华为账号登录
3. 完成实名认证（需要身份证，约 5 分钟）

---

## 2. 创建项目和应用

1. 进入 [AppGallery Connect 控制台](https://developer.huawei.com/consumer/cn/service/josp/agc/index.html)
2. 点击「我的项目」→「创建项目」
3. 项目名称：`HealthSync`
4. 在项目下点击「添加应用」→ 选择「Web应用」（方便在浏览器授权）
5. 填写应用名称，完成创建

---

## 3. 开通 Health Kit 服务

1. 进入刚创建的应用
2. 左侧菜单找到「API管理」
3. 搜索「Health Kit」→ 点击「启用」
4. 配置数据权限，勾选：
   - ✅ 步数数据
   - ✅ 心率数据
   - ✅ 睡眠数据
   - ✅ 运动数据
   - ✅ 血氧数据
   - ✅ 压力数据
   - ✅ 体重数据
5. 提交审核（通常 1-3 个工作日）

---

## 4. 获取凭证

审核通过后：

1. 进入应用 →「项目设置」
2. 记录以下信息：
   - **Client ID**（客户端 ID）
   - **Client Secret**（客户端密钥）

---

## 5. 配置 OAuth 回调地址

1. 在「项目设置」→「OAuth 2.0 设置」
2. 添加回调地址：
   ```
   https://github.com/QingfengLi-ing/HealthSync
   ```
   （也可以用你自己的地址，或 `http://localhost:8080` 本地调试）

---

## 6. 获取授权码（Authorization Code）

构造授权 URL，在浏览器中访问：

```
https://oauth-login.cloud.huawei.com/oauth2/v3/authorize?response_type=code&client_id=YOUR_CLIENT_ID&redirect_uri=YOUR_REDIRECT_URI&scope=https%3A%2F%2Fwww.huawei.com%2Fhealth%2Fstep%20https%3A%2F%2Fwww.huawei.com%2Fhealth%2Fheart%20https%3A%2F%2Fwww.huawei.com%2Fhealth%2Fsleep%20https%3A%2F%2Fwww.huawei.com%2Fhealth%2Factivity&access_type=offline
```

替换参数：
- `YOUR_CLIENT_ID`：你的 Client ID
- `YOUR_REDIRECT_URI`：你配置的回调地址（需要 URL 编码）

操作流程：
1. 访问授权 URL
2. 用华为账号登录
3. 同意授权
4. 浏览器跳转到回调地址，URL 中会包含 `code=xxx`
5. 复制这个 `code` 值

---

## 7. 用授权码换取 Token

在终端执行（替换参数）：

```bash
curl -X POST "https://oauth-login.cloud.huawei.com/oauth2/v3/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTH_CODE" \
  -d "client_id=YOUR_CLIENT_ID" \
  -d "client_secret=YOUR_CLIENT_SECRET" \
  -d "redirect_uri=YOUR_REDIRECT_URI"
```

响应示例：

```json
{
  "access_token": "CF2Jxxxxxxxx",
  "refresh_token": "CFsJxxxxxxxx",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

记录：
- `access_token`：访问令牌
- `refresh_token`：刷新令牌（重要！用于自动刷新）

---

## 8. 配置到 GitHub

进入你的仓库 `Settings` → `Secrets and variables` → `Actions`：

| Secret 名称 | 值 |
|------------|-----|
| `HUAWEI_ACCESS_TOKEN` | 你的 access_token |
| `HUAWEI_REFRESH_TOKEN` | 你的 refresh_token |
| `HUAWEI_CLIENT_ID` | 你的 Client ID |
| `HUAWEI_CLIENT_SECRET` | 你的 Client Secret |

配置完成后，GitHub Actions 会自动使用 refresh_token 刷新 access_token，无需手动更新！

---

## 常见问题

### Q: Health Kit 审核需要多久？

通常 1-3 个工作日，如果被拒可以查看原因重新申请。

### Q: 授权 scope 怎么写？

Health Kit 的 scope 格式为：
- 步数：`https://www.huawei.com/health/step`
- 心率：`https://www.huawei.com/health/heart`
- 睡眠：`https://www.huawei.com/health/sleep`
- 运动：`https://www.huawei.com/health/activity`

多个 scope 用空格分隔。

### Q: refresh_token 会过期吗？

有效期约 30 天，但每次刷新后会产生新的 refresh_token。GitHub Actions 会自动处理刷新逻辑。

### Q: 本地如何测试？

可以使用 `http://localhost:8080` 作为回调地址，在本地接收授权码。