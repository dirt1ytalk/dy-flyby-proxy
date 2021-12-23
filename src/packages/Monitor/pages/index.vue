<template>
  <el-container>
    <el-main>
      <el-row class="mb-1" :gutter="5">
        <el-col :span="14">
          <el-card>
            <!-- <template #header>
              <div>弹幕</div>
            </template> -->
            <div class="monitor" ref="domMonitor">
              <Danmaku
                style="height: 260px"
                v-if="options.switch.includes('danmaku')"
                :maxOrder="maxOrder"
                :options="options"
                :danmakuList="danmakuList"
                @addToVIP="addToVIP"
                @addToBan="addToBan"
              ></Danmaku>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card>
            <div class="monitor" @click.right.prevent="onClickMonitor" ref="domMonitor">
              <Gift
                style="height: 260px"
                v-if="options.switch.includes('gift')"
                :maxOrder="maxOrder"
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
          <el-card>
            <div class="monitor" @click.right.prevent="onClickMonitor" ref="domMonitor">
              <Danmakuvip
                style="height: 200px"
                v-if="options.switch.includes('danmakuvip')"
                :maxOrder="maxOrder"
                :options="options"
                :danmakuList="danmakuListVIP"
              ></Danmakuvip>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card>
            <div class="monitor" @click.right.prevent="onClickMonitor" ref="domMonitor">
              <GiftAll
                style="height: 200px"
                v-if="options.switch.includes('giftunfiltered')"
                :maxOrder="maxOrder"
                :options="options"
                :giftListAll="giftListAll"
                :allGiftData="allGiftData"
              ></GiftAll>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <Popup class="popup" v-model:show="isShowOption" position="bottom" :style="{ height: '50%' }">
    <Tabs v-model:active="activeTab">
      <Tab title="通用">
        <Field label="模块">
          <template #input>
            <CheckboxGroup v-model="options.switch" direction="horizontal" @change="onChangeSwitch">
              <Checkbox name="giftunfiltered" shape="square">未过滤礼物</Checkbox>
              <Checkbox name="gift" shape="square">礼物</Checkbox>
              <Checkbox name="danmaku" shape="square">弹幕</Checkbox>
              <Checkbox name="danmakuvip" shape="square">特别关注弹幕</Checkbox>
            </CheckboxGroup>
          </template>
        </Field>
        <Field label="动画">
          <template #input>
            <Switch v-model="options.animation" size="20" />
          </template>
        </Field>
         <!-- <Field label=面板透明度>
          <template #input>
            <Slider v-model="options.opacity" :min="0" :max="1" :step="0.1" />
          </template>
        </Field> -->
        <Field label="字号">
          <template #input>
            <Slider v-model="options.fontSize" :min="12" :max="30" />
          </template>
        </Field>
        <Field v-model="options.threshold" label="数据上限" type="digit" placeholder="当超过上限 最早的旧数据会被抛弃"></Field>
        <div>
          <span class="text-xs ml-4"> Recomposed by: 星落 | Based on github: qianjiachun/douyu-monitor </span>
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
        <Field v-model="options.danmaku.ban.level" label="屏蔽等级≤" type="digit" placeholder="请输入屏蔽的等级"></Field>
        <Field v-model="options.danmaku.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:关键词1 关键词2"></Field>
        <Field v-model="options.danmaku.ban.nicknames" label="屏蔽列表" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
        <Field v-model="options.danmaku.vip" label="特别关注" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
      </Tab>
      <Tab title="礼物">
        <Field label="显示图片">
          <template #input>
            <Switch v-model="options.gift.showImg" size="20" />
          </template>
        </Field>
        <Field v-model="options.gift.ban.price" label="过滤阈值<" type="number" placeholder="低于此阈值(鱼翅价值)的礼物不会在上方面板显示"></Field>
        <Field v-model="options.gift.totalPrice" label="高亮阈值≥" type="number" placeholder="高于此阈值(鱼翅价值)的礼物会在上方面板高亮显示"></Field>
        <Field v-model="options.gift.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:荧光棒 鱼丸"></Field>
      </Tab>
      <!-- <Tab title="进场">
        <Field label="显示">
          <template #input>
            <CheckboxGroup v-model="options.enter.show" direction="horizontal">
              <Checkbox name="level" shape="square">等级</Checkbox>
              <Checkbox name="noble" shape="square">贵族</Checkbox>
              <Checkbox name="avatar" shape="square">头像</Checkbox>
            </CheckboxGroup>
          </template>
        </Field>
      </Tab> -->
      <Tab title="Fail Safe">
        <Field label="布局 - 弹幕">
          <template #input>
            <Slider v-model="options.size.danmaku" :disabled="maxOrder === options.order.danmaku" />
          </template>
        </Field>
        <Field label="布局 - 特别关注弹幕">
          <template #input>
            <Slider v-model="options.size.danmakuvip" :disabled="maxOrder === options.order.danmakuvip" />
          </template>
        </Field>
        <Field label="布局 - 礼物">
          <template #input>
            <Slider v-model="options.size.gift" :disabled="maxOrder === options.order.gift" />
          </template>
        </Field>
        <Field label="布局 - 未过滤礼物">
          <template #input>
            <Slider v-model="options.size.giftunfiltered" :disabled="maxOrder === options.order.enter" />
          </template>
        </Field>
      </Tab>
    </Tabs>
  </Popup>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'

