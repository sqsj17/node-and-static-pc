## 服务端

1、安装express、 路由控制

2、页面访问、API接口

4、区别环境变量
    cross-env

3、express 中间件
        1 、redis 缓存 本地启动一个
            "ioredis": "^5.3.2",
            "lru-cache": "^10.1.0"

            brew install redis
            // 1. 使用 brew 启动软件
            brew services start redis
            // 2. 执行命令，启动服务
            redis-server
            ps axu | grep redis
            redis-cli -h 127.0.0.1 -p 6379
            $redis-cli
            redis 127.0.0.1:6379>
            redis 127.0.0.1:6379> PING
            PONG
            // PING 命令，该命令用于检测 redis 服务是否启动。
            redis-cli shutdown
            sudo pkill redis-server

            参考https://blog.csdn.net/XH_jing/article/details/129365285

5、租户差异化配置支持

            路由中间件配置拦截是哪个租户(匹配域名)
            模板语言读取租户，指定访问配置
                nunjucks原理：javascript实现类似python模板引擎，既可以用在Node环境下，又可以运行在浏览器端
                中间件读取域名匹配租户
                node-redis缓存
            服务端Node请求JAVA接口 渲染模板
                自动化生成请求工具插件
                封装axios拦截器
                
            客户端请求







