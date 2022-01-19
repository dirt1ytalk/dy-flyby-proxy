<template>
  <el-container style="-webkit-app-region: drag">
    <el-main>
      <el-row class="mb-1" :gutter="5">
        <el-col :span="14">
          <el-card class="bg">
            <div class="monitor">
              <Danmaku
                :style="{ height: heightUpper + 'px' }"
                :options="options"
                :danmakuList="danmakuList"
                @addToVIP="addToVIP"
                @addToBan="addToBan"
              ></Danmaku>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="bg">
            <div class="monitor" @click.right.prevent="onClickMonitor">
              <Gift
                :style="{ height: heightUpper + 'px' }"
                :options="options"
                :giftList="giftList"
                :allGiftData="allGiftData"
              ></Gift>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="14">
          <el-card class="bg" style="-webkit-app-region: no-drag">
            <div class="monitor" @click.right.prevent="onClickMonitor">
              <Danmakuvip
                :style="{ height: heightLower + 'px' }"
                :options="options"
                :danmakuList="danmakuListVIP"
              ></Danmakuvip>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="bg" style="-webkit-app-region: no-drag">
            <div class="monitor" @click.right.prevent="onClickMonitor">
              <GiftUnfiltered
                :style="{ height: heightLower + 'px' }"
                :options="options"
                :giftListUnfiltered="giftListUnfiltered"
                :allGiftData="allGiftData"
              ></GiftUnfiltered>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <Popup
    class="popup"
    v-model:show="isShowOption"
    position="bottom"
    :overlay-style="{ '-webkit-app-region': 'no-drag' }"
    :style="{ height: '50%' }"
  >
    <Tabs v-model:active="activeTab">
      <Tab title="通用">
        <Field label="面板背景颜色 & 不透明度">
          <template #input>
            <el-color-picker show-alpha v-model="options.bgcolora"></el-color-picker>
          </template>
        </Field>
        <Field label="字号">
          <template #input>
            <Slider v-model="options.fontSize" :min="12" :max="30" />
          </template>
        </Field>
        <Field v-model="options.threshold" label="数据上限" type="digit" placeholder="当超过上限 最早的旧数据会被抛弃"></Field>
        <Field label="实验性功能">
          <template #input>
            <Switch v-model="options.expFeature" size="24px"/>
          </template>
        </Field>
        <div>
          <span
            class="text-xs ml-4"
          >Recomposed by: 星落 | V2.1.6 | Based on github: qianjiachun/douyu-monitor</span>
        </div>
      </Tab>
      <Tab title="弹幕">
        <Field label="显示">
          <template #input>
            <CheckboxGroup v-model="options.danmaku.show" direction="horizontal">
              <Checkbox name="level" shape="square">等级</Checkbox>
              <Checkbox name="noble" shape="square">贵族</Checkbox>
              <Checkbox name="fans" shape="square">粉丝牌</Checkbox>
              <Checkbox name="avatar" shape="square">头像</Checkbox>
              <Checkbox name="roomAdmin" shape="square">房管</Checkbox>
              <Checkbox name="diamond" shape="square">钻粉</Checkbox>
            </CheckboxGroup>
          </template>
        </Field>
        <Field
          v-model="options.danmaku.ban.level"
          label="屏蔽等级≤"
          type="digit"
          placeholder="请输入屏蔽的等级"
        ></Field>
        <Field v-model="options.danmaku.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:关键词1 关键词2"></Field>
        <Field v-model="options.danmaku.ban.nicknames" label="屏蔽列表" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
        <Field v-model="options.danmaku.vip" label="特别关注" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
      </Tab>
      <Tab title="礼物">
        <Field label="显示">
          <template #input>
            <CheckboxGroup v-model="options.gift.show" direction="horizontal">
              <Checkbox name="giftImg" shape="square">礼物图片</Checkbox>
              <Checkbox name="level" shape="square">等级</Checkbox>
              <Checkbox name="noble" shape="square">贵族</Checkbox>
              <Checkbox name="fans" shape="square">粉丝牌</Checkbox>
              <Checkbox name="avatar" shape="square">头像</Checkbox>
              <Checkbox name="roomAdmin" shape="square">房管</Checkbox>
              <Checkbox name="diamond" shape="square">钻粉</Checkbox>
            </CheckboxGroup>
          </template>
        </Field>
        <Field
          v-model="options.gift.ban.price"
          label="过滤阈值<"
          type="number"
          placeholder="低于此阈值(鱼翅价值)的礼物不会在上方面板显示"
        ></Field>
        <Field
          v-model="options.gift.totalPrice"
          label="高亮阈值≥"
          type="number"
          placeholder="高于此阈值(鱼翅价值)的礼物会在上方面板高亮显示"
        ></Field>
        <Field v-model="options.gift.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:荧光棒 鱼丸"></Field>
      </Tab>
    </Tabs>
  </Popup>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import Danmaku from '../components/Danmaku/Danmaku.vue'
