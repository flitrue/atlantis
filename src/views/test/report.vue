<template>
  <el-tabs type="border-card">
    <el-tab-pane label="请求信息">
      <el-container>
        <el-header>URL</el-header>
        <el-main>{{ reqestUrl }}</el-main>
        <el-header>Header</el-header>
        <el-main>{{ reqestHeader }}</el-main>
      </el-container>
    </el-tab-pane>
    <el-tab-pane label="响应信息">
      <el-container>
        <el-header>status状态</el-header>
        <el-main>{{ responsStatus }}</el-main>
        <el-header>Header</el-header>
        <el-main>内容</el-main>
        <el-header>Body</el-header>
        <el-main style = "white-space: pre-wrap;word-wrap: break-word;">{{ responsBody }}</el-main>
      </el-container>
      <pre>{{ responsBody }}</pre>
    </el-tab-pane>
    <el-tab-pane label="验证结果">
      <el-container>
        <el-header>测试结果</el-header>
        <el-main>内容</el-main>
        <el-header>断言详情</el-header>
        <el-main>内容</el-main>
      </el-container>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  data() {
    return {
      reqestUrl: 'http://www.tujia.com',
      reqestHeader: '{Cookie=fvt.tujia.com_PortalContext_UserToken=f7f7b904-d7ec-410e-b69f-ee986af619a5;fvt.tujia.com_PortalContext_UserId=7457482;, Accept=*/*, Content-Type=application/x-www-form-urlencoded;charset=utf-8, user-agent=Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/48.0.2564.97 Safari/537.36}',
      responsStatus: 200,
      responsHeader: '',
      responsBody: '{"trace": null,"referTraceId": null,"ver": "1.0","ret": false,"errmsg": "Content type application/x-www-form-urlencoded;charset=utf-8 not supported","errcode": 55999,"data": null}'
    }
  }
}
</script>

<style>
    .el-main {
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 400px;
    }

    .el-header{
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    body > .el-container {
        margin-bottom: 500px;
    }

</style>
