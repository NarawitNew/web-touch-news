import {
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Space,
  Switch,
  Tooltip,
  message,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import Modals from "components/layout/modal";
import Tables from "components/layout/table";
import config from "config";
import { httpClient } from "HttpClient";

const { Search } = Input;
const { Content } = Layout;

const Manage = () => {
  const [formValue] = Form.useForm();
  const [dataSource, setDataSource] = useState();
  const [loading, setLoading] = useState(true);
  const [dataFilter, setDataFilter] = useState("");
  const [dataSearch, setDataSearch] = useState("");
  const [pagination, setPagination] = useState({
    current: 1,
    sorter: "dsc",
    pageSize: 1,
    total: 0,
  });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    icon: null,
    title: "",
    okColor: "",
    content: "",
    okText: "",
    onOk: null,
  });

  useEffect(() => {
    getData();
  }, [dataFilter, pagination.current, isModalVisible, dataSearch]);

  const getData = () => {
    var params = new URLSearchParams();
    params.append("page", pagination.current);
    params.append("filters", `firstname:like:${dataSearch}`);
    params.append("filters", `lastname:like:${dataSearch}`);
    httpClient
      .get(config.REACT_APP_BASEURL + "/admin", { params })
      .then(function (response) {
        const code = response.data.code;
        const data = response.data.data.data_list;
        setPagination({
          current: response.data.data.pagination.current_page,
          pageSize: response.data.data.pagination.per_page,
          total: response.data.data.pagination.total,
          sorter: response.data.data.pagination.sorts[0].value,
        });
        if (code === 200) {
          const dataMap = data.map((item, i) => {
            item.order = i + 1 + (pagination.current - 1) * 10;
            item.key = item.id;
            item.name = item.firstname + " " + item.lastname;
            const status = item.status;
            item.status = status === "active" ? true : false;
            return item;
          });
          setDataSource(dataMap);
          setLoading(false);
        } else {
          setLoading(false);
          setDataSource(data);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onInsert = (value) => {
    const setData = JSON.stringify({
      email: value.email,
    });
    httpClient
      .post(config.REACT_APP_BASEURL + "/admin", setData)
      .then(function (response) {
        const code = response.data.code;
        if (code === 201) {
          setModalData({
            type: "show",
            icon: <UserOutlined className="manage-icon-insert" />,
            title: "เพิ่มผู้ดูแลระบบใหม่",
            okColor: "#216258",
            okText: "ตกลง",
            onOk() {
              setIsModalVisible(false);
            },
            content: {
              email: response.data.data.email,
              password: response.data.data.password,
            },
          });
          onModal();
          setDataFilter(response.data.data.email);
          formValue.setFieldsValue({
            email: "",
          });
        } else if (code === 200) {
          message.error(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDelete = (record) => {
    setModalData({
      type: "confirm",
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: "คุณต้องการลบผู้ดูแลระบบนี้ หรือไม่ ! ",
      okColor: "red",
      okText: "ลบ",
      content: record.email,
      onOk() {
        setIsModalVisible(false);
        httpClient
          .delete(config.REACT_APP_BASEURL + "/admin/" + record.key)
          .then(function (response) {
            const code = response.data.code;
            if (code === 200) {
              message.success("ลบผู้ดูแลระบบสำเร็จ");
              setDataFilter(record.key);
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error("ลบไม่สำเร็จ");
          });
      },
    });
    onModal();
  };

  const onSuspend = (checked, record) => {
    if (checked === false) {
      setModalData({
        type: "confirm",
        icon: <ExclamationCircleOutlined className="manage-icon-suspend" />,
        title: "คุณต้องการระงับผู้ดูแลระบบนี้ หรือไม่ ! ",
        okColor: "orange",
        content: record.email,
        okText: "ระงับ",
        onOk() {
          const setData = JSON.stringify({
            status: "inactive",
          });
          httpClient
            .put(
              config.REACT_APP_BASEURL + "/admin/suspend/" + record.key,
              setData
            )
            .then(function (response) {
              const code = response.data.code;
              if (code === 200) {
                message.success("ระงับผู้ดูแลระบบสำเร็จ");
                setDataFilter(record.key);
              }
            })
            .catch(function (error) {
              console.log(error);
              message.error("ระงับผู้ดูแลระบบไม่สำเร็จ");
            });
          offModal();
        },
      });
      onModal();
    } else {
      const setData = JSON.stringify({
        status: "active",
      });
      httpClient
        .put(config.REACT_APP_BASEURL + "/admin/suspend/" + record.key, setData)
        .then(function (response) {
          const code = response.data.code;
          if (code === 200) {
            message.success("อนุญาติผู้ดูแลระบบสำเร็จ");
          }
        })
        .catch(function (error) {
          message.error("อนุญาติผู้ดูแลระบบไม่สำเร็จ");
        });
    }
  };

  const onSearch = (value) => {
    setDataSearch(value);
    setLoading(true);
  };

  const onModal = () => {
    setIsModalVisible(true);
  };

  const offModal = () => {
    setIsModalVisible(false);
  };

  const columns = [
    {
      title: "ลำดับ",
      dataIndex: "order",
      key: "order",
      width: "20px",
    },
    {
      title: "อีเมล",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "ชื่อ - นามสกุล",
      dataIndex: "name",
      key: "name",
      responsive: ["md"],
    },
    {
      title: "",
      width: "15%",
      key: "action",
      render: (record) => (
        <Space>
          <Tooltip placement="bottom" title="แก้ไข">
            <Link to={`/manage/profile/${record.key}`}>
              <Button
                icon={<EditOutlined className="manage-icon-edit" />}
                size={"middle"}
              />
            </Link>
          </Tooltip>
          <Tooltip placement="bottom" title="ลบ">
            <Button
              icon={<DeleteOutlined className="manage-icon-delete" />}
              size={"middle"}
              onClick={() => {
                onDelete(record);
              }}
            />
          </Tooltip>
          <Tooltip placement="bottom" title="ระงับ">
            <Switch
              size="small"
              defaultChecked={record.status}
              onClick={(e) => {
                onSuspend(e, record);
              }}
            />
          </Tooltip>
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
        <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="manage-content">
        <Row>
          <Col
            xs={24}
            sm={24}
            md={14}
            lg={14}
            xl={16}
            style={{ marginBottom: "5px" }}
          >
            <Form
              form={formValue}
              name="email"
              layout="inline"
              onFinish={onInsert}
            >
              <Form.Item>
                <div className="manage-Text">ผู้ดูแลระบบ</div>
              </Form.Item>
              <Form.Item
                name="email"
                rules={[
                  {
                    required: false,
                    pattern: /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i,
                    message: "Enter a valid email address!",
                  },
                  {
                    required: true,
                    message: "Please enter your E-mail!",
                  },
                ]}
                className="manage-Input"
              >
                <Input placeholder="กรอกอีเมล" />
              </Form.Item>
              <Form.Item>
                <Button
                  className="manage-button"
                  type="primary"
                  htmlType="submit"
                  icon={<PlusOutlined />}
                >
                  เพิ่ม
                </Button>
              </Form.Item>
            </Form>
          </Col>
          <Col
            md={10}
            lg={10}
            xl={8}
            style={{ textAlign: "right", paddingLeft: "80px" }}
          >
            <Search
              placeholder="ค้นหา"
              className="manage-search"
              onSearch={onSearch}
            />
          </Col>
        </Row>
        <Tables
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          setPagination={setPagination}
          pagination={pagination}
        />
      </Content>
      <Modals
        isModalVisible={isModalVisible}
        onOk={modalData.onOk}
        onCancel={offModal}
        modalData={modalData}
      >
        {modalData.type === "show" ? (
          <>
            <div style={{ marginLeft: "80px" }}>
              อีเมล : {modalData.content.email}
            </div>
            <div style={{ marginLeft: "80px" }}>
              รหัสผ่าน : {modalData.content.password}
            </div>
            <div
              style={{ marginLeft: "40px", marginTop: "20px", color: "red" }}
            >
              *ระบบจะแสดงข้อมูลเพียงครั้งเดียว*
            </div>
          </>
        ) : (
          <p style={{ marginLeft: "80px" }}>{modalData.content}</p>
        )}
      </Modals>
    </>
  );
};

export default Manage;
