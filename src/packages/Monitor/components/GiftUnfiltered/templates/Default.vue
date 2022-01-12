<template>
  <div :class="`item ${showAnimation ? 'fadeInLeft' : ''} ${getItemClass()}`">
    <div class="time_stamp">{{ data.dt }}</div>
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

const GIFT_IMG_PREFIX = 'https://gfs-op.douyucdn.cn/dygift'

let props = defineProps(['data', 'giftData', 'mode', 'showAnimation', 'totalPrice', 'showImg'])

let avatarSrc = computed(() => {
  let ret = "";
  ret += GIFT_IMG_PREFIX + props.giftData.pic;
  return ret;
});

let giftMsg = computed(() => {
  let ret = "";
  ret = `${props.giftData.n}*${props.data.gfcnt}`;
  return ret;
});

function getItemClass() {
  let ret = "";
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
</style>