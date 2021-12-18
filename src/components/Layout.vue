<template lang="">
    <el-container>
        <el-main>
            <el-row class="mb-4" :gutter="10">
                <el-col :span="12">
                    <el-card>
                        <template #header>
                            <div>
                               弹幕 
                            </div>
                        </template>
                    </el-card>
                </el-col>
                <el-col :span="12"> 
                    <el-card>
                        <template #header>
                            <div>
                                礼物
                            </div>
                        </template>                       
                    </el-card>
                </el-col>
            </el-row>
            <el-row :gutter="10">
                <el-col :span="12">
                    <el-card>
                        <template #header>
                            <div>
                               特别关注弹幕 
                            </div>
                        </template>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card>
                        <template #header>
                            <div>
                               进场 
                            </div>
                        </template>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>
<script>
import Flyby from '../packages/Monitor/components/Danmaku/Danmaku.vue'
import Enter from '../packages/Monitor/components/Enter/Enter.vue'
import Gifts from '../packages/Monitor/components/Gift/Gift.vue'

export default {
    
}
</script>