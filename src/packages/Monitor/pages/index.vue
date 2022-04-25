<template>
  <el-container style="-webkit-app-region: drag">
    <el-main>
      <el-row
        class="mb-1"
        :gutter="5"
      >
        <el-col :span="14">
          <el-card class="bg">
            <div class="monitor">
              <Danmaku
                :style="{ height: heightUpper + 'px' }"
                :options="options"
                :danmakuList="danmakuList"
                @addToVIP="addToVIP"
                @addToBan="addToBan"
              ></Danmaku>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="bg">
            <div
              class="monitor"
              @click.right.prevent="onClickMonitor"
            >
              <Gift
                :style="{ height: heightUpper + 'px' }"
                :options="options"
                :giftList="giftList"
                :allGiftData="allGiftData"
              ></Gift>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="5">
        <el-col :span="14">
          <el-card class="bg no-drag">
            <div
              class="monitor"
              @click.right.prevent="onClickMonitor"
            >
              <Danmakuvip
                :style="{ height: heightLower + 'px' }"
                :options="options"
                :danmakuList="danmakuListVIP"
              ></Danmakuvip>
            </div>
          </el-card>
        </el-col>
        <el-col :span="10">
          <el-card class="bg no-drag">
            <div
              class="monitor"
              @click.right.prevent="onClickMonitor"
            >
              <GiftUnfiltered
                :style="{ height: heightLower + 'px' }"
                :options="options"
                :giftListUnfiltered="giftListUnfiltered"
                :allGiftData="allGiftData"
              ></GiftUnfiltered>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-main>
  </el-container>
  <el-drawer
    v-model="isShowOption"
    direction="ltr"
    size="33%"
    custom-class="select-none"
    modal-class="no-drag"
    title="设置"
    :show-close="false"
    :with-header="false"
  >
    <el-tabs v-model="activeTab">
      <el-tab-pane>
        <template #label>
          <el-icon><operation /></el-icon>
          <span>通用</span>
        </template>
        <el-form>
          <el-form-item label="面板背景颜色 & 不透明度">
            <el-color-picker
              show-alpha
              v-model="options.bgcolora"
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="字号 (12-30)">
            <el-input-number
              v-model="options.fontSize"
              :min="12"
              :max="30"
              controls-position="right"
              :step-strictly="true"
            >
            </el-input-number>
          </el-form-item>
          <el-form-item label="面板显示上限">
            <el-input-number
              v-model="options.threshold"
              :step="500"
              :min="500"
              controls-position="right"
              step-strictly="true"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="设置迁移">
            <el-upload
              class="mr-2"
              action="#"
              accept=".txt"
              :http-request="readOptionsFromUpload"
              :show-file-list="false"
            >
              <template #trigger>
                <el-button
                  type="primary"
                  plain
                  >导入设置</el-button
                >
              </template>
            </el-upload>
            <span>|</span>
            <el-button
              class="ml-2"
              type="primary"
              plain
              @click="saveOptionsWithDialog"
              >导出设置</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <el-icon><chat-dot-round /></el-icon>
          <span>弹幕</span>
        </template>
        <el-form>
          <el-form-item label="显示">
            <el-checkbox-group v-model="options.danmaku.show">
              <el-checkbox label="level">等级</el-checkbox>
              <el-checkbox label="noble">贵族</el-checkbox>
              <el-checkbox label="fans">粉丝牌</el-checkbox>
              <el-checkbox label="avatar">头像</el-checkbox>
              <el-checkbox label="roomAdmin">房管</el-checkbox>
              <el-checkbox label="diamond">钻粉</el-checkbox>
              <el-checkbox label="vip">VIP</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="屏蔽等级">
            <el-input-number
              v-model="options.danmaku.ban.level"
              :step="1"
              :min="0"
              :max="150"
              controls-position="right"
              step-strictly="true"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="屏蔽关键词">
            <el-button
              type="primary"
              plain
              @click="showDialog(0)"
              :loading="isShowDialog"
              >管理</el-button
            >
          </el-form-item>
          <el-form-item label="屏蔽用户">
            <el-button
              type="primary"
              plain
              @click="showDialog(1)"
              :loading="isShowDialog"
              >管理</el-button
            >
          </el-form-item>
          <el-form-item label="特别关注">
            <el-button
              type="primary"
              plain
              @click="showDialog(2)"
              :loading="isShowDialog"
              >管理</el-button
            >
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane>
        <template #label>
          <el-icon><present /></el-icon>
          <span>礼物</span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <div class="text-xs flex-auto">Recomposed by: 星落 | V2.3.0</div>
      <div class="text-xs flex-auto">
        Based on github: qianjiachun/douyu-monitor
      </div>
    </template>
  </el-drawer>
  <el-dialog
    v-model="isShowDialog"
    top="10vh"
  >
    <el-table
      :data="parseDialogData(dialogIndex)"
      max-height="330"
    >
      <el-table-column prop="name"></el-table-column>
      <el-table-column
        fixed="right"
        label="编辑"
        width="80"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            @click="handleDeleteEl(dialogIndex, scope.row.name)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-input
        v-model="strToAdd"
        class="w-32 mr-3 align-middle"
        placeholder="新关键词"
      >
      </el-input>
      <el-button
        class="align-middle"
        type="primary"
        plain
        @click="handleAddStr(dialogIndex)"
        >添加</el-button
      >
    </template>
  </el-dialog>
  <!-- <Popup
    class="popup"
    v-model:show="isShowOption"
    position="bottom"
    :overlay-style="{ '-webkit-app-region': 'no-drag' }"
    :style="{ height: '50%', userSelect: 'none' }"
  >
    <Tabs v-model:active="activeTab">
      <Tab title="通用">
        <Field
          label="面板背景颜色 & 不透明度"
          center
        >
          <template #input>
            <el-color-picker
              show-alpha
              v-model="options.bgcolora"
            ></el-color-picker>
          </template>
        </Field>
        <Field label="字号">
          <template #input>
            <Slider
              v-model="options.fontSize"
              :min="12"
              :max="30"
            />
          </template>
        </Field>
        <Field
          v-model="options.threshold"
          label="数据上限"
          type="digit"
          placeholder="当超过上限 最早的旧数据会被抛弃"
        ></Field>
        <Field
          label="设置迁移"
          center
        >
          <template #input>
            <Button
              plain
              round
              type="primary"
              size="small"
              @click="saveOptionsWithDialog"
              >导出设置</Button
            >
            <Uploader
              accept=".txt"
              :after-read="readOptionsFromUpload"
              result-type="text"
            >
              <Button
                plain
                round
                type="primary"
                size="small"
                class="ml-4"
                >导入设置</Button
              >
            </Uploader>
          </template>
        </Field>
        <div>
          <span class="text-xs ml-4"
            >Recomposed by: 星落 | V2.2.8 | Based on github:
            qianjiachun/douyu-monitor</span
          >
        </div>
      </Tab>
      <Tab title="弹幕">
        <Field label="显示">
          <template #input>
            <CheckboxGroup
              v-model="options.danmaku.show"
              direction="horizontal"
            >
              <Checkbox
                name="level"
                shape="square"
                >等级</Checkbox
              >
              <Checkbox
                name="noble"
                shape="square"
                >贵族</Checkbox
              >
              <Checkbox
                name="fans"
                shape="square"
                >粉丝牌</Checkbox
              >
              <Checkbox
                name="avatar"
                shape="square"
                >头像</Checkbox
              >
              <Checkbox
                name="roomAdmin"
                shape="square"
                >房管</Checkbox
              >
              <Checkbox
                name="diamond"
                shape="square"
                >钻粉</Checkbox
              >
              <Checkbox
                name="vip"
                shape="square"
                >房间VIP</Checkbox
              >
            </CheckboxGroup>
          </template>
        </Field>
        <Field
          v-model="options.danmaku.ban.level"
          label="屏蔽等级≤"
          type="digit"
          placeholder="请输入屏蔽的等级"
        ></Field>
        <Field
          v-model="options.danmaku.ban.keywords"
          label="屏蔽关键词"
          placeholder="空格隔开 例如:关键词1 关键词2"
        ></Field>
        <Field
          v-model="options.danmaku.ban.nicknames"
          label="屏蔽列表"
          placeholder="空格隔开 例如:昵称1 昵称2"
        ></Field>
        <Field
          v-model="options.danmaku.vip"
          label="特别关注"
          placeholder="空格隔开 例如:昵称1 昵称2"
        ></Field>
      </Tab>
      <Tab title="礼物">
        <Field label="显示">
          <template #input>
            <CheckboxGroup
              v-model="options.gift.show"
              direction="horizontal"
            >
              <Checkbox
                name="giftImg"
                shape="square"
                >礼物图片</Checkbox
              >
              <Checkbox
                name="level"
                shape="square"
                >等级</Checkbox
              >
              <Checkbox
                name="noble"
                shape="square"
                >贵族</Checkbox
              >
              <Checkbox
                name="fans"
                shape="square"
                >粉丝牌</Checkbox
              >
              <Checkbox
                name="avatar"
                shape="square"
                >头像</Checkbox
              >
              <Checkbox
                name="roomAdmin"
                shape="square"
                >房管</Checkbox
              >
              <Checkbox
                name="diamond"
                shape="square"
                >钻粉</Checkbox
              >
              <Checkbox
                name="vip"
                shape="square"
                >房间VIP</Checkbox
              >
            </CheckboxGroup>
          </template>
        </Field>
        <Field
          v-model="options.gift.ban.price"
          label="过滤阈值<"
          type="number"
          placeholder="低于此阈值(鱼翅价值)的礼物不会在上方面板显示"
        ></Field>
        <Field
          v-model="options.gift.totalPrice"
          label="高亮阈值≥"
          type="number"
          placeholder="高于此阈值(鱼翅价值)的礼物会在上方面板高亮显示"
        ></Field>
        <Field
          v-model="options.gift.ban.keywords"
          label="屏蔽关键词"
          placeholder="空格隔开 例如:荧光棒 鱼丸"
        ></Field>
      </Tab>
    </Tabs>
  </Popup> -->
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

