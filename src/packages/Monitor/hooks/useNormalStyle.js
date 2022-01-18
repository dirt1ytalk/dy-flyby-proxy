import { computed } from "vue";

export function useNormalStyle(options) {
    let fontSizeStyle = computed(() => {
        return `${options.value.fontSize}px`;
    });

    // 图片（头像）尺寸
    let avatarImgSizeStyle = computed(() => {
        return `${options.value.fontSize * 2}px`;
    });

    let bgColorValue = computed(() => {
        return `${options.value.bgcolora}`
    });


    return { fontSizeStyle, avatarImgSizeStyle, bgColorValue }
}