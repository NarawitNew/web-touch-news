import { Breadcrumb, Button, Col, Form, Image, Input, Layout, Row, Select, Upload, Spin, message } from 'antd'
import React, { useState, useEffect, useContext } from "react"

import FroalaEditor from 'components/layout/froala/index'
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from '@ant-design/icons'
import Tag from 'components/layout/tag/index'
import config from 'config'
import { httpClient } from 'HttpClient'
import { Context } from '../../../context'
import axios from 'axios'
import FormData from 'form-data'


const { Content } = Layout
const { Option } = Select

const CreateNews = (props) => {
    const params = props.match.params
    const context = useContext(Context)
    const [form] = Form.useForm()
    // const [formValue] = Form.useForm();
    const [category, setCategory] = useState(null)
    const [credit, setCredit] = useState({ inputVisible: false, inputValue: '', tags: [] })
    const [hashtag, setHashtag] = useState({ inputVisible: false, inputValue: '', tags: [] })
    const [image, setImage] = useState('error')
    const [spinningImage, setSpinningImage] = useState(false)
    const [newsContent, setNewsContent] = useState('')

    useEffect(() => {
        getCategory()
        if(params.type === 'edit'){
            getData()
        }
    }, [props.location.pathname])

    const getCategory = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/category')
            .then(function (response) {
                const data = response.data.data.data_list
                const code = response.data.code
                if (code === 200) {
                    const dataMap = data.map((item) => {
                        item = item.category
                        return item
                    })
                    setCategory(dataMap)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const getData = () =>{
        console.log('getDat',params.id)
        form.setFieldsValue({
            topic: params.id,
          })
    }

    const uploadImage = (option) => {
        // console.log('file.originFileObj', file.originFileObj)
        setSpinningImage(true)
        let setData = new FormData();
        setData.append('sampleFile', option.file);
        setData.append('save', false)
        httpClient.post(config.REACT_APP_IMGAE + '/upload', setData)
            .then(function (response) {
                console.log('response', response)
                const status = response.status
                const data = response.data
                if (status === 200) {
                    setImage(data.url)
                    setSpinningImage(false)
                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const onFinish = async () => {
        try {
            const values = await form.validateFields();
            const setData = JSON.stringify({
                "category": values.category,
                "topic": values.topic,
                "content": newsContent,
                "image": image,
                "cerdit": "เครติด 1",
                "hashtag": "แฮชแท็ก 1",
                "status": "ส่ง",
                "by": context.user.firstname + " " + context.user.lastname
            })
            httpClient.post(config.REACT_APP_BASEURL + '/news', setData)
                .then(function (response) {
                    const code = response.data.code
                    if (code === 201) {
                        message.success(response.data.message)
                        let setData = new FormData();
                        setData.append('url', image);
                        axios.post(config.REACT_APP_IMGAE + '/savefile', setData)
                            .then(function (response) {
                                console.log(response)
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                    }
                })
                .catch(function (error) {
                })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const changeNewsContent = html => {
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
                                    <Spin spinning={spinningImage}>
                                        <Image
                                            width={300}
                                            height={300}
                                            src={image}
                                        />
                                    </Spin>
                                </Col>
                            </Row>
                            <Row gutter={[0, 0]} justify='center'>
                                <Col>
                                    <div style={{ color: '#A0A0A0' }}>อัตราส่วนภาพ 1:1 ขนาด 1080x1080 px</div>
                                </Col>
                            </Row>
                            <Row gutter={[0, 16]} justify='center'>
                                <Col>
                                    <Upload
                                        listType="picture"
                                        customRequest={uploadImage}
                                        showUploadList={false}
                                    >
                                        <Button>อัพโหลดรูปภาพ</Button>
                                    </Upload>
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
                                    {category !== null ? category.map((category) =>
                                        <Option key={category} value={category}>{category}</Option>) : null}
                                    {/* {category.map((category) =>
                                        <Option >{category.data.data}</Option>  
                                    )} */}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                label="หัวเรื่อง"
                                name="topic"
                                rules={[{ required: true, message: 'กรุณาใส่ข้อมูล' }]}
                            >
                                <Input></Input>
                            </Form.Item>
                            <Form.Item
                                label="เนื้อหาข่าว"
                            >
                                <FroalaEditor
                                    onModelChange={changeNewsContent}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end">
                        <Button className="create-button" type="primary" ghost onClick={onFinish} >บันทึก</Button>
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