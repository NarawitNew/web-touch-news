import { Avatar, Breadcrumb, Button, Col, Form, Input, Layout, Row, Upload } from 'antd'
import { ExclamationCircleOutlined, KeyOutlined } from '@ant-design/icons';
import React, { useState } from "react"

import { Link } from "react-router-dom";
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
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: '', okText: '' });

  const onPasswdr = () => {
    console.log('pass')
    setShowpass(true)
  }

  const onNewPassword = () => {
    setModalData({
      type: 'confirm',
      icon: <ExclamationCircleOutlined className="manage-icon-edit" />,
      title: 'ยืนยันการสร้างรหัสผ่านใหม่',
      okColor: 'orange',
      okText: 'ตกลง',
      content: 'คุณต้องการยืนยันการสร้างรหัสใหม่นี้หรือไม่ !!! '
    })
    showModal()
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
                    <Button className="profile-button" type="primary" ghost>บันทึก</Button>
                    <Link to="/manage">
                      <Button  className="profile-button" style={{ marginLeft: '10px' }}>ยกเลิก</Button>
                    </Link>
                  </>
                  :
                  <>
                    <Button  className="profile-button" type="primary" ghost>บันทึก</Button>
                    <Button  className="profile-button" style={{ marginLeft: '10px' }}>ยกเลิก</Button>
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
        onOk={handleOk}
        onCancel={handleCancel}
        modalData={modalData}
      >
          <p style={{ marginLeft: '80px' }}>{modalData.content}</p>
      </Modals>
    </>
  );
}
export default Profile