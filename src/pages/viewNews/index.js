import { Breadcrumb, Button, Col, Dropdown, Image, Input, Layout, Menu, Row, Select, Tag, message } from 'antd'
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
    const [statusNews, setStatusNews] = useState();
    const [cause, setCause] = useState('')
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: null, okText: '' });

    useEffect(() => {
        getData()
    }, [params,])

    const getData = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/news/data/' + params.id)
            .then(function (response) {
                const code = response.data.code
                const data = response.data.data
                const hashtag = response.data.data.hashtag
                const credit = response.data.data.credit
                if (code === 200) {
                    const hashtagMap = hashtag.map((hashtag, key) => {
                        hashtag = <Tag key={key} color="#87d068">{hashtag}</Tag>
                        return hashtag
                    })
                    const creditMap = credit.map((credit, key) => {
                        credit = <Tag key={key} color="#108ee9">{credit}</Tag>
                        return credit
                    })
                    setDataNews({ ...data, hashtag: hashtagMap, credit: creditMap })
                    setStatusNews(data.status)
                    setCause(data.cause)
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

    const onStatusNews = (value) => {
        setStatusNews(value)
        console.log('value', value)
    }

    const changeCause = ({ target: { value } }) => {
        setCause(value)
        console.log('value', cause)
    }

    const onFinish = () =>{
        const setData = JSON.stringify({
            "status": statusNews,
            "cause": cause,
        })
        httpClient.put(config.REACT_APP_BASEURL + '/news/update_status/'+ params.id , setData)
            .then(function (response) {
                const code = response.data.code
                if (code === 201) {
                    message.success(response.data.message);
                }else{
                    message.success(response.data.message);
                }
            })
            .catch(function (error) {
                console.log(error);
            })
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
                        width={800}
                        src={dataNews.image}
                    />
                </Row>
                <Row justify="center">
                    <Col span={10}>
                        <FroalaView
                            model={dataNews.content}
                        />
                    </Col>
                </Row>
                <Row gutter={[0, 10]} >
                    <Col flex="60px">แฮชแท็ก</Col>
                    <Col>{dataNews.hashtag}</Col>
                </Row>
                <Row gutter={[0, 10]} >
                    <Col flex="60px">เครดิต</Col>
                    <Col>{dataNews.credit}</Col>
                </Row>

                <Row gutter={[0, 10]}>
                    <Col flex="60px">ผู้ดูแล : </Col>
                    <Col>{dataNews.by}</Col>
                </Row>
                <hr />
                <Row>
                    <Col span={12}>
                        <h3>ไทม์ไลน์</h3>
                        <div style={{ width: "400px", marginTop: '20px' }}>
                            <Timeline idNews={params.id}></Timeline>
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
                                        <Select placeholder={statusNews} onChange={onStatusNews} className="view-Input-Group">
                                            <Option value="ส่ง">ส่ง</Option>
                                            <Option value="แก้ไข">แก้ไข</Option>
                                            <Option value="อนุมัติ">อนุมัติ</Option>
                                            <Option value="สาธารณะ">สาธารณะ</Option>
                                        </Select>
                                    </Input.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={20} offset={4}>
                                    {statusNews === 'แก้ไข' ?
                                        <div className="view-Input-TextArea">
                                            <div style={{ color: 'red' }}>*กรุณากรอกสิ่งที่ต้องแก้ไข</div>
                                            <TextArea  value={cause} autoSize={{ minRows: 1, maxRows: 5 }} onChange={changeCause} />
                                        </div>
                                        : null
                                    }
                                </Col>
                            </Row>
                        </Col>
                        : null
                    }
                </Row>
                {type === 'Superadmin' ?
                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Button type="primary" ghost className="view-Button" onClick={onFinish} >บันทึก</Button>
                        <Button className="view-Button" onClick={onDelete} danger>ลบ</Button>
                    <Link to="/home">
                        <Button className="view-Button">ยกเลิก</Button>
                        </Link>
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