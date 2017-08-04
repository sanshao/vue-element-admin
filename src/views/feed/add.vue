
<template>
    <el-form :model="form" :rules="rules" ref="form" label-width="80px">
  
        <el-form-item label="选择帐号">
            <el-select v-model="uid" placeholder="选择帐号" @change="switchAccount">              
              <el-option
              v-for="item in accounts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="内容" prop='content'>
            <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>

        <el-form-item label="图片">
            <el-upload
              action="/oss/upload"
              list-type="picture-card"
              :on-success="handleAvatarSuccess"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove">
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog v-model="dialogVisible" size="tiny">
              <img width="100%" :src="dialogImageUrl" alt="">
            </el-dialog>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" @click="onSubmit('form')">提交动态</el-button>
            <el-button @click="cancel">取消</el-button>
        </el-form-item>

    </el-form>
</template>

<script>
  export default {
    data() {
      return {
        form: {
          name: '',
          accounts: '',
          date1: '',
          date2: '',
          delivery: false,
          type: [],
          resource: '',
          content: ''
        },
        uid: 37,
        accounts: [
            {
                value: 34,
                label: '美饭'
            },
            {
                value: 37,
                label: '三少'
            },
            {
                value: 35,
                label: '周小兔Josy'
            }
        ],
        rules: {
            content: [
                { required: true, message: '请输入内容', trigger: 'blur' },
                { min: 3, max: 500, message: '到少10个字符', trigger: 'blur' }
            ]
            
        },
        fileList: [],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    methods: {
        handleRemove(file, fileList) {
        console.log(file, fileList);
        this.fileList = fileList;
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      handleAvatarSuccess(res, file, fileList){
        console.log('handleAvatarSuccess', res, file, fileList);
        this.fileList = fileList;

      },
      switchAccount(val){
        // TODO
      },
      async onSubmit(formName) {

        this.$refs[formName].validate((valid)=>{
            if(valid){
                this.fetch();
            }else{
                return false;
            }
        })

      },
      async fetch(){
        let loading = this.$loading({ fullscreen: true });
        
        let content = this.form.content;
        let uid = this.uid;

        let fileList = this.fileList;

        // console.log(JSON.stringify(fileList));

        let files = [];

        for(let n of fileList){
            files.push(n.response.name);
        }
        

        let body = 'content='+content+'&uid='+uid;

        if(files.length){
            body += '&files='+JSON.stringify(files);
        }

        let a = await fetch('/feed/add', {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        });
        setTimeout(()=>{
            loading.close();
        }, 500);
        let json = await a.json();
        
        if(json.code == 0){
            this.resetForm();
            this.$notify({
                title: '提示',
                message: "数据提交成功"
            });
        }else{
            this.$notify({
                title: '错误',
                message: "失败:"+JSON.stringify(json)
            });
        }
      },
      resetForm(){
          this.$refs['form'].resetFields();
      },
      cancel(){
        this.resetForm();
        history.back();
      }
    }
  }
</script>

<style lang='less'>
    
</style>