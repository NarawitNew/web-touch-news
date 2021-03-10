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
  HomeOutlined,
  MoreOutlined,
  SendOutlined,
  TeamOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import {
  admincount,
  categoryList,
  countsuper,
  news,
  newsSuper,
} from "core/schemas/index";
import { deleteData, getDataList } from "core/actions/collection";

import Box from "components/layout/box";
import { Link } from "react-router-dom";
import Modals from "components/layout/modal";
import Tables from "components/layout/table";
import Timeline from "components/layout/timeline";
import moment from "moment";

const { Content } = Layout;
const { Search } = Input;
const { Option } = Select;

const color = {
  Submit: "var(--link-color)",
  Approve: "var(--success-color)",
  Public: "var(--error-color)",
  Edit: "var(--warning-color)",
  Draft: "var(--primary-color)",
};

const Home = (props) => {
  const [dataSource, setDataSource] = useState([]);
  const [category, setCategory] = useState([]);
  const [totalNews, setTotalNews] = useState({ all: 0, toDate: 0 });
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paginations, setPaginations] = useState({
    current: 1,
    sorter: "desc",
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
  const [filters, setFilters] = useState("");

  useEffect(() => {
    setTimeout(() => {
      getData();
      getCategory();
      getTotalAdmin();
      getTotalNews();
    }, 1000);
  }, [paginations.current, paginations.sorter, dataSearch, filters]);

  const dateShow = (time) => {
    const date = moment(time * 1000).format("DD/MM/YYYY HH:mm:ss ");
    return date;
  };

  const getData = () => {
    setLoading(true);
    var params = new URLSearchParams();
    params.append("page", paginations.current);
    params.append("sorts", `created_at:${paginations.sorter}`);
    params.append("filters", `topic:like:${dataSearch.filter}`);
    params.append("filters", `category:like:${dataSearch.category}`);
    getDataList(newsSuper, { params })
      .then(function (response) {
        const code = response?.code || "";
        const { data_list, pagination } = response?.data || "";
        setLoading(false);
        if (code === 200) {
          setPaginations({
            current: pagination.current_page,
            pageSize: pagination.per_page,
            total: pagination.total,
            sorter: pagination.sorts[0].value,
          });
          const dataMap = data_list.map((item) => {
            item.key = item.id;
            item.created_at = dateShow(item.created_at);
            return item;
          });
          setDataSource(dataMap);
        } else {
          setDataSource([]);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTotalNews = () => {
    getDataList(countsuper)
      .then(function (response) {
        const { code, data } = response || "";
        if (code === 200) {
          setTotalNews({
            all: data[0],
            toDate: data[1],
          });
        } else {
          setTotalNews(0);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getTotalAdmin = () => {
    getDataList(admincount)
      .then(function (response) {
        const { code, data } = response || "";
        if (code === 200) {
          setTotalAdmin(data[0]);
        } else {
          setTotalAdmin(0);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const getCategory = () => {
    getDataList(categoryList)
      .then((response) => {
        const data = response?.data?.data_list || "";
        const code = response?.code || "";
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
        } else {
          setCategory(null);
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onDelete = (record) => {
    setModalData({
      type: "confirm",
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: "คุณต้องการลบข่าวนี้ หรือไม่ ! ",
      okColor: "red",
      okText: "ลบ",
      onOk() {
        setIsModalVisible(false);
        deleteData(news, record.key)
          .then(function (response) {
            if (response?.code === 200) {
              message.success(response?.message);
              setFilters(record.key);
            } else {
              message.error(response?.message);
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error(error.message);
          });
      },
      content: record.topic,
    });
    setIsModalVisible(true);
  };

  const onTimeline = (record) => {
    setModalData({
      type: "show",
      icon: <FieldTimeOutlined className="manage-icon-insert" />,
      title: "ไทม์ไลน์",
      okColor: "var(--primary-color)",
      okText: "ตกลง",
      onOk() {
        setIsModalVisible(false);
      },
      content: <Timeline idNews={record.key} />,
    });
    setIsModalVisible(true);
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
          <EyeOutlined style={{ color: "var(--success-color)" }} />
          ดูข่าว
        </Menu.Item>
        <Menu.Item
          key="1"
          onClick={() => {
            onTimeline(record);
          }}
        >
          <FieldTimeOutlined style={{ color: "var(--link-color)" }} />
          ไทม์ไลน์
        </Menu.Item>
        <Menu.Item
          key="2"
          onClick={() => {
            onDelete(record);
          }}
        >
          <DeleteOutlined style={{ color: "var(--error-color)" }} />
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
        <Link
          to={`/home/view/${record.key}`}
          style={{ color: "var(--text-color)" }}
        >
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
            color: color[status],
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
      <Breadcrumb style={{ padding: "1px 0" }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="home-Content">
        <Row gutter={[16, 16]}>
          <Box
            color="var(--error-color)"
            icon={<UnorderedListOutlined />}
            text="ข่าวทั้งหมด"
            number={totalNews.all}
          />
          <Box
            color="var(--success-color)"
            icon={<TeamOutlined />}
            text="ผู้ดูแลระบบ"
            number={totalAdmin}
          />
          <Box
            color="var(--warning-color)"
            icon={<SendOutlined />}
            text="ข่าววันนี้"
            number={totalNews.toDate}
          />
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
                onChange={(value) =>
                  setDataSearch({ ...dataSearch, category: value })
                }
              >
                <Option value="">ประเภทข่าวทั้งหมด</Option>
                {category}
              </Select>
            </Input.Group>
          </Col>
          <Col xs={12} sm={10} md={6} lg={6} xl={4}>
            <Search
              placeholder="ค้นหา"
              onSearch={(value) =>
                setDataSearch({ ...dataSearch, filter: value })
              }
            ></Search>
          </Col>
        </Row>
        <Tables
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          setPagination={setPaginations}
          pagination={paginations}
        />
        <Modals
          isModalVisible={isModalVisible}
          onOk={modalData.onOk}
          onCancel={() => setIsModalVisible(false)}
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
