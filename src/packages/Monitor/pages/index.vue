<template>
  <el-container>
    <el-main>
      <el-row class="mb-4" :gutter="10">
        <el-col :span="12">
          <el-card class="h-96">
            <template #header>
              <div>弹幕</div>
            </template>
            <div class="monitor" @click.prevent="onClickMonitor" ref="domMonitor">
              <Danmaku style="height: 280px;" v-if="options.switch.includes('danmaku')" :maxOrder="maxOrder" :options="options" :danmakuList="danmakuList"></Danmaku>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="h-96">
            <template #header>
              <div>礼物</div>
            </template>
            <div class="monitor" @click.prevent="onClickMonitor" ref="domMonitor">
              <Gift
                style="height: 280px"
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
      <el-row :gutter="10">
        <el-col :span="12">
          <el-card class="h-96">
            <template #header>
              <div>特别关注弹幕</div>
            </template>
            <div class="monitor" @click.prevent="onClickMonitor" ref="domMonitor">
              <Danmakuvip style="height: 280px;" v-if="options.switch.includes('danmakuvip')" :maxOrder="maxOrder" :options="options" :danmakuList="danmakuListVIP"></Danmakuvip>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <el-card class="h-96">
            <template #header>
              <div>进场</div>
            </template>
            <div class="monitor" @click.prevent="onClickMonitor" ref="domMonitor">
              <Enter
                style="height: 280px"
                v-if="options.switch.includes('enter')"
                :maxOrder="maxOrder"
                :options="options"
                :enterList="enterList"
              ></Enter>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <Popup class="popup" v-model:show="isShowOption" position="bottom" :style="{ height: '45%' }">
    <Tabs v-model:active="activeTab">
      <Tab title="通用">
        <Field label="模块">
          <template #input>
            <CheckboxGroup v-model="options.switch" direction="horizontal" @change="onChangeSwitch">
              <Checkbox name="enter" shape="square">进场</Checkbox>
              <Checkbox name="gift" shape="square">礼物</Checkbox>
              <Checkbox name="danmaku" shape="square">弹幕</Checkbox>
              <Checkbox name="danmakuvip" shape="square">特别关注弹幕</Checkbox>
            </CheckboxGroup>
          </template>
        </Field>
        <Field label="字号">
          <template #input>
            <Slider v-model="options.fontSize" :min="12" :max="30" />
          </template>
        </Field>
        <Field v-model="options.threshold" label="数据上限" type="digit" placeholder="当超过上限 旧数据会被删除"></Field>
        <div>
        <span class="text-xs ml-4">
            Recomposed By: 星落 | Based on github: qianjiachun/douyu-monitor
        </span>
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
        <Field v-model="options.danmaku.ban.nicknames" label="屏蔽昵称" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
         <Field v-model="options.danmaku.vip" label="弹幕特别关注" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
      </Tab>
      <Tab title="礼物">
        <Field v-model="options.gift.ban.price" label="屏蔽单价<" type="number" placeholder="请输入单价(非亲密度)"></Field>
        <Field v-model="options.gift.totalPrice" label="高亮总价≥" type="number" placeholder="请输入总价(非亲密度)"></Field>
        <Field v-model="options.gift.ban.keywords" label="屏蔽关键词" placeholder="空格隔开 例如:荧光棒 鱼丸"></Field>
      </Tab>
      <Tab title="进场">
        <Field label="显示">
          <template #input>
            <CheckboxGroup v-model="options.enter.show" direction="horizontal">
              <Checkbox name="level" shape="square">等级</Checkbox>
              <Checkbox name="noble" shape="square">贵族</Checkbox>
              <Checkbox name="avatar" shape="square">头像</Checkbox>
            </CheckboxGroup>
          </template>
        </Field>
        <Field v-model="options.enter.keywords" label="进场特别关注" placeholder="空格隔开 例如:昵称1 昵称2"></Field>
      </Tab>
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
          <Field label="布局 - 进场">
          <template #input>
            <Slider v-model="options.size.enter" :disabled="maxOrder === options.order.enter" />
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
import Enter from '../components/Enter/Enter.vue'

import { Popup, Tab, Tabs, Field, Slider, Checkbox, CheckboxGroup, RadioGroup, Radio, Switch, Dialog } from 'vant'

import { useNormalStyle } from '../hooks/useNormalStyle.js'
import { useWebsocket } from '../hooks/useWebsocket.js'

import { giftData } from '@/global/utils/dydata/giftData.js'
import { saveLocalData, getLocalData, deepCopy, getClassStyle, getStrMiddle } from '@/global/utils'
import { defaultOptions } from '../options'

const LOCAL_NAME = 'monitor_options'

let domMonitor = ref(null)
let options = ref(deepCopy(defaultOptions))
let allGiftData = ref({})
let isShowOption = ref(false)
let activeTab = ref(0)
let { directionStyle, fontSizeStyle, avatarImgSizeStyle } = useNormalStyle(options)
let { connectWs, danmakuList, danmakuListVIP, enterList, giftList } = useWebsocket(options, allGiftData)
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
  display: flex;
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