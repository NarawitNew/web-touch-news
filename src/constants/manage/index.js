import { Breadcrumb, Button, Col, Form, Input, Layout, Row, Space, Switch, Tooltip } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom"
import Modals from 'components/layout/modal/index'
import Pagination from 'components/layout/pagination/index'
import Tables from 'components/layout/table/index'
import axios from 'axios'
import config from 'config'
import {httpClient} from 'HttpClient'

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
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: '', okText: '' });

  useEffect(()=>{
    getData()
  })
  const getData = () => {
    httpClient.get(config.manageURL)
      .then(function (response) {
        console.log('response', response)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

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
      title: 'เพิ่มผู้ดูแลระบบใหม่',
      okColor: '#216258',
      okText: 'ตกลง',
      content: value.email
    })
    showModal()
  }

  const onDelete = (email, e) => {
    setModalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: 'คุณต้องการลบผู้ดูแลระบบนี้ หรือไม่ ! ',
      okColor: 'red',
      okText: 'ลบ',
      content: email,
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
      okColor: 'orange',
      content: email,
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

  const onPagination = (page) => {
    console.log(page);
  };

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
        <Space size="Small">
          <Tooltip placement="bottom" title="แก้ไข">
            <Link to={`/manage/profile/${record.email}`}>
              <EditOutlined className="manage-icon-edit" onClick={(e) => { onEdit(record.email, e); }} /></Link>
          </Tooltip>
          <Tooltip placement="bottom" title="ลบ">
            <DeleteOutlined className="manage-icon-delete" onClick={(e) => { onDelete(record.email, e); }} />
          </Tooltip>
          <Tooltip placement="bottom" title="ระงับ">
            <Switch size="small" defaultChecked={record.status} onChange={(e) => { onSuspend(record.email, e); }} />
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
        <Tables
          columns={columns}
          dataSource={dataSource}
        />
        <Pagination
          defaultCurrent={1}
          total={100}
          onChange={onPagination}
        />
      </Content>
      <Modals
        isModalVisible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        modalData={modalData}
      >
        {modalData.type === 'show'? 
        <>
        <div style={{marginLeft:'80px'}}>อีเมล : {modalData.content}</div>
        <div style={{marginLeft:'80px'}}>รหัสผ่าน</div>
        <div style={{marginLeft:'40px',color:'red'}}>*ระบบจะแสดงข้อมูลเพียงครั้งเดียว*</div>
        </>
        :
        <p style={{marginLeft:'80px'}}>{modalData.content}</p>
        }
      </Modals>


    </>
  );
}
export default Manage