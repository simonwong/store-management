import React, { Component } from 'react'
import { connect } from 'dva'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SearchForm from '@/components/SearchForm'
import BasicTable from '@/components/BasicTable'

import { getComodityListMOCK } from './services'

@connect(() => ({}))
class CommodityManagement extends Component {
    state = {
        searchCondition: {}, // 搜索条件
        dataSrouce: [], // 表格数据
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        }, // 表格分页
    }

    componentDidMount() {
        this.fetchData()
    }

    // 请求表格的数据
    fetchData = (parmas = {}) => {
        const { pageNum, ...params } = parmas
        const { pagination, searchCondition } = this.state

        getComodityListMOCK({
            size: pagination.pageSize,
            index: pageNum || pagination.current,
            ...searchCondition,
            ...params,
        }).then(res => {
            if (res && res.errcode === 0) {
                this.setState({
                    dataSrouce: res.data,
                    pagination: {
                        ...pagination,
                        total: res.pages.count,
                    },
                })
            }
        })
    }

    // 查询表单搜索
    handleFormSearch = values => {
        const { pagination } = this.state

        this.setState(
            {
                searchCondition: values,
                pagination: {
                    ...pagination,
                    current: 1,
                },
            },
            () => {
                this.fetchData()
            }
        )
    }

    // 切换分页
    handleChangePage = page => {
        const { pagination } = this.state

        this.setState(
            {
                pagination: {
                    ...pagination,
                    current: page,
                },
            },
            () => {
                this.fetchData({
                    pageNum: page,
                })
            }
        )
    }

    render() {
        const { dataSrouce, pagination } = this.state

        return (
            <PageHeaderWrapper>
                <SearchForm
                    data={[
                        {
                            label: 'sku品名/批次ID',
                            type: 'input',
                            key: 'id',
                        },
                        {
                            label: '状态',
                            type: 'select',
                            options: [{ key: 0, value: '上架' }, { key: 1, value: '下架' }],
                            key: 'status',
                        },
                    ]}
                    buttonGroup={[{ onSearch: this.handleFormSearch }]}
                />
                <BasicTable
                    columns={[
                        {
                            title: '商品批次 id',
                            dataIndex: 'id1',
                        },
                        {
                            title: 'sku id',
                            dataIndex: 'id2',
                        },
                        {
                            title: 'sku品名',
                            dataIndex: 'a',
                        },
                        {
                            title: '别名',
                            dataIndex: 'b',
                        },
                        {
                            dataIndex: 'c',
                            title: '品类',
                        },
                        {
                            dataIndex: 'd',
                            title: '品种',
                        },
                        {
                            dataIndex: 'e',
                            title: '产区',
                        },
                        {
                            dataIndex: 'f',
                            title: '存储情况',
                        },
                        {
                            dataIndex: 'g',
                            title: '加工情况',
                        },
                        {
                            dataIndex: 'h',
                            title: '外包装',
                        },
                        {
                            dataIndex: 'i',
                            title: '内包装',
                        },
                        {
                            dataIndex: 'j',
                            title: '实际规格值',
                        },
                        {
                            dataIndex: 'k',
                            title: '净重',
                        },
                        {
                            dataIndex: 'date1',
                            title: '采购日期',
                        },
                        {
                            dataIndex: 'number1',
                            title: '门店结算价',
                        },
                        {
                            dataIndex: 'number2',
                            title: '门店售价',
                        },
                        {
                            dataIndex: 'number3',
                            title: '入库库存',
                        },
                        {
                            dataIndex: 'number4',
                            title: '期初库存',
                        },
                        {
                            width: 100,
                            dataIndex: 'number5',
                            title: '期末库存',
                        },
                        {
                            dataIndex: 'number6',
                            title: '当前库存',
                        },
                        {
                            dataIndex: 'n',
                            title: '上下架状态',
                        },
                        {
                            type: 'oprate',
                            // fixed: 'right',
                            buttons: [{ text: '售价/别名' }, { text: '生成尾货' }],
                        },
                    ]}
                    dataSource={dataSrouce}
                    pagination={{
                        ...pagination,
                        onChange: this.handleChangePage,
                    }}
                />
            </PageHeaderWrapper>
        )
    }
}

export default CommodityManagement