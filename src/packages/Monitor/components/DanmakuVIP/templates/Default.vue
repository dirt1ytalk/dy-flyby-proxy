<template>
  <div class="item">
    <span class="time_stamp">{{ data.dt }}</span>
    <!-- 等级 -->
    <span
      v-if="showLevel"
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
      v-if="data.roomAdmin == '4' && showRoomAdmin"
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
      v-if="showAvatar"
      class="item__avatar"
    >
      <img
        class="avatar"
        :src="`https://apic.douyucdn.cn/upload/${data.avatar}_small.jpg`"
        loading="lazy"
      />
    </span>
    <span class="item__name">{{ data.nn }}：</span>
    <span class="item__txt">{{ data.txt }}</span>
  </div>
</template>

<script setup>
import { nobleData } from '@/global/utils/dydata/nobleData.js';
let props = defineProps([
  'data',
  'showLevel',
  'showNoble',
  'showFans',
  'showDiamond',
  'showRoomAdmin',
  'showAvatar',
  'showVip',
]);
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
  vertical-align: middle;
  width: 100%;
  margin-bottom: 5px;
  &:first-child {
    margin-top: 5px;
  }
  > * {
    margin-right: 5px;
  }
  > :nth-last-child(1),
  > :nth-last-child(2) {
    margin-right: 0;
  }
  .item__level {
    vertical-align: middle;
  }
  .item__fans {
    width: 60px;
    position: relative;
    vertical-align: middle;
  }

  .item__avatar {
    vertical-align: middle;
    display: inline-block;
  }
  .item__name {
    vertical-align: middle;
    @include fontColor('nicknameColor');
  }
  .item__txt {
    vertical-align: middle;
    @include fontColor('txtColor');
  }
}
.noble-day {
  background-color: rgba(255, 172, 88, 0.3);
  border-top: 1px solid #ffe4b8;
  border-bottom: 1px solid #ffe4b8;
}

.noble-night {
  background-color: rgb(55, 55, 55);
  border-top: 1px solid rgb(90, 90, 90);
  border-bottom: 1px solid rgb(90, 90, 90);
}
</style>
