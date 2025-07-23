# Docker 部署指南

本文档介绍如何使用 Docker 部署 Supabase Admin 项目。

## 🚀 快速部署

### 方法一：使用部署脚本（推荐）

```bash
# 1. 进入项目目录
cd supabase-admin

# 2. 运行部署脚本
./deploy.sh

# 3. 访问应用
# 打开浏览器访问: http://localhost:7777
```

### 方法二：手动部署

```bash
# 1. 构建镜像
docker compose build

# 2. 启动服务
docker compose up -d

# 3. 查看日志
docker compose logs -f

# 4. 访问应用
# 打开浏览器访问: http://localhost:7777
```

## ⚙️ 环境变量配置

当前配置已简化，只需要基本的环境变量：

```bash
# 应用配置
NODE_ENV=production
PORT=7777
```

## 🔧 常用命令

### 服务管理

```bash
# 启动服务
docker compose up -d

# 停止服务
docker compose down

# 重启服务
docker compose restart

# 查看服务状态
docker compose ps

# 查看日志
docker compose logs -f

# 进入容器
docker compose exec supabase-admin sh
```

### 镜像管理

```bash
# 重新构建镜像
docker compose build --no-cache

# 清理镜像
docker compose down --rmi all

# 查看镜像
docker images
```

### 数据管理

```bash
# 备份数据
docker compose exec supabase-admin tar -czf backup.tar.gz /app/data

# 恢复数据
docker cp backup.tar.gz supabase-admin:/app/
docker compose exec supabase-admin tar -xzf backup.tar.gz
```

## 📊 监控和日志

### 日志查看

```bash
# 查看实时日志
docker compose logs -f supabase-admin

# 查看最近100行日志
docker compose logs --tail=100 supabase-admin

# 查看错误日志
docker compose logs supabase-admin | grep ERROR
```

## 🔍 故障排除

### 常见问题

1. **端口冲突**
   ```bash
   # 检查端口占用
   netstat -tulpn | grep 7777
   
   # 修改端口映射
   # 编辑 docker-compose.yml 中的 ports 配置
   ```

2. **内存不足**
   ```bash
   # 增加 Docker 内存限制
   # 在 Docker Desktop 设置中调整内存限制
   ```

3. **构建失败**
   ```bash
   # 清理缓存重新构建
   docker compose build --no-cache
   
   # 清理所有 Docker 缓存
   docker system prune -a
   ```

4. **环境变量问题**
   ```bash
   # 检查环境变量
   docker compose exec supabase-admin env
   
   # 重新加载环境变量
   docker compose down && docker compose up -d
   ```

### 调试模式

```bash
# 以调试模式运行
docker compose run --rm supabase-admin sh

# 在容器内调试
docker compose exec supabase-admin sh
```

## 🔒 安全建议

1. **生产环境配置**
   - 使用强密码和密钥
   - 启用 HTTPS
   - 配置防火墙规则
   - 定期更新镜像

2. **数据备份**
   - 定期备份数据库
   - 备份环境变量
   - 备份上传文件

3. **监控告警**
   - 配置应用监控
   - 设置错误告警
   - 监控资源使用

## 📈 性能优化

1. **资源限制**
   ```yaml
   # 在 docker-compose.yml 中添加
   deploy:
     resources:
       limits:
         memory: 1G
         cpus: '0.5'
   ```

2. **缓存优化**
   - 使用 Docker 层缓存
   - 配置 Next.js 缓存
   - 启用 CDN

3. **数据库优化**
   - 配置连接池
   - 优化查询
   - 定期维护

## 🆘 获取帮助

如果遇到问题，请：

1. 查看日志文件
2. 检查环境变量配置
3. 确认 Docker 和 Docker Compose 版本
4. 查看项目 GitHub Issues
5. 联系技术支持

---

**注意**: 首次部署可能需要较长时间来下载依赖和构建镜像，请耐心等待。 