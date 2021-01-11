import React from 'react';
import { Link } from "react-router-dom";
import { Layout, Breadcrumb, Row, Col, Input, Select, Dropdown,Menu  } from 'antd';
import { UnorderedListOutlined, TeamOutlined, SendOutlined, MoreOutlined  } from '@ant-design/icons';

import Tables from 'components/layout/table/index'

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;


const data = [{
  date: '07/01/2021',
  topic:'ข่าว',
  admin: 'new',
  category:'การเมือง',
  status:'ส่ง',
}
];

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
    <Menu.Item danger>a danger item</Menu.Item>
  </Menu>
);

const home = () => {
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
      render: (text, record) => (<Link to="/home/view">{record.topic}</Link>),
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
      render: (text, record) => (<Dropdown overlay={menu}><MoreOutlined/></Dropdown>),
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
      </Content>
    </>
  );
}
export default home