import { Breadcrumb, Button, Col, Form, Input, Layout, Row, Space, Switch, Tooltip, message } from 'antd';
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react"

import FormData from 'form-data'
import { Link } from "react-router-dom"
import Modals from 'components/layout/modal/index'
import Tables from 'components/layout/table/index'
import config from 'config'
import { httpClient } from 'HttpClient'

const { Search } = Input;
const { Content } = Layout;

const Manage = () => {
  const [dataSource, setDataSource] = useState();
  const [dataFilter, setDataFilter] = useState("")
  const [current, setCurrent] = useState(1)
  const [pagination, setPagination] = useState({ pageCurrent: 1, perPage: 1, totalPage: 1 })
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: '', okText: '', onOk: null });

  useEffect(() => {
    getData()
  }, [dataFilter, current])

  const getData = () => {
    const params = {
      per_page: '15',
      page: current,
    }
    httpClient.get(config.manageURL, { params })
      .then(function (response) {
        // console.log('response', response)
        const code = response.data.code
        const data = response.data.data.data_list
        setPagination({
          currentPage: response.data.data.pagination.current_page,
          perPage: response.data.data.pagination.per_page,
          totalPage: response.data.data.pagination.total
        })
        if (code === 200) {
          const dataMap = data.map((item, key) => {
            item.key = item.id
            item.email = item.email
            item.name = item.firstname + ' ' + item.lastname
            item.status = item.Status
            return item
          })
          setDataSource(dataMap)
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const onInsert = (value) => {
    // console.log('email', value.email)
    // let setData = new FormData();
    // setData.append("email", value);
    httpClient.post(config.manageURL, `{"email":"${value.email}"}`)
      .then(function (response) {
        const code = response.data.code
        console.log('response', response)
        if (code === 201) {
          setModalData({
            type: 'show',
            icon: <UserOutlined className="manage-icon-insert" />,
            title: 'เพิ่มผู้ดูแลระบบใหม่',
            okColor: '#216258',
            okText: 'ตกลง',
            onOk() {
              setIsModalVisible(false)
            },
            content: ({email: response.data.data.email,
                        password: response.data.data.password}),
          })
          showModal()
          setDataFilter(response.data.data.email)
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const onDelete = (record) => {
    console.log('Delete id : ', record.key)
    setModalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: 'คุณต้องการลบผู้ดูแลระบบนี้ หรือไม่ ! ',
      okColor: 'red',
      okText: 'ลบ',
      content: record.email,
      onOk() {
        setIsModalVisible(false)
        httpClient.delete(config.manageURL + '/' + record.key)
          .then(function (response) {
            const code = response.data.code
            if (code === 200) {
              message.success('ลบผู้ดูแลระบบสำเร็จ');
              setDataFilter(record.key)
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error('ลบไม่สำเร็จ');
          })
      },
    })
    setIsModalVisible(true)
  }

  const onEdit = (record) => {
 
  }

  const onSuspend = (record) => {
    setModalData({
      type: 'confirm',
      icon: <ExclamationCircleOutlined className="manage-icon-suspend" />,
      title: 'คุณต้องการระงับผู้ดูแลระบบนี้ หรือไม่ ! ',
      okColor: 'orange',
      content: record.email,
      okText: 'ระงับ'
    })
    showModal()
  }

  const onSearch = (value) => {
  } 
  
  const currentPage = (value) => {
    setCurrent(value);
    console.log('currentPage', current)
  }

  const showModal = () => {
    setIsModalVisible(true)
  };

  const handleOk = () => {
    console.log('OK')
    setIsModalVisible(false)
  };

  const handleCancel = () => {
    setIsModalVisible(false)
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
        <Space >
          <Tooltip placement="bottom" title="แก้ไข">
            <Link to="/manage/profile/">
              <EditOutlined className="manage-icon-edit" />
            </Link>
          </Tooltip>
          <Tooltip placement="bottom" title="ลบ">
            <DeleteOutlined className="manage-icon-delete" onClick={() => { onDelete(record) }} />
          </Tooltip>
          <Tooltip placement="bottom" title="ระงับ">
            <Switch size="small" defaultChecked={record.status} onChange={() => { onSuspend(record) }} />
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
          setCurrentPage={currentPage}
          pageCurrent={pagination.pageCurrent}
          perPage={pagination.perPage}
          totalPage={pagination.totalPage}
        />
      </Content>
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
export default Manage