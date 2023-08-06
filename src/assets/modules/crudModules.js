import axios from 'axios'

// 添加数据
export function create(data) {
    return axios.post('/users/create', data)
}

// 删除数据
export function remove(id) {
    return axios.delete(`/users/delete/${id}`)
}
// 删除多条数据
export function removeMultiple(arr) {
    return axios.delete('/users/delete', {
        data: {
            ids: JSON.stringify(arr)
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}

// 修改数据
export function update(data) {
    return axios.post('/users/update', data)
}

// 查询数据
export function read() {
    return axios.get('/users/read')
}