import Danmaku from '../components/Danmaku/Danmaku.vue';
import Danmakuvip from '../components/DanmakuVIP/Danmaku.vue';
import Gift from '../components/Gift/Gift.vue';
import GiftUnfiltered from '../components/GiftUnfiltered/Gift.vue';

import { Operation, Present, ChatDotRound } from '@element-plus/icons-vue';

import {
  Popup,
  Tab,
  Tabs,
  Field,
  Slider,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Button,
  Uploader,
  Notify,
} from 'vant';

import { useNormalStyle } from '../hooks/useNormalStyle.js';
import { useWebsocket } from '../hooks/useWebsocket.js';

import {
  saveLocalData,
  getLocalData,
  deepCopy,
  formatObj,
} from '@/global/utils';
import { defaultOptions } from '../options';

const LOCAL_NAME = 'monitor_options';
const ipc = window.ipcRenderer;
const fs = window.fs;

let options = ref(deepCopy(defaultOptions));
let allGiftData = ref({});
let isShowOption = ref(false);
let isShowDialog = ref(false);
let dialogArrTmp = ref([]);
let dialogIndex = ref(0);
let strToAdd = ref('');
let activeTab = ref(0);
let { fontSizeStyle, avatarImgSizeStyle, bgColorValue } =
  useNormalStyle(options);