import useClipboard from 'vue-clipboard3'

import Danmaku from '../components/Danmaku/Danmaku.vue'
import Danmakuvip from '../components/DanmakuVIP/Danmaku.vue'
import Gift from '../components/Gift/Gift.vue'
//import Enter from '../components/Enter/Enter.vue'
import GiftAll from '../components/GiftUnfiltered/Gift.vue'

import { Popup, Tab, Tabs, Field, Slider, Checkbox, CheckboxGroup, RadioGroup, Radio, Switch, Dialog } from 'vant'

import { useNormalStyle } from '../hooks/useNormalStyle.js'
import { useWebsocket } from '../hooks/useWebsocket.js'

//import { giftData } from '@/global/utils/dydata/giftData.js'
import { saveLocalData, getLocalData, deepCopy, getClassStyle, getStrMiddle } from '@/global/utils'
import { defaultOptions } from '../options'

const LOCAL_NAME = 'monitor_options'

let domMonitor = ref(null)
let options = ref(deepCopy(defaultOptions))
let allGiftData = ref({})
let isShowOption = ref(false)
let activeTab = ref(0)
let { directionStyle, fontSizeStyle, avatarImgSizeStyle, bgAlphaValue } = useNormalStyle(options)
let { connectWs, danmakuList, danmakuListVIP, enterList, giftList, giftListAll } = useWebsocket(options, allGiftData)
let { toClipboard } = useClipboard()

let maxOrder = computed(() => {
  let ret = 0
  for (const key in options.value.order) {
    if (options.value.order[key] > ret) {
      ret = options.value.order[key]
    }
  }
  return ret
})

onMounted(async () => {
  let rid = 520
  let propsOptions = window.options
  if (propsOptions && propsOptions !== '') {
    // 当网页参数传了options，就使用网页的options
    options.value = JSON.parse(propsOptions)
  } else {
    let localData = JSON.parse(getLocalData(LOCAL_NAME))
    if (Object.prototype.toString.call(localData) !== '[object Object]') {
      localData = deepCopy(defaultOptions)
    }
    options.value = localData
  }

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
  //console.log(allGiftData.value)
  connectWs(rid)
})

function addToVIP(nn) {
  let bef = options.value.danmaku.vip
  if (!bef) {
    Dialog.confirm({
      title: '提示',
      message: '确认添加 ' + nn + ' 到特别关注？',
    })
      .then(() => {
        options.value.danmaku.vip = nn
      })
      .catch(() => {})
  } else {
    if (bef.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于特别关注中',
      }).then(() => {})
    } else
      Dialog.confirm({
        title: '提示',
        message: '确认添加 ' + nn + ' 到特别关注？',
      })
        .then(() => {
          let aft = bef.concat(' ', nn)
          options.value.danmaku.vip = aft
        })
        .catch(() => {})
  }
}

