import axios from 'axios'

// 添加数据
export function create(data) {
    return axios.post('/users/create', data)
}

// 删除数据
export function remove(id) {
    return axios.delete(`/users/delete/${id}`)
}

// 修改数据
export function update(data) {
    return axios.post('/users/update', data)
}

// 查询数据
export function read() {
    return axios.get('/users/read')
}