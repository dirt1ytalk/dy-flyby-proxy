import { ref } from "vue";
import { Ex_WebSocket_UnLogin } from "@/global/utils/websocket.js"
import { STT } from "@/global/utils/stt.js"
import { getStrMiddle } from "@/global/utils"

const fs = window.fs

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
        //     "rnewbc",
        //     "uenter",
        //     "chatmsg",
        //     "dgb",
        //     "odfbc",
        //     "rndfbc",
        //     "spbc",
        //     "synexp",
        //     "dfrank",
        //     "noble_num_info",
        //     "qausrespond",
        //     "ranklist",
        //     "fswrank",
        //     "srres",
        //     "rtss_update",
        //     "framl",
        //     "rri",
        //     "tsboxb",
        //     "rankup",
        //     "upgrade",
        //     "frank",
        //     "blab",
        //     "tsgs",
        //     "wiru",
        //     "lucky_wheel_star_pool",
        //     "cthn"
        // ]

        // if (!excludes.includes(msgType)) {
        //     console.log(msgType)
        //     console.log(msg)
        //     let dataObj = stt.deserialize(msg);
        //     console.log(dataObj)
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
                //color: data.col, // 弹幕颜色 undefine就是普通弹幕 2蓝色 3绿色 6粉色 4橙色 5紫色 1红色
                fansName: data.bnn, // 粉丝牌名字
                fansLv: data.bl, // 粉丝牌等级
                diamond: data.diaf, // 是否是钻粉
                noble: data.nl, // 贵族等级
                //nobleC: data.nc, // 贵族弹幕是否开启，1开
                roomAdmin: data.rg, // 房管，data.rg为4则是房管
                //super: data.pg, // 超管，data.pg为5则为超管
                //vip: data.ail == "453/" || data.ail == "454/", // vip，如果是 453/则为vip  454/则为超级vip
                key: data.cid, // 时间戳
                dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
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
                //color: data.col, // 弹幕颜色 undefine就是普通弹幕 2蓝色 3绿色 6粉色 4橙色 5紫色 1红色
                fansName: data.bnn, // 粉丝牌名字
                fansLv: data.bl, // 粉丝牌等级
                diamond: data.diaf, // 是否是钻粉
                noble: data.nl, // 贵族等级
                //nobleC: data.nc, // 贵族弹幕是否开启，1开
                roomAdmin: data.rg, // 房管，data.rg为4则是房管
                //super: data.pg, // 超管，data.pg为5则为超管
                //vip: data.ail == "453/" || data.ail == "454/", // vip，如果是 453/则为vip  454/则为超级vip
                key: data.cid, // 时间戳
                dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
            if (danmakuListVIP.value.length + 1 > options.value.threshold) {
                danmakuListVIP.value.shift();
            }
            danmakuListVIP.value.push(obj);
        }

        if ((msgType === "dgb" || msgType === "odfbc" || msgType === "rndfbc" || msgType === "blab" || msgType === "fansupgradebroadcast" || msgType === "anbc" || msgType === "rnewbc") && options.value.switch.includes("gift")) {
            let data = stt.deserialize(msg);
            let obj = {};
            switch (msgType) {
                case "dgb":
                    // 正常礼物
                    if (!checkGiftValid(data)) {
                        if (checkAllGift(data)) {
                            if (data.bcnt !== 1) {
                                obj = {
                                    nn: data.nn, // 昵称
                                    lv: data.level, // 等级
                                    gfid: data.gfid, // 礼物id 获取名字：allGiftData[item.gfid].n
                                    gfcnt: data.gfcnt, // 礼物数量
                                    hits: data.bcnt, // 连击
                                    key: new Date().getTime() + Math.random(),
                                    dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                }
                            } else {
                                obj = {
                                    nn: data.nn, // 昵称
                                    lv: data.level, // 等级
                                    gfid: data.gfid, // 礼物id 获取名字：allGiftData[item.gfid].n
                                    gfcnt: data.gfcnt, // 礼物数量
                                    hits: data.hits, // 连击
                                    key: new Date().getTime() + Math.random(),
                                    dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                                }
                            }
                            if (giftListAll.value.length + 1 > options.value.threshold) {
                                giftListAll.value.shift();
                            }
                            giftListAll.value.forEach((item, i, arr) => {
                                if (item.nn === obj.nn && item.gfid === obj.gfid && item.gfcnt === obj.gfcnt && item.hits !== obj.hits) {
                                    arr.splice(i, 1);
                                }
                            })
                            giftListAll.value.push(obj);
                            return;
                        } else return
                    }
                    if (data.bcnt !== 1) {
                        obj = {
                            nn: data.nn, // 昵称
                            lv: data.level, // 等级
                            gfid: data.gfid, // 礼物id 获取名字：allGiftData[item.gfid].n
                            gfcnt: data.gfcnt, // 礼物数量
                            hits: data.bcnt, // 连击
                            key: new Date().getTime() + Math.random(),
                            dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        }
                    } else {
                        obj = {
                            nn: data.nn, // 昵称
                            lv: data.level, // 等级
                            gfid: data.gfid, // 礼物id 获取名字：allGiftData[item.gfid].n
                            gfcnt: data.gfcnt, // 礼物数量
                            hits: data.hits, // 连击
                            key: new Date().getTime() + Math.random(),
                            dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        }
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.forEach((item, i, arr) => {
                        if (item.nn === obj.nn && item.gfid === obj.gfid && item.gfcnt === obj.gfcnt && item.hits !== obj.hits) {
                            arr.splice(i, 1);
                        }
                    })
                    giftList.value.push(obj);
                    break;
                case "odfbc":
                    // 开通钻粉
                    obj = {
                        type: "开通钻粉",
                        nn: data.nick,
                        lv: data.level,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                        dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "rndfbc":
                    // 续费钻粉
                    obj = {
                        type: "续费钻粉",
                        nn: data.nick,
                        lv: data.level,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                        dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "anbc":
                    //开通贵族
                    if (!checkNobelValid(data)) {
                        return;
                    }
                    obj = {
                        sptypen: "开通贵族",
                        nn: data.unk,
                        nlv: data.nl,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                        dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "rnewbc":
                    //续费贵族
                    if (!checkNobelValid(data)) {
                        return;
                    }
                    obj = {
                        sptypern: "续费贵族",
                        nn: data.unk,
                        nlv: data.nl,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                        dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }
                    if (giftList.value.length + 1 > options.value.threshold) {
                        giftList.value.shift();
                    }
                    giftList.value.push(obj);
                    break;
                case "blab":
                    //粉丝牌升级
                    if (data.bl >= 15) {
                        obj = {
                            sptype: "粉丝牌升级",
                            nn: data.nn,
                            blv: data.bl,
                            gfid: "0",
                            gfcnt: "1",
                            hits: "1",
                            key: new Date().getTime() + Math.random(),
                            dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                        }
                        giftList.value.push(obj);
                    }
                    break;
                case "fansupgradebroadcast":
                    //粉丝牌30以上升级
                    //由于斗鱼的在configscreen下播报30级以上粉丝牌升级, 且存在名为"btype@="的子分类
                    //因此getStrMiddle会将子分类解析为msgType, 针对30级以上粉丝牌升级的子分类为"fansupgradebroadcast"
                    if (data.rid !== "520") {
                        return;
                    }
                    obj = {
                        sptype: "粉丝牌升级",
                        nn: data.userName,
                        blv: data.otherContent,
                        gfid: "0",
                        gfcnt: "1",
                        hits: "1",
                        key: new Date().getTime() + Math.random(),
                        dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                    }
                    giftList.value.push(obj);
                    break;
                default:
                    break;
            }
        }
        if (msgType === "uenter" && options.value.switch.includes("danmakuvip")) {
            let data = stt.deserialize(msg);
            if (!checkDanmakuIsVIP(data)) {
                return;
            }
            let obj = {
                nn: data.nn, // 昵称
                avatar: data.ic, // 头像地址 https://apic.douyucdn.cn/upload/ + avatar + _small.jpg
                lv: data.level, // 等级
                txt: "进入了直播间", // 弹幕内容
                key: new Date().getTime() + Math.random(), // 时间戳
                dt: new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            };
            if (danmakuListVIP.value.length + 1 > options.value.threshold) {
                danmakuListVIP.value.shift();
            }
            danmakuListVIP.value.push(obj);
        }
    }

    //记录弹幕信息到本地文件
    const logToLocalFile = async (data) => {

        //构建消息体
        let timeStr = new Date().toLocaleTimeString(['en-GB'], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        let userNameStr = data.nn;
        let msgContentStr = data.txt;
        let arrConcat = [timeStr, ' - ', userNameStr, ': ', msgContentStr];
        let strToWrite = "".concat(...arrConcat);

        //将消息体附加到文件
        let dirLog = options.value.logDir
        await fs.promises.appendFile(dirLog + '\\logs.txt', strToWrite + '\n').catch(err => {
            console.log(err.message)
            return new Promise.reject()
        })
    }

    const checkDanmakuValid = (data) => {
        // 判断屏蔽等级
        logToLocalFile(data)
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
        let keywords = options.value.gift.ban.keywords ? options.value.gift.ban.keywords.trim() : "";
        if (keywords !== "") {
            let giftName = giftData.n;
            let arr = keywords.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && giftName.indexOf(arr[i]) !== -1) {
                    return false;
                }
            }
        }
        return true;
    }

    const checkGiftValid = (data) => {
        let giftData = allGiftData.value[data.gfid];
        //判断该礼物是否存在于接口数据中,如不存在则将id记录到控制台并抛弃
        if (!giftData) {
            console.log("未知礼物: ", String(data.gfid));
            return false;
        }
        // 屏蔽单价
        let expThreshold = Number(options.value.gift.ban.price) * 100
        if (Number(giftData.pc) < expThreshold) {
            //判断连击或捆绑是否总值小于阈值, 如是, 则抛弃该礼物
            if (Number(giftData.pc) * Number(data.hits) < expThreshold && Number(giftData.pc) * Number(data.gfcnt) < expThreshold) {
                //console.log("valid: gift total value not valid")
                return false;
            }
        }
        // 屏蔽关键词
        let keywords = options.value.gift.ban.keywords ? options.value.gift.ban.keywords.trim() : "";
        if (keywords !== "") {
            let giftName = giftData.n;
            let arr = keywords.split(" ");
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] !== "" && giftName.indexOf(arr[i]) !== -1) {
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