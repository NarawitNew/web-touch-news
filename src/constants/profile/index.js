import React, { useState } from "react"
import { Link } from "react-router-dom";
import { Layout, Breadcrumb, Form, Row, Col, Avatar, Button, Input, Upload } from 'antd'
import { KeyOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import Modals from 'components/layout/modal/index'

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
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [Showpass, setShowpass] = useState(false)
  const [modalData, setmodalData] = useState({ type: '', icon: null, title: '', cancelButton: '', okButton: null, email: '', okText: '' });

  const onPasswdr = () => {
    console.log('pass')
    setShowpass(true)
  }

  const onNewPassword = () => {
    setmodalData({
      type: 'confirm',
      icon: <ExclamationCircleOutlined className="manage-Icon-edit" />,
      title: 'ยืนยันการสร้างรหัสผ่านใหม่',
      cancelButton: '',
      okButton: { backgroundColor: 'white', color: 'orange', borderColor: 'orange' },
      okText: 'ตกลง',
      email: 'คุณต้องการยืนยันการสร้างรหัสใหม่นี้หรือไม่ !!! ',
    })
    showModal()
  }

  const newPassword = () => {
    setmodalData({
      type: 'show',
      icon: <KeyOutlined className="manage-Icon-edit" />,
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
        {props.type === 'manage' ?
          <>
            <Breadcrumb.Item>{props.title}</Breadcrumb.Item>
            <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
          </>
          :
            <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
        }
      </Breadcrumb>
      <Content className="content-layout-background">
        <Row style={{ marginTop: '20px' }}>
          <Col span={12} offset={6}>
            <Form>
              <Form.Item className="profile-Center">
                <Avatar size={250} />
              </Form.Item>
              <Form.Item className="profile-Center">
                <Upload>
                  <Button>อัพโหลดรูปภาพโปรไฟล์</Button>
                </Upload>
              </Form.Item>
              <Form.Item label='อีเมล' {...layout}>
                <Input></Input>
              </Form.Item>
              <Form.Item label='ชื่อ' {...layout}>
                <Input></Input>
              </Form.Item>
              <Form.Item label='นามสกุล' {...layout}>
                <Input></Input>
              </Form.Item>
              <Form.Item className="profile-Right">
                {props.type === 'manage' ?
                  <>
                    <a onClick={onNewPassword}><u>เปลี่ยนรหัสผ่าน</u></a>
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
                {props.type === 'manage' ?
                  <>
                    <Button type="primary" ghost>บันทึก</Button>
                    <Link to="/manage">
                      <Button style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                    </Link>
                  </>
                  :
                  <>
                    <Button type="primary" ghost>บันทึก</Button>
                    <Button style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                  </>
                }
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Content>
      <Modals
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalData={modalData}
      ></Modals>
    </>
  );
}
export default Profile