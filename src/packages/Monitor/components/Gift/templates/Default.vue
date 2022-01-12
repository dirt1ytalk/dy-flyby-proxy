<template>
  <div :class="`item ${showAnimation ? 'fadeInLeft' : ''} ${getItemClass(data)}`">
    <span class="time_stamp">{{ data.dt }}</span>
    <div v-if="showImg" class="item__gift">
      <img class="avatar" :src="avatarSrc" loading="lazy" />
    </div>
    <div class="item__name">{{ data.nn }}</div>
    <div class="item__cnt">{{ giftMsg }}</div>
    <div v-if="Number(data.hits) > 1" class="item__hits">累计x{{ data.hits }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { nobleData } from '@/global/utils/dydata/nobleData.js'

// 钻粉图片
const DIAMOND_URL = 'https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/diamonds_banner_logo_c077d7b.gif'
const GIFT_IMG_PREFIX = 'https://gfs-op.douyucdn.cn/dygift'
const FANS_LEVEL_UP = "https://shark2.douyucdn.cn/front-publish/live-anchor-title-master/assets/images/exp_ca09807.webp"

let props = defineProps(['data', 'giftData', 'mode', 'showAnimation', 'totalPrice', 'showImg'])

let avatarSrc = computed(() => {
  let ret = "";
  switch (props.data.type) {
    case "礼物":
      ret += GIFT_IMG_PREFIX + props.giftData.pic;
      break;
    case "钻粉":
      ret += DIAMOND_URL;
      break;
    case "贵族":
      ret += nobleData.prefix + nobleData[props.data.nl].pic;
      break;
    case "粉丝牌升级":
      ret += FANS_LEVEL_UP;
      break;
    default:
      break;
  }
  return ret;
});

let giftMsg = computed(() => {
  let ret = "";
  switch (props.data.type) {
    case "礼物":
      ret = `${props.giftData.n}*${props.data.gfcnt}`;
      break;
    case "钻粉":
      ret = props.data.msg;
      break;
    case "贵族":
      ret = props.data.msg;
      break;
    case "粉丝牌升级":
      ret = props.data.msg;
      break;
    case "特殊礼物消息":
      ret = props.data.msg;
      break;
    default:
      break;
  }
  return ret;
});

function getItemClass(item) {
  let ret = "";
  switch (props.data.type) {
    case "礼物":
      if (Number(props.giftData.pc) * Number(item.gfcnt) >= Number(props.totalPrice) * 100 ||
        Number(props.giftData.pc) * Number(item.hits) >= Number(props.totalPrice) * 100) {
        if (props.mode === "night") {
          ret = "highlight-night";
        } else {
          ret = "highlight-day";
        }
      }
      break;
    case "钻粉":
      if (props.mode === "night") {
        ret = "highlight-night";
      } else {
        ret = "highlight-day";
      }
      break;
    case "贵族":
      if (props.mode === "night") {
        ret = "highlight-night";
      } else {
        ret = "highlight-day";
      }
      break;
    case "粉丝牌升级":
      // 当粉丝牌升级大于25级则高亮
      if (item.blv >= 26) {
        if (props.mode === "night") {
          ret = "highlight-night";
        } else {
          ret = "highlight-day";
        }
      }
      break;
    default:
      break;
  }
  return ret;
}
</script>

<style lang="scss" scoped>
@import "@/global/styles/themes/index.scss";

.time_stamp {
  color: black;
  vertical-align: middle;
}

.item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 5px;
  justify-content: v-bind(justifyContentStyle);
  text-align: v-bind(textAlignStyle);

  &:first-child {
    margin-top: 5px;
  }
  > * {
    margin-right: 5px;
  }
  .item__gift {
    img {
      border-radius: 10%;
    }
  }
  .item__fans {
    width: 60px;
  }
  .item__level {
    width: 40px;
    height: 16px;
  }
  .item__name {
    @include fontColor("nicknameColor");
  }
  .item__cnt {
    @include fontColor("contentColor");
  }
  .item__hits {
    @include fontColor("contentColor");
  }
}

.highlight-day {
  background-color: rgba(255, 172, 88, 0.3);
  border-top: 1px solid #ffe4b8;
  border-bottom: 1px solid #ffe4b8;
}

.highlight-night {
  background-color: rgb(55, 55, 55);
  border-top: 1px solid rgb(90, 90, 90);
  border-bottom: 1px solid rgb(90, 90, 90);
}
</style>