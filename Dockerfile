# 使用Node.js 22作为基础镜像
FROM node:22-alpine

# 安装pnpm
RUN npm install -g pnpm --registry=https://registry.npmmirror.com

# 设置工作目录
WORKDIR /app


# 复制源代码
COPY . .

# 安装依赖
RUN pnpm i --registry=https://registry.npmmirror.com

# 构建前端应用
WORKDIR /app/apps/fe-ui
RUN pnpm run build

# 安装生产依赖
RUN pnpm i --production --registry=https://registry.npmmirror.com

# 暴露端口
EXPOSE 7777

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=7777

# 启动应用
CMD ["pnpm", "start"] 