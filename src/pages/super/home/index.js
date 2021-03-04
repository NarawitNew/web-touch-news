import {
  Breadcrumb,
  Col,
  Dropdown,
  Input,
  Layout,
  Menu,
  Row,
  Select,
  message,
} from "antd";
import {
  DeleteOutlined,
  EyeOutlined,
  FieldTimeOutlined,
  MoreOutlined,
  SendOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Modals from "components/layout/modal";
import Tables from "components/layout/table";
import Timeline from "components/layout/timeline";
import config from "config";
import { httpClient } from "HttpClient";
import moment from "moment";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const Home = (props) => {
  const [dataSource, setDataSource] = useState();
  const [category, setCategory] = useState(null);
  const [totalNews, setTotalNews] = useState({ all: 0, toDate: 0 });
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    sorter: "dsc",
    pageSize: 0,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    icon: null,
    title: "",
    okColor: "",
    content: null,
    okText: "",
  });
  const [dataSearch, setDataSearch] = useState({ category: "", filter: "" });
  const [filters, setFilters] = useState();

  useEffect(() => {
    setTimeout(() => {
      getData();
      getCategory();
      getTotalAdmin();
      getTotalNews();
    }, 1000);
  }, [pagination.current, pagination.sorter, dataSearch, filters]);

  const dateShow = (time) => {
    const date = moment(time * 1000).format("DD/MM/YYYY HH:mm:ss ");
    return date;
  };

  const getData = () => {
    setLoading(true);
    var params = new URLSearchParams();
    params.append("page", pagination.current);
    params.append("sorts", `created_at:${pagination.sorter}`);
    params.append("filters", `topic:like:${dataSearch.filter}`);
    params.append("filters", `category:like:${dataSearch.category}`);
    httpClient
      .get(config.REACT_APP_BASEURL + "/news/super", { params })
      .then(function (response) {
        const code = response.data.code;
        const data = response.data.data.data_list;
        setLoading(false);
        if (code === 200) {
          setPagination({
            current: response.data.data.pagination.current_page,
            pageSize: response.data.data.pagination.per_page,
            total: response.data.data.pagination.total,
            sorter: response.data.data.pagination.sorts[0].value,
          });
          const dataMap = data.map((item) => {
            item.key = item.id;
            item.created_at = dateShow(item.created_at);
            return item;
          });
          setDataSource(dataMap);
        } else {
          setDataSource();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTotalNews = () => {
    httpClient
      .get(config.REACT_APP_BASEURL + "/news/countsuper")
      .then(function (response) {
        const code = response.data.code;
        if (code === 200) {
          setTotalNews({
            all: response.data.data[0],
            toDate: response.data.data[1],
          });
        } else {
          setTotalNews({
            all: 0,
            toDate: 0,
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTotalAdmin = () => {
    httpClient
      .get(config.REACT_APP_BASEURL + "/admin/count")
      .then(function (response) {
        const code = response.data.code;
        if (code === 200) {
          setTotalAdmin(response.data.data[0]);
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCategory = () => {
    httpClient
      .get(config.REACT_APP_BASEURL + "/category")
      .then(function (response) {
        const data = response.data.data.data_list;
        const code = response.data.code;
        if (code === 200) {
          const dataMap = data.map((item) => {
            item = (
              <Option key={item.id} value={item.category}>
                {item.category}
              </Option>
            );
            return item;
          });
          setCategory(dataMap);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onCategory = (value) => {
    setDataSearch({ ...dataSearch, category: value });
  };
  const onSearch = (value) => {
    setDataSearch({ ...dataSearch, filter: value });
  };

  const onDelete = (record) => {
    setModalData({
      type: "confirm",
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: "คุณต้องการลบข่าวนี้ หรือไม่ ! ",
      okColor: "red",
      okText: "ลบ",
      onOk() {
        offModal();
        httpClient
          .delete(config.REACT_APP_BASEURL + "/news/" + record.key)
          .then(function (response) {
            const code = response.data.code;
            if (code === 200) {
              message.success(response.data.message);
              setFilters(record.key);
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error(error.data.message);
          });
      },
      content: record.topic,
    });
    onModal();
  };

  const onTimeline = (record) => {
    setModalData({
      type: "show",
      icon: <FieldTimeOutlined className="manage-icon-insert" />,
      title: "ไทม์ไลน์",
      okColor: "#216258",
      okText: "ตกลง",
      onOk() {
        setIsModalVisible(false);
      },
      content: <Timeline idNews={record.key} />,
    });
    onModal();
  };

  const onModal = () => {
    setIsModalVisible(true);
  };

  const offModal = () => {
    setIsModalVisible(false);
  };

  const menu = (record) => {
    return (
      <Menu>
        <Menu.Item
          key="0"
          onClick={() => {
            props.history.push(`/home/view/${record.key}`);
          }}
        >
          <EyeOutlined style={{ color: "#73d13d" }} />
          ดูข่าว
        </Menu.Item>
        <Menu.Item
          key="1"
          onClick={() => {
            onTimeline(record);
          }}
        >
          <FieldTimeOutlined style={{ color: "#1890ff" }} />
          ไทม์ไลน์
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            onDelete(record);
          }}
        >
          <DeleteOutlined style={{ color: "red" }} />
          ลบ
        </Menu.Item>
      </Menu>
    );
  };

  const columns = [
    {
      title: "วันที่",
      dataIndex: "created_at",
      key: "created_at",
      width: "120px",
      sorter: true,
    },
    {
      title: "หัวข้อ",
      key: "topic",
      width: "400px",
      ellipsis: true,
      render: (record) => (
        <Link to={`/home/view/${record.key}`} style={{ color: "#000" }}>
          {record.topic}
        </Link>
      ),
    },
    {
      title: "ผู้ดูแลระบบ",
      dataIndex: "by",
      key: "by",
      width: "160px",
    },
    {
      title: "ประเภท",
      dataIndex: "category",
      key: "category",
      width: "100px",
    },
    {
      title: "สถานะ",
      dataIndex: "status",
      key: "status",
      width: "100px",
      render: (status) => (
        <div
          style={{
            color:
              status === "Submit"
                ? "blue"
                : status === "Approve"
                ? "#73d13d"
                : status === "Public"
                ? "red"
                : status === "Edit"
                ? "orange"
                : "black",
          }}
        >
          {status}
        </div>
      ),
    },
    {
      title: "",
      width: "50px",
      key: "action",
      fixed: "right",
      render: (record) => (
        <Dropdown placement="bottomCenter" overlay={menu(record)}>
          <a style={{ color: "black" }} onClick={(e) => e.preventDefault()}>
            <MoreOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];
  return (
    <>
      <Breadcrumb style={{ margin: "4px 0" }}>
        <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="home-Content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div className="home-Box-Left">
              <Row align="middle" style={{ height: "100%" }}>
                <Col span={8} offset={4}>
                  <UnorderedListOutlined className="home-Icon" />
                </Col>
                <Col span={8}>
                  <p className="home-Number">{totalNews.all}</p>
                  <p className="home-Text">ข่าวทั้งหมด</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div className="home-Box-Center">
              <Row align="middle" style={{ height: "100%" }}>
                <Col span={8} offset={4}>
                  <TeamOutlined className="home-Icon" />
                </Col>
                <Col span={8}>
                  <p className="home-Number">{totalAdmin}</p>
                  <p className="home-Text">ผู้ดูแลระบบ</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div className="home-Box-Right">
              <Row align="middle" style={{ height: "100%" }}>
                <Col span={8} offset={4}>
                  <SendOutlined className="home-Icon" />
                </Col>
                <Col span={8}>
                  <p className="home-Number">{totalNews.toDate}</p>
                  <p className="home-Text">ข่าววันนี้</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={16}>
            <div className="home-Text-List">รายการ</div>
          </Col>
          <Col xs={12} sm={10} md={6} lg={6} xl={4}>
            <Input.Group className="home-Input-Group">
              <Select
                defaultValue=""
                className="home-Select"
                onChange={onCategory}
              >
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
          {modalData.type === "show" ? (
            <div style={{ marginTop: "5px" }}>{modalData.content}</div>
          ) : (
            <p className="truncate-text">{modalData.content}</p>
          )}
        </Modals>
      </Content>
    </>
  );
};

export default Home;
