# 520弹幕助手

https://www.douyu.com/520

---

基于 [qianjiachun/douyu-monitor](https://github.com/qianjiachun/douyu-monitor) 深度定制

更多信息请至上方原repo查看

---

## 使用

- 安装依赖

  ```bash
  yarn
  ```

- 使用 `electron-builder` 打包为electron应用

  - 仅应用

    ```bash
    yarn run pack
    ```

    

  - 打包为安装包(nsis)

    ```bash
    yarn run dist
    ```


### 修改房间号

房间号默认定义为 `520` ，如需要修改请定位至 `src/packages/Monitor/pages/index.vue` 下的 `onMounted` 方法

```javascript
let rid = 520 //change here
```

将 `rid` 修改为目标房间号

同时定位至`src/packages/Monitor/hooks/useWebsocket.js`

```javascript
let targetRid = "520" //change here, must be string duee to strict equality check
```

修改 `targetRid` 为目标房间号

随后重新打包即可

## 所做修改

See commits

