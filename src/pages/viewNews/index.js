import { Breadcrumb, Button, Col, Dropdown, Image, Input, Layout, Menu, Row, Select, message } from 'antd'
import { DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";

import { FroalaView } from 'components/layout/froala/index'
import { Link } from "react-router-dom";
import Modals from 'components/layout/modal'
import Timeline from 'components/layout/timeline'
import config from 'config'
import { httpClient } from 'HttpClient'

const { Content } = Layout
const { Option } = Select;
const { TextArea } = Input;

const View = (props) => {
    const params = props.match.params;
    const type = localStorage.getItem('role')
    const [dataNews, setDataNews] = useState({})
    const [statusNews, setstatusNews] = useState(dataNews.state); //(Draft/Submit/Approve/Public)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: null, okText: '' });

    useEffect(() => {
        getData()
    }, [params,])

    const getData = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/news/data/' + params.id)
            .then(function (response) {
                console.log('response', response)
                const code = response.data.code
                if (code === 200) {
                    setDataNews(response.data.data)
                    console.log('data', response.data.data)
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
    const menu = () => {
        return (
            <Menu>
                <Menu.Item >
                    <Link to={`/home/edit/${params.id}`}>
                        <EditOutlined style={{ color: 'orange' }}></EditOutlined>
                        แก้ไข
                    </Link>
                </Menu.Item>
                <Menu.Item
                    onClick={() => { onDelete() }}
                >
                    <DeleteOutlined style={{ color: 'red' }} ></DeleteOutlined>
                    ลบ
                </Menu.Item>
            </Menu>
        );

    }

    const onDelete = () => {
        setModalData({
            type: 'confirm',
            icon: <DeleteOutlined className="manage-icon-delete" />,
            title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
            okColor: 'red',
            okText: 'ลบ',
            onOk() {
                offModal()
                httpClient.delete(config.REACT_APP_BASEURL + '/news/' + params.id)
                    .then(function (response) {
                        const code = response.data.code
                        if (code === 200) {
                            message.success(response.data.message);
                            props.history.push("/home")
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        message.error(error.data.message);
                    })
            },
            content: dataNews.topic,
        })
        onModal()
    }
    const onModal = () => {
        setIsModalVisible(true)
    };

    const offModal = () => {
        setIsModalVisible(false)
    };

    const onStatusNews = (value) => {
        setstatusNews(value)
    }
    return (
        <>
            <Breadcrumb style={{ margin: '4px 0' }}>
                <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
                <Breadcrumb.Item>ข่าว</Breadcrumb.Item>
            </Breadcrumb>
            <Content className="view-Content">
                <Row align="middle">
                    <Col flex='auto'>
                        <div className="view-titel-news">{dataNews.topic}</div>
                    </Col>
                    {type === 'admin' ?
                        <Col flex='10px'>
                            <Dropdown placement="bottomRight" overlay={menu()}><MoreOutlined style={{ fontSize: '20px' }} /></Dropdown>
                        </Col>
                        : <></>
                    }
                </Row>
                <hr />
                <Row justify="center">
                    <Image
                        style={{ padding: '20px' }}
                        width={400}
                        src={dataNews.image}
                    />
                </Row>
                <Row justify="center">
                    <Col span={10}>
                        <FroalaView
                            model={dataNews.content}
                        />

                        {/* <p >{dataNews.content}</p> */}


                    </Col>
                </Row>
                <Row>แฮกแทร็ก : {dataNews.hashtag}  </Row>
                <Row>เครดิต : {dataNews.credit}</Row>
                <Row>ผู้ดูแล : {dataNews.by}</Row>
                <hr />
                <Row>
                    <Col span={12}>
                        <h3>ไทม์ไลน์</h3>
                        <div style={{ width: "180px", marginTop: '20px' }}>
                            <Timeline></Timeline>
                        </div>
                    </Col>
                    {type === 'Superadmin' ?
                        <Col span={12} >
                            <h3>เปลี่ยนสถานะข่าว</h3>
                            <Row style={{ marginTop: '20px' }}>
                                <Col span={4} >
                                    สถานะ :
                            </Col>
                                <Col span={20}>
                                    <Input.Group>
                                        <Select defaultValue={statusNews} onChange={onStatusNews} className="view-Input-Group">
                                            <Option value="Submit">ส่ง</Option>
                                            <Option value="Draft">ร่าง</Option>
                                            <Option value="Approve">อนุมัติ</Option>
                                            <Option value="Public">สาธารณะ</Option>
                                        </Select>
                                    </Input.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20} offset={4}>
                                    {statusNews === 'Draft' ?
                                        <><div className="view-Input-TextArea">
                                            <div style={{ color: 'red' }}>*กรุณากรอกสิ่งที่ต้องแก้ไข</div>
                                            <TextArea rows={1} />

                                        </div>
                                        </>
                                        : <></>
                                    }
                                </Col>

                            </Row>
                        </Col>
                        : <></>
                    }
                </Row>
                {type === 'Superadmin' ?
                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Button type="primary" ghost className="view-Button">บันทึก</Button>
                        <Button className="view-Button" onClick={onDelete} danger>ลบ</Button>
                        <Button className="view-Button">ยกเลิก</Button>
                    </Row>
                    : <></>
                }
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
export default View