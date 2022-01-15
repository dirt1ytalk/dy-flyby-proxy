export const defaultOptions = {
    // 日间day 夜间night模式
    mode: "day",
    //背景颜色(包含alpha)
    bgcolora: 'rgba(255,255,255,0.7)',
    // 纵向column 横向row
    direction: "column",
    // 左对齐left 右对齐right
    align: "left",
    // 每个模块的占比%
    size: {
        giftunfiltered: 25,
        gift: 25,
        danmaku: 25,
        danmakuvip: 25
    },
    // 每个模块的排序
    order: {
        gift: 0,
        danmaku: 1,
        danmakuvip: 2,
        giftunfiltered: 3
    },
    // 每个模块开关，按顺序排
    switch: ["gift", "danmaku", "danmakuvip", "giftunfiltered"],
    // 数据阈值
    threshold: 1000,
    // 字号
    fontSize: 14,
    // 背景透明
    transparent: false,
    // 开启动画
    animation: false,
    // 弹幕设置
    danmaku: {
        // 设置弹幕显示内容，如果在数组里就显示
        // level:等级  avatar:头像  fans:粉丝牌  noble:贵族  roomAdmin:房管  diamond:钻粉
        show: ["level", "avatar", "fans", "noble", "roomAdmin", "diamond"],
        // 屏蔽项
        ban: {
            level: 0, // 等级
            keywords: "", // 关键词
            nicknames: "", // 关键昵称
        },
        vip: ""
    },
    // 入场设置
    enter: {
        // 设置入场显示内容，如果在数组里就显示
        // level:等级  avatar:头像   noble:贵族
        show: ["level", "avatar", "noble"],
        // 高亮关键昵称
        keywords: "",
    },
    // 礼物设置
    gift: {
        // 高亮价格
        totalPrice: 100,
        show: ["giftImg","level", "avatar", "fans", "noble", "roomAdmin", "diamond"],
        // 屏蔽项
        ban: {
            // 价格低于
            price: 50,
            // 礼物名称
            keywords: "",
        }
    },
    logDir: ""
}