let { connectWs, danmakuList, danmakuListVIP, giftList, giftListUnfiltered } =
  useWebsocket(options, allGiftData);

let heightDiff = ref(0);
let heightUpper = ref(0);
let heightLower = ref(0);

onMounted(async () => {
  let rid = 520;
  let localData = JSON.parse(getLocalData(LOCAL_NAME));
  if (Object.prototype.toString.call(localData) !== '[object Object]') {
    localData = deepCopy(defaultOptions);
  }
  options.value = localData;

  options.value = formatObj(options.value, defaultOptions);

  //窗口大小重新定位
  heightUpper.value = options.value.moduleSize.upper;
  heightLower.value = options.value.moduleSize.lower;
  window.addEventListener('resize', setNewHeight);

  //监听fs错误
  window.addEventListener('fserror', () => {
    displayNotifyMessage(
      '日志文件写入失败, 请反馈开发者, 具体错误可至控制台查看',
    );
  });

  //监听超管信息
  window.addEventListener('pg-message', (e) => {
    displayNotifyMessage(
      '超管信息 - ' + e.detail.nn + ': ' + e.detail.txt,
      'danger',
      10000,
    );
  });

  //监听处理失败未知礼物信息
  window.addEventListener('unknown-gift', (e) => {
    displayNotifyMessage(
      '未知礼物 - ' + e.detail.id + ' 获取数据失败, 已记录至日志文件',
    );
  });

  //Global unhandled error listener
  // window.addEventListener('error', () => {
  //   displayNotifyMessage(
  //     '程序运行出现错误, 请反馈开发者, 具体错误可至控制台查看',
  //   );
  // });

  //创建日志文件夹
  await resetLogPath();
  let dirLog = options.value.log.dir;
  let date = new Date();
  let dateStr =
    String(date.getFullYear()) +
    '-' +
    String(date.getMonth() + 1) +
    '-' +
    String(date.getDate());
  dirLog = dirLog + '\\' + dateStr;
  try {
    await fs.promises.mkdir(dirLog, { recursive: true });
  } catch (err) {
    console.log(err.message);
    displayNotifyMessage(
      '无法创建日志文件夹, 请反馈开发者, 具体错误可至控制台查看',
    );
  }

  // await logInit(dirLog, dateStr, '弹幕');
  // await logInit(dirLog, dateStr, '礼物');
  // await logInit(dirLog, dateStr, '特殊事件');

  let data = await getRoomGiftData(rid);
  let giftData = await getGiftData();
  let roomGiftData = { prefix: 'https://gfs-op.douyucdn.cn/dygift' };
  if ('giftList' in data.data) {
    for (let i = 0; i < data.data.giftList.length; i++) {
      let item = data.data.giftList[i];
      roomGiftData[item.id] = {
        n: item.name,
        pic: item.basicInfo.focusPic,
        pc: item.priceInfo.price,
      };
    }
  }
  allGiftData.value = { ...roomGiftData, ...giftData };
  connectWs(rid);
});

