import {
  Breadcrumb,
  Button,
  Col,
  Input,
  Layout,
  Row,
  Select,
  Space,
  Tooltip,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  FieldTimeOutlined,
  HomeOutlined,
  PlusOutlined,
  SendOutlined,
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

const Home = () => {
  const [dataSource, setDataSource] = useState();
  const [total, setTotal] = useState({ all: 0, sdnt: 0, draft: 0 });
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current: 1,
    sorter: "desc",
    pageSize: 1,
    total: 0,
  });
  const [category, setCategory] = useState(null);
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
    getData();
    getTotalNews();
    getCategory();
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
      .get(config.REACT_APP_BASEURL + "/news/admin", { params })
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
            item.date = dateShow(item.created_at);
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
      .get(config.REACT_APP_BASEURL + "/news/countadmin")
      .then(function (response) {
        const code = response.data.code;
        if (code === 200) {
          setTotal({
            ...total,
            all: pagination.total,
            sdnt: response.data.data[0],
            draft: response.data.data[1],
          });
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

  const onSearch = (value) => {
    setDataSearch({ ...dataSearch, filter: value });
    setLoading(true);
  };

  const onCategory = (value) => {
    setDataSearch({ ...dataSearch, category: value });
    setLoading(true);
  };

  const onTimeline = (record) => {
    setModalData({
      type: "show",
      icon: <FieldTimeOutlined className="admin-icon-time" />,
      title: "ไทม์ไลน์",
      okColor: "#216258",
      okText: "ตกลง",
      onOk() {
        offModal();
      },
      content: <Timeline idNews={record.key} />,
    });
    onModal();
  };

  const onDelete = (record) => {
    setModalData({
      type: "confirm",
      icon: <DeleteOutlined className="admin-icon-delete" />,
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
            } else {
              message.success(response.data.message);
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error("เชื่อมต่อ Server ล้มเหลว");
          });
      },
      content: record.topic,
    });
    onModal();
  };

  const onModal = () => {
    setIsModalVisible(true);
  };

  const offModal = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "วันที่",
      dataIndex: "date",
      key: "date",
      width: "120px",
      sorter: true,
    },
    {
      title: "หัวข้อ",
      key: "topic",
      width: "500px",
      ellipsis: true,
      render: (record) => (
        <Link to={`/home/view/${record.key}`} style={{ color: "#000" }}>
          {record.topic}
        </Link>
      ),
    },
    {
      title: "ประเภท",
      dataIndex: "category",
      key: "category",
      width: "150px",
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
                : status === "Draft"
                ? "grey"
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
      fixed: "right",
      width: "140px",
      key: "action",
      render: (record) => (
        <Space>
          <Tooltip placement="bottom" title="ไทม์ไลน์">
            <Button
              icon={<FieldTimeOutlined className="admin-icon-time" />}
              size={"middle"}
              onClick={() => {
                onTimeline(record);
              }}
            />
          </Tooltip>
          {record.status === "Draft" ? (
            <>
              <Tooltip placement="bottom" title="แก้ไข">
                <Link to={`/home/edit/${record.key}`}>
                  <Button
                    icon={<EditOutlined className="admin-icon-edit" />}
                    size={"middle"}
                  />
                </Link>
              </Tooltip>
              <Tooltip placement="bottom" title="ลบ">
                <Button
                  icon={<DeleteOutlined className="admin-icon-delete" />}
                  size={"middle"}
                  onClick={() => {
                    onDelete(record);
                  }}
                />
              </Tooltip>
            </>
          ) : (
            <>
              <Tooltip placement="bottom" title="แก้ไข">
                <Button
                  icon={<EditOutlined className="admin-icon-disabled" />}
                  size={"middle"}
                  disabled
                />
              </Tooltip>
              <Tooltip placement="bottom" title="ลบ">
                <Button
                  icon={<DeleteOutlined className="admin-icon-disabled" />}
                  size={"middle"}
                  disabled
                />
              </Tooltip>
            </>
          )}
        </Space>
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
      <Content className="admin-home-content">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div className="admin-home-box-left">
              <Row align="middle" style={{ height: "100%" }}>
                <Col span={8} offset={4}>
                  <UnorderedListOutlined className="admin-home-icon" />
                </Col>
                <Col span={8}>
                  <p className="admin-home-number"> {pagination.total} </p>
                  <p className="admin-home-text">ข่าวทั้งหมด</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div className="admin-home-box-center">
              <Row align="middle" style={{ height: "100%" }}>
                <Col span={8} offset={4}>
                  <SendOutlined className="admin-home-icon" />
                </Col>
                <Col span={8}>
                  <p className="admin-home-number"> {total.sdnt} </p>
                  <p className="admin-home-text">ข่าวอนุมัติ</p>
                </Col>
              </Row>
            </div>
          </Col>
          <Col xs={24} sm={12} md={12} lg={8} xl={8}>
            <div className="admin-home-box-right">
              <Row align="middle" style={{ height: "100%" }}>
                <Col span={8} offset={4}>
                  <EditOutlined className="admin-home-icon" />
                </Col>
                <Col span={8}>
                  <p className="admin-home-number"> {total.draft} </p>
                  <p className="admin-home-text">ข่าวรอตรวจสอบ</p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
        <Row gutter={8} style={{ marginTop: "20px" }}>
          <Col flex="auto" xs={24} sm={12} md={12} lg={16} xl={16}>
            <div className="admin-home-text-list">รายการ</div>
          </Col>
          <Col flex="220px">
            <Input.Group>
              <Select
                defaultValue=""
                style={{ width: "100%" }}
                onChange={onCategory}
              >
                <Option value="">ประเภทข่าวทั้งหมด</Option>
                {category}
              </Select>
            </Input.Group>
          </Col>
          <Col flex="220px">
            <Search placeholder="ค้นหา" onSearch={onSearch}></Search>
          </Col>
          <Col flex="100px">
            <Link to="/home/create">
              <Button
                style={{ width: "100%" }}
                type="primary"
                icon={<PlusOutlined />}
              >
                เพิ่มข่าว
              </Button>
            </Link>
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
            <p className="truncate-text" style={{ marginTop: "5px" }}>
              {modalData.content}
            </p>
          )}
        </Modals>
      </Content>
    </>
  );
};

export default Home;
