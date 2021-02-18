import { Breadcrumb, Button, Col, Input, Layout, Row, Select, Space, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, FieldTimeOutlined, PlusOutlined, SendOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal'
import Tables from 'components/layout/table'
import Timeline from 'components/layout/timeline'
import config from 'config'
import { httpClient } from 'HttpClient'

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const Home = () => {
    const [dataSource, setDataSource] = useState()
    const [numderNews, setNumder] = useState({ all: 0, sdnt: 0, draft: 0 })
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({ pageCurrent: 1, perPage: 10, totalPage: 1 })
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: null, okText: '' });
    const [dataSearch, setDataSearch] = useState({ category: 0, filter: '' })
    const [current, setCurrent] = useState(1)
    const [filters, setFilters] = useState()

    useEffect(() => {
        getData()
    }, [current, dataSearch, filters])

    const getData = () => {
        const params = {
            // per_page: '10',
            page: current,
            filters: `category:like:${dataSearch.category}`,
            filters: `topic:like:${dataSearch.filter}`,
        }
        httpClient.get(config.REACT_APP_BASEURL + '/news', { params })
            .then(function (response) {
                console.log('response', response)
                const code = response.data.code
                const data = response.data.data.data_list
                setLoading(false)
                if (code === 200) {
                    setPagination({
                        pageCurrent: response.data.data.pagination.current_page,
                        perPage: response.data.data.pagination.per_page,
                        totalPage: response.data.data.pagination.total
                    })
                    const dataMap = data.map((item) => {
                        item.key = item.id
                        item.date = item.created_at
                        item.status = "--"
                        // item.status = item.status
                        return item
                    })
                    setDataSource(dataMap)
                } else {
                    setDataSource()
                }
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    const onSearch = (value) => {
        setDataSearch({ ...dataSearch, filter: value })
    }

    const onCategory = (value) => {
        setDataSearch({ ...dataSearch, category: value })
    }

    const currentPage = (value) => {
        setCurrent(value);
    }

    const onTimeline = (record) => {
        setModalData({
            type: 'show',
            icon: <FieldTimeOutlined className="manage-icon-insert" />,
            title: 'ไทม์ไลน์',
            okColor: '#216258',
            okText: 'ตกลง',
            onOk() {
                offModal()
            },
            content: <div style={{ width: '180px' }}><Timeline /></div>
        })
        onModal()
    }

    const onDelete = (record) => {
        setModalData({
            type: 'confirm',
            icon: <DeleteOutlined className="manage-icon-delete" />,
            title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
            okColor: 'red',
            okText: 'ลบ',
            onOk() {
                offModal()
                httpClient.delete(config.REACT_APP_BASEURL + '/news/' + record.key)
                    .then(function (response) {
                        const code = response.data.code
                        if (code === 200) {
                            message.success(response.data.message);
                            setFilters(record.key)
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        message.error(error.data.message);
                    })
            },
            content: record.topic,
        })
        onModal()
    }
    
    const onModal = () => {
        setIsModalVisible(true)
    };

    const offModal = () => {
        setIsModalVisible(false)
    };

    const columns = [
        {
            title: 'วันที่',
            dataIndex: 'date',
            key: 'date',
            width: '120px'
        },
        {
            title: 'หัวข้อ',
            dataIndex: 'topic',
            key: 'topic',
            width: '500px',
            ellipsis: true,
            render: (text, record) => (<Link to={`/home/view/${record.key}`} style={{ color: '#000' }}>{record.topic}</Link>),
        },
        {
            title: 'ประเภท',
            dataIndex: 'category',
            key: 'category',
            width: '100px'
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
            width: '100px'
        },
        {
            title: '',
            fixed: 'right',
            width: '120px',
            key: 'action',
            render: (text, record) => (
                <Space >
                    <Tooltip placement="bottom" title="ไทม์ไลน์">
                        <FieldTimeOutlined className="admin-icon-time" onClick={() => { onTimeline(record) }}></FieldTimeOutlined>
                    </Tooltip>
                    <Tooltip placement="bottom" title="แก้ไข">
                        <Link to={`/home/edit/${record.key}`}>
                            <EditOutlined className="admin-icon-edit" />
                        </Link>
                    </Tooltip>
                    <Tooltip placement="bottom" title="ลบ">
                        <DeleteOutlined className="admin-icon-delete" onClick={() => { onDelete(record) }} />
                    </Tooltip>
                </Space>
            ),
        }
    ];
    return (
        <>
            <Breadcrumb style={{ margin: '4px 0' }}>
                <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="admin-home-content">
                <Row gutter={[16, 16]} >
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                        <div className="admin-home-box-left">
                            <Row align="middle" style={{ height: '100%' }}>
                                <Col span={8} offset={4}>
                                    <UnorderedListOutlined className="admin-home-icon" />
                                </Col>
                                <Col span={8}>
                                    <p className="admin-home-number"> {numderNews.all} </p>
                                    <p className="admin-home-text">ข่าวทั้งหมด</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8} >
                        <div className="admin-home-box-center" >
                            <Row align="middle" style={{ height: '100%' }}>
                                <Col span={8} offset={4}>
                                    <SendOutlined className="admin-home-icon" />
                                </Col>
                                <Col span={8}>
                                    <p className="admin-home-number"> {numderNews.sdnt} </p>
                                    <p className="admin-home-text">ข่าวส่งแล้ว</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col xs={24} sm={12} md={12} lg={8} xl={8} >
                        <div className="admin-home-box-right" >
                            <Row align="middle" style={{ height: '100%' }}>
                                <Col span={8} offset={4}>
                                    <EditOutlined className="admin-home-icon" />
                                </Col>
                                <Col span={8}>
                                    <p className="admin-home-number"> {numderNews.draft} </p>
                                    <p className="admin-home-text">ข่าวร่าง</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row gutter={8} style={{ marginTop: '20px' }} >
                    <Col flex="auto">
                        <div className="admin-home-text-list">รายการ</div>
                    </Col>
                    <Col flex="220px">
                        <Input.Group >
                            <Select defaultValue="1" style={{ width: '100%' }} onChange={onCategory}>
                                <Option value="1">ประเภทข่าวทั้งหมด</Option>
                                <Option value="การเมือง">การเมือง</Option>
                                <Option value="ท่องเที่ยว">ท่องเที่ยว</Option>
                            </Select>
                        </Input.Group>
                    </Col>
                    <Col flex="220px">
                        <Search placeholder="ค้นหา" onSearch={onSearch}></Search>
                    </Col>
                    <Col flex="100px">
                        <Link to="/home/create">
                            <Button style={{ width: '100%' }} type="primary" icon={<PlusOutlined />}>เพิ่ม</Button>
                        </Link>
                    </Col>
                </Row>
                <Tables
                    loading={loading}
                    columns={columns}
                    dataSource={dataSource}
                    setCurrentPage={currentPage}
                    pageCurrent={pagination.pageCurrent}
                    perPage={pagination.perPage}
                    totalPage={pagination.totalPage}
                />
                <Modals
                    isModalVisible={isModalVisible}
                    onOk={modalData.onOk}
                    onCancel={offModal}
                    modalData={modalData}
                >
                    {modalData.content}
                </Modals>
            </Content>
        </>
    );
}
export default Home