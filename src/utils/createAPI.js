import axios from 'axios'
import { Modal } from 'antd'
import md5 from 'md5'

import { uuid, createSign, mainSite } from '@/utils/utils'
import { getUserToken, setUserToken } from './token'

// const baseURL = '/api'
// export const baseURL = '//47.97.180.197:89'
let baseURL = ''

// 线上环境
if (window.location.href.includes('mp.yicaipi')) {
    baseURL = '//msapi.yicaipi.com'

    // 其他环境
} else {
    baseURL = '//admin.api.fresh.laoniutech.com'
}

export const baseUrl = baseURL

const codeMessage = {
    200: '服务器成功返回请求的数据。',
    201: '新建或修改数据成功。',
    202: '一个请求已经进入后台排队（异步任务）。',
    204: '删除数据成功。',
    400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
    401: '用户没有权限（令牌、用户名、密码错误）。',
    403: '用户得到授权，但是访问是被禁止的。',
    404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
    406: '请求的格式不可得。',
    410: '请求的资源被永久删除，且不会再得到的。',
    422: '当创建一个对象时，发生一个验证错误。',
    500: '服务器发生错误，请检查服务器。',
    502: '网关错误。',
    503: '服务不可用，服务器暂时过载或维护。',
    504: '网关超时。',
}

const checkStatus = response => {
    if (response.status >= 200 && response.status < 300) {
        return response
    }
    const errortext = codeMessage[response.status] || response.statusText
    Modal.error({
        title: `请求错误 ${response.status}: ${response.request.responseURL}`,
        content: errortext,
    })
    const error = new Error(errortext)
    error.name = response.status
    error.response = response
    throw error
}

const instance = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
        // "Content-Type": "multipart/form-data",
        Accept: 'application/json',
    },
})

// 响应拦截器
instance.interceptors.response.use(
    res => {
        const { data } = res
        // errcode 2000 时处理未登陆或登陆过期
        if (data.errcode === 2000) {
            Modal.error({
                title: data.message || '请求超时',
                okText: '前往登陆',
                onOk: () => {
                    setUserToken('')
                    window.location = `${mainSite()}user/login`
                },
            })
            return data
        }
        if (data.errcode !== 0) {
            Modal.error({
                title: data.msg || data.message,
            })
        }
        return data
    },
    error => {
        // 如果跨域，则拿不到response
        const res = error.response

        if (res) {
            checkStatus(res)
        } else {
            Modal.error({
                title: '请求错误',
                content: error.toString(),
            })
        }
        Promise.reject(error)
    }
)

const createAPI = (url, method, config) => {
    const { params } = config
    const uuId = localStorage.getItem('uuId')
    if (uuId) {
        params.sk = uuId
    } else {
        params.sk = uuid()
        localStorage.setItem('uuId', params.sk)
    }
    const userInfoStr = getUserToken()
    let localUk = ''
    if (userInfoStr) {
        const userInfo = JSON.parse(userInfoStr)
        localUk = userInfo.uk
    }
    if (localUk) {
        params.uk = localUk
    }
    params.ver = '1.0.0'
    params.ts = Date.parse(new Date().toUTCString()) / 1000
    const paramsArr = Object.keys(params).map(key => {
        return params[key]
    })
    params.sign = md5(createSign(paramsArr))
    config.params = params

    return instance({
        url,
        method,
        ...config,
    })
}

export default createAPI