function addToBan(nn) {
  let bef = options.value.danmaku.ban.nicknames
  if (!bef) {
    Dialog.confirm({
      title: '提示',
      message: '确认添加 ' + nn + ' 到屏蔽名单？',
    })
      .then(() => {
        options.value.danmaku.ban.nicknames = nn
      })
      .catch(() => {})
  } else {
    if (bef.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于屏蔽名单中',
      }).then(() => {})
    } else
      Dialog.confirm({
        title: '提示',
        message: '确认添加 ' + nn + ' 到屏蔽名单？',
      })
        .then(() => {
          let aft = bef.concat(' ', nn)
          options.value.danmaku.ban.nicknames = aft
        })
        .catch(() => {})
  }
}

function addToGiftFilter() {}

function getRoomGiftData(rid) {
  return new Promise((resolve) => {
    fetch('https://gift.douyucdn.cn/api/gift/v2/web/list?rid=' + rid, {
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
      })
  })
}

function getGiftData() {
  return new Promise((resolve) => {
    fetch('giftdata.txt')
      .then((res) => {
        //console.log(res.text())
        return res.text()
      })
      .then((ret) => {
        let json = ret.substring(String('DYConfigCallback(').length, ret.length)
        //console.log('raw: ' + json)
        json = json.substring(0, json.lastIndexOf(')'))
        //console.log('sub: ' + json)
        //todo - fix
        json = JSON.parse(json)
        //console.log('res: ' + JSON.stringify(json))
        let obj = {}
        for (const key in json.data) {
          let item = json.data[key]
          obj[key] = {
            n: item.name,
            pic: item.himg.replace('https://gfs-op.douyucdn.cn/dygift', ''),
            pc: item.pc,
          }
        }
        //console.log(obj);
        //console.log('resFinal: ' + JSON.stringify(obj))
        return obj
      })
      .then((ret) => {
        resolve(ret)
      })
      .catch((err) => {
        console.log('请求失败!', err)
      })
  })
}

function onClickMonitor() {
  isShowOption.value = true
}

function onChangeSwitch(list) {
  for (const key in options.value.order) {
    let index = list.indexOf(key)
    options.value.order[key] = index + 1
  }
}

function onClickChangeMode() {
  if (options.value.mode === 'night') {
    options.value.mode = 'day'
  } else {
    options.value.mode = 'night'
  }
}

function onClickRestOptions() {
  Dialog.confirm({
    title: '提示',
    message: '确认恢复默认设置？',
  })
    .then(() => {
      options.value = deepCopy(defaultOptions)
    })
    .catch(() => {})
}

function onClickShare() {
  let url = location.href
  if (url.includes('?')) {
    url += '&exoptions='
  } else {
    url += '?exoptions='
  }
  url += encodeURIComponent(JSON.stringify(options.value))
  Dialog.confirm({
    title: '复制分享链接',
    message: '链接保存了当前设置，可粘贴至斗鱼直播伴侣浏览器源中，使设置与网页一致',
  })
    .then(async () => {
      try {
        await toClipboard(url)
      } catch (e) {
        console.error(e)
      }
    })
    .catch(() => {})
}

watch(
  options,
  (n, o) => {
    saveLocalData(LOCAL_NAME, JSON.stringify(n))
  },
  { deep: true }
)

watch(
  () => options.value.mode,
  (n, o) => {
    if (n === 'night') {
      window.document.documentElement.setAttribute('data-theme', 'night')
    } else {
      window.document.documentElement.setAttribute('data-theme', 'day')
    }
  },
  { immediate: true, deep: true }
)

watch(
  () => options.value.transparent,
  (n, o) => {
    if (!domMonitor.value) {
      return
    }
    if (!n) {
      domMonitor.value.style.backgroundColor = ``
      return
    }
    let str = getClassStyle(domMonitor.value, 'backgroundColor')
    let rgb = String(str).match(/[^\(\)]+(?=\))/g)[0]
    if (n) {
      domMonitor.value.style.backgroundColor = `rgba(${rgb},0)`
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
@import '@/global/styles/themes/index.scss';
.monitor {
  @include backgroundColor('backgroundColor');
  width: 100%;
  height: 100%;
  overflow: hidden;
  //display: flex;
  flex-direction: v-bind(directionStyle);
  font-size: v-bind(fontSizeStyle);
  user-select: none;
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