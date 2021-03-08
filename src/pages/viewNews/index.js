import {
  Breadcrumb,
  Button,
  Col,
  Dropdown,
  Image,
  Input,
  Layout,
  Menu,
  Row,
  Select,
  Tag,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined, MoreOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";

import { FroalaView } from "components/layout/froala/index";
import { Link } from "react-router-dom";
import Modals from "components/layout/modal";
import Timeline from "components/layout/timeline";
import config from "config";
import { httpClient } from "HttpClient";
import imgError from "assets/image/img_error2.png";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const View = (props) => {
  const params = props.match.params;
  const role = localStorage.getItem("role");
  const [dataNews, setDataNews] = useState({});
  const [statusNews, setStatusNews] = useState();
  const [cause, setCause] = useState();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    icon: null,
    title: "",
    okColor: "",
    content: null,
    okText: "",
  });

  useEffect(() => {
    getData();
  }, [params]);

  const getData = () => {
    httpClient
      .get(config.REACT_APP_BASEURL + "/news/info/" + params.id)
      .then(function (response) {
        const code = response.data.code;
        const data = response.data.data;
        const hashtag = response.data.data.hashtag;
        const credit = response.data.data.credit;
        if (code === 200) {
          const hashtagMap = hashtag.map((hashtag, key) => {
            hashtag = (
              <Tag key={key} color="#87d068">
                {hashtag}
              </Tag>
            );
            return hashtag;
          });
          const creditMap = credit.map((credit, key) => {
            credit = (
              <Tag key={key} color="#108ee9">
                {credit}
              </Tag>
            );
            return credit;
          });
          setDataNews({ ...data, hashtag: hashtagMap, credit: creditMap });
          setStatusNews(data.status);
          setCause(data.cause);
        } else {
          setDataNews();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const handleSelectStatus = (value) => {
    setStatusNews(value);
  };

  const changeCause = ({ target: { value } }) => {
    setCause(value);
  };

  const submitUpdate = (status) => {
    const setData = JSON.stringify({
      status: status,
      cause: cause,
    });
    httpClient
      .put(
        config.REACT_APP_BASEURL + "/news/update_status/" + params.id,
        setData
      )
      .then(function (response) {
        const code = response.data.code;
        if (code === 200) {
          message.success(response.data.message);
          setDataNews({ ...dataNews, status: status });
          props.history.push(`/home`);
        } else {
          message.error(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onDelete = () => {
    setModalData({
      type: "confirm",
      icon: <DeleteOutlined className="manage-icon-delete" />,
      title: "คุณต้องการลบข่าวนี้ หรือไม่ ! ",
      okColor: "red",
      okText: "ลบ",
      onOk() {
        offModal();
        httpClient
          .delete(config.REACT_APP_BASEURL + "/news/" + params.id)
          .then(function (response) {
            const code = response.data.code;
            if (code === 200) {
              message.success(response.data.message);
              props.history.push("/home");
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error(error.data.message);
          });
      },
      content: dataNews.topic,
    });
    onModal();
  };
  const onModal = () => {
    setIsModalVisible(true);
  };

  const offModal = () => {
    setIsModalVisible(false);
  };

  const onErrorImg = (e) => {
    e.target.src = imgError;
  };

  const menu = () => {
    if (dataNews.status === "Draft" || dataNews.status === "Edit") {
      return (
        <Menu>
          <Menu.Item>
            <Link to={`/home/edit/${params.id}`}>
              <EditOutlined style={{ color: "orange" }}></EditOutlined>
              แก้ไข
            </Link>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              onDelete();
            }}
          >
            <DeleteOutlined style={{ color: "red" }}></DeleteOutlined>
            ลบ
          </Menu.Item>
        </Menu>
      );
    } else {
      return (
        <Menu>
          <Menu.Item disabled>
            <EditOutlined style={{ color: "#DADADA" }}></EditOutlined>
            แก้ไข
          </Menu.Item>
          <Menu.Item disabled>
            <DeleteOutlined style={{ color: "#DADADA" }}></DeleteOutlined>
            ลบ
          </Menu.Item>
        </Menu>
      );
    }
  };

  return (
    <>
      <Breadcrumb style={{ padding: "1px 0" }}>
        <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
        <Breadcrumb.Item>ข่าว</Breadcrumb.Item>
      </Breadcrumb>
      <Content className="view-Content">
        <Row align="top">
          <Col span={23}>
            <div className="view-titel-news">{dataNews.topic}</div>
          </Col>
          {role === "admin" ? (
            <Col span={1} style={{ textAlign: "right", paddingTop: "16px" }}>
              <Dropdown placement="bottomRight" overlay={menu()}>
                <a
                  style={{ color: "black" }}
                  onClick={(e) => e.preventDefault()}
                >
                  <MoreOutlined style={{ fontSize: "20px" }} />
                </a>
              </Dropdown>
            </Col>
          ) : null}
        </Row>
        <hr />
        <Row justify="center">
          <Col span={10} justify="center">
            <Image
              style={{ padding: "20px" }}
              width={"100%"}
              src={dataNews.image}
              onError={onErrorImg}
            />
          </Col>
        </Row>
        <Row justify="center" style={{ padding: "20px" }}>
          <Col span={16}>
            <FroalaView model={dataNews.content} />
          </Col>
        </Row>
        <Row gutter={[0, 10]}>
          <Col flex="60px">เครดิต</Col>
          <Col>{dataNews.credit}</Col>
        </Row>
        <Row gutter={[0, 10]}>
          <Col flex="60px">แฮชแท็ก</Col>
          <Col>{dataNews.hashtag}</Col>
        </Row>
        <Row gutter={[0, 10]}>
          <Col flex="60px">ผู้ดูแล </Col>
          <Col>{dataNews.by}</Col>
        </Row>
        <hr />
        <Row>
          <Col span={10}>
            <h3>ไทม์ไลน์</h3>
            <div style={{ marginTop: "20px" }}>
              <Timeline idNews={params.id} />
            </div>
          </Col>
          {role === "superadmin" ? (
            <Col span={12} offset={2}>
              <h3>เปลี่ยนสถานะข่าว</h3>
              <Row style={{ marginTop: "20px" }}>
                <Col span={4}>สถานะ :</Col>
                <Col span={20}>
                  <Input.Group>
                    <Select
                      placeholder={statusNews}
                      onChange={handleSelectStatus}
                      className="view-Input-Group"
                    >
                      <Option value="Draft">Draft</Option>
                      <Option value="Approve">Approve</Option>
                      <Option value="Public">Public</Option>
                    </Select>
                  </Input.Group>
                </Col>
              </Row>
              <Row>
                <Col span={20} offset={4}>
                  {statusNews === "Draft" && (
                    <div className="view-Input-TextArea">
                      <div style={{ color: "red" }}>
                        *กรุณากรอกสิ่งที่ต้องแก้ไข
                      </div>
                      <TextArea
                        value={cause}
                        autoSize={{ minRows: 1, maxRows: 5 }}
                        onChange={changeCause}
                      />
                    </div>
                  )}
                </Col>
              </Row>
            </Col>
          ) : null}
        </Row>
        <Row justify="end" style={{ marginTop: "20px" }}>
          {role === "superadmin" ? (
            <>
              <Button
                type="primary"
                ghost
                className="view-Button"
                onClick={() => {
                  submitUpdate(statusNews);
                }}
              >
                บันทึก
              </Button>
              <Button className="view-Button" onClick={onDelete} danger>
                ลบ
              </Button>
            </>
          ) : dataNews.status === "Draft" ? (
            <Button
              type="primary"
              ghost
              className="view-Button"
              onClick={() => {
                submitUpdate("Submit");
              }}
            >
              ส่ง
            </Button>
          ) : dataNews.status === "Submit" ? (
            <Button
              type="primary"
              ghost
              className="view-Button"
              onClick={() => {
                submitUpdate("Edit");
              }}
            >
              ขอแก้ไข
            </Button>
          ) : null}
          <Link to="/home">
            <Button className="view-Button">ย้อนกลับ</Button>
          </Link>
        </Row>
        <Modals
          isModalVisible={isModalVisible}
          onOk={modalData.onOk}
          onCancel={offModal}
          modalData={modalData}
        >
          <p className="truncate-text">{modalData.content}</p>
        </Modals>
      </Content>
    </>
  );
};

export default View;
