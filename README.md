
客户端：webpack + react + 事件总线 + 插件基座 + scss + js + gulp
服务端：express + redis + 租户化 + 中间件

# 插件说明

- [插件说明](#%e6%8f%92%e4%bb%b6%e8%af%b4%e6%98%8e)
  - [1. 说明](#1-%e8%af%b4%e6%98%8e)
  - [2. 相关概念](#2-%e7%9b%b8%e5%85%b3%e6%a6%82%e5%bf%b5)
    - [2.1. PluginHub（Class）](#21-pluginhubclass)
      - [2.1.1. load(pluginName, options)](#211-loadpluginname-options)
      - [2.1.2. subscribe](#212-subscribe)
      - [2.1.3. dispatch](#213-dispatch)
      - [2.1.4. dispatch](#214-dispatch)
    - [2.2. 插件](#22-%e6%8f%92%e4%bb%b6)
      - [2.2.1 插件目录](#221-%e6%8f%92%e4%bb%b6%e7%9b%ae%e5%bd%95)
      - [2.2.2 pluginId](#222-pluginid)
      - [2.2.3 文件夹命名](#223-%e6%96%87%e4%bb%b6%e5%a4%b9%e5%91%bd%e5%90%8d)
      - [2.2.3 const.js](#223-constjs)
      - [2.2.4 event.const.js](#224-eventconstjs)
      - [2.2.5 index.js](#225-indexjs)
      - [2.2.6 plugin.js](#226-pluginjs)
      - [2.2.8 其他](#228-%e5%85%b6%e4%bb%96)
    - [2.3. request](#23-request)
    - [2.4. 兼容性](#24-%e5%85%bc%e5%ae%b9%e6%80%a7)
  - [3. 插件开发流程](#3-%e6%8f%92%e4%bb%b6%e5%bc%80%e5%8f%91%e6%b5%81%e7%a8%8b)
  - [4. 插件列表](#4-%e6%8f%92%e4%bb%b6%e5%88%97%e8%a1%a8)


## 


插件1 插件2

在一个父级元素上 实现 事件总线订阅发布

数据通信： provider 共享顶层数据
        插件本身使用react组件 子父组件props dispatch通信
