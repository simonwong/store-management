import React, { PureComponent } from 'react'
import { Spin, Tag, Menu, Icon, Avatar } from 'antd'
import moment from 'moment'
import groupBy from 'lodash/groupBy'
// import NoticeIcon from '../NoticeIcon'
// import HeaderSearch from '../HeaderSearch'
import HeaderDropdown from '../HeaderDropdown'

import styles from './index.less'

export default class GlobalHeaderRight extends PureComponent {
    getNoticeData() {
        const { notices = [] } = this.props
        if (notices.length === 0) {
            return {}
        }
        const newNotices = notices.map(notice => {
            const newNotice = { ...notice }
            if (newNotice.datetime) {
                newNotice.datetime = moment(notice.datetime).fromNow()
            }
            if (newNotice.id) {
                newNotice.key = newNotice.id
            }
            if (newNotice.extra && newNotice.status) {
                const color = {
                    todo: '',
                    processing: 'blue',
                    urgent: 'red',
                    doing: 'gold',
                }[newNotice.status]
                newNotice.extra = (
                    <Tag color={color} style={{ marginRight: 0 }}>
                        {newNotice.extra}
                    </Tag>
                )
            }
            return newNotice
        })
        return groupBy(newNotices, 'type')
    }

    getUnreadData = noticeData => {
        const unreadMsg = {}
        Object.entries(noticeData).forEach(([key, value]) => {
            if (!unreadMsg[key]) {
                unreadMsg[key] = 0
            }
            if (Array.isArray(value)) {
                unreadMsg[key] = value.filter(item => !item.read).length
            }
        })
        return unreadMsg
    }

    changeReadState = clickedItem => {
        const { id } = clickedItem
        const { dispatch } = this.props
        dispatch({
            type: 'global/changeNoticeReadState',
            payload: id,
        })
    }

    render() {
        const {
            currentUser,
            // fetchingNotices,
            // onNoticeVisibleChange,
            onMenuClick,
            // onNoticeClear,
            theme,
        } = this.props

        const menu = (
            <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
                <Menu.Item disabled key="userCenter">
                    <Icon type="user" />
                    用户中心
                </Menu.Item>
                <Menu.Item disabled key="userinfo">
                    <Icon type="setting" />
                    用户设置
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout">
                    <Icon type="logout" />
                    登出
                </Menu.Item>
            </Menu>
        )
        // const noticeData = this.getNoticeData()
        // const unreadMsg = this.getUnreadData(noticeData)
        let className = styles.right
        if (theme === 'dark') {
            className = `${styles.right}  ${styles.dark}`
        }
        return (
            <div className={className}>
                {/* <HeaderSearch
                    className={`${styles.action} ${styles.search}`}
                    placeholder={formatMessage({ id: 'component.globalHeader.search' })}
                    dataSource={[
                        formatMessage({ id: 'component.globalHeader.search.example1' }),
                        formatMessage({ id: 'component.globalHeader.search.example2' }),
                        formatMessage({ id: 'component.globalHeader.search.example3' }),
                    ]}
                    onSearch={value => {
                        console.log('input', value) // eslint-disable-line
                    }}
                    onPressEnter={value => {
                        console.log('enter', value) // eslint-disable-line
                    }}
                /> */}
                {/* <NoticeIcon
                    className={styles.action}
                    count={currentUser.unreadCount}
                    onItemClick={(item, tabProps) => {
                        console.log(item, tabProps) // eslint-disable-line
                        this.changeReadState(item, tabProps)
                    }}
                    loading={fetchingNotices}
                    locale={{
                        emptyText: formatMessage({ id: 'component.noticeIcon.empty' }),
                        clear: formatMessage({ id: 'component.noticeIcon.clear' }),
                        viewMore: formatMessage({ id: 'component.noticeIcon.view-more' }),
                        notification: formatMessage({ id: 'component.globalHeader.notification' }),
                        message: formatMessage({ id: 'component.globalHeader.message' }),
                        event: formatMessage({ id: 'component.globalHeader.event' }),
                    }}
                    onClear={onNoticeClear}
                    onPopupVisibleChange={onNoticeVisibleChange}
                    onViewMore={() => message.info('Click on view more')}
                    clearClose
                >
                    <NoticeIcon.Tab
                        count={unreadMsg.notification}
                        list={noticeData.notification}
                        title="notification"
                        emptyText={formatMessage({
                            id: 'component.globalHeader.notification.empty',
                        })}
                        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                        showViewMore
                    />
                    <NoticeIcon.Tab
                        count={unreadMsg.message}
                        list={noticeData.message}
                        title="message"
                        emptyText={formatMessage({ id: 'component.globalHeader.message.empty' })}
                        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
                        showViewMore
                    />
                    <NoticeIcon.Tab
                        count={unreadMsg.event}
                        list={noticeData.event}
                        title="event"
                        emptyText={formatMessage({ id: 'component.globalHeader.event.empty' })}
                        emptyImage="https://gw.alipayobjects.com/zos/rmsportal/HsIsxMZiWKrNUavQUXqx.svg"
                        showViewMore
                    />
                </NoticeIcon> */}
                {currentUser.userName ? (
                    <HeaderDropdown overlay={menu}>
                        <span className={`${styles.action} ${styles.account}`}>
                            <Avatar
                                size="small"
                                className={styles.avatar}
                                // src={currentUser.avatar}
                                icon="user"
                                alt="avatar"
                            />
                            <span className={styles.name}>{currentUser.userName}</span>
                        </span>
                    </HeaderDropdown>
                ) : (
                    <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
                )}
            </div>
        )
    }
}