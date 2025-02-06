# call-center-template

call-center 模板项目。

call-center 是基于 @juzi/wechaty-puppet-rabbit 所设计的基于 rabbit-mq 的 IM 底层服务端。基础设计理念是：易扩展、无状态。

优点：可以轻松的横向扩展。
代价：如果 IM 需要维护登录状态，则需要比较复杂的实现。因此比较适合基于开放 API 的 IM。

## 项目结构

### 项目结构

```bash
src
├── config
├── data
├── error
├── event
├── middleware
├── oss
├── puppet
├── rabbit
├── state
├── token
├── util
└── app & main.ts
```

### 结构说明

- config: 配置文件
- data: 数据模块，主要负责与 mongo 交互，存储长期数据，例如 联系人、消息
- error: 错误类型定义，主要区别是增加了 $code 和 $message 属性，用于存储 IM 的 API 返回的信息
- event: 事件类型和 payload 定义
- middleware: http log 中间件，用于自动针对 http 请求进行记录
- oss: 对象存储模块，目前只支持了 s3
- puppet: puppet 模块，通过事件监听 mq 来的 wechaty 请求进行处理
- rabbit: rabbit-mq 模块，用于与 rabbit-mq 交互
- state: 状态模块，用于与 redis 交互，存储必要的状态
- token: token 模块，用于创建、删除 token 等 manager 相关的逻辑
- util: 工具函数模块
- app & main: 主模块，用于启动项目

### 流程示例

#### 客户端命令

1. @juzi/wechaty-puppet-rabbit 将 messageSendText 推入 message.to.server 交换机
2. 通过 'command' 的路由 key，数据进入 command.queue 队列，最后触发 handleCommand 方法
3. handleCommand 方法中，通过 appId 获取 token 并对比 data，如果没有相关 token 则抛弃
4. 如果 token 存在，则通过 eventEmitter 触发相关事件，例如 messageSendText 事件，最后在 messageSendText 事件中，通过 puppet 模块进行处理
5. puppet 模块在处理完毕后，会通过 rabbit 模块将消息推入 message.to.client 交换机，并通过相关 key 路由到具体的 client 消费者

#### IM 事件

1. 通过回调或其他队列获取到事件。（需要具体实现）
2. 通过 rabbitProcessor 的 sendEventToExchange 方法，将事件推入 message.to.client 交换机
3. 通过相关 key 路由到具体的 client 消费者