async function resetLogPath() {
  //构建日志文件夹路径
  let parentDir = await ipc.invoke('get-doc-path');
  let dirLog = parentDir + '\\520-Logs';
  //存储路径
  options.value.log.dir = dirLog;
}

function showDialog(index) {
  dialogIndex.value = index;
  isShowDialog.value = true;
}

function handleDeleteEl(index, item) {
  switch (index) {
    case 0:
      options.value.danmaku.ban.keywords = options.value.danmaku.ban.keywords
        .split(' ')
        .filter((e) => e !== item)
        .join(' ');
      break;
    case 1:
      options.value.danmaku.ban.nicknames = options.value.danmaku.ban.nicknames
        .split(' ')
        .filter((e) => e !== item)
        .join(' ');
      break;
    case 2:
      options.value.danmaku.vip = options.value.danmaku.vip
        .split(' ')
        .filter((e) => e !== item)
        .join(' ');
      break;
    default:
  }
}

function handleAddStr(index) {
  switch (index) {
    case 0:
      if (options.value.danmaku.ban.keywords === '') {
        options.value.danmaku.ban.keywords += strToAdd.value;
      } else {
        options.value.danmaku.ban.keywords =
          dialogArrTmp.value
            .map((obj) => {
              return obj.name;
            })
            .join(' ') +
          ' ' +
          strToAdd.value;
      }
      strToAdd.value = '';
      break;
    case 1:
      if (options.value.danmaku.ban.nicknames === '') {
        options.value.danmaku.ban.nicknames += strToAdd.value;
      } else {
        options.value.danmaku.ban.nicknames =
          dialogArrTmp.value
            .map((obj) => {
              return obj.name;
            })
            .join(' ') +
          ' ' +
          strToAdd.value;
      }
      strToAdd.value = '';
      break;
    case 2:
      if (options.value.danmaku.vip === '') {
        options.value.danmaku.ban.vip += strToAdd.value;
      } else {
        options.value.danmaku.vip =
          dialogArrTmp.value
            .map((obj) => {
              return obj.name;
            })
            .join(' ') +
          ' ' +
          strToAdd.value;
      }
      strToAdd.value = '';
      break;
    default:
  }
}

