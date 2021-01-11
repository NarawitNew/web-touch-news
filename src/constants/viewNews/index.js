import { Layout, Breadcrumb, Image, Row, Col, Select, Input, Avatar, Button, Upload } from 'antd'

const { Content } = Layout
const { Option } = Select;

const View = (props) => {
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
                <Row>ดูแล</Row>
                <hr />
                <Row>
                    <Col span={12}>
                        <div>ไทม์ไลน์</div>
                        <p>!</p>
                        <p>!</p>
                        <p>!</p>
                        <p>!</p>
                        <p>!</p>
                        <p>!</p>
                    </Col>
                    <Col span={12}>
                        <div>เปลี่ยนสถานะข่าว</div>
                        <Input.Group >
                            สถานะ :
                            <Select defaultValue="1" className="view-Button">
                                <Option value="1">ส่ง</Option>
                                <Option value="2">ร่าง</Option>
                            </Select>
                        </Input.Group>
                    </Col>
                </Row>
                <Row justify="end">
                    <Button type="primary" ghost className="view-Button">บันทึก</Button>
                    <Button className="view-Button">ลบ</Button>
                    <Button className="view-Button">ยกเลิก</Button>
                </Row>
            </Content>
        </>
    );
}
export default View