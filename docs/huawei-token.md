# 华为健康 Token 获取指南

本文档介绍如何通过抓包获取华为健康数据的访问令牌。

> ⚠️ **重要提示**：Token 有效期约 24 小时，需要定期更新。建议每周重新抓取一次。

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

## 常见问题

### Q: Token 有效期是多久？

约 24 小时，过期后需要重新抓取。

### Q: 如何判断Token是否过期？

GitHub Actions 同步失败时，检查日志是否有 `401 Unauthorized` 错误。

### Q: 需要经常更新Token吗？

是的，建议每周更新一次 Token。可以在手机上设置提醒。

### Q: 抓包方式安全吗？

仅读取自己的健康数据，风险较低。Token 存储在 GitHub Secrets 中，不会暴露在代码里。

---

## 快速配置

只需要配置一个 Secret：

| Secret名称 | 说明 |
|-----------|------|
| `HUAWEI_ACCESS_TOKEN` | 抓包获取的访问令牌 |

配置完成后，GitHub Actions 会自动同步你的华为健康数据！