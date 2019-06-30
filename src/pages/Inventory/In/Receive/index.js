import React, { Component } from 'react'
import { connect } from 'dva'

import PageHeaderWrapper from '@/components/PageHeaderWrapper'
import SearchForm from '@/components/SearchForm'
import BasicTable from '@/components/BasicTable'
import ButtonGroup from '@/components/ButtonGroup'

import { message } from 'antd'
import { getReceiveList /* , confrimReceive */ } from '../../services'

@connect(() => ({}))
class InventoryInReceive extends Component {
    state = {
        searchCondition: {}, // 搜索条件
        dataSrouce: [], // 表格数据
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0,
        }, // 表格分页

        selectedData: [],
    }

    componentDidMount() {
        this.fetchData()
    }

    // 请求表格的数据
    fetchData = (parmas = {}) => {
        const { pageNum, ...params } = parmas
        const { pagination, searchCondition } = this.state

        getReceiveList({
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

    onChangeRowSelect = (_, selectedRows) => {
        this.setState({
            selectedData: selectedRows,
        })
    }

    onConfirmReceive = () => {
        const { selectedData } = this.state

        if (selectedData.length === 0) {
            message.warn('选择订单后再操作')
            return
        }
        // TODO:
        console.log(selectedData)
        // confrimReceive()
    }

    render() {
        const { dataSrouce, pagination } = this.state

        return (
            <PageHeaderWrapper>
                <SearchForm
                    data={[
                        {
                            label: '日期',
                            type: 'datepicker',
                            key: 'ship_date',
                        },
                        {
                            label: '发货地',
                            type: 'input',
                            key: 'ship_adr',
                        },
                        {
                            label: '收货地',
                            type: 'input',
                            key: 'mch_address',
                        },
                        {
                            label: '车牌号码',
                            type: 'input',
                            key: 'vehicle_no',
                        },
                    ]}
                    buttonGroup={[{ onSearch: this.handleFormSearch }]}
                />
                <ButtonGroup
                    secondary={[
                        {
                            text: '确认入库',
                            onClick: this.onConfirmReceive,
                        },
                    ]}
                />
                <BasicTable
                    columns={[
                        {
                            title: '发货日期',
                            dataIndex: 'ship_date',
                        },
                        {
                            title: '物流公司',
                            dataIndex: 'logistics_name',
                        },
                        {
                            title: '车辆类型',
                            dataIndex: 'vehicle_type',
                        },
                        {
                            title: '车牌号码',
                            dataIndex: 'vehicle_no',
                        },
                        {
                            dataIndex: 'ship_adr',
                            title: '发货地',
                        },
                        {
                            dataIndex: 'mch_address',
                            title: '收货地',
                        },
                        {
                            dataIndex: 'skuid',
                            title: 'sku id',
                        },
                        {
                            dataIndex: 'name',
                            title: 'sku品名',
                        },
                        {
                            dataIndex: 'category_name',
                            title: '品类',
                        },
                        {
                            dataIndex: 'region_name',
                            title: '产区',
                        },
                        {
                            dataIndex: 'variety_name',
                            title: '品种',
                        },
                        {
                            dataIndex: 'storage_name',
                            title: '存储情况',
                        },
                        {
                            dataIndex: 'process_name',
                            title: '加工情况',
                        },
                        {
                            dataIndex: 'packing_name_b',
                            title: '内包装',
                        },
                        {
                            dataIndex: 'packing_name_a',
                            title: '外包装',
                        },
                        {
                            dataIndex: 'specification_real',
                            title: '实际规格值',
                        },
                        {
                            dataIndex: 'nn',
                            title: '净重',
                        },
                        {
                            dataIndex: 'quantity',
                            title: '订货数量',
                        },
                        {
                            dataIndex: 'date2',
                            title: '预计到达时间',
                        },
                        {
                            dataIndex: 'buy_date',
                            title: '采购日期',
                        },
                        {
                            dataIndex: 'buyer',
                            title: '采购人员',
                        },
                        {
                            dataIndex: 'status',
                            title: '状态',
                        },
                    ]}
                    dataSource={dataSrouce}
                    rowSelection={{
                        onChange: this.onChangeRowSelect,
                    }}
                    pagination={{
                        ...pagination,
                        onChange: this.handleChangePage,
                    }}
                />
            </PageHeaderWrapper>
        )
    }
}

export default InventoryInReceive