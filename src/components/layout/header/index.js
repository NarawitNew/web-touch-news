import { Avatar, Col, Layout, Row, Tooltip } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { getDataRead, postData } from "core/actions/collection";
import { logout, user } from "core/schemas/index";

import { Context } from "../../../context";
import { ExportOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Headerbar = () => {
  const context = useContext(Context);
  const users = context.user;
  const [dataUser, setDataUser] = useState({
    image: "",
    firstname: "",
  });

  useEffect(() => {
    getData();
  }, [(users.firstname, users.lastname, users.image)]);

  const getData = () => {
    const setData = localStorage.getItem("id");
    getDataRead(user, setData)
      .then(function (response) {
        const code = response?.code;
        const data = response?.data || "";
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

  return (
    <Header className="header">
      <Row>
        <Col span={12}>
          <div className="header-text">
            T<p className="login-text-o">o</p>uch k
            <p className="login-text-o">o</p>rat news
          </div>
        </Col>
        <Col span={12}>
          <Row justify="end">
            <Col>
              <Avatar size={40} src={dataUser.image} />
            </Col>
            <Col className="header-name">{dataUser.firstname}</Col>
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
