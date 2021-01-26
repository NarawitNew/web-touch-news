import { Breadcrumb, Button, Col, Form, Image, Input, Layout, Row, Select } from 'antd';
import React, {useState} from "react"

import FroalaEditor from 'components/layout/froala/index'
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from '@ant-design/icons';
import Tag from 'components/layout/tag/index'

const { Content } = Layout;
const { Option } = Select;

const CreateNews = (props) => {
    const params = props.match.params;
    const [credit, setCredit] = useState({ inputVisible: false, inputValue: '', tags: ['Tag 1', 'Tag 2', 'Tag 3'] })
    const [hashtag, setHashtag] = useState({ inputVisible: false, inputValue: '', tags: ['Tag 1', 'Tag 2', 'Tag 3'] })

    const creditChange = (e) => {
        setCredit({ ...credit, inputValue: e.target.value });
    };
    const creditClose = removedTag => {
        const tags = credit.tags.filter(tag => tag !== removedTag);
        setCredit({ tags })
    }
    const creditConfirm = (e) => {
        let tags = [...credit.tags];
        tags.push(credit.inputValue)
        setCredit({
            tags,
            inputVisible: false,
            inputValue: '',
        });
    }
    const hashtagChange = (e) => {
        setHashtag({ ...hashtag, inputValue: e.target.value });
    };
    const hashtagClose = removedTag => {
        const tags = hashtag.tags.filter(tag => tag !== removedTag);
        setHashtag({ tags })
    }
    const hashtagConfirm = (e) => {
        let tags = [...hashtag.tags];
        tags.push(hashtag.inputValue)
        setHashtag({
            tags,
            inputVisible: false,
            inputValue: '',
        });

    }
    return (
        <>
            {params.type === "create" ?
                <Breadcrumb style={{ margin: '4px 0' }}>
                    <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่ม</Breadcrumb.Item>
                </Breadcrumb>
                :
                <Breadcrumb style={{ margin: '4px 0' }}>
                    <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไข</Breadcrumb.Item>
                </Breadcrumb>
            }
            <Content className="create-content">
                <Row>
                    <Col span={12} >
                        <Row gutter={[0, 0]} justify='center'>
                            <Col>
                                <Image width={300} height={300} ></Image>
                            </Col>
                        </Row>
                        <Row gutter={[0, 0]} justify='center'>
                            <Col>
                                <div style={{ color: '#A0A0A0' }}>อัตราส่วนภาพ 1:1 ขนาด 1080x1080 px</div>
                            </Col>
                        </Row>
                        <Row gutter={[0, 16]} justify='center'>
                            <Col>
                                <Button>รูปภาพ</Button>
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]} align='middle'>
                            <Col style={{ textAlign: 'right' }} span={5}>
                                <div>เครติด</div>
                            </Col>
                            <Col span={16}>
                                <Input
                                    value={credit.inputValue}
                                    onChange={creditChange}
                                    // onBlur={handleTagConfirm}
                                    onPressEnter={creditConfirm}
                                />
                            </Col>
                            <Col span={2}>
                                <PlusCircleOutlined className="create-icon"></PlusCircleOutlined>
                            </Col>
                        </Row>
                        <Row gutter={[8, 16]} align='middle'>
                            <Col offset={5}>
                                <Tag
                                    data={credit.tags}
                                    onClose={creditClose}
                                />
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]} align='middle'>
                            <Col style={{ textAlign: 'right' }} span={5}>
                                <div>แฮชแท็ก</div>
                            </Col>
                            <Col span={16}>
                            <Input
                                    value={credit.inputValue}
                                    onChange={hashtagChange}
                                    // onBlur={handleTagConfirm}
                                    onPressEnter={hashtagConfirm}
                                />
                            </Col>
                            <Col span={2}>
                                <PlusCircleOutlined className="create-icon"></PlusCircleOutlined>
                            </Col>
                        </Row>
                        <Row gutter={[8, 16]} align='middle'>
                            <Col offset={5}>
                                <Tag
                                    data={hashtag.tags}
                                    onClose={hashtagClose} 
                                />
                            </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                            <Col style={{ textAlign: 'right' }} span={5}>
                                <div>สิ่งที่ควรแก้ไข</div>
                            </Col>
                            <Col span={17}>
                                <div style={{ color: 'red' }}>คำแนะนำจาก Super Admin</div>
                                <div>ข่าว-----</div>
                            </Col>
                        </Row>
                    </Col>
                    <Col span={12}>
                        <Form>
                            <Form.Item
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <div>ประเภทข่าว</div>
                                <Select>
                                    <Option value="male">male</Option>
                                    <Option value="female">female</Option>
                                    <Option value="other">other</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                rules={[{ required: true, message: 'กรุณาใส่ข้อมูล' }]}
                            >
                                <div>หัวเรื่อง</div>
                                <Input></Input>
                            </Form.Item>
                            <Form.Item>
                                <div>เนื้อหาขาว</div>
                                <FroalaEditor></FroalaEditor>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
                <Row justify="end">
                    <Button className="create-button" type="primary" ghost htmlType='submit'>บันทึก</Button>
                    <Link to="/home">
                        <Button className="create-button">ยกเลิก</Button>
                    </Link>
                </Row>
            </Content>
        </>
    );
}
export default CreateNews