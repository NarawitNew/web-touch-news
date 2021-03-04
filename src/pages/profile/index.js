import {
  Avatar,
  Breadcrumb,
  Button,
  Col,
  Form,
  Input,
  Layout,
  Row,
  Spin,
  Upload,
  message,
} from "antd";
import { ExclamationCircleOutlined, UserOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";

import { Context } from "../../context";
import FormData from "form-data";
import { Link } from "react-router-dom";
import Modals from "components/layout/modal";
import axios from "axios";
import config from "config";
import { httpClient } from "HttpClient";

const { Content } = Layout;
const layout = {
  labelCol: {
    xs: { span: 2 },
    sm: { span: 6 },
  },
  wrapperCol: {
    span: 20,
  },
};

const Profile = (props) => {
  const context = useContext(Context);
  const [formValue] = Form.useForm();
  const params = props.match.params;
  const [image, setImage] = useState("");
  const [spinningImage, setSpinningImage] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showInputPass, setShowInputPass] = useState(false);
  const [modalData, setModalData] = useState({
    type: "",
    icon: null,
    title: "",
    okColor: "",
    content: "",
    okText: "",
  });
  const setId =
    params.state === "manage" ? params.id : localStorage.getItem("id");

  useEffect(() => {
    if (props.location.pathname === "/profile") {
      getData();
    } else {
      getDataAdmin();
    }
  }, [params, context]);

  const getData = () => {
    const data = context.user;
    setImage(data.image);
    formValue.setFieldsValue({
      email: data.email,
      firstname: data.firstname,
      lastname: data.lastname,
      passwordNew: "",
      passwordConfirm: "",
    });
  };

  const getDataAdmin = () => {
    httpClient
      .get(config.REACT_APP_BASEURL + "/user/" + setId)
      .then(function (response) {
        const code = response.data.code;
        if (code === 200) {
          setImage(response.data.data.image);
          formValue.setFieldsValue({
            email: response.data.data.email,
            firstname: response.data.data.firstname,
            lastname: response.data.data.lastname,
            passwordNew: "",
            passwordConfirm: "",
          });
        } else {
          message.error("โหลดข้อมูลล้มเหลว");
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onLogout = () => {
    httpClient
      .post(config.REACT_APP_BASEURL + "/logout")
      .then(function (response) {
        const code = response.data.code;
        if (code === 200) {
          localStorage.setItem("access_token", "");
          localStorage.setItem("refresh_token", "");
          localStorage.setItem("role", "");
          localStorage.setItem("id", "");
          window.location.reload();
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const conFirmPassword = () => {
    setModalData({
      type: "confirm",
      icon: <ExclamationCircleOutlined className="manage-icon-edit" />,
      title: "ยืนยันการสร้างรหัสผ่านใหม่",
      okColor: "orange",
      okText: "ตกลง",
      content: "คุณต้องการยืนยันการสร้างรหัสใหม่นี้หรือไม่ !!! ",
      onOk() {
        httpClient
          .put(config.REACT_APP_BASEURL + "/admin/reset_password/" + setId)
          .then(function (response) {
            const code = response.data.code;
            if (code === 201) {
              setModalData({
                type: "show",
                icon: <UserOutlined className="manage-icon-insert" />,
                title: "เปลี่ยนรหัสผ่านสำเร็จ",
                okColor: "#216258",
                okText: "ตกลง",
                onOk() {
                  offModal();
                },
                content: {
                  email: response.data.data.email,
                  password: response.data.data.password,
                },
              });
              onModal();
            } else {
              message.error("เปลี่ยนรหัสผ่านไม่สำเร็จ");
            }
          })
          .catch(function (error) {
            console.log(error);
            message.error("เปลี่ยนรหัสผ่านไม่สำเร็จ");
          });
      },
    });
    onModal();
  };

  const cancelUpdate = () => {
    getData();
    setShowInputPass(false);
    formValue.setFieldsValue({
      password: "",
      confirm: "",
    });
  };

  const submitUpdate = (value) => {
    if (showInputPass === true) {
      const setData = JSON.stringify({
        password: value.password,
      });
      httpClient
        .put(config.REACT_APP_BASEURL + "/user/password/" + setId, setData)
        .then(function (response) {
          message.success("เปลี่ยนรหัสผ่านสำเร็จ");
          onLogout();
        })
        .catch(function (error) {
          message.error("เปลี่ยนรหัสผ่านไม่สำเร็จ");
        });
      formValue.setFieldsValue({
        password: "",
        confirm: "",
      });
    } else {
      const setData = JSON.stringify({
        firstname: value.firstname,
        lastname: value.lastname,
        image: image,
      });
      httpClient
        .put(config.REACT_APP_BASEURL + "/user/update/" + setId, setData)
        .then(function (response) {
          if (response.data.code === 200) {
            message.success(response.data.message);
            context.setData({
              image: image,
              firstname: value.firstname,
              lastname: value.lastname,
            });
            let setData = new FormData();
            setData.append("url", image);
            axios
              .post(config.REACT_APP_IMGAE + "/savefile", setData)
              .then(function (response) {})
              .catch(function (error) {
                console.log(error);
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  };

  const ShowInputPassword = () => {
    if (showInputPass === false) {
      setShowInputPass(true);
    } else {
      setShowInputPass(false);
      formValue.setFieldsValue({
        password: "",
        confirm: "",
      });
    }
  };

  const onModal = () => {
    setIsModalVisible(true);
  };

  const offModal = () => {
    setIsModalVisible(false);
  };

  const customRequest = (option) => {
    setSpinningImage(true);
    let setData = new FormData();
    setData.append("sampleFile", option.file);
    setData.append("save", false);
    axios
      .post(config.REACT_APP_IMGAE + "/upload", setData)
      .then(function (response) {
        const status = response.status;
        const data = response.data;
        if (status === 200) {
          setImage(data.url);
          setSpinningImage(false);
        } else {
          setSpinningImage(false);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Breadcrumb style={{ margin: "4px 0" }}>
        {params.state === "manage" ? (
          <>
            <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
            <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
          </>
        ) : (
          <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
        )}
      </Breadcrumb>
      <Content className="profile-layout-background">
        <Row justify="center" gutter={[16, 16]} style={{ marginTop: "20px" }}>
          <Col>
            <Spin spinning={spinningImage}>
              <Avatar
                size={{ xs: 150, sm: 150, md: 150, lg: 150, xl: 150, xxl: 250 }}
                src={image}
              />
            </Spin>
          </Col>
        </Row>
        <Row justify="center" gutter={[16, 16]}>
          <Col>
            <Upload
              listType="picture"
              customRequest={customRequest}
              showUploadList={false}
            >
              <Button>อัพโหลดรูปภาพโปรไฟล์</Button>
            </Upload>
          </Col>
        </Row>
        <Row style={{ marginTop: "20px" }}>
          <Col
            xs={{ span: 22, offset: 1 }}
            sm={{ span: 22, offset: 1 }}
            md={{ span: 18, offset: 2 }}
            lg={{ span: 18, offset: 2 }}
            xl={{ span: 18, offset: 2 }}
          >
            <Form form={formValue} onFinish={submitUpdate}>
              <Form.Item name="email" label="อีเมล" {...layout}>
                <Input disabled={true} />
              </Form.Item>
              <Form.Item name="firstname" label="ชื่อ" {...layout}>
                <Input disabled={showInputPass} />
              </Form.Item>
              <Form.Item name="lastname" label="นามสกุล" {...layout}>
                <Input disabled={showInputPass} />
              </Form.Item>
              <Form.Item className="profile-right">
                {params.state === "manage" ? (
                  <Button type="link" onClick={conFirmPassword}>
                    <u>เปลี่ยนรหัสผ่าน</u>
                  </Button>
                ) : (
                  <Button type="link" onClick={ShowInputPassword}>
                    <u>เปลี่ยนรหัสผ่าน</u>
                  </Button>
                )}
              </Form.Item>
              {showInputPass === true ? (
                <>
                  <Form.Item
                    {...layout}
                    name="password"
                    label="รหัสผ่านใหม่"
                    rules={[
                      {
                        required: true,
                        message: "รหัสผ่านไม่ถูกต้อง !",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password />
                  </Form.Item>
                  <Form.Item
                    name="confirm"
                    label="ยืนยันรหัสผ่านใหม่"
                    {...layout}
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "รหัสผ่านไม่ถูกต้อง !",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(
                            new Error("รหัสผ่านไม่ถูกต้อง")
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password />
                  </Form.Item>
                </>
              ) : null}
              <Form.Item className="profile-right">
                <Button
                  className="profile-button"
                  type="primary"
                  ghost
                  htmlType="submit"
                >
                  บันทึก
                </Button>
                {params.state === "manage" ? (
                  <Link to="/manage">
                    <Button
                      className="profile-button"
                      style={{ marginLeft: "10px" }}
                    >
                      ยกเลิก
                    </Button>
                  </Link>
                ) : (
                  <Button
                    className="profile-button"
                    onClick={cancelUpdate}
                    style={{ marginLeft: "10px" }}
                    disabled={false}
                  >
                    ยกเลิก
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
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
              รหัสผ่าน {modalData.content.password}
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

export default Profile;
