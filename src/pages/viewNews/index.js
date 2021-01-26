import { Breadcrumb, Button, Col, Dropdown, Image, Input, Layout, Menu, Row, Select } from 'antd'
import { DeleteOutlined, FieldTimeOutlined, MoreOutlined } from '@ant-design/icons';
import React, { useState } from "react";

import Modals from 'components/layout/modal'
import Timeline from 'components/layout/timeline'

const { Content } = Layout
const { Option } = Select;
const { TextArea } = Input;
const type = localStorage.getItem('type')

const dataNews = {
    id: '1',
    admin: 'narawit',
    topic: 'ตร.ค้นโกดังย่านฉลองกรุง ยังไม่พบผิด เร่งเช็กภาพโต๊ะบาคาร่า ตัดต่อหรือไม่',
    state: 'Submit',
    image: 'https://www.thairath.co.th/media/dFQROr7oWzulq5Fa4VWesCxyzDRhGiTaaQHKKLE9G1eqrrp8gfV9rJEz93EgR5Xdmao.webp',
    content: 'รองต๊ะ พล.ต.ต.ปิยะ ต๊ะวิชัย รอง ผบช.น. เผยภาพรวมการตั้งด่านตรวจคัดกรองโควิด-19 ตามแนวรอยต่อกทม.-ปริมณฑลเรียบร้อยดี ส่วนเรื่องค้นโกดังย่านฉลองกรุง เจอไพ่และโพยพนัน ยังไม่สามารถพิสูจน์ได้ว่าเป็นอุปกรณ์ที่ใช้ในการกระทำผิดตาม พ.ร.บ.การพนัน ทำให้ไม่มีมูลพอจะดำเนินคดีฐานพยายามทำลายหลักฐาน',
    track: '#โควิค 19',
    credit: 'https://www.thairath.co.th/news/local/central/1998611',
    timeline: ''
};


const View = (props) => {
    const [statusNews, setstatusNews] = useState(dataNews.state); //(Draft/Submit/Approve/Public)
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [modalData, setmodalData] = useState({ type: '', icon: null, title: '', cancelButton: '', okButton: null, email: null, okText: '' });

    const menu = () => {
        return (
            <Menu>
                <Menu.Item >
                    <FieldTimeOutlined style={{ color: '#6AC9FF' }}></FieldTimeOutlined>
              ไทม์ไลน์
          </Menu.Item>
                <Menu.Item >
                    <DeleteOutlined style={{ color: 'red' }}></DeleteOutlined>
              ลบ
          </Menu.Item>
            </Menu>
        );

    }

    const onDelete = () => {
        setmodalData({
            type: 'confirm',
            icon: <DeleteOutlined className="manage-Icon-delete" />,
            title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
            cancelButton: '',
            okButton: { backgroundColor: 'white', color: 'red', borderColor: 'red' },
            okText: 'ลบ',
            email: dataNews.topic,
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
                        <p >{dataNews.content}</p>
                    </Col>
                </Row>
                <Row>แฮกแทร็ก : {dataNews.track}</Row>
                <Row>เครดิต : {dataNews.credit}</Row>
                <Row>ผู้ดูแล : {dataNews.admin}</Row>
                <hr />
                <Row>
                    <Col span={12}>
                        <h3>ไทม์ไลน์</h3>
                        <div style={{ width: "180px", marginTop: '20px' }}>
                            <Timeline></Timeline>
                        </div>
                    </Col>
                    {type === 'super' ?
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
                {type === 'super' ?
                    <Row justify="end" style={{ marginTop: '20px' }}>
                        <Button type="primary" ghost className="view-Button">บันทึก</Button>
                        <Button className="view-Button" onClick={onDelete} danger>ลบ</Button>
                        <Button className="view-Button">ยกเลิก</Button>
                    </Row>
                    : <></>
                }
                <Modals
                    isModalVisible={isModalVisible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    modalData={modalData}
                />
            </Content>
        </>
    );
}
export default View