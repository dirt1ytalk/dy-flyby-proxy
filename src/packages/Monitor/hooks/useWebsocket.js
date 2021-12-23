import { ref } from "vue";
import { Ex_WebSocket_UnLogin } from "@/global/utils/websocket.js"
import { STT } from "@/global/utils/stt.js"
import { getStrMiddle } from "@/global/utils"

export function useWebsocket(options, allGiftData) {
    let ws = null;
    let stt = new STT();
    let danmakuList = ref([]);
    let danmakuListVIP = ref([]);
    let enterList = ref([]);
    let giftList = ref([]);
    let giftListAll = ref([]);

    const connectWs = (rid) => {
        if (rid === "") {
            return;
        }
        ws = new Ex_WebSocket_UnLogin(rid, (msg) => {
            handleMsg(msg);
        }, () => {
            // 重连
            ws.close();
            ws = null;
            connectWs();
        });
    }

    const handleMsg = (msg) => {
        let msgType = getStrMiddle(msg, "type@=", "/");
        if (!msgType) {
            return;
        }
        //debug
        // let excludes = [
        //     "anbc",
        //     "rnewbc"
        // ]
        // if (excludes.includes(msgType)) {
        //     let dataObj = stt.deserialize(msg);
        //     console.log(dataObj)
        // }

        // {
        //     "type": "blab",
        //     "uid": "17484032",
        //     "nn": "爱队",
        //     "lbl": "1",
        //     "bl": "4",
        //     "ba": "1",
        //     "bnn": "淑怡",
        //     "diaf": "0",
        //     "rid": "290935"
        // }

        if (msgType === "chatmsg" && options.value.switch.includes("danmaku")) {
            let data = stt.deserialize(msg);
            if (!checkDanmakuValid(data)) {
                return;
            }
            let obj = {
                nn: data.nn, // 昵称
                avatar: data.ic, // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
                lv: data.level, // 等级
                txt: data.txt, // 弹幕内容
                color: data.col, // 弹幕颜色 undefine就是普通弹幕 2蓝色 3绿色 6粉色 4橙色 5紫色 1红色
                fansName: data.bnn, // 粉丝牌名字
                fansLv: data.bl, // 粉丝牌等级
                diamond: data.diaf, // 是否是钻粉
                noble: data.nl, // 贵族等级
                nobleC: data.nc, // 贵族弹幕是否开启，1开
                roomAdmin: data.rg, // 房管，data.rg为4则是房管
                key: data.cid, // 时间戳
            };
            if (danmakuList.value.length + 1 > options.value.threshold) {
                danmakuList.value.shift();
            }
            danmakuList.value.push(obj);
        }

        if (msgType === "chatmsg" && options.value.switch.includes("danmakuvip")) {
            let data = stt.deserialize(msg);
            if (!checkDanmakuIsVIP(data)) {
                return;
            }
            let obj = {
                nn: data.nn, // 昵称
                avatar: data.ic, // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
                lv: data.level, // 等级
                txt: data.txt, // 弹幕内容
                color: data.col, // 弹幕颜色 undefine就是普通弹幕 2蓝色 3绿色 6粉色 4橙色 5紫色 1红色
                fansName: data.bnn, // 粉丝牌名字
                fansLv: data.bl, // 粉丝牌等级
                diamond: data.diaf, // 是否是钻粉
                noble: data.nl, // 贵族等级
                nobleC: data.nc, // 贵族弹幕是否开启，1开
                roomAdmin: data.rg, // 房管，data.rg为4则是房管
                key: data.cid, // 时间戳
            };
            if (danmakuListVIP.value.length + 1 > options.value.threshold) {
                danmakuListVIP.value.shift();
            }
            danmakuListVIP.value.push(obj);
        }

        if ((msgType === "dgb" || msgType === "odfbc" || msgType === "rndfbc" || msgType === "blab" || msgType === "anbc" || msgType === "rnewbc") && options.value.switch.includes("gift")) {
            let data = stt.deserialize(msg);
            console.log('matched filter: ' + JSON.stringify(data))
            // 续费钻粉
            // {"type":"rndfbc","uid":"573096","rid":"5189167","nick":"一只小洋丶","icon":"avatar_v3/202111/d7d383be4c874af0b50e3d9eb58ad462","level":"39","nl":"0","pg":"1","fl":"24","bn":"歆崽"}

            // 开通钻粉
            // {"type":"odfbc","uid":"341314282","rid":"5189167","nick":"nt五香蛋","icon":"avatar_v3/202103/04d3d252139f4620bd417c6bef673bd6","level":"36","nl":"0","pg":"1","fl":"22","bn":"歆崽"}
            let obj = {};
            switch (msgType) {
                case "dgb":
                    // 正常礼物
                    //let data = stt.deserialize(msg)
                    if (!checkGiftValid(data)) {
                        if (checkAllGift(data)) {
                            console.log("all: gift check passed")
                            obj = {
                                nn: data.nn, // 昵称
                                lv: data.level, // 等级
                                gfid: data.gfid, // 礼物id 获取名字：allGiftData[item.gfid].n
                                gfcnt: data.gfcnt, // 礼物数量
                                hits: data.hits, // 连击
                                key: new Date().getTime() + Math.random(),
                            }
                            if (giftListAll.value.length + 1 > options.value.threshold) {
                                giftListAll.value.shift();
                            }
                            console.log("all: pushing to giftlistAll")
                            giftListAll.value.push(obj);
                            return;
                        } else return
                    }
                    console.log("valid: gift check passed")
                    obj = {
                        nn: data.nn, // 昵称
                        lv: data.level, // 等级
                        gfid: data.gfid, // 礼物id 获取名字：allGiftData[item.gfid].n
                        gfcnt: data.gfcnt, // 礼物数量
                        hits: data.hits, // 连击
                        key: new Date().getTime() + Math.random(),
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    console.log("valid: pushing to giftlist")
                    giftList.value.push(obj);
                    break;
                case "odfbc":
                    // 开通钻粉
                    //let data = stt.deserialize(msg)
                    obj = {
                        type: "开通钻粉",
                        nn: data.nick,
                        lv: data.level,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "rndfbc":
                    // 续费钻粉
                    //let data = stt.deserialize(msg)
                    obj = {
                        type: "续费钻粉",
                        nn: data.nick,
                        lv: data.level,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "anbc":
                    //开通贵族
                    //let data = stt.deserialize(msg)
                    if (!checkNobelValid(data)) {
                        return;
                    }
                    console.log(data);
                    obj = {
                        sptypen: "开通贵族",
                        nn: data.unk,
                        nlv: data.nl,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "rnewbc":
                    //续费贵族
                    //let data = stt.deserialize(msg)
                    if (!checkNobelValid(data)) {
                        return;
                    }
                    console.log(data);
                    obj = {
                        sptypern: "续费贵族",
                        nn: data.unk,
                        nlv: data.nl,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "blab":
                    //粉丝牌升级
                    //let data = stt.deserialize(msg)
                    if (data.bl >= 15) {
                        obj = {
                            sptype: "粉丝牌升级",
                            nn: data.nn,
                            blv: data.bl,
                            gfid: "0",
                            gfcnt: "1",
                            hits: "1",
                            key: new Date().getTime() + Math.random(),
                        }
                        giftList.value.push(obj)
                    }
                    break;
                default:
                    break;
            }
        }
        if (msgType === "uenter" && options.value.switch.includes("enter")) {
            let data = stt.deserialize(msg);
            if (!checkEnterValid(data)) {
                return;
            }
            let obj = {
                nn: data.nn,
                avatar: data.ic, // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
                lv: data.level, // 等级
                noble: data.nl, // 贵族等级
                key: new Date().getTime() + Math.random(),
            }
            if (enterList.value.length + 1 > options.value.threshold) {
                enterList.value.shift();
            }
            enterList.value.push(obj);
        }
    }

    const checkDanmakuValid = (data) => {
        // 判断屏蔽等级
        if (Number(data.level) <= Number(options.value.danmaku.ban.level)) {
            return false;
        }
        // 判断关键词
        let keywords = options.value.danmaku.ban.keywords ? options.value.danmaku.ban.keywords.trim() : "";
        if (keywords !== "") {
            let arr = keywords.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && data.txt.indexOf(arr[i]) !== -1) {
                    return false;
                }
            }
        }
        // 判断关键昵称
        let nicknames = options.value.danmaku.ban.nicknames ? options.value.danmaku.ban.nicknames.trim() : "";
        if (nicknames !== "") {
            let arr = nicknames.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && data.nn.indexOf(arr[i]) !== -1) {
                    return false;
                }
            }
        }
        return true;
    }

    const checkEnterValid = (data) => {
        if (Number(data.level) <= Number(options.value.danmaku.ban.level)) {
            return false;
        }
        let nicknames = options.value.danmaku.ban.nicknames ? options.value.danmaku.ban.nicknames.trim() : "";
        if (nicknames !== "") {
            let arr = nicknames.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && data.nn.indexOf(arr[i]) !== -1) {
                    return false;
                }
            }
        }
        return true;
    }

    //判断是否特别关注
    const checkDanmakuIsVIP = (data) => {
        let nicknames = options.value.danmaku.vip ? options.value.danmaku.vip.trim() : "";
        if (nicknames !== "") {
            let arr = nicknames.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && data.nn.indexOf(arr[i]) !== -1) {
                    return true;
                }
            }
        }
        return false;
    }

    const checkAllGift = (data) => {
        let giftData = allGiftData.value[data.gfid];
        console.log('all: start all gift evaluation')
        let keywords = options.value.gift.ban.keywords ? options.value.gift.ban.keywords.trim() : "";
        if (keywords !== "") {
            console.log("all: matching keywords...")
            let giftName = giftData.n;
            console.log("all: gift name:" + giftName)
            let arr = keywords.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && giftName.indexOf(arr[i]) !== -1) {
                    console.log("all: keyword machted, ditching gift object")
                    return false;
                }
            }
        }
        return true;
    }

    const checkGiftValid = (data) => {
        //console.log(data);
        console.log('valid: start valid gift evaluation')
        let giftData = allGiftData.value[data.gfid];
        //console.log(giftData);
        // 屏蔽单价
        let expThreshold = Number(options.value.gift.ban.price) * 100
        if (Number(giftData.pc) < expThreshold) {
            //判断连击或捆绑是否总值小于阈值, 如是, 则抛弃该礼物
            if (Number(giftData.pc) * Number(data.hits) < expThreshold && Number(giftData.pc) * Number(data.gfcnt) < expThreshold) {
                console.log("valid: gift total value not valid")
                return false;
            }
        }
        console.log("valid: gift total value valid, matching keywords...")
        // 屏蔽关键词
        let keywords = options.value.gift.ban.keywords ? options.value.gift.ban.keywords.trim() : "";
        if (keywords !== "") {
            let giftName = giftData.n;
            console.log("valid: gift name:" + giftName)
            let arr = keywords.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && giftName.indexOf(arr[i]) !== -1) {
                    console.log("valid: keyword matched, ditching gift object")
                    return false;
                }
            }
        }
        return true;
    }

    const checkNobelValid = (data) => {
        if (data.drid !== "520") {
            return false
        }
        return true
    }

    return { connectWs, danmakuList, danmakuListVIP, enterList, giftList, giftListAll }
}