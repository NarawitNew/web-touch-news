import { Breadcrumb, Button, Col, Form, Image, Input, Layout, Row, Select } from 'antd';
import React, { useState } from "react"

import FroalaEditor from 'components/layout/froala/index'
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from '@ant-design/icons';
import Tag from 'components/layout/tag/index'

const { Content } = Layout;
const { Option } = Select;

const CreateNews = (props) => {
    const params = props.match.params;
    const [form] = Form.useForm();
    const [credit, setCredit] = useState({ inputVisible: false, inputValue: '', tags: [] })
    const [hashtag, setHashtag] = useState({ inputVisible: false, inputValue: '', tags: [] })
    const [newsContent, setNewsContent] = useState('')

    const newsContentChange = html => {
        setNewsContent(html)
    }
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

    const onFinish = (values) => {
        console.log('Success:', values);
        console.log('newsContent', newsContent)
        console.log('credit', credit)
        console.log('hashtag', hashtag)
    };

    const onCheck = async () => {
        try {
            const values = await form.validateFields();
            console.log('Success:', values);
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    };

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
                <Form
                    form={form}
                    // name="dynamic_rule"
                    // onFinish={onFinish}
                    layout="vertical"
                >
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
                                    <PlusCircleOutlined className="create-icon" onClick={creditConfirm}></PlusCircleOutlined>
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
                                        value={hashtag.inputValue}
                                        onChange={hashtagChange}
                                        // onBlur={handleTagConfirm}
                                        onPressEnter={hashtagConfirm}

                                    />
                                </Col>
                                <Col span={2}>
                                    <PlusCircleOutlined onClick={hashtagConfirm} className="create-icon"></PlusCircleOutlined>
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

                            <Form.Item
                                label="ประเภทข่าว"
                                name="category"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Select placeholder="เลือกประเภท">
                                    <Option value="1">ไอที</Option>
                                    <Option value="2">ท่องเที่ยว</Option>
                                    <Option value="3">อาหาร</Option>
                                    <Option value="4">สุขภาพ</Option>
                                    <Option value="5">อุบัติเหตุ</Option>
                                    <Option value="6">กิจกรรม</Option>
                                    <Option value="7">ทั่วไป</Option>
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="หัวเรื่อง"
                                name="heading"
                                rules={[{ required: true, message: 'กรุณาใส่ข้อมูล' }]}
                            >
                                <Input></Input>
                            </Form.Item>
                            <Form.Item
                                label="เนื้อหาข่าว"
                            >
                                <FroalaEditor
                                    onModelChange={newsContentChange}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Button className="create-button" type="primary" ghost onClick={onCheck} >บันทึก</Button>
                        <Link to="/home">
                            <Button className="create-button">ยกเลิก</Button>
                        </Link>
                    </Row>
                </Form>
            </Content>
        </>
    );
}
export default CreateNews