import { Breadcrumb, Button, Col, Dropdown, Input, Layout, Menu, Row, Select, Space, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, FieldTimeOutlined, PlusOutlined, SendOutlined, UnorderedListOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from "react";

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal/index'
import Tables from 'components/layout/table/index'
import Timeline from 'components/layout/timeline/index'

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const data = [{
    key: '1',
    date: '07/01/2021',
    topic: 'ตร.ค้นโกดังย่านฉลองกรุง ยังไม่พบผิด เร่งเช็กภาพโต๊ะบาคาร่า ตัดต่อหรือไม่',
    category: 'การเมือง',
    status: 'ส่ง',
},{
    key: '2',
    date: '07/01/2021',
    topic: 'ตร.ค้นโกดังย่านฉลองกรุง ยังไม่พบผิด เร่งเช็กภาพโต๊ะบาคาร่า ตัดต่อหรือไม่',
    category: 'การเมือง',
    status: 'ส่ง',
}
];


const Home = () => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: null, okText: '' });

    const onTimeline = (record) => {
        setModalData({
            type: 'show',
            icon: <FieldTimeOutlined className="manage-icon-insert" />,
            title: 'ไทม์ไลน์',
            okColor: '#216258',
            okText: 'ตกลง',
            onOk() {
                setIsModalVisible(false)
            },
            content: <div style={{ width: '180px' }}><Timeline /></div>
        })
        showModal()
    }

    const onDelete = (record) => {
        setModalData({
            type: 'confirm',
            icon: <DeleteOutlined className="manage-icon-delete" />,
            title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
            okColor: 'red',
            okText: 'ลบ',
            onOk() {
                setIsModalVisible(false)
            },
            content: record.topic,
        })
        showModal()
    }

    const showModal = () => {
        setIsModalVisible(true)
    };

    const handleOk = () => {
        setIsModalVisible(false)
    };

    const handleCancel = () => {
        setIsModalVisible(false)
    };


    const columns = [
        {
            title: 'วันที่',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'หัวข้อ',
            dataIndex: 'topic',
            key: 'topic',
            width: '50%',
            ellipsis: true,
            render: (text, record) => (<Link to="/home/view" style={{ color: '#000' }}>{record.topic}</Link>),
        },
        {
            title: 'ประเภท',
            dataIndex: 'category',
            key: 'category',
        },
        {
            title: 'สถานะ',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: '',
            // width: '10%',
            key: 'action',
            render: (text, record) => (
                <Space >
                    <Tooltip placement="bottom" title="ไทม์ไลน์">
                        <FieldTimeOutlined className="admin-icon-time" onClick={() => { onTimeline(record) }}></FieldTimeOutlined>
                    </Tooltip>
                    <Tooltip placement="bottom" title="แก้ไข">
                        <Link to={`/home/edit/123456`}>
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
            <Content className="admin-home-Content">
                <Row style={{ height: '160px' }} >
                    <Col span={8} >
                        <div className="admin-home-Box-Left">
                            <Row align="middle" style={{ height: '100%' }}>
                                <Col span={8} offset={4}>
                                    <UnorderedListOutlined className="admin-home-Icon" />
                                </Col>
                                <Col span={8}>
                                    <p className="admin-home-Number">6</p>
                                    <p className="admin-home-Text">ข่าวทั้งหมด</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={8} >
                        <div className="admin-home-Box-Center" >
                            <Row align="middle" style={{ height: '100%' }}>
                                <Col span={8} offset={4}>
                                    <SendOutlined className="admin-home-Icon" />
                                </Col>
                                <Col span={8}>
                                    <p className="admin-home-Number">6</p>
                                    <p className="admin-home-Text">ข่าวส่งแล้ว</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    <Col span={8} >
                        <div className="admin-home-Box-Right" >
                            <Row align="middle" style={{ height: '100%' }}>
                                <Col span={8} offset={4}>
                                    <EditOutlined className="admin-home-Icon" />
                                </Col>
                                <Col span={8}>
                                    <p className="admin-home-Number">6</p>
                                    <p className="admin-home-Text">ข่าวร่าง</p>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
                <Row gutter={8} style={{ marginTop: '20px' }} >
                    <Col flex="auto">
                        <div className="admin-home-Text-List">รายการ</div>
                    </Col>
                    <Col flex="220px">
                        <Input.Group >
                            <Select defaultValue="1" style={{ width: '100%' }}>
                                <Option value="1">ประเภทข่าวทั้งหมด</Option>
                                <Option value="2">การเมือง</Option>
                            </Select>
                        </Input.Group>
                    </Col>
                    <Col flex="220px">
                        <Search placeholder="ค้นหา"></Search>
                    </Col>
                    <Col flex="100px">
                        <Link to="/home/create">
                            <Button style={{ width: '100%' }} type="primary" icon={<PlusOutlined />}>เพิ่ม</Button>
                        </Link>
                    </Col>
                </Row>
                <Tables
                    columns={columns}
                    dataSource={data}
                    setCurrentPage={'1'}
                    pageCurrent={'1'}
                    perPage={2}
                    totalPage={2}
                />
                <Modals
                    isModalVisible={isModalVisible}
                    onOk={modalData.onOk}
                    onCancel={handleCancel}
                    modalData={modalData}
                >
                    <p className="admin-truncate-text">{modalData.content}</p>
                </Modals>
            </Content>
        </>
    );
}
export default Home