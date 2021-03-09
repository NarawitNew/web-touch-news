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
import {
  ExclamationCircleOutlined,
  HomeOutlined,
  UserOutlined,
} from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";
import {
  getDataRead,
  postData,
  postIamge,
  putData,
} from "core/actions/collection";
import {
  imageSave,
  imageUpLoad,
  logout,
  resetPassword,
  user,
  userPassword,
  userUpdate,
} from "core/schemas/index";

import { Context } from "../../context";
import FormData from "form-data";
import { Link } from "react-router-dom";
import Modals from "components/layout/modal";

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
  const dataUser = context.user;
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
    setImage(dataUser.image);
    formValue.setFieldsValue({
      email: dataUser.email,
      firstname: dataUser.firstname,
      lastname: dataUser.lastname,
      passwordNew: "",
      passwordConfirm: "",
    });
  };

  const getDataAdmin = () => {
    getDataRead(user, setId)
      .then(function (response) {
        const code = response?.code || "";
        const data = response?.data || "";
        if (code === 200) {
          setImage(data.image);
          formValue.setFieldsValue({
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
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
    postData(logout)
      .then(function (response) {
        const code = response?.code || "";
        if (code === 200) {
          localStorage.clear();
          window.location.href = "/login";
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
      okColor: "var(--warning-color)",
      okText: "ตกลง",
      content: "คุณต้องการยืนยันการสร้างรหัสใหม่นี้หรือไม่ ! ",
      onOk() {
        putData(resetPassword, setId)
          .then(function (response) {
            const code = response?.code || "";
            const data = response?.data || "";
            if (code === 201) {
              setModalData({
                type: "show",
                icon: <UserOutlined className="manage-icon-insert" />,
                title: "เปลี่ยนรหัสผ่านสำเร็จ",
                okColor: "var(--primary-color)",
                okText: "ตกลง",
                onOk() {
                  setIsModalVisible(false);
                },
                content: {
                  email: data.email,
                  password: data.password,
                },
              });
              setIsModalVisible(true);
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
    setIsModalVisible(true);
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
    console.log("value", value);
    if (showInputPass === true) {
      const setData = JSON.stringify({
        password: value.password,
      });
      putData(userPassword, setId, setData)
        .then(function (response) {
          message.success("เปลี่ยนรหัสผ่านสำเร็จ");
          onLogout();
        })
        .catch(function (error) {
          console.log(error);
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
      putData(userUpdate, setId, setData)
        .then(function (response) {
          if (response?.code === 200) {
            message.success(response?.message);
            context.setData({
              image: image,
              emali: dataUser.email,
              firstname: value.firstname,
              lastname: value.lastname,
            });
            getData();
            let setData = new FormData();
            setData.append("url", image);
            postIamge(imageSave, setData)
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

  const customRequest = (option) => {
    setSpinningImage(true);
    let setData = new FormData();
    setData.append("sampleFile", option.file);
    setData.append("save", false);
    postIamge(imageUpLoad, setData)
      .then(function (response) {
        const status = response?.status || "";
        const data = response?.data || "";
        if (status === 200) {
          setImage(data.url);
          setSpinningImage(false);
        } else {
          setSpinningImage(true);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <>
      <Breadcrumb style={{ padding: "1px 0" }}>
        <Breadcrumb.Item>
          <HomeOutlined />
        </Breadcrumb.Item>
        {params.state === "manage" && (
          <Breadcrumb.Item>ผู้ดูแลระบบ</Breadcrumb.Item>
        )}
        <Breadcrumb.Item>โปรไฟล์</Breadcrumb.Item>
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
                <Button
                  type="link"
                  onClick={() =>
                    params.state === "manage"
                      ? conFirmPassword()
                      : ShowInputPassword()
                  }
                >
                  <u>เปลี่ยนรหัสผ่าน</u>
                </Button>
              </Form.Item>
              {showInputPass === true && (
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
              )}
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
                    <Button className="profile-button">ยกเลิก</Button>
                  </Link>
                ) : (
                  <Button className="profile-button" onClick={cancelUpdate}>
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
        onCancel={() => setIsModalVisible(false)}
        modalData={modalData}
      >
        {modalData.type === "show" ? (
          <>
            <div className="profile-marginLeft-80">
              อีเมล : {modalData.content.email}
            </div>
            <div className="profile-marginLeft-80">
              รหัสผ่าน : {modalData.content.password}
            </div>
            <div className="comment-text">
              *ระบบจะแสดงข้อมูลเพียงครั้งเดียว*
            </div>
          </>
        ) : (
          <p className="profile-marginLeft-80">{modalData.content}</p>
        )}
      </Modals>
    </>
  );
};

export default Profile;
