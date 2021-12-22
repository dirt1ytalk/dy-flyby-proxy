import { computed } from "vue";

export function useNormalStyle(options) {
    let directionStyle = computed(() => {
        return options.value.direction;
    });

    let fontSizeStyle = computed(() => {
        return `${options.value.fontSize}px`;
    });

    // 图片（头像）尺寸
    let avatarImgSizeStyle = computed(() => {
        return `${options.value.fontSize * 2}px`;
    });

    let bgAlphaValue = computed(() => {
        return `rgba(0,0,0,${options.value.opacity})`
    });


    return { directionStyle, fontSizeStyle, avatarImgSizeStyle, bgAlphaValue }
}