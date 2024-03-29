import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import { Form, Input, Select, DatePicker, Button, Card, Radio } from 'antd'
import styles from './index.less'

const { RangePicker } = DatePicker

@Form.create()
class SearchForm extends Component {
    // 生成input
    createInput = ({ label, key, ...props }) => {
        const {
            form: { getFieldDecorator },
        } = this.props
        return (
            <Form.Item label={label} key={key}>
                {getFieldDecorator(key)(<Input style={{ width: 200 }} {...props} />)}
            </Form.Item>
        )
    }

    // 生成select
    createSelect = ({
        label,
        key,
        options = [],
        initValue = '',
        keyFiled,
        textFiled,
        ...props
    }) => {
        const {
            form: { getFieldDecorator },
        } = this.props
        const custom = {
            allowClear: true,
        }
        if (props.showSearch && !props.filterOption) {
            Object.assign(custom, {
                showSearch: true,
                filterOption: (input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0,
            })
        }

        return (
            <Form.Item label={label} key={key}>
                {getFieldDecorator(key, {
                    initialValue: initValue,
                })(
                    <Select style={{ width: 200 }} {...custom} {...props}>
                        {options.map(option => (
                            <Select.Option key={option[keyFiled || 'key']}>
                                {option[textFiled || 'value']}
                            </Select.Option>
                        ))}
                    </Select>
                )}
            </Form.Item>
        )
    }

    // 生成DatePicker
    createDatePicker = ({ label, key, ...props }) => {
        const {
            form: { getFieldDecorator },
        } = this.props
        return (
            <Form.Item label={label} key={key}>
                {getFieldDecorator(key)(<DatePicker {...props} />)}
            </Form.Item>
        )
    }

    // 生成RangePicker
    createRangePicker = ({ label, key, ...props }) => {
        const {
            form: { getFieldDecorator },
        } = this.props
        return (
            <Form.Item label={label} key={key}>
                {getFieldDecorator(key)(<RangePicker {...props} />)}
            </Form.Item>
        )
    }

    // 生成Radiogroup
    createRadiogroup = ({ label, key, options = [], ...props }) => {
        const {
            form: { getFieldDecorator },
        } = this.props
        return (
            <Form.Item label={label} key={key}>
                {getFieldDecorator(key)(
                    <Radio.Group {...props}>
                        {options.map(item => (
                            <Radio.Button key={item.value} value={item.value}>
                                {item.text}
                            </Radio.Button>
                        ))}
                    </Radio.Group>
                )}
            </Form.Item>
        )
    }

    createForm = data => {
        const formEl = data.map(item => {
            let formElement = null

            switch (item.type.toLocaleLowerCase()) {
                case 'input':
                    formElement = this.createInput(item)
                    break
                case 'select':
                    formElement = this.createSelect(item)
                    break
                case 'datepicker':
                    formElement = this.createDatePicker(item)
                    break
                case 'rangepicker':
                    formElement = this.createRangePicker(item)
                    break
                case 'radiogroup':
                    formElement = this.createRadiogroup(item)
                    break
                default:
                    formElement = null
            }

            return formElement
        })
        return formEl
    }

    handleSearch = () => {
        const { onSearch } = this.props
        const values = this.getFormValues()
        // console.log(values)
        onSearch(values)
    }

    handleDownload = () => {
        const { onDownload } = this.props

        const values = this.getFormValues()

        onDownload(values)
    }

    // 点击按钮
    handleCustomClick = (callback = () => {}) => {
        const values = this.getFormValues()

        // TODO: 过滤没有用的字段
        // eslint-disable-next-line no-restricted-syntax
        for (const key in values) {
            // eslint-disable-next-line no-prototype-builtins
            if (values.hasOwnProperty(key)) {
                const element = values[key]

                if (element == null) {
                    delete values[key]
                }
            }
        }

        callback(values)
    }

    generateButton = ({ type, onClick, icon, disabled, text, key }) => (
        <Button
            type={type || 'default'}
            onClick={() => this.handleCustomClick(onClick)}
            icon={icon || null}
            disabled={disabled}
            key={key}
        >
            {text}
        </Button>
    )

    // 获取表单的数据
    getFormValues = () => {
        const {
            data,
            form: { getFieldsValue },
        } = this.props

        const values = getFieldsValue()

        // 对日期进行格式转换
        data.forEach(item => {
            const { type, key, dateFormat } = item
            const curVal = values[key]

            if (type.toLocaleLowerCase() === 'datepicker' && curVal != null) {
                values[key] = moment(curVal).format(dateFormat || 'YYYY-MM-DD')
            }

            if (type.toLocaleLowerCase() === 'rangepicker' && curVal != null) {
                values[key] = curVal.map(v => moment(v).format(dateFormat || 'YYYY-MM-DD'))
            }
        })

        return values
    }

    render() {
        const { data, buttonGroup } = this.props

        return (
            <Card bordered={false}>
                <Form className={styles.content} layout="inline">
                    {this.createForm(data)}
                    {buttonGroup.map((button, index) => {
                        if (button.onSearch) {
                            return this.generateButton({
                                type: 'primary',
                                onClick: button.onSearch,
                                disabled: button.disabled,
                                icon: 'search',
                                text: '搜索',
                                key: index,
                            })
                        }
                        if (button.onDownload) {
                            return this.generateButton({
                                type: 'default',
                                onClick: button.onDownload,
                                disabled: button.disabled,
                                icon: 'download',
                                text: '下载',
                                key: index,
                            })
                        }

                        return this.generateButton({
                            type: button.type || 'default',
                            onClick: button.onClick,
                            disabled: button.disabled,
                            icon: button.icon || null,
                            text: button.text,
                            key: index,
                        })
                    })}
                </Form>
            </Card>
        )
    }
}

SearchForm.defaultProps = {
    data: [],
    buttonGroup: [],
}

SearchForm.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            key: PropTypes.string.isRequired,
        })
    ),
    buttonGroup: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
            onSearch: PropTypes.func,
            onDownload: PropTypes.func,
            onClick: PropTypes.func,
            disabled: PropTypes.bool,
            icon: PropTypes.string,
            text: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
        })
    ),
}

export default SearchForm
