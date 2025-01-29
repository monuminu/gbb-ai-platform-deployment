# 基础镜像
FROM ubuntu:22.04

# Set maintainer information
LABEL maintainer="your-email@example.com"

# Avoid interactive prompts
ENV DEBIAN_FRONTEND=noninteractive


# Install Python 3.11
RUN apt-get update && \
    apt-get install -y python3.11 python3.11-venv python3.11-dev --quiet && \
    update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.11 1 && \
    apt-get install -y python3-pip



# 设置工作目录
WORKDIR /app

# 复制应用程序代码到容器中
COPY . .

# 安装依赖包
RUN pip install --no-cache-dir  -r requirements.txt

# 暴露端口
EXPOSE 8080

# 启动应用
CMD ["gunicorn", "-c", "gunicorn_config.py", "app:app"]