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
import React, { useContext, useEffect, useState } from "react";
import { deleteData, getDataRead, putData } from "core/actions/collection";
import { news, newsRead, newsStatus } from "core/schemas/index";

import { Context } from "context";
import { FroalaView } from "components/layout/froala/index";
import { Link } from "react-router-dom";
import Modals from "components/layout/modal";
import Timeline from "components/layout/timeline";
import imgError from "assets/image/img_error2.png";

const { Content } = Layout;
const { Option } = Select;
const { TextArea } = Input;

const View = (props) => {
  const context = useContext(Context);
  const params = props.match.params;
  const role = context.user.role;
  const [dataNews, setDataNews] = useState({});
  const [statusNews, setStatusNews] = useState("");
  const [cause, setCause] = useState("");
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
    getDataRead(newsRead, params.id)
      .then(function (response) {
        const data = response?.data || "";
        const { hashtag, credit } = response?.data || "";
        if (response?.code === 200) {
          const hashtagMap = hashtag.map((hashtag, key) => {
            hashtag = (
              <Tag key={key} color="var(--success-color)">
                {hashtag}
              </Tag>
            );
            return hashtag;
          });
          const creditMap = credit.map((credit, key) => {
            credit = (
              <Tag key={key} color="var(--link-color)">
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

  const submitUpdate = (status) => {
    const setData = JSON.stringify({
      status: status,
      cause: cause,
    });
    putData(newsStatus, params.id, setData)
      .then(function (response) {
        if (response?.code === 200) {
          message.success(response?.message);
          setDataNews({ ...dataNews, status: status });
          props.history.push(`/home`);
        } else {
          message.error(response?.message);
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
      okColor: "var(--error-color)",
      okText: "ลบ",
      onOk() {
        setIsModalVisible(false);
        deleteData(news, params.id)
          .then(function (response) {
            if (response?.code === 200) {
              message.success(response?.message);
              props.history.push("/home");
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error(error?.message);
          });
      },
      content: dataNews.topic,
    });
    setIsModalVisible(true);
  };

  const onErrorImg = (e) => {
    e.target.src = imgError;
  };

  const menu = () => {
    return (
      <Menu>
        <Menu.Item disabled={dataNews.status === "Draft" ? false : true}>
          <Link to={`/home/edit/${params.id}`}>
            <EditOutlined
              style={{
                color:
                  dataNews.status === "Draft"
                    ? "var(--warning-color)"
                    : "var(--gray-color)",
              }}
            ></EditOutlined>
            แก้ไข
          </Link>
        </Menu.Item>
        <Menu.Item
          disabled={dataNews.status === "Draft" ? false : true}
          onClick={() => {
            onDelete();
          }}
        >
          <DeleteOutlined
            style={{
              color:
                dataNews.status === "Draft"
                  ? "var(--error-color)"
                  : "var(--gray-color)",
            }}
          ></DeleteOutlined>
          ลบ
        </Menu.Item>
      </Menu>
    );
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
                      onChange={(value) => setStatusNews(value)}
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
                        onChange={({ target: { value } }) => setCause(value)}
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
          onCancel={() => setIsModalVisible(false)}
          modalData={modalData}
        >
          <p className="truncate-text">{modalData.content}</p>
        </Modals>
      </Content>
    </>
  );
};

export default View;