function parseDialogData(index) {
  switch (index) {
    case 0:
      let res0 = options.value.danmaku.ban.keywords.split(' ').map((str) => {
        return {
          name: str,
        };
      });
      dialogArrTmp.value = res0;
      if (res0.length === 1 && res0[0].name === '') return undefined;
      return res0;
    case 1:
      let res1 = options.value.danmaku.ban.nicknames.split(' ').map((str) => {
        return {
          name: str,
        };
      });
      dialogArrTmp.value = res1;
      if (res1.length === 1 && res1[0].name === '') return undefined;
      return res1;
    case 2:
      let res2 = options.value.danmaku.vip.split(' ').map((str) => {
        return {
          name: str,
        };
      });
      dialogArrTmp.value = res2;
      if (res2.length === 1 && res2[0].name === '') return undefined;
      return res2;
  }
}

function displayNotifyMessage(message, type = 'warning', duration = 5000) {
  if (isShowOption.value === true) isShowOption.value = false;
  Notify({
    type: type,
    message: message,
    duration: duration,
  });
}

function setNewHeight() {
  heightDiff.value = document.documentElement.clientHeight - 590;
  heightUpper.value = 260 + heightDiff.value / 2;
  heightLower.value = 200 + heightDiff.value / 2;
  options.value.moduleSize.upper = heightUpper.value;
  options.value.moduleSize.lower = heightLower.value;
}

