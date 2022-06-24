<template>
  <div :class="`item ${getItemClass(data)}`">
    <span class="time_stamp">{{ data.dt }}</span>
    <!-- 等级 -->
    <span
      v-if="!!data.lv && showLevel"
      :class="`item__level UserLevel UserLevel--${data.lv}`"
    ></span>
    <!-- 贵族 -->
    <span
      v-if="!!data.noble && showNoble"
      class="item__noble Barrage-icon Barrage-noble"
    >
      <img
        :src="`${
          data.noble in nobleData
            ? nobleData.prefix + nobleData[data.noble].pic
            : ''
        }`"
        loading="lazy"
      />
    </span>
    <!-- 粉丝牌 -->
    <div
      v-if="!!data.fansName && showFans"
      :class="`item__fans FansMedal fansLevel-${data.fansLv}`"
    >
      <span class="FansMedal-name">{{ data.fansName }}</span>
    </div>
    <span
      v-if="data.roomAdmin === '4' && showRoomAdmin"
      class="item__roomAdmin"
    >
      <span class="Barrage-icon Barrage-icon--roomAdmin"></span>
    </span>
    <span v-if="!!data.diamond && showDiamond">
      <img
        class="FansMedalBox-diamondsIcon"
        src="https://sta-op.douyucdn.cn/douyu/2021/08/05/02304a1c04587e43ac626ce5ce07d935.png"
        alt
        loading="lazy"
      />
    </span>
    <span
      v-if="data.vip && showVip"
      class="Barrage-roomVipIcon"
    ></span>
    <span
      v-if="!!data.avatar && showAvatar"
      class="item__avatar"
    >
      <img
        class="avatar"
        :src="`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`"
        loading="lazy"
      />
    </span>
    <div class="item__name">{{ data.nn }}</div>
    <div class="item__cnt">{{ giftMsg }}</div>
    <div
      v-if="Number(data.hits) > 1"
      class="item__hits"
    >
      累计x{{ data.hits }}
    </div>
    <div
      v-if="showImg"
      class="item__gift"
    >
      <img
        class="avatar"
        :src="avatarSrc"
        loading="lazy"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { nobleData } from '@/global/utils/dydata/nobleData.js';

// 钻粉图片
const DIAMOND_URL =
  'https://shark2.douyucdn.cn/front-publish/live-player-aside-master/assets/images/diamonds_banner_logo_c077d7b.gif';
const GIFT_IMG_PREFIX = 'https://gfs-op.douyucdn.cn/dygift';
const FANS_LEVEL_UP =
  'https://shark2.douyucdn.cn/front-publish/live-anchor-title-master/assets/images/exp_ca09807.webp';

let props = defineProps([
  'data',
  'giftData',
  'totalPrice',
  'showImg',
  'showLevel',
  'showNoble',
  'showFans',
  'showDiamond',
  'showRoomAdmin',
  'showAvatar',
  'showVip',
]);

let avatarSrc = computed(() => {
  let ret = '';
  switch (props.data.type) {
    case '礼物':
      ret += GIFT_IMG_PREFIX + props.giftData.pic;
      break;
    case '钻粉':
      ret += DIAMOND_URL;
      break;
    case '贵族':
      ret += nobleData.prefix + nobleData[props.data.nlv].pic;
      break;
    case '粉丝牌升级':
      ret += FANS_LEVEL_UP;
      break;
    default:
      break;
  }
  return ret;
});

let giftMsg = computed(() => {
  let ret = '';
  switch (props.data.type) {
    case '礼物':
      ret = `${props.giftData.n}*${props.data.gfcnt}`;
      break;
    case '钻粉':
      ret = `${props.data.msg}*${props.data.gfcnt}`;
      break;
    case '贵族':
      ret = props.data.msg;
      break;
    case '粉丝牌升级':
      ret = props.data.msg;
      break;
    case '特殊礼物消息':
      ret = props.data.msg;
      break;
    default:
      break;
  }
  return ret;
});

function getItemClass(item) {
  let ret = '';
  switch (props.data.type) {
    case '礼物':
      if (
        Number(props.giftData.pc) * Number(item.gfcnt) >=
          Number(props.totalPrice) * 100 ||
        Number(props.giftData.pc) * Number(item.hits) >=
          Number(props.totalPrice) * 100 ||
        Number(props.giftData.pc) * Number(item.gfcnt) * Number(item.hits) >=
          Number(props.totalPrice) * 100
      ) {
        ret = 'highlight';
      }
      break;
    case '钻粉':
      if (props.data.gfcnt >= 3) ret = 'highlight';
      break;
    case '贵族':
      ret = 'highlight';
      break;
    case '粉丝牌升级':
      // 当粉丝牌升级大于25级则高亮
      if (item.blv >= 26) ret = 'highlight';
      break;
    default:
      break;
  }
  return ret;
}
</script>

<style
  lang="scss"
  scoped
>
@import '@/global/styles/themes/index.scss';

.time_stamp {
  color: black;
  vertical-align: middle;
}

.item {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin-bottom: 5px;
  justify-content: flex-start;
  text-align: left;

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
    position: relative;
    vertical-align: middle;
  }
  .item__level {
    width: 40px;
    height: 16px;
  }
  .item__avatar {
    vertical-align: middle;
    display: inline-block;
  }
  .item__name {
    @include fontColor('nicknameColor');
  }
  .item__cnt {
    @include fontColor('contentColor');
  }
  .item__hits {
    @include fontColor('contentColor');
  }
}

.highlight {
  background-color: rgba(255, 172, 88, 0.3);
  border-top: 1px solid #ffe4b8;
  border-bottom: 1px solid #ffe4b8;
}
</style>
