import createAPI from '@/utils/createAPI'

// 获取当前的菜单
export const queryCurrentMenu = async params =>
    createAPI('/admin', 'get', {
        params: {
            t: 'menus',
            ...params,
        },
    })

/**
 * 动态页面
 */
// 数据接口
export const getDynamicConfig = async params =>
    createAPI('/configuration', 'get', {
        params: {
            t: 'list',
            ...params,
        },
    })

// 添加接口
export const addDynamicData = async params =>
    createAPI('/configuration', 'get', {
        params: {
            t: 'save',
            id: 0,
            ...params,
        },
    })

// 删除接口
export const deleteDynamicData = async params =>
    createAPI('/configuration', 'get', {
        params: {
            t: 'status',
            action: 'delete',
            ...params,
        },
    })

// 禁用接口
export const disableDynamicData = async params =>
    createAPI('/configuration', 'get', {
        params: {
            t: 'status',
            action: 'disable',
            ...params,
        },
    })

// 文件上传
export const fileUpload = async data =>
    createAPI('/general', 'post', {
        params: {
            t: 'upload',
        },
        data,
    })

// 通用
export const generalPost = async (params = {}, formData) =>
    createAPI('/general', 'post', {
        params,
        data: formData,
    })

// 获取地域信息
export const getRegions = async params =>
    createAPI('/general', 'get', {
        params: {
            t: 'regions',
            ...params,
        },
    })
