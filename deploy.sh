#!/bin/bash

# Supabase Admin Docker 部署脚本

set -e

echo "🚀 开始部署 Supabase Admin..."

# 检查Docker是否安装
if ! command -v docker &> /dev/null; then
    echo "❌ Docker 未安装，请先安装 Docker"
    exit 1
fi


# 停止现有容器
echo "🛑 停止现有容器..."
docker compose down

# 清理旧镜像（可选）
if [ "$1" = "--clean" ]; then
    echo "🧹 清理旧镜像..."
    docker compose down --rmi all
fi

# 构建镜像
echo "🔨 构建 Docker 镜像..."
docker compose build --no-cache

# 启动服务
echo "🚀 启动服务..."
docker compose up -d

# 等待服务启动
echo "⏳ 等待服务启动..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker compose ps

echo "✅ 服务启动成功！"
echo "🌐 访问地址: http://localhost:7777"

echo "📋 常用命令:"
echo "  查看日志: docker compose logs -f"
echo "  停止服务: docker compose down"
echo "  重启服务: docker compose restart"
echo "  进入容器: docker compose exec supabase-admin sh" 