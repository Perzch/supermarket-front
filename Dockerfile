# 使用一个基础镜像，例如Nginx
FROM nginx:latest

# 删除默认的Nginx配置文件
RUN rm -rf /etc/nginx/conf.d/*

# 将Vue项目的构建文件复制到Nginx的默认静态文件目录
COPY dist/ /usr/share/nginx/html

# 将Vue项目的构建文件挂载到Nginx的默认静态文件目录(无效)
# VOLUME /usr/share/nginx/html

# 复制自定义Nginx配置文件（如果需要）
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口（如果Vue项目需要监听特定的端口）
EXPOSE 80

# 启动Nginx服务
CMD ["nginx", "-g", "daemon off;"]
