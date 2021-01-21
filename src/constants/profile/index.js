import { Avatar, Breadcrumb, Button, Col, Form, Input, Layout, Row, Upload, message } from 'antd'
import { ExclamationCircleOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal/index'
import config from 'config'
import { httpClient } from 'HttpClient'

const { Content } = Layout
const layout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 20,
  },
};

const Profile = (props) => {
  const [formValue] = Form.useForm();
  const params = props.match.params;
  const [image, setImage] = useState('')
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Showpass, setShowpass] = useState(false)
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: '', okText: '' });

  useEffect(() => {
    getData()
  })

  const getData = () => {
    httpClient.get(config.manageURL + '/admin/data/' + params.id)
      .then(function (response) {
        // console.log('response', response)
        const code = response.data.code
        if (code === 200) {
          setImage(response.data.data.image)
          formValue.setFieldsValue({
            email: response.data.data.email,
            firstname: response.data.data.firstname,
            lastname: response.data.data.lastname,
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const handleChange = (fileList) => {
    console.log('fileList', fileList)
    setImage(fileList.fileList[0].thumbUrl)
  };

  const conFirmPassword = () => {
    setModalData({
      type: 'confirm',
      icon: <ExclamationCircleOutlined className="manage-icon-edit" />,
      title: 'ยืนยันการสร้างรหัสผ่านใหม่',
      okColor: 'orange',
      okText: 'ตกลง',
      content: 'คุณต้องการยืนยันการสร้างรหัสใหม่นี้หรือไม่ !!! ',
      onOk() {
        // setIsModalVisible(false)
        httpClient.put(config.manageURL + '/admin/resetpassword/' + params.id)
          .then(function (response) {
            const code = response.data.code
            if (code === 201) {
              setModalData({
                type: 'show',
                icon: <UserOutlined className="manage-icon-insert" />,
                title: 'เปลี่ยนรหัสผ่านสำเร็จ',
                okColor: '#216258',
                okText: 'ตกลง',
                onOk() {
                  setIsModalVisible(false)
                },
                content: ({
                  email: response.data.data.email,
                  password: response.data.data.password
                }),
              })
              showModal()
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error('เปลี่ยนรหัสผ่านไม่สำเร็จ');
          })
      },
    })
    showModal()
  }

  const upData = (value) => {
    console.log('value', value)
    const setData = 
      `{
        "firstname":"${value.firstname}",
        "lastname":"${value.lastname}",
        "image":"${image}"
      }`
    
    httpClient.put(config.manageURL + '/admin/update/' + params.id,setData)
      .then(function (response) {
        message.success('สำเร็จ');
      })
      .catch(function (error) {
        message.error('ไม่สำเร็จ');
      })
  }

  const onPasswdr = () => {
    console.log('pass')
    setShowpass(true)
  }
  const newPassword = () => {
    setModalData({
      type: 'show',
      icon: <KeyOutlined className="manage-icon-edit" />,
      cancelButton: 'none',
      okButton: { backgroundColor: 'white', color: '#216258', borderColor: '#216258' },
      title: 'เพิ่มผู้ดูแลระบบใหม่',
      okText: 'ตกลง',
      email: 'asdfghjkl;'
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

  return (
    <>
      <Breadcrumb style={{ margin: '4px 0' }}>
        {params.state === 'manage' ?
          <>
            <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
            <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
          </>
          :
          <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
        }
      </Breadcrumb>
      <Content className="content-layout-background">
        <Row style={{ marginTop: '20px' }}>
          <Col span={12} offset={6}>
            <Form
              form={formValue}
              onFinish={upData}
            >
              <Form.Item className="profile-Center">
                <Avatar size={250} src={image} />
              </Form.Item>
              <Form.Item className="profile-Center">
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture"
                  maxCount={1}
                  onChange={handleChange}

                >
                  <Button>อัพโหลดรูปภาพโปรไฟล์</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="email" label='อีเมล' {...layout}>
                <Input disabled></Input>
              </Form.Item>
              <Form.Item name="firstname" label='ชื่อ' {...layout}>
                <Input ></Input>
              </Form.Item>
              <Form.Item name="lastname" label='นามสกุล' {...layout}>
                <Input ></Input>
              </Form.Item>
              <Form.Item className="profile-Right">
                {params.state === 'manage' ?
                  <>
                    <a onClick={conFirmPassword}><u>เปลี่ยนรหัสผ่าน</u></a>
                  </>
                  :
                  <>
                    <a onClick={onPasswdr}><u>เปลี่ยนรหัสผ่าน</u></a>
                  </>
                }
              </Form.Item>
              {Showpass === true ?
                <>
                  <Form.Item label='รหัสผ่านใหม่' {...layout}>
                    <Input></Input>
                  </Form.Item>
                  <Form.Item label='ยืนยันรหัสผ่านใหม่' {...layout}>
                    <Input></Input>
                  </Form.Item>
                </>
                :
                <>
                </>
              }
              <Form.Item className="profile-Right">
                {params.state === 'manage' ?
                  <>
                    <Button className="profile-button" type="primary" ghost htmlType="submit">บันทึก</Button>
                    <Link to="/manage">
                      <Button className="profile-button" style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                    </Link>
                  </>
                  :
                  <>
                    <Button className="profile-button" type="primary" ghost>บันทึก</Button>
                    <Button className="profile-button" style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                  </>
                }
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      {/* <Modals
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalData={modalData}
      ></Modals> */}

      <Modals
        isModalVisible={isModalVisible}
        onOk={modalData.onOk}
        onCancel={handleCancel}
        modalData={modalData}
      >
        {modalData.type === 'show' ?
          <>
            <div style={{ marginLeft: '80px' }}>อีเมล : {modalData.content.email}</div>
            <div style={{ marginLeft: '80px' }}>รหัสผ่าน {modalData.content.password}</div>
            <div style={{ marginLeft: '40px', marginTop: '20px', color: 'red' }}>*ระบบจะแสดงข้อมูลเพียงครั้งเดียว*</div>
          </>
          :
          <p style={{ marginLeft: '80px' }}>{modalData.content}</p>
        }
      </Modals>
    </>
  );
}
export default Profile