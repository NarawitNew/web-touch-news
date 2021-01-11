import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Layout, Breadcrumb } from 'antd';
import Modals from 'components/layout/modal/index'
import Tables from 'components/layout/table/index'
import { Row, Col, Form, Input, Button, Space, Switch, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, UserOutlined, ExclamationCircleOutlined, DeleteOutlined, } from '@ant-design/icons';

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
  const [DataTest, setDataTest] = useState({dataAdmin: data, page: '5'})
  const [dataSource, setDataSource] = useState(DataTest.dataAdmin);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setmodalData] = useState({ type: '', icon: null, title: '', cancelButton: '', okButton: null, email: '', okText: '' });
  


  const onInsert = (value) => {
    const datA = DataTest.dataAdmin
    const dataMap = datA.map((item, key) =>{
      item.key = item.key * 10
      item.email = item.email
      item.name = 'Test map'
      // item.status = item.status
      {item.status === true? item.status = false : item.status = true}
      return item
    })
    setDataSource(dataMap)
    console.log('DataSource', dataSource)
    setmodalData({
      type: 'show',
      icon: <UserOutlined className="manage-Icon-insert" />,
      cancelButton: 'none',
      okButton: { backgroundColor: 'white', color: '#216258', borderColor: '#216258' },
      title: 'เพิ่มผู้ดูแลระบบใหม่',
      okText: 'ตกลง',
      email: value.email
    })
    // showModal()
  }

  const onDelete = (email, e) => {
    setmodalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-Icon-delete" />,
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

  const onChangeSwitch = (email, e) => {
    setmodalData({
      type: 'confirm',
      icon: <ExclamationCircleOutlined className="manage-Icon-ban" />,
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
              <EditOutlined className="manage-Icon-edit" onClick={(e) => { onEdit(record.email, e); }} /></Link>
          </Tooltip>
          <Tooltip placement="bottom" title="ลบ">
            <DeleteOutlined className="manage-Icon-delete" onClick={(e) => { onDelete(record.email, e); }} />
          </Tooltip>
          <Tooltip placement="bottom" title="แบน">
            <Switch defaultChecked={record.status} onChange={(e) => { onChangeSwitch(record.email, e); }} />
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
      <Content className="manage-Content">
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
                <Button className="manage-Button" type="primary" htmlType="submit" icon={<PlusOutlined />}>เพิ่ม</Button>
              </Form.Item>
            </Form>
          </Col>
          <Col span={6} style={{ textAlign: 'right' }}>
            <Search placeholder="ค้นหา" className="manage-Search" onSearch={onSearch} />
          </Col>
        </Row>
        {/* <Table columns={columns} dataSource={dataSource} style={{ marginTop: '10px' }} /> */}
        <Tables
          columns={columns}
          dataSource={dataSource}
        />
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