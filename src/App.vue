<template>
  <div class="table-box">
    <!-- title -->
    <div class="title">
      <h2>最简单的<span style="color: #67C23A;">CRUD</span> DEMO</h2>
    </div>
    <!-- search btn -->
    <div class="search-bar">
      <!-- [Bug] v-model.lazy 无法在el-input上工作 -->
      <el-input v-model.trim="input" placeholder="请输入姓名搜索🔍" />
      <div class="btn-select">
        <el-button type="primary" @click="handleAddOrEditInfo('Add')">添加</el-button>
        <el-badge :value="multipleSelection.length" v-if="multipleSelection.length > 0" class="item">
          <el-button type="danger" @click="handleDeleteMultiple">删除多选</el-button>
        </el-badge>
      </div>
    </div>
    <!-- table -->
    <div class="table-core">
      <el-table :data="paginationPageSize > 0 && input.length === 0 ? tableDataPagination : tableData" style="width: 100%"
        @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="昵称" width="80" />
        <el-table-column prop="email" label="邮箱" width="160" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="state" label="状态" width="120" />
        <el-table-column prop="address" label="地址" width="230" />
        <el-table-column fixed="right" label="操作" width="100">
          <template #default="scope">
            <el-button class="table-delete" link type="primary" size="small" @click="handleDeleteData(scope.$index)">删除
            </el-button>
            <el-button link type="primary" size="small" @click="handleEditData(scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- pagination -->
    <el-pagination class="pagination" small background layout="prev, pager, next" :total="tableData.length"
      :default-page-size="paginationPageSize" @current-change="handlePageChange" />
    <div class="clearfix"></div>
    <!-- footer -->
    <footer>
      <h4>技术栈</h4>
      <div class="subfield">
        <div class="one">
          <span><b>&nbsp;&nbsp;前端</b></span>
          <p>
            HTML5 + CSS3 + JavaScript <br>
            Vue3 + Vite + Element-Plus + Git
          </p>
        </div>
        <div class="two">
          <span><b>&nbsp;&nbsp;后端</b></span>
          <p>
            ES6 + Node.js + Express + Git + MySQL
          </p>
        </div>
      </div>
    </footer>
  </div>
  <!-- dialog -->
  <el-dialog v-model="dialogFormVisible" modal :title="dialogTitle" style="max-width: 600px;">
    <el-form ref="ruleFormRef" :model="form" label-position="right" :rules="rules" status-icon>
      <el-form-item label="姓名" :label-width="formLabelWidth" prop="name">
        <el-input v-model="form.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
        <el-input v-model="form.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="状态" :label-width="formLabelWidth" prop="state">
        <el-input v-model="form.state" autocomplete="off" />
      </el-form-item>
      <el-form-item label="地址" :label-width="formLabelWidth" prop="address">
        <el-input v-model="form.address" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="handleDialogConfirm(ruleFormRef)">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>



<script setup>
import { ref, shallowReactive, shallowRef, watch } from 'vue';
import { create, remove, removeMultiple, update, read } from './assets/modules/crudModules.js';
import { cloneDeep } from 'lodash'

/** 数据data */
const input = ref("")
const tableData = ref([
  //   {
  //     id: 1,
  //     name: "Alive Sir",
  //     email: "57878778@qq.com",
  //     phone: "16599999215",
  //     state: "在职",
  //     address: "上海市"
  //   },
  //   {
  //     id: 4,
  //     name: "DNDong",
  //     email: "3962476@qq.com",
  //     phone: "17266536654",
  //     state: "离职",
  //     address: "山东省"
  //   },
  //   {
  //     id: 9,
  //     name: "Sekter",
  //     email: "sekter@gmail.com",
  //     phone: "69997325000",
  //     state: "在职",
  //     address: "上海市"
  //   }
])
// 值类型浅拷贝没有问题，当表格数据中包含复杂类型数据时请务必用深拷贝
let tableDataCopy = Object.assign([], tableData.value)
// 过滤显示，这里只做一层遮罩，实际数据在 tableData 和 tableDataCopy
const tableDataPagination = ref(Object.assign(tableData.value))
const multipleSelection = ref([])
const dialogFormVisible = ref(false)
const formLabelWidth = '65px'
let form = ref({})
const dialogTitle = ref("编辑")
const rules = {
  name: [
    { required: true, message: 'Be sure to enter the nickname option', trigger: 'blur' },
    { min: 2, max: 8, message: 'Length should be 2 to 8', trigger: 'blur' },
  ],
  email: [
    { type: 'email', message: 'Please input correct email address', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1(3\d|4[5-9]|5[0-35-9]|6[567]|7[0-8]|8\d|9[0-35-9])\d{8}$/, message: 'Please enter the correct format phone number', trigger: 'blur' }
  ],
  state: [
    { type: 'enum', message: 'The value of State must be ‘在职’ or ‘离职’', enum: ['在职', '离职'], required: true, trigger: 'change' }
  ],
  address: [
    { min: 2, max: 18, message: 'Please enter the addressPlease enter an address between 2 and 18 in length', trigger: 'blur' }
  ]
}
const ruleFormRef = ref()
const paginationPageSize = 5 // 一页五行数据
let currentPage = 1
let dialogType = 'Add'  // 对话框类型，默认 Add



