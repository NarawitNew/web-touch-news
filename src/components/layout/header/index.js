import {
  Avatar,
  Badge,
  Col,
  Layout,
  Popover,
  Row,
  Tooltip,
  message,
} from "antd";
import { BellOutlined, ExportOutlined } from "@ant-design/icons";
import React, { useContext, useEffect, useState } from "react";

import { Context } from "../../../context";
import config from "config";
import { httpClient } from "HttpClient";

const { Header } = Layout;

const Headerbar = () => {
  const context = useContext(Context);
  const user = context.user;
  const [dataUser, setDataUser] = useState({
    image: "",
    firstname: "",
    badge: null,
  });
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  useEffect(() => {
    getData();
  }, [user.firstname, user.lastname, user.image]);

  const getData = () => {
    const setData = localStorage.getItem("id");
    httpClient
      .get(config.REACT_APP_BASEURL + "/user/" + setData)
      .then(function (response) {
        const code = response.data.code;
        const data = response.data.data;
        if (code === 200) {
          setDataUser({
            image: data.image,
            firstname: data.firstname,
            badge: 2,
          });
          context.setData({
            email: data.email,
            image: data.image,
            firstname: data.firstname,
            lastname: data.lastname,
          });
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
          message.success("ออกจากระบบสำเร็จ");
          window.location.reload();
        } else {
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <Header className="header">
      <Row>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="header-text">touch korat news</div>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
          <Row justify="end">
            <Col>
              <Avatar size={40} src={dataUser.image} />
            </Col>
            <Col className="header-name">{dataUser.firstname}</Col>
            <Col className="header-col-icon">
              <Popover
                placement="bottomRight"
                content={
                  <div>
                    <p>Content</p>
                    <p>Content</p>
                  </div>
                }
                // title="Title"
                trigger="click"
                visible={visible}
                onVisibleChange={handleVisibleChange}
              >
                {/* <Badge count={dataUser.badge} size="small">
                                    <BellOutlined className="header-icon" />
                                </Badge> */}
              </Popover>
            </Col>
            <Col>
              <Tooltip placement="bottomRight" title="ออกจากระบบ">
                <ExportOutlined className="header-icon" onClick={onLogout} />
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </Header>
  );
};
export default Headerbar;
