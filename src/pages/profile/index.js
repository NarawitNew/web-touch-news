import { Avatar, Breadcrumb, Button, Col, Form, Input, Layout, Row, Upload, message } from 'antd'
import { ExclamationCircleOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal'
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
  const [showInputPass, setShowInputPass] = useState(false)
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: '', okText: '' });

  useEffect(() => {
    getData()
  }, [params,])

  const getData = () => {
    httpClient.get(config.REACT_APP_BASEURL + '/user/' + params.id)
      .then(function (response) {
        // console.log('response', response)
        const code = response.data.code
        if (code === 200) {
          setImage(response.data.data.image)
          formValue.setFieldsValue({
            email: response.data.data.email,
            firstname: response.data.data.firstname,
            lastname: response.data.data.lastname,
            passwordNew: " ",
            passwordConfirm: " "
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
        httpClient.put(config.REACT_APP_BASEURL + '/admin/resetpassword/' + params.id)
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
                  offModal()
                },
                content: ({
                  email: response.data.data.email,
                  password: response.data.data.password
                }),
              })
              onModal()
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error('เปลี่ยนรหัสผ่านไม่สำเร็จ');
          })
      },
    })
    onModal()
  }

  const cancelUpdate = () =>{
    getData()
  }

  const submitUpdate = (value) => {
    console.log('value', value)
    if (showInputPass === true) {
      if (value.passwordNew === value.passwordConfirm) {
        const setData = JSON.stringify({
          "password": value.passwordNew
        })
        httpClient.put(config.REACT_APP_BASEURL + '/user/password/' + params.id, setData)
          .then(function (response) {
            console.log('response', response)
            message.success('เปลี่ยนรหัสผ่านสำเร็จ');
          })
          .catch(function (error) {
            message.error('เปลี่ยนรหัสผ่านไม่สำเร็จ');
          })
      } else {
        message.error('รหัสผ่านไม่ตรงกัน');
      }
    }
    else {
      const setData = JSON.stringify({
        "firstname": value.firstname,
        "lastname": value.lastname,
        "image": image
      })
      httpClient.put(config.REACT_APP_BASEURL + '/user/update/' + params.id, setData)
        .then(function (response) {
          message.success('สำเร็จ');
        })
        .catch(function (error) {
          message.error('ไม่สำเร็จ');
        })
    }
  }

  const ShowInputPassword = () => {
    if (showInputPass === false) {
      setShowInputPass(true);
    }
    else {
      setShowInputPass(false)
      formValue.setFieldsValue({
        passwordNew: " ",
        passwordConfirm: " "
      })
    }
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
              onFinish={submitUpdate}
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
                <Input disabled={true}></Input>
              </Form.Item>
              <Form.Item name="firstname" label='ชื่อ' {...layout}>
                <Input disabled={showInputPass}></Input>
              </Form.Item>
              <Form.Item name="lastname" label='นามสกุล' {...layout}>
                <Input disabled={showInputPass}></Input>
              </Form.Item>
              <Form.Item className="profile-Right">
                {params.state === 'manage' ?
                  <>
                    <a onClick={conFirmPassword}><u>เปลี่ยนรหัสผ่าน</u></a>
                  </>
                  :
                  <>
                    <a onClick={ShowInputPassword}><u>เปลี่ยนรหัสผ่าน</u></a>
                  </>
                }
              </Form.Item>
              {showInputPass === true ?
                <>
                  <Form.Item
                    name="passwordNew"
                    label='รหัสผ่านใหม่' {...layout}>
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="passwordConfirm"
                    label='ยืนยันรหัสผ่านใหม่' {...layout}>
                    <Input />
                  </Form.Item>
                </>
                :
                <>
                </>
              }
              <Form.Item className="profile-Right">
                <Button className="profile-button" type="primary" ghost htmlType="submit">บันทึก</Button>
                {params.state === 'manage' ?
                  <>
                    <Link to="/manage">
                      <Button className="profile-button" style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                    </Link>
                  </>
                  :
                  <>
                    <Button className="profile-button" onClick={cancelUpdate} style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                  </>
                }
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      <Modals
        isModalVisible={isModalVisible}
        onOk={modalData.onOk}
        onCancel={offModal}
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