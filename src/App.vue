<template>
  <div class="table-box">
    <!-- title -->
    <div class="title">
      <h2>最简单的<span style="color: #67C23A;">CRUD</span> DEMO</h2>
    </div>
    <!-- search btn -->
    <div class="search-bar">
      <!-- [Bug] v-model.lazy 无法在el-input上工作 -->
      <el-input v-model.lazy="input" placeholder="请输入姓名搜索🔍" />
      <div class="btn-select">
        <el-button type="primary" @click="handleAddOrEditInfo('Add')">添加</el-button>
        <el-button type="danger" v-if="multipleSelection.length > 0" @click="handleDeleteMultiple">删除多选</el-button>
      </div>
    </div>
    <!-- table -->
    <div class="table-core">
      <el-table :data="tableData" style="width: 100%" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" />
        <el-table-column prop="name" label="昵称" width="130" />
        <el-table-column prop="email" label="邮箱" width="150" />
        <el-table-column prop="phone" label="电话" width="120" />
        <el-table-column prop="state" label="状态" width="120" />
        <el-table-column prop="address" label="地址" width="180" />
        <el-table-column fixed="right" label="操作" width="120">
          <template #default="scope">
            <el-button class="table-delete" link type="primary" size="small" @click="handleDeleteData(scope.$index)">删除
            </el-button>
            <el-button link type="primary" size="small" @click="handleEditData(scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
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
import { ref, watch } from 'vue';
import { create, remove, update, read } from './assets/modules/crudModules';

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
let tableDataCopy = Object.assign(tableData.value)
const multipleSelection = ref([])
const dialogFormVisible = ref(false)
const formLabelWidth = '65px'
const form = ref({})
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
    { min: 2, max: 12, message: 'Please enter the addressPlease enter an address between 2 and 12 in length', trigger: 'blur' }
  ]
}
const ruleFormRef = ref()



/** 方法methods */
const restoreSearchValue = () => {
  input.value = ''
  // 先将表单数据恢复正常，因为可能会受到搜索框的影响
  tableData.value = tableDataCopy
}
const updateTableDataCopy = () => {
  // 更新copy数组
  tableDataCopy = Object.assign(tableData.value)
}
const getUsersData = () => {
  read().then((response) => {
    // console.log(response.status)
    if (response.status === 200) {
      tableData.value = response.data.data
      updateTableDataCopy()
      console.log(response.data)
    }
  })
}
getUsersData()


/** -------------------------------------------- */
const handleDeleteData = (index) => {
  // console.log('handleDeleteData', index)
  // console.log(tableData.value[index].id)
  remove(tableData.value[index].id).then((response) => {
    console.log(response.data)
  })
  tableData.value.splice(index, 1)
}
const handleEditData = (row) => {
  // console.log('handleEditData')
  form.value = row
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

  if (type === "Add") form.value = {}
}
const handleDialogConfirm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      // console.log('submit!')
      dialogFormVisible.value = false

      // 将信息更新到表格原位置
      // 检测查找索引是否存在
      const index = tableData.value?.findIndex((d) => d.id === form.value.id) || -1
      if (index !== -1) {
        update(form.value).then((response) => {
          console.log(response.data)
        })
        tableData.value[index] = form.value
      }
      else {
        restoreSearchValue()
        create(form.value).then(response => {
          console.log(response.data)
        })
        // 将数据推到数组中
        tableData.value.push(form.value)

        updateTableDataCopy()
      }
    } else {
      // console.log('error submit!', fields)
    }
  })

}
// 处理多选删除事件
const handleDeleteMultiple = () => {
  restoreSearchValue()
  multipleSelection.value.forEach(ele => {
    const index = tableData.value.findIndex(d => d.id === ele.id)
    remove(tableData.value[index].id).then((response) => {
      console.log(response.data)
    })
    tableData.value.splice(index, 1)
  })
}

/** 数据监听 watch */
watch(input, (newQuestion) => {
  // console.log(newQuestion)
  // 对查询数据大小写进行处理，统一改成小写
  newQuestion = newQuestion.trim().toLowerCase()
  tableData.value = tableDataCopy
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

/* 表格删除按钮的颜色以及交互样式 */
.table-delete {
  color: #F56C6C;
}

.table-delete:hover,
.table-delete:focus {
  color: #f89898;
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
