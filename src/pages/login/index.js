import { Button, Checkbox, Form, Input, message } from "antd";
import React, { useState } from "react";
import { UnlockOutlined, UserOutlined } from "@ant-design/icons";

import axios from "axios";
import config from "config";

const Login = (props) => {
  const [username] = useState(
    localStorage.getItem("checkbox") ? localStorage.getItem("email") : ""
  );
  const [password] = useState(
    localStorage.getItem("checkbox") ? localStorage.getItem("password") : ""
  );
  const [isCheckbox, setIsCheckbox] = useState(
    localStorage.getItem("checkbox") === "true" ? true : false
  );
  const onFinish = (values) => {
    if (isCheckbox && values.username !== "") {
      localStorage.setItem("email", values.username);
      localStorage.setItem("password", values.password);
      localStorage.setItem("checkbox", isCheckbox);
    } else if (isCheckbox === false) {
      localStorage.setItem("email", "");
      localStorage.setItem("password", "");
      localStorage.setItem("checkbox", isCheckbox);
    }

    const setData = JSON.stringify({
      email: `${values.username}`,
      password: `${values.password}`,
    });
    axios
      .post(config.REACT_APP_BASEURL + "/login", setData)
      .then(function (response) {
        const data = response.data?.data || "";
        if (response.data.code === 200) {
          localStorage.setItem("refresh_token", data.refresh_token);
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("id", data.id);
          message.success(response.data.message);
          props.history.push("/home");
          window.location.reload();
        } else {
          message.error(response.data.message);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onCheckbox = (e) => {
    setIsCheckbox(e.target.checked);
  };

  return (
    <div className="Login">
      <div className="Login-box">
        <div className="Login-herde">
          T<p className="login-text-o">o</p>uch K
          <p className="login-text-o">o</p>rat News
        </div>

        <div className="Login-form">
          <Form
            initialValues={{ username: username, password: password }}
            onFinish={onFinish}
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input
                value="s"
                size="large"
                placeholder="ชื่อผู้ใช้งาน"
                prefix={<UserOutlined />}
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="รหัสผ่าน"
                prefix={<UnlockOutlined />}
              />
            </Form.Item>
            <Form.Item name="isCheckbox">
              <Checkbox checked={isCheckbox} onChange={onCheckbox}>
                บันทึกรหัสผ่าน
              </Checkbox>
            </Form.Item>
            <Form.Item>
              <div className="Login-button">
                <Button size="large" type="primary" htmlType="submit" block>
                  เข้าสู่ระบบ
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Login;
