import { AutoComplete, Breadcrumb, Button, Col, Form, Image, Input, Layout, Row, Select, Spin, Tooltip, Upload, message } from 'antd'
import React, { useContext, useEffect, useState } from "react"

import { Context } from '../../../context'
import FormData from 'form-data'
import { Froala } from 'components/layout/froala/index'
import { Link } from "react-router-dom";
import { PlusCircleOutlined } from '@ant-design/icons'
import Tag from 'components/layout/tag/index'
import config from 'config'
import { httpClient } from 'HttpClient'
import imgError from 'assets/image/img_error2.png'

const { Content } = Layout
const { Option } = Select

const CreateNews = (props) => {
    const params = props.match.params
    const context = useContext(Context)
    const [form] = Form.useForm()
    const [category, setCategory] = useState(null)
    const [credit, setCredit] = useState({ inputValue: '', tags: [] })
    const [hashtag, setHashtag] = useState({ inputValue: '', tags: [] })
    const [hashtagSource, setHashtagSource] = useState(null)
    const [image, setImage] = useState('error')
    const [spinningImage, setSpinningImage] = useState(false)
    const [newsContent, setNewsContent] = useState('')
    const [imageContent, setImageContent] = useState()
    const [cause, setCause] = useState('')
    useEffect(() => {
        getCategory()
        getHashtag()
        if (params.type === 'edit') {
            getData()
        }
    }, [props.location.pathname])

    const getData = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/news/info/' + params.id)
            .then(function (response) {
                const code = response.data.code
                const data = response.data.data
                const hashtag = response.data.data.hashtag
                const credit = response.data.data.credit
                if (code === 200) {
                    form.setFieldsValue({
                        topic: data.topic,
                        category: data.category,
                    })
                    setNewsContent(data.content)
                    setImage(data.image)
                    setCause(data.cause)
                    setCredit({
                        tags: credit,
                        inputValue: ''
                    })
                    setHashtag({
                        tags: hashtag,
                        inputValue: ''
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    const getCategory = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/category')
            .then(function (response) {
                const data = response.data.data.data_list
                const code = response.data.code
                if (code === 200) {
                    const dataMap = data.map((item) => {
                        item = <Option key={item.id} value={item.category}>{item.category}</Option>
                        return item
                    })
                    setCategory(dataMap)

                }
            })
            .catch(function (error) {
                console.log(error)
            })
    }

    const getHashtag = () => {
        httpClient.get(config.REACT_APP_BASEURL + '/news/hashtag')
            .then(function (response) {
                const code = response.data.code
                if (code === 200) {
                    const data = response.data?.data
                    const dataMap = data?.map((item) => {
                        item = { value: item }
                        return item
                    })
                    setHashtagSource(dataMap)
                } else {
                    console.log('map Error')
                }
            })
            .catch(function (error) {
                console.log(error)
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

    const submitCreate = async () => {
        try {
            const values = await form.validateFields();
            const setData = JSON.stringify({
                "category": values.category,
                "topic": values.topic,
                "content": newsContent,
                "image": image,
                "credit": credit.tags,
                "hashtag": hashtag.tags,
                "status": 'Draft',
            })
            httpClient.post(config.REACT_APP_BASEURL + '/news', setData)
                .then(function (response) {
                    const code = response.data.code
                    if (code === 201) {
                        message.success(response.data.message)
                        let setData = new FormData();
                        setData.append('url', image);
                        httpClient.post(config.REACT_APP_IMGAE + '/savefile', setData)
                            .then(function (response) {
                                console.log(response)
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                        if (imageContent !== undefined) {
                            imageContent.map((item) => {
                                let setData = new FormData();
                                setData.append('url', item);
                                httpClient.post(config.REACT_APP_IMGAE + '/savefile', setData)
                                    .then(function (response) {
                                        console.log(response)
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    })
                                return(item)
                            })
                        }
                        props.history.push(`/home/view/${response.data.data}`)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const submitEdit = async () => {
        try {
            const values = await form.validateFields();
            const setData = JSON.stringify({
                "category": values.category,
                "topic": values.topic,
                "content": newsContent,
                "image": image,
                "credit": credit.tags,
                "hashtag": hashtag.tags,
                "status": 'Draft',
                "by": context.user.firstname + ' ' + context.user.lastname
            })
            httpClient.put(config.REACT_APP_BASEURL + `/news/update/${params.id}`, setData)
                .then(function (response) {
                    const code = response.data.code
                    if (code === 200) {
                        message.success(response.data.message)
                        let setData = new FormData();
                        setData.append('url', image);
                        httpClient.post(config.REACT_APP_IMGAE + '/savefile', setData)
                            .then(function (response) {
                                console.log(response)
                            })
                            .catch(function (error) {
                                console.log(error)
                            })
                        if (imageContent !== undefined) {
                            imageContent.map((item) => {
                                let setData = new FormData();
                                setData.append('url', item);
                                httpClient.post(config.REACT_APP_IMGAE + '/savefile', setData)
                                    .then(function (response) {
                                        console.log(response)
                                    })
                                    .catch(function (error) {
                                        console.log(error)
                                    })
                                return(item)
                            })
                        }
                        props.history.push(`/home/view/${params.id}`)
                        console.log('params.id', params.id)
                    }
                })
                .catch(function (error) {
                    console.log(error)
                })
        } catch (errorInfo) {
            console.log('Failed:', errorInfo);
        }
    }

    const changeNewsContent = html => {
        console.log('html', html)
        console.log('imageContent', imageContent)
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
            inputValue: '',
        });
    }

    const hashtagChange = (inputValue) => {
        setHashtag({ ...hashtag, inputValue: inputValue });
    }

    const hashtagClose = removedTag => {
        const tags = hashtag.tags.filter(tag => tag !== removedTag);
        setHashtag({
            tags,
            inputValue: ''
        })
    }

    const hashtagConfirm = () => {
        let tags = [...hashtag.tags];
        tags.push(hashtag.inputValue)
        setHashtag({
            tags,
            inputValue: '',
        });
    }

    const onErrorImg = (e) => {
        e.target.src = imgError
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
                    layout="vertical"
                >
                    <Row>
                        <Col xs={24} sm={24} md={24} lg={24} xl={12} >
                            <Row gutter={[0, 0]} justify='center'>
                                <Col span={16}>
                                    <Spin spinning={spinningImage}>
                                        <Image
                                            width={'100%'}
                                            // height='50xp
                                            src={image}
                                            onError={onErrorImg}
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
                            <Row gutter={[8, 8]} align='middle' style={{ marginTop: '20px' }}>
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
                                    <Tooltip placement="bottom" title="เพิ่มเครติด">
                                        <PlusCircleOutlined className="create-icon" onClick={creditConfirm}></PlusCircleOutlined>
                                    </Tooltip>
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
                                    <Input.Group>
                                        <AutoComplete
                                        onPressEnter={hashtagConfirm}
                                            style={{ width: '100%', }}
                                            value={hashtag.inputValue}
                                            onChange={hashtagChange}
                                            options={hashtagSource}
                                            filterOption={(inputValue, option) =>
                                                option.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                                            }
                                        />
                                    </Input.Group>
                                </Col>
                                <Col span={2}>
                                    <Tooltip placement="bottom" title="เพิ่มแฮชแท็ก">
                                        <PlusCircleOutlined onClick={hashtagConfirm} className="create-icon"></PlusCircleOutlined>
                                    </Tooltip>
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
                            {params.type === 'edit' ?
                                <Row gutter={[8, 8]}>
                                    <Col style={{ textAlign: 'right' }} span={5}>
                                        <div>สิ่งที่ควรแก้ไข</div>
                                    </Col>
                                    <Col span={17}>
                                        <div style={{ color: 'red' }}>คำแนะนำจาก Super Admin</div>
                                        <div>{cause}</div>
                                    </Col>
                                </Row>
                                :
                                null
                            }
                        </Col>
                        <Col xs={{ span: 18, offset: 3 }} sm={{ span: 18, offset: 3 }} md={{ span: 18, offset: 3 }} lg={{ span: 18, offset: 3 }} xl={{ span: 12, offset: 0 }}>
                            <Form.Item
                                label="ประเภทข่าว"
                                name="category"
                                rules={[{ required: true, message: 'Please input your username!' }]}
                            >
                                <Select placeholder="เลือกประเภท">
                                    {category}
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
                                <Froala
                                    onModelChange={changeNewsContent}
                                    setImageContent={setImageContent}
                                    mode={newsContent}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row justify="end">
                        {params.type === 'create' ?
                            <Button className="create-button" type="primary" ghost onClick={submitCreate} >บันทึก</Button>
                            :
                            <Button className="create-button" type="primary" ghost onClick={submitEdit} >บันทึก</Button>
                        }
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