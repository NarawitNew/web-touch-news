import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Breadcrumb, Row, Col, Input, Select, Dropdown, Menu } from 'antd';
import { UnorderedListOutlined, TeamOutlined, SendOutlined, MoreOutlined, DeleteOutlined, FieldTimeOutlined } from '@ant-design/icons';

import Tables from 'components/layout/table/index'
import Modals from 'components/layout/modal/index'
import Timeline from 'components/layout/timeline/index'


const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;


const data = [{
  date: '07/01/2021',
  topic: 'ตร.ค้นโกดังย่านฉลองกรุง ยังไม่พบผิด เร่งเช็กภาพโต๊ะบาคาร่า ตัดต่อหรือไม่',
  admin: 'new',
  category: 'การเมือง',
  status: 'ส่ง',
}
];



const Home = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setmodalData] = useState({ type: '', icon: null, title: '', cancelButton: '', okButton: null, email: null, okText: '' });

  const onTimeline = (value) => {
    setmodalData({
      type: '',
      icon: <FieldTimeOutlined className="manage-Icon-insert" />,
      cancelButton: 'none',
      okButton: { backgroundColor: 'white', color: '#216258', borderColor: '#216258' },
      title: 'ไทม์ไลน์',
      okText: 'ตกลง',
      email: <div style={{width:'180px'}}><Timeline/></div>
    })
    showModal()
  }

  const onDelete = () => {
    setmodalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-Icon-delete" />,
      title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
      cancelButton: '',
      okButton: { backgroundColor: 'white', color: 'red', borderColor: 'red' },
      okText: 'ลบ',
      email: '',
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

  const menu = () => {
    return (
      <Menu>
        <Menu.Item onClick={onTimeline}>
          <FieldTimeOutlined style={{ color: '#6AC9FF' }}></FieldTimeOutlined>
          ไทม์ไลน์
      </Menu.Item>
        <Menu.Item onClick={onDelete}>
          <DeleteOutlined style={{ color: 'red' }}></DeleteOutlined>
          ลบ
      </Menu.Item>
      </Menu>
    );

  }

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'หัวข้อ',
      // dataIndex: 'topic',
      key: 'topic',
      render: (text, record) => (<Link to="/home/view" style={{color:'#000'}}>{record.topic}</Link>),
    },
    {
      title: 'ผู้ดูแลระบบ',
      dataIndex: 'admin',
      key: 'admin',
    },
    {
      title: 'ประเภท',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '',
      width: '5%',
      key: 'action',
      render: (text, record) => (<Dropdown placement="bottomRight" overlay={menu}><MoreOutlined /></Dropdown>),
    }
  ];
  return (
    <>
      <Breadcrumb style={{ margin: '4px 0' }}>
        <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="home-Content">
        <Row style={{ height: '160px' }} >
          <Col span={8} >
            <div className="home-Box-Left">
              <Row align="middle" style={{ height: '100%' }}>
                <Col span={8} offset={4}>
                  <UnorderedListOutlined className="home-Icon" />
                </Col>
                <Col span={8}>
                  <p className="home-Number">6</p>
                  <p className="home-Text">ข่าวทั้งหมด</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8} >
            <div className="home-Box-Center" >
              <Row align="middle" style={{ height: '100%' }}>
                <Col span={8} offset={4}>
                  <TeamOutlined className="home-Icon" />
                </Col>
                <Col span={8}>
                  <p className="home-Number">6</p>
                  <p className="home-Text">ผู้ดูแลระบบ</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col span={8} >
            <div className="home-Box-Right" >
              <Row align="middle" style={{ height: '100%' }}>
                <Col span={8} offset={4}>
                  <SendOutlined className="home-Icon" />
                </Col>
                <Col span={8}>
                  <p className="home-Number">6</p>
                  <p className="home-Text">ข่าววันนี้</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: '20px' }}>
          <Col span={16}>
            <div className="home-Text-List">รายการ</div>
          </Col>
          <Col span={4}>
            <Input.Group className="home-Input-Group">
              <Select defaultValue="1" className="home-Select">
                <Option value="1">ประเภทข่าวทั้งหมด</Option>
                <Option value="2">การเมือง</Option>
              </Select>
            </Input.Group>
          </Col>
          <Col span={4}>
            <Search placeholder="ค้นหา"></Search>
          </Col>
        </Row>
        <Tables
          columns={columns}
          dataSource={data}
        />
        <Modals
          isModalVisible={isModalVisible}
          onOk={handleOk}
          onCancel={handleCancel}
          modalData={modalData}
        />
      </Content>
    </>
  );
}
export default Home