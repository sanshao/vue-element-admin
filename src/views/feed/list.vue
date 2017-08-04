<template>
    
    <div class="feed-list-page">

        <div class="filter-container">
            <el-form :inline="true" >
                <el-select v-model="checkStatusVal" placeholder="未审阅" @change="statusChange">
                    <el-option
                      v-for="item in checkStatus"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
                <el-form-item class='btn-new-feed'>
                  
                    <router-link :to="{ path: '/feed/add' }">
                        <el-button type="primary" icon='edit'>发布新动态</el-button>
                    </router-link>
                  
                </el-form-item>
            </el-form>
            

        </div>
        
        <el-checkbox-group v-model="selectList" @change="handleCheckedChange">
        
            <div class="feed-list-container">
                
                <div class="feed-item" v-for="(item, index) in feedList">

                    <div class="feed-info">
                        <div class="left-container">
                            <div class="avatar" :style="{'background-image':'url('+item.avatar+')'}"></div>
                        </div>
                        <div class="right-container">
                            <div class="nick"> {{item.nick}}</div>
                            <div class="date"> {{new Date(item.gmt_create).format('yyyy-MM-dd hh:mm')}}</div>
                            <div class="content">{{item.content}}</div>
                            <div class="pic-list">
                                <div class="img-item" v-for="(n, idx) in (JSON.parse(item.pic_list))">
                                    
                                    <div class="img-cover" :style="{'background-image':'url(//img.meifanapp.com/'+n+')'}">
                                        
                                    </div>
                                    
                                </div>
                            </div>
                            <div class="addr">{{item.address}}</div>
                        </div>
                    </div>

                    <div class="feed-oper">
                        <el-checkbox :label="item.id" :key="item.id">勾选审阅</el-checkbox>
                    </div>

                </div>
                
            </div>

        </el-checkbox-group>
        
        <div class="bottom-layer">
            <el-checkbox :indeterminate="isIndeterminate" v-model="selectkAll" @change="handleCheckAllChange">全选</el-checkbox>
            <el-button type="primary" size="small" @click="batchCheck">批量审阅</el-button>    
        </div>
        
        <div class="pagination-container">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="pageNo"
              :page-size="pageSize"
              layout="prev, pager, next, jumper"
              :total="total">
            </el-pagination>
        </div>

    </div>
    
</template>

<script>

export default {
    data() {
        return {
            checkStatusVal: '0',
            checkStatus: [
                {
                    value: '0',
                    label: '未审阅'
                },
                {
                    value: '1',
                    label: '已审阅'
                }
            ],

            selectkAll: false,
            isIndeterminate: false,
            selectList: [],

            feedList: [],
            pageNo: 1,
            pageSize: 3,
            total: 0

        }
    },
    beforeRouteEnter(to, from, next){
        next(vm => {
            vm.getFeed();
        });
    },
    methods: {
        
        async getFeed(){
            let loading = this.$loading({ fullscreen: true });
            let json = await this.fetch();
            if(json.code == 0){
                this.feedList = json.data;
                this.total = json.total
            }
            loading.close();
        },
        async fetch(){
            let pageNo = this.pageNo;
            let pageSize =  this.pageSize;

            let url = '/feed/list?'+'pageNo='+pageNo+'&pageSize='+pageSize+'&checkStatus='+ this.checkStatusVal;
            let a = await fetch(url, {
                credentials: 'include',
                method: 'get',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
                
            });
            try{

            let json = await a.json();
                return json;
            }catch(e){
                return {};
            }
        },

        onSubmit(){
            console.log('xxx')
        },
        createFeed(){

        },
        handleCheckedChange(e){
            
            let checkedCount = e.length;
            this.selectkAll = checkedCount === this.feedList.length;
            this.isIndeterminate = checkedCount > 0 && checkedCount < this.feedList.length;
        },
        handleCheckAllChange(e){
            // console.log(e)
            
            let tmp = [];
            for(let n of this.feedList){
                tmp.push(n.id);
            }
            this.selectList = e.target.checked ? tmp : [];
            this.isIndeterminate = false;
        },
        handleCurrentChange(val){
            // console.log(val);
            this.pageNo = val;
            this.resetSelect();
            this.getFeed();
        },
        async batchCheck(){
            if(this.selectList.length != 0){
                let url = '/feed/review?ids='+this.selectList.join(',');
                let res = await fetch(url, {
                    credentials: 'include',
                    method: 'get',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                });
            }
        },
        statusChange(val){
            // console.log(val, this.checkStatusVal)
            this.resetData();

            this.getFeed();
        },
        resetData(){
            this.pageNo = 1;
            this.resetSelect();

        },
        resetSelect(){
            this.selectkAll = false;
            this.isIndeterminate = false;
            this.selectList = [];
        }
    }
}
</script>

<style lang='less' scoped>
.filter-container {
    a {
        text-decoration: none;
        color: #fff;
    }
    .btn-new-feed {
        margin-bottom: 0;
    }
}
.feed-list-container {
    .feed-item {
        margin-top: 10px;
        border: 1px solid #eee;

        .feed-info {
            display: flex;
            padding-top: 10px;
            
            .left-container {
                text-align: center;
                width: 80px;

                .avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50px;
                    background: #eee;
                    margin: 0 auto;
                    background-size: cover;
                    background-repeat: no-repeat;
                }
            }
            .right-container {
                flex: 1;
                padding-right: 10px;
                padding-bottom: 10px;

                .nick {
                    color: #000;
                    font-size: 16px;
                }
                .date, .addr {
                    color: #99a4aa;
                    font-size: 14px;
                }
                .content {
                    color: #474747;
                    font-size: 14px;
                }
            }

            
        }

        .feed-oper {
            height: 40px;
            line-height: 40px;
            border-top: 1px solid #eee;
            padding: 0 20px;
            font-size: 12px;

        }

        
    }

    .pic-list {
        display: flex;
        .img-item {
            padding-right: 10px;
            padding-top: 10px;

            .img-cover {
                background-size: cover;
                width: 100px;
                height: 100px;
                box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.4);
                border-radius: 6px;
            }
        }
    }

}
.bottom-layer {
    padding: 10px;
    padding-left: 20px;
}

.pagination-container {
    padding: 15px 0;
    padding-bottom: 0;
}
    
</style>