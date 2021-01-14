import { Breadcrumb, Col, Dropdown, Input, Layout, Menu, Row, Select } from 'antd';
import { DeleteOutlined, FieldTimeOutlined, MoreOutlined, SendOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React, { useState } from "react";

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal/index'
import Pagination from 'components/layout/pagination/index'
import Tables from 'components/layout/table/index'
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
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: null, okText: '' });

  const onTimeline = (value) => {
    setModalData({
      type: 'show',
      icon: <FieldTimeOutlined className="manage-icon-insert" />,
      title: 'ไทม์ไลน์',
      okColor: '#216258',
      okText: 'ตกลง',
      content: <div style={{ width: '180px' }}><Timeline /></div>
    })
    showModal()
  }

  const onDelete = (topic,e) => {
    setModalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
      okColor: 'red',
      okText: 'ลบ',
      content: topic,
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

  const onPagination = (page) => {
    console.log(page);
  };
  const menu = (topic) => {
    return (
      <Menu>
        <Menu.Item onClick={onTimeline}>
          <FieldTimeOutlined style={{ color: '#6AC9FF' }}></FieldTimeOutlined>
          ไทม์ไลน์
      </Menu.Item>
        <Menu.Item onClick={(e) => { onDelete(topic, e); }}>
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
      width: '50%',
      ellipsis: true,
      render: (text, record) => (<Link to="/home/view"  style={{ color: '#000' }}>{record.topic}</Link>),
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
      render: (text, record) => (<Dropdown placement="bottomRight" overlay={menu(record.topic)}><MoreOutlined /></Dropdown>),
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
        <Pagination
          defaultCurrent={1}
          total={100}
          onChange={onPagination}
        />
        <Modals
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalData={modalData}
      >
        {modalData.type === 'show'? 
        <div style={{marginLeft:'100px'}}>{modalData.content}</div>
        :
        <p style={{marginLeft:'80px'}} className="text-overflow">{modalData.content}</p>
        }
      </Modals>
      </Content>
    </>
  );
}
export default Home