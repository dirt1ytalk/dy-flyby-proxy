<template>
    <div ref="dom_gift" class="gift">
        <Deafult
            v-for="item in giftList"
            :data="item"
            :key="item.key"
            :giftData="allGiftData[item.gfid]"
            :totalPrice="options.gift.totalPrice"
            :showImg="options.gift.show.includes('giftImg')"
            :showLevel="options.gift.show.includes('level')"
            :showNoble="options.gift.show.includes('noble')"
            :showFans="options.gift.show.includes('fans')"
            :showDiamond="options.gift.show.includes('diamond')"
            :showRoomAdmin="options.gift.show.includes('roomAdmin')"
            :showAvatar="options.gift.show.includes('avatar')"
            :showVip="options.gift.show.includes('vip')"
        ></Deafult>
        <div v-show="isLock" class="gobottom" @click.stop="goToScrollBottom(dom_gift)">回到底部</div>
    </div>
</template>

<script setup>
import {ref, onUpdated, onMounted } from 'vue'
import Deafult from "./templates/Default.vue"
import { useScroll } from '../../hooks/useScroll.js'
let props = defineProps({
    options: {
        type: Object,
    },
    giftList: {
        type: Array,
    },
    allGiftData: {
        type: Object,
    }
});
let { isLock, onScroll, onScrollUpdate, goToScrollBottom } = useScroll();
let dom_gift = ref(null);

onUpdated(() => {
    onScrollUpdate(dom_gift.value);
})
onMounted(() => {
    dom_gift.value.addEventListener("mousewheel", () => {
        onScroll(dom_gift.value);
    })
    dom_gift.value.addEventListener("touchmove", () => {
        onScroll(dom_gift.value);
    })
    window.addEventListener('resize', () => {
        onScroll(dom_gift.value);
    })
})

</script>

<style lang="scss" scoped>
.gift {
    height: 100%;
    padding: 0 5px;
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
    content-visibility: auto;
    .item {
        justify-content: flex-start;
        text-align: left;
    }
}
</style>