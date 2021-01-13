import { Breadcrumb, Button, Col, Form, Input, Layout, Pagination, Row, Space, Switch, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import React, { useState } from "react";

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal/index';
import Tables from 'components/layout/table/index';

const { Search } = Input;
const { Content } = Layout;

const data = [{
  key: 1,
  email: '1-@gmail.com',
  name: 'Admin 1',
  status: true
},
{
  key: 2,
  email: '2-@gmail.com',
  name: 'Admin 2',
  status: false
},
{
  key: 3,
  email: '3-@gmail.com',
  name: 'Admin 3',
  status: false
},
{
  key: 4,
  email: '4-@gmail.com',
  name: 'Admin 4',
  status: true
},];

const Manage = () => {
  const [dataTest, setDataTest] = useState({ dataAdmin: data, page: '5' })
  const [dataSource, setDataSource] = useState(dataTest.dataAdmin);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', cancelButton: '', okButton: null, email: '', okText: '' });

  const onInsert = (value) => {
    // const datA = dataTest.dataAdmin
    // const dataMap = datA.map((item, key) =>{
    //   item.key = item.key * 10
    //   item.email = item.email
    //   item.name = 'Test map'
    //   // item.status = item.status
    //   {item.status === true? item.status = false : item.status = true}
    //   return item
    // })
    // setDataSource(dataMap)
    // console.log('DataSource', dataSource)
    setModalData({
      type: 'show',
      icon: <UserOutlined className="manage-icon-insert" />,
      cancelButton: 'none',
      okButton: { backgroundColor: 'white', color: '#216258', borderColor: '#216258' },
      title: 'เพิ่มผู้ดูแลระบบใหม่',
      okText: 'ตกลง',
      email: value.email
    })
    showModal()
  }

  const onDelete = (email, e) => {
    setModalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: 'คุณต้องการลบผู้ดูแลระบบนี้ หรือไม่ ! ',
      cancelButton: '',
      okButton: { backgroundColor: 'white', color: 'red', borderColor: 'red' },
      okText: 'ลบ',
      email: email,
    })
    showModal()
  }

  const onEdit = (email, e) => {
    console.log('edit', email);
  }

  const onSuspend = (email, e) => {
    setModalData({
      type: 'confirm',
      icon: <ExclamationCircleOutlined className="manage-icon-suspend" />,
      title: 'คุณต้องการระงับผู้ดูแลระบบนี้ หรือไม่ ! ',
      cancelButton: '',
      okButton: { backgroundColor: 'white', color: 'orange', borderColor: 'orange' },
      email: email,
      okText: 'ระงับ'
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

  const onSearch = (value) => {
    console.log('Search : ' + value)
    const currValue = value;
    const filteredData = data.filter(entry =>
      entry.name.includes(currValue)
    );
    setDataSource(filteredData)
  }

  const columns = [
    {
      title: 'อีเมล',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'ชื่อ - นามสกุล',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '',
      width: '15%',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip placement="bottom" title="แก้ไข">
            <Link to={`/manage/profile/${record.email}`}>
              <EditOutlined className="manage-icon-edit" onClick={(e) => { onEdit(record.email, e); }} /></Link>
          </Tooltip>
          <Tooltip placement="bottom" title="ลบ">
            <DeleteOutlined className="manage-icon-delete" onClick={(e) => { onDelete(record.email, e); }} />
          </Tooltip>
          <Tooltip placement="bottom" title="ระงับ">
            <Switch defaultChecked={record.status} onChange={(e) => { onSuspend(record.email, e); }} />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Breadcrumb style={{ margin: '4px 0' }}>
        <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="manage-content">
        <Row>
          <Col span={18}>
            <Form name="email" layout="inline" onFinish={onInsert}>
              <Form.Item>
                <div className="manage-Text">ผู้ดูแลระบบ</div>
              </Form.Item>
              <Form.Item name="email" className="manage-Input">
                <Input placeholder="กรอกอีเมล" />
              </Form.Item>
              <Form.Item>
                <Button className="manage-button" type="primary" htmlType="submit" icon={<PlusOutlined />}>เพิ่ม</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Search placeholder="ค้นหา" className="manage-search" onSearch={onSearch} />
          </Col>
        </Row>
        {/* <Table columns={columns} dataSource={dataSource} style={{ marginTop: '10px' }} /> */}
        <Tables
          columns={columns}
          dataSource={dataSource}
        />
        <Row>
          <Col>
          <Pagination style={{textAlign:'right'}} defaultCurrent={1} total={200} showSizeChanger={false} />
          
          </Col>
        </Row>
      </Content>
      <Modals
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalData={modalData}
      />


    </>
  );
}
export default Manage