/** 方法methods */
const restoreSearchValue = () => {
  input.value = ''
  // 先将表单数据恢复正常，因为可能会受到搜索框的影响
  tableData.value = cloneDeep(tableDataCopy)
  tableDataPagination.value = cloneDeep(tableData.value)
}
const updateTableDataCopy = () => {
  // 更新copy数组
  tableDataCopy = cloneDeep(tableData.value)
  tableDataPagination.value = cloneDeep(tableData.value)
  handlePageChange(currentPage)
}
const resetFormValidation = (formEl) => {
  if (!formEl) formEl = ruleFormRef.value
  formEl?.resetFields()
}
const getUsersData = async () => {
  await read().then((response) => {
    if (response.status === 200 && response.data.status === 0) {
      tableData.value = response.data.data
      updateTableDataCopy()
      handlePageChange(currentPage)
      console.log(response.data)
    }
  })
}
getUsersData()



/** -------------------------------------------- */
// 处理分页按钮改变事件
const handlePageChange = (val) => {
  currentPage = val
  // console.log(val)
  restoreSearchValue()
  tableDataPagination.value = tableDataPagination.value.filter((ele, index) => {
    index++
    return index > paginationPageSize * (val - 1) && index <= paginationPageSize * val
  })
}
const handleDeleteData = (index) => {
  // console.log('handleDeleteData', index)
  // console.log(tableData.value[index].id)
  remove(tableDataPagination.value[index].id).then((response) => {
    console.log(response.data)
  })

  tableData.value.splice(tableData.value.findIndex((ele) => ele.id === tableDataPagination.value[index].id), 1)
  tableDataPagination.value.splice(index, 1)


  updateTableDataCopy()
}
const handleEditData = (row) => {
  // console.log('handleEditData')
  console.log(row)
  form.value = cloneDeep(row)
  handleAddOrEditInfo("Edit")
}
// 多选
const handleSelectionChange = val => {
  multipleSelection.value = val
  // console.log(val)
}
const handleAddOrEditInfo = (type) => {
  dialogFormVisible.value = true
  dialogTitle.value = type === "Add" ? "添加" : "编辑"

  resetFormValidation()
  if (type === "Add") form.value = {}

  dialogType = type
}
const handleDialogConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!')
      restoreSearchValue()

      // 将信息更新到表格原位置
      // 检测查找索引是否存在
      // 本地id用随机数生成，与服务器端不一致，只有刷新数据后才同步
      const index = tableData.value?.findIndex((d) => d.id === form.value.id) || -1
      if (dialogType === 'Edit') {
        update(form.value).then((response) => {
          console.log(response.data)

          tableData.value[index] = form.value
          updateTableDataCopy()
        })
      }
      else if (dialogType === 'Add') {
        tableData.value = tableDataCopy
        // restoreSearchValue()
        create(form.value).then(response => {
          console.log(response.data)

          // 这一步很重要
          // form.value = { id: getRandomInt(1000), ...form.value }
          // 将数据推到数组中
          tableData.value.push(form.value)
          getUsersData()
        })
        // updateTableDataCopy()
      }
      dialogFormVisible.value = false
    } else {
      // console.log('error submit!', fields)
    }
  })
  // 必须清除掉对话框表单值
  // form.value = {}
}
// 处理多选删除事件
const handleDeleteMultiple = () => {
  restoreSearchValue()
  const arr = []
  multipleSelection.value.forEach(ele => {
    // console.dir(tableData.value)
    const index = tableData.value.findIndex(d => d.id === ele.id)
    // handleDeleteData(index)

    arr.push(tableData.value[index].id)
  })

  // 在这里将要删除的数据的唯一标识ID记录下来，调用一次删除多条数据接口
  // 不在上面每次请求移除一条数据，优化！
  // console.log(JSON.stringify(arr))
  removeMultiple(arr).then((response) => {
    console.log(response.data)
    if (response.status === 200 && response.data.status === 0) {
      console.log(response.data)
      arr.forEach((val) => {
        const index = tableData.value.findIndex(d => d.id === val)
        tableData.value.splice(index, 1)
      })

      updateTableDataCopy()
    }
  })
}

/** 数据监听 watch */
watch(input, (newQuestion) => {
  // console.log(newQuestion)
  // 对查询数据大小写进行处理，统一改成小写
  newQuestion = newQuestion.trim().toLowerCase()
  tableData.value = cloneDeep(tableDataCopy)
  if (newQuestion.length > 0) {
    tableData.value = tableData.value.filter(d => d.name.toLowerCase().match(newQuestion))
  }
})

</script>


<!-- 对于element-plus插件中所自定义的元素，例如el-input,el-button，
  我们在修改其CSS时不应和元素的方式一样查询，应该使用类名的方式查询例如.el-input-->
<style scoped>
.table-box {
  width: 800px;
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
}


/* 标题居中 */
.table-box .title {
  text-align: center;
}


/* 设置搜索栏样式 */
.table-box .search-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.table-box .search-bar .el-input {
  width: 200px;
}

.table-box .search-bar .btn-select .item {
  margin-left: 10px;
}

/* 表格删除按钮的颜色以及交互样式 */
.table-delete {
  color: #F56C6C;
}

.table-delete:hover,
.table-delete:focus {
  color: #f89898;
}

/* pagination分页 */
.pagination {
  float: right;
  margin: 10px 0;
}


/* 底部信息样式 */
.table-box footer p {
  padding: 10px;
}

.table-box footer .subfield {
  display: flex;
  justify-content: space-between;
}
</style>