async function logInit(dir, date, name) {
  let fileDir = dir + '\\' + date + '_' + name + '.txt';
  let timeStr = new Date().toLocaleTimeString(['en-GB'], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  let initLogMsg =
    '==================================================\n' +
    '[Renderer] Application launched, start logging...\n' +
    'Current time: ' +
    date +
    ' ' +
    timeStr +
    '\n' +
    '==================================================\n';
  try {
    await fs.promises.appendFile(fileDir, initLogMsg);
  } catch (err) {
    console.log(err.message);
    displayNotifyMessage(
      '日志文件初始化失败, 请反馈开发者, 具体错误可至控制台查看',
    );
  }
}

async function saveOptionsWithDialog() {
  const winPath = await ipc.invoke('get-settings-save-path');
  if (winPath.canceled) return;
  let optionsStr = JSON.stringify(options.value, null, 2);
  try {
    await fs.promises.truncate(winPath.filePath).catch((err) => {
      if (err.message.includes('ENOENT')) return;
      else throw err;
    });
    await fs.promises.appendFile(winPath.filePath, optionsStr);
    displayNotifyMessage(
      '导出设置成功! 存储路径: ' + winPath.filePath,
      'success',
    );
  } catch (err) {
    displayNotifyMessage('导出设置失败! 错误信息: ' + err.message);
  }
}

async function readOptionsFromUpload(res) {
  let resStr = await res.file.text();
  try {
    let resObj = JSON.parse(resStr);
    resObj = formatObj(resObj, options.value);
    if (JSON.stringify(resObj) === JSON.stringify(options.value))
      throw new Error('导入文件结构不正确或无设置项更改');
    options.value = resObj;
    await resetLogPath();
    displayNotifyMessage('从本地文件导入设置成功!', 'success');
  } catch (err) {
    displayNotifyMessage('导入设置失败! 错误信息: ' + err.message);
  }
}

function addToVIP(nn) {
  let bef = options.value.danmaku.vip;
  if (!bef) {
    Dialog.confirm({
      title: '确认操作',
      message: '确认添加 ' + nn + ' 到特别关注？',
      overlayStyle: {
        '-webkit-app-region': 'no-drag',
      },
    })
      .then(() => {
        options.value.danmaku.vip = nn;
      })
      .catch(() => {});
  } else {
    if (bef.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于特别关注中',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      }).then(() => {});
    } else
      Dialog.confirm({
        title: '确认操作',
        message: '确认添加 ' + nn + ' 到特别关注？',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      })
        .then(() => {
          let aft = bef.concat(' ', nn);
          options.value.danmaku.vip = aft;
        })
        .catch(() => {});
  }
}

function addToBan(nn) {
  let bef = options.value.danmaku.ban.nicknames;
  let vip = options.value.danmaku.vip;
  if (!bef && !vip.includes(nn)) {
    Dialog.confirm({
      title: '确认操作',
      message: '确认添加 ' + nn + ' 到屏蔽名单？',
      overlayStyle: {
        '-webkit-app-region': 'no-drag',
      },
    })
      .then(() => {
        options.value.danmaku.ban.nicknames = nn;
      })
      .catch(() => {});
  } else {
    if (bef.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于屏蔽名单中',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      }).then(() => {});
    } else if (vip.includes(nn)) {
      Dialog.alert({
        title: '用户已存在',
        message: nn + ' 已存在于特别关注中, 请将其先从特别关注中移除',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      }).then(() => {});
    } else
      Dialog.confirm({
        title: '确认操作',
        message: '确认添加 ' + nn + ' 到屏蔽名单？',
        overlayStyle: {
          '-webkit-app-region': 'no-drag',
        },
      })
        .then(() => {
          let aft = bef.concat(' ', nn);
          options.value.danmaku.ban.nicknames = aft;
        })
        .catch(() => {});
  }
}

function getRoomGiftData(rid) {
  return new Promise((resolve) => {
    fetch('https://gift.douyucdn.cn/api/gift/v3/web/list?rid=' + rid, {
      method: 'GET',
    })
      .then((res) => {
        return res.json();
      })
      .then((ret) => {
        resolve(ret);
      })
      .catch((err) => {
        ipc.invoke('err-quit', err.message);
      });
  });
}

function getGiftData() {
  return new Promise((resolve) => {
    fetch(
      'https://webconf.douyucdn.cn/resource/common/prop_gift_list/prop_gift_config.json',
      {
        method: 'GET',
        credentials: 'include',
      },
    )
      .then((res) => {
        return res.text();
      })
      .then((ret) => {
        let json = ret.substring(
          String('DYConfigCallback(').length,
          ret.length,
        );
        json = json.substring(0, json.lastIndexOf(')'));
        json = JSON.parse(json);
        let obj = {};
        for (const key in json.data) {
          let item = json.data[key];
          obj[key] = {
            n: item.name,
            pic: item.himg.replace('https://gfs-op.douyucdn.cn/dygift', ''),
            pc: item.pc,
          };
        }
        return obj;
      })
      .then((ret) => {
        resolve(ret);
      })
      .catch((err) => {
        ipc.invoke('err-quit', err.message);
      });
  });
}

function onClickMonitor() {
  isShowOption.value = true;
}

watch(
  options,
  (n) => {
    saveLocalData(LOCAL_NAME, JSON.stringify(n));
  },
  { deep: true },
);
</script>

<style
  lang="scss"
  scoped
>
@import '@/global/styles/themes/index.scss';

.monitor {
  width: 100%;
  height: 100%;
  overflow: hidden;
  font-size: v-bind(fontSizeStyle);
  user-select: none;
  -webkit-app-region: no-drag;
}

.bg {
  background-color: v-bind(bgColorValue);
}
</style>

<style lang="scss">
.no-drag {
  -webkit-app-region: no-drag;
}
.avatar {
  width: v-bind(avatarImgSizeStyle);
  height: v-bind(avatarImgSizeStyle);
  border-radius: 50%;
}
</style>
