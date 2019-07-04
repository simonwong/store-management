import React, { Component } from 'react'
import { Col, Row, InputNumber, Button } from 'antd'

class ConfirmModal extends Component {
    state = {
        data: [],
    }

    componentDidMount() {
        const { data } = this.props

        const newData = data.map(item => ({
            serial_no: item.serial_no,
            key: item.skuid,
            quantity: item.quantity,
            name: item.name,
            value: item.quantity,
        }))
        this.setState({
            data: newData,
        })
    }

    onChangeInput = (key, value) => {
        const { data } = this.state
        const newData = data.map(item => {
            if (item.key === key) {
                return {
                    ...item,
                    value,
                }
            }
            return item
        })
        this.setState({
            data: newData,
        })
    }

    handleConfirm = () => {
        const { onConfirm } = this.props
        const { data } = this.state
        const serials = []
        const dataArr = data.map(item => {
            serials.push(item.serial_no)
            return {
                serial_no: item.serial_no,
                quantity: item.value,
            }
        })

        onConfirm({
            serials: serials.join(','),
            data: JSON.stringify(dataArr),
        })
    }

    render() {
        const { data } = this.state
        return (
            <div>
                <Row style={{ marginBottom: 10, fontWeight: 'bold' }}>
                    <Col span={12}>SKU名</Col>
                    <Col span={6}>订货数量</Col>
                    <Col span={6}>收货数量</Col>
                </Row>
                {data.map(item => (
                    <Row style={{ marginBottom: 10 }} key={item.key}>
                        <Col span={12}>{item.name}</Col>
                        <Col span={6}>{item.quantity}</Col>
                        <Col span={6}>
                            <InputNumber
                                min={1}
                                value={item.value}
                                onChange={value => this.onChangeInput(item.key, value)}
                            />
                        </Col>
                    </Row>
                ))}
                <div style={{ marginTop: 20, textAlign: 'center' }}>
                    <Button type="primary" onClick={this.handleConfirm}>
                        确认收货
                    </Button>
                </div>
            </div>
        )
    }
}

export default ConfirmModal
