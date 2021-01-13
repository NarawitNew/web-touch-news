import React, { useState } from "react";
import { Layout, Breadcrumb, Image, Row, Col, Select, Input, Button } from 'antd'

import Timeline from 'components/layout/timeline/index'

const { Content } = Layout
const { Option } = Select;
const { TextArea } = Input;

const View = (props) => {
    const [statusNews, setstatusNews] = useState('Submit'); //(Draft/Submit/Approve/Public)

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
                <div className="view-titel-news">ตร.ค้นโกดังย่านฉลองกรุง ยังไม่พบผิด เร่งเช็กภาพโต๊ะบาคาร่า ตัดต่อหรือไม่</div>
                <hr />
                <Row justify="center">
                    <Image
                        width={400}
                        src="https://www.thairath.co.th/media/dFQROr7oWzulq5Fa4VWesCxyzDRhGiTaaQHKKLE9G1eqrrp8gfV9rJEz93EgR5Xdmao.webp"
                    />
                </Row>
                <Row justify="center">
                    <Col span={10}>
                        <p >รองต๊ะ พล.ต.ต.ปิยะ ต๊ะวิชัย รอง ผบช.น. เผยภาพรวมการตั้งด่านตรวจคัดกรองโควิด-19 ตามแนวรอยต่อกทม.-ปริมณฑลเรียบร้อยดี ส่วนเรื่องค้นโกดังย่านฉลองกรุง เจอไพ่และโพยพนัน ยังไม่สามารถพิสูจน์ได้ว่าเป็นอุปกรณ์ที่ใช้ในการกระทำผิดตาม พ.ร.บ.การพนัน ทำให้ไม่มีมูลพอจะดำเนินคดีฐานพยายามทำลายหลักฐาน</p>
                    </Col>
                </Row>
                <Row>แฮกแทร็ก</Row>
                <Row>เครดิต</Row>
                <Row>ผู้ดูแล</Row>
                <hr />
                <Row>
                    <Col span={12}>
                        <h3>ไทม์ไลน์</h3>
                        <div style={{ width: "180px", marginTop: '20px' }}>
                            <Timeline></Timeline>
                        </div>
                    </Col>
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
                </Row>
                <Row justify="end" style={{ marginTop: '20px' }}>
                    <Button type="primary" ghost className="view-Button">บันทึก</Button>
                    <Button className="view-Button">ลบ</Button>
                    <Button className="view-Button">ยกเลิก</Button>
                </Row>
            </Content>
        </>
    );
}
export default View