import { Breadcrumb, Col, Dropdown, Input, Layout, Menu, Row, Select, message } from 'antd';
import { DeleteOutlined, FieldTimeOutlined, MoreOutlined, SendOutlined, TeamOutlined, UnorderedListOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Modals from 'components/layout/modal'
import Tables from 'components/layout/table'
import Timeline from 'components/layout/timeline'
import config from 'config'
import { httpClient } from 'HttpClient'

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;


const Home = () => {
  const [dataSource, setDataSource] = useState()
  const [category, setCategory] = useState(null)
  // const [numderNews, setNumder] = useState({ all: 0, sdnt: 0, draft: 0 })
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ current: 1, sorter:'dsc', pageSize: 1, total: 1 })
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({ type: '', icon: null, title: '', okColor: '', content: null, okText: '' });
  const [dataSearch, setDataSearch] = useState({ category: '', filter: '' })
  // const [current, setCurrent] = useState(1)
  const [filters, setFilters] = useState()

  useEffect(() => {
    getData()
    getCategory()
  }, [pagination.current,pagination.sorter,dataSearch, filters])

  const getData = () => {
    setLoading(true)
    // const params = {
    //   // per_page: '10',
    //   page: current,
    //   filters:[`category:like:${dataSearch.category}`,`topic:like:${dataSearch.filter}`]
    //   // filters: `category:like:${dataSearch.category}`,
    //   // filters: `topic:like:${dataSearch.filter}`,
    // }
    var params = new URLSearchParams()
    params.append("page", pagination.current)
    params.append("sorts", `created_at:${pagination.sorter}`)
    params.append("filters", `topic:like:${dataSearch.filter}`)
    params.append("filters", `category:like:${dataSearch.category}`)

    httpClient.get(config.REACT_APP_BASEURL + '/news', { params })
      .then(function (response) {
        console.log('response',response.data.data.pagination.sorts[0].value)
        const code = response.data.code
        const data = response.data.data.data_list
        setLoading(false)
        if (code === 200) {
          setPagination({
            current: response.data.data.pagination.current_page,
            pageSize: response.data.data.pagination.per_page,
            total: response.data.data.pagination.total,
            sorter:response.data.data.pagination.sorts[0].value
          })
          const dataMap = data.map((item) => {
            item.key = item.id
            return item
          })
          setDataSource(dataMap)
        } else {
          setDataSource()
        }
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const getCategory = () => {
    httpClient.get(config.REACT_APP_BASEURL + '/category')
      .then(function (response) {
        const data = response.data.data.data_list
        const code = response.data.code
        if (code === 200) {
          const dataMap = data.map((item) => {
            item = <Option key={item.id} value={item.category}>{item.category}</Option>
            return item
          })
          setCategory(dataMap)
          
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const onCategory = (value) => {
    setDataSearch({ ...dataSearch, category: value })
  }
  const onSearch = (value) => {
    setDataSearch({ ...dataSearch, filter: value })
  }

  const onDelete = (record) => {
    setModalData({
      type: 'confirm',
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: 'คุณต้องการลบข่าวนี้ หรือไม่ ! ',
      okColor: 'red',
      okText: 'ลบ',
      onOk() {
        offModal()
        httpClient.delete(config.REACT_APP_BASEURL + '/news/' + record.key)
          .then(function (response) {
            const code = response.data.code
            if (code === 200) {
              message.success(response.data.message);
              setFilters(record.key)
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error(error.data.message);
          })
      },
      content: record.topic,
    })
    onModal()
  }

  const onTimeline = (record) => {
    setModalData({
      type: 'show',
      icon: <FieldTimeOutlined className="manage-icon-insert" />,
      title: 'ไทม์ไลน์',
      okColor: '#216258',
      okText: 'ตกลง',
      onOk() {
        setIsModalVisible(false)
      },
      content: <Timeline idNews={record.key}/>,
    })
    onModal()
  }

  const onModal = () => {
    setIsModalVisible(true)
  }

  const offModal = () => {
    setIsModalVisible(false)
  }

  const menu = (record) => {
    return (
      <Menu>
        <Menu.Item onClick={() => { onTimeline(record); }}>
          <FieldTimeOutlined style={{ color: '#6AC9FF' }}></FieldTimeOutlined>
          ไทม์ไลน์
      </Menu.Item>
        <Menu.Item onClick={() => { onDelete(record); }}>
          <DeleteOutlined style={{ color: 'red' }}></DeleteOutlined>
          ลบ
      </Menu.Item>
      </Menu>
    );

  }

  const columns = [
    {
      title: 'วันที่',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '120px',
      sorter: true,
      // sorter: (a, b) => a.created_at.length - b.created_at.length,
      // sortOrder: sortedInfo.columnKey === 'created_at' && sortedInfo.order,
    },
    {
      title: 'หัวข้อ',
      key: 'topic',
      width: '400px',
      ellipsis: true,
      render: (record) => (<Link to={`/home/view/${record.key}`} style={{ color: '#000' }}>{record.topic}</Link>),
    },
    {
      title: 'ผู้ดูแลระบบ',
      dataIndex: 'by',
      key: 'by',
      width: '200px',
    },
    {
      title: 'ประเภท',
      dataIndex: 'category',
      key: 'category',
      width: '200px',
    },
    {
      title: 'สถานะ',
      dataIndex: 'status',
      key: 'status',
      width: '100px',
    },
    {
      title: '',
      width: '50px',
      key: 'action',
      fixed: 'right',
      render: (record) => (<Dropdown placement="bottomRight" overlay={menu(record)}><MoreOutlined /></Dropdown>),
    }
  ];
  return (
    <>
      <Breadcrumb style={{ margin: '4px 0' }}>
        <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="home-Content">
        <Row gutter={[16, 16]} >
          <Col xs={24} sm={12} md={12} lg={8} xl={8} >
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
          <Col xs={24} sm={12} md={12} lg={8} xl={8} >
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
          <Col xs={24} sm={12} md={12} lg={8} xl={8} >
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
          <Col xs={24} sm={24} md={12} lg={12} xl={16}>
            <div className="home-Text-List">รายการ</div>
          </Col>
          <Col xs={12} sm={10} md={6} lg={6} xl={4}>
            <Input.Group className="home-Input-Group">
              <Select placeholder="เลือกประเภท" className="home-Select" onChange={onCategory}>
                <Option value="">ทั้งหมด</Option>
                {category}
              </Select>
            </Input.Group>
          </Col>
          <Col xs={12} sm={10} md={6} lg={6} xl={4}>
            <Search placeholder="ค้นหา" onSearch={onSearch}></Search>
          </Col>
        </Row>
        <Tables
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          setPagination={setPagination}
          pagination={pagination}
        />

        <Modals
          isModalVisible={isModalVisible}
          onOk={modalData.onOk}
          onCancel={offModal}
          modalData={modalData}
        >
          {modalData.type === 'show' ?
            <div style={{marginTop:'5px'}}>{modalData.content}</div>
            :
            <p className="truncate-text">{modalData.content}</p>
          }
        </Modals>
      </Content>
    </>
  );
}
export default Home