import Danmakuvip from '../components/DanmakuVIP/Danmaku.vue'
import Gift from '../components/Gift/Gift.vue'
import GiftUnfiltered from '../components/GiftUnfiltered/Gift.vue'

import { Popup, Tab, Tabs, Field, Slider, Checkbox, CheckboxGroup, Switch, Dialog } from 'vant'

import { ElCard, ElRow, ElCol, ElContainer, ElMain, ElColorPicker } from 'element-plus'
import 'element-plus/es/components/card/style/css'
import 'element-plus/es/components/row/style/css'
import 'element-plus/es/components/col/style/css'
import 'element-plus/es/components/container/style/css'
import 'element-plus/es/components/main/style/css'
import 'element-plus/es/components/color-picker/style/css'

import { useNormalStyle } from '../hooks/useNormalStyle.js'
import { useWebsocket } from '../hooks/useWebsocket.js'

import { saveLocalData, getLocalData, deepCopy, formatObj } from '@/global/utils'
import { defaultOptions } from '../options'

const LOCAL_NAME = 'monitor_options'
const ipc = window.ipcRenderer
const fs = window.fs

let options = ref(deepCopy(defaultOptions))
let allGiftData = ref({})
let isShowOption = ref(false)
let activeTab = ref(0)
let { fontSizeStyle, avatarImgSizeStyle, bgColorValue } = useNormalStyle(options)
let { connectWs, danmakuList, danmakuListVIP, giftList, giftListUnfiltered } = useWebsocket(options, allGiftData)

let heightDiff = ref(0)
let heightUpper = ref(0)
let heightLower = ref(0)

function setNewHeight() {
  heightDiff.value = document.documentElement.clientHeight - 590
  heightUpper.value = 260 + heightDiff.value / 2
  heightLower.value = 200 + heightDiff.value / 2
  options.value.moduleSize.upper = heightUpper.value
  options.value.moduleSize.lower = heightLower.value
}

onMounted(async () => {
  let rid = 520
  let localData = JSON.parse(getLocalData(LOCAL_NAME))
  if (Object.prototype.toString.call(localData) !== '[object Object]') {
    localData = deepCopy(defaultOptions)
  }
  options.value = localData

  options.value = formatObj(options.value, defaultOptions)

  //窗口大小重新定位
  heightUpper.value = options.value.moduleSize.upper
  heightLower.value = options.value.moduleSize.lower
  window.addEventListener('resize', setNewHeight)

  //构建日志文件夹路径
  let parentDir = await ipc.invoke('get-doc-path')
  let date = new Date()
  let dateStr = String(date.getFullYear()) + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate())
  let dirLog = parentDir + '\\520-Logs\\' + dateStr

  //存储路径以及启动时日期
  options.value.log.dir = dirLog
  options.value.log.date = dateStr

  //创建日志文件夹, 如文件夹已存在则指定resolve
  await fs.promises.mkdir(dirLog, { recursive: true }).catch((err) => {
    if (err.message.includes('EEXIST')) return Promise.resolve()
  })

  await logInit(dirLog, dateStr, "弹幕")
  await logInit(dirLog, dateStr, "礼物")
  await logInit(dirLog, dateStr, "特殊事件")


  let data = await getRoomGiftData(rid)
  let giftData = await getGiftData()
  let roomGiftData = { prefix: 'https://gfs-op.douyucdn.cn/dygift' }
  if ('giftList' in data.data) {
    for (let i = 0; i < data.data.giftList.length; i++) {
      let item = data.data.giftList[i]
      roomGiftData[item.id] = {
        n: item.name,
        pic: item.basicInfo.focusPic,
        pc: item.priceInfo.price,
      }
    }
  }
  allGiftData.value = { ...roomGiftData, ...giftData }
  connectWs(rid)
})

async function logInit(dir, date, name) {
  let fileDir = dir + "\\" + date + '_' + name + '.txt'
  let timeStr = new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  let initLogMsg = "==================================================\n" +
    "[Renderer] Application launched, start logging...\n" +
    "Current time: " + date + " " + timeStr + "\n" +
    "==================================================\n"
  await fs.promises.appendFile(fileDir, initLogMsg).catch(err => {
    return new Promise.reject(err.message)
  })
}

function addToVIP(nn) {
  let bef = options.value.danmaku.vip
  if (!bef) {
    Dialog.confirm({
      title: '提示',
      message: '确认添加 ' + nn + ' 到特别关注？',
      overlayStyle: {
        '-webkit-app-region': 'no-drag',
      },
    })
      .then(() => {
        options.value.danmaku.vip = nn
      })
      .catch(() => { })
  } else {
    if (bef.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于特别关注中',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      }).then(() => { })
    } else
      Dialog.confirm({
        title: '提示',
        message: '确认添加 ' + nn + ' 到特别关注？',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      })
        .then(() => {
          let aft = bef.concat(' ', nn)
          options.value.danmaku.vip = aft
        })
        .catch(() => { })
  }
}

function addToBan(nn) {
  let bef = options.value.danmaku.ban.nicknames
  if (!bef) {
    Dialog.confirm({
      title: '提示',
      message: '确认添加 ' + nn + ' 到屏蔽名单？',
      overlayStyle: {
        '-webkit-app-region': 'no-drag',
      },
    })
      .then(() => {
        options.value.danmaku.ban.nicknames = nn
      })
      .catch(() => { })
  } else {
    if (bef.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于屏蔽名单中',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      }).then(() => { })
    } else
      Dialog.confirm({
        title: '提示',
        message: '确认添加 ' + nn + ' 到屏蔽名单？',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      })
        .then(() => {
          let aft = bef.concat(' ', nn)
          options.value.danmaku.ban.nicknames = aft
        })
        .catch(() => { })
  }
}

function getRoomGiftData(rid) {
  return new Promise((resolve) => {
    fetch('https://gift.douyucdn.cn/api/gift/v3/web/list?rid=' + rid, {
      method: 'GET',
    })
      .then((res) => {
        return res.json()
      })
      .then((ret) => {
        resolve(ret)
      })
      .catch((err) => {
        console.log('请求失败!', err)
        alert('获取房间礼物数据失败! 请重启程序再试一次')
      })
  })
}

function getGiftData() {
  return new Promise((resolve) => {
    fetch('https://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => {
        return res.text()
      })
      .then((ret) => {
        let json = ret.substring(String('DYConfigCallback(').length, ret.length)
        json = json.substring(0, json.lastIndexOf(')'))
        json = JSON.parse(json)
        let obj = {}
        for (const key in json.data) {
          let item = json.data[key]
          obj[key] = {
            n: item.name,
            pic: item.himg.replace('https://gfs-op.douyucdn.cn/dygift', ''),
            pc: item.pc,
          }
        }
        return obj
      })
      .then((ret) => {
        resolve(ret)
      })
      .catch((err) => {
        console.log('请求失败!', err)
        alert('获取背包礼物数据失败! 请重启程序再试一次')
      })
  })
}

function onClickMonitor() {
  isShowOption.value = true
}





watch(
  options,
  (n) => {
    saveLocalData(LOCAL_NAME, JSON.stringify(n))
  },
  { deep: true }
)
</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";
.monitor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: v-bind(fontSizeStyle);
  user-select: none;
  -webkit-app-region: no-drag;
}

.bg {
  background-color: v-bind(bgColorValue);
}

.popup {
  .popup-top {
    user-select: none;
    height: 32px;
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    padding: 0 10px;
    box-sizing: border-box;
    text-align: right;
    border-bottom: 1px solid rgb(227, 227, 227);
    > div {
      width: 24px;
      height: 24px;
      margin-left: 10px;
      cursor: pointer;
    }
    .douyuex {
      position: absolute;
      left: 0;
    }
    .github {
      position: absolute;
      left: 34px;
    }
  }
}
</style>

<style lang="scss">
.avatar {
  width: v-bind(avatarImgSizeStyle);
  height: v-bind(avatarImgSizeStyle);
  border-radius: 50%;
}
</style>