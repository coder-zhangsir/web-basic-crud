<template>
  <div class="tableBox">
    <div class="title">
      <h2>最简单的CRUD DEMO</h2>
    </div>
    <div class="searchBar">
      <el-input v-model="input" placeholder="请输入姓名搜索🔍" />
      <el-button type="primary">添加</el-button>
    </div>
    <div class="tableCore">
      <el-table 
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border>
        <el-table-column type="selection" width="55" />
        <el-table-column fixed prop="date" label="Date" width="150" />
        <el-table-column prop="name" label="Name" width="120" />
        <el-table-column prop="state" label="State" width="120" />
        <el-table-column prop="city" label="City" width="120" />
        <el-table-column prop="address" label="Address" width="600" />
        <el-table-column prop="zip" label="Zip" width="120" />
        <el-table-column fixed="right" label="Operations" width="120">
          <template #default>
            <el-button link type="primary" size="small" @click="handleRawClick">Detail</el-button>
            <el-button link type="primary" size="small">Edit</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue';

/** 数据data */ 
const input = ref("")
const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Home',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    state: 'California',
    city: 'Los Angeles',
    address: 'No. 189, Grove St, Los Angeles',
    zip: 'CA 90036',
    tag: 'Office',
  },
]
const multipleSelection = ref([])



/** 方法methods */
const handleRawClick = () => {
  console.log('handleRawClick')
} 
const handleSelectionChange = val => {
  multipleSelection.value = val
  console.log(val)
}

</script>


<!-- 对于element-plus插件中所自定义的元素，例如el-input,el-button，
  我们在修改其CSS时不应和元素的方式一样查询，应该使用类名的方式查询例如.el-input-->
<style scoped>
.tableBox {
  width: 800px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.tableBox .title {
  text-align: center;
}

.tableBox .searchBar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.tableBox .searchBar .el-input {
  width: 200px;
}
</style>
