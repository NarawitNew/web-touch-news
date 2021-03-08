import { HomeOutlined, SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import React, { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const { Sider } = Layout;

const Siderbar = (props) => {
  const type = localStorage.getItem("role");
  const [activeMenu, setActiveMenu] = useState(props.location.pathname);

  useEffect(() => {
    setActiveMenu(props.location.pathname);
    console.log("props.location", props.location);
    if (props.location.pathname === "/") {
      setActiveMenu("/home");
    } else if (props.location.pathname.substring(1, 5) === "home") {
      setActiveMenu("/home");
    }
  }, [props.location.pathname]);

  return (
    <Sider
      width={200}
      className="site-layout-background"
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="logo">
        {type === "superadmin" ? <>SUPER ADMIN</> : <>ADMIN</>}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[activeMenu]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item
          key="/home"
          onClick={() => setActiveMenu("/home")}
          icon={<HomeOutlined />}
        >
          <Link to="/home">หน้าแรก</Link>
        </Menu.Item>
        {type === "superadmin" ? (
          <Menu.Item
            key="/manage"
            onClick={() => setActiveMenu("/manage")}
            icon={<UserOutlined />}
          >
            <Link to="/manage">ผู้ดูแลระบบ</Link>
          </Menu.Item>
        ) : null}
        <Menu.Item
          key="/profile"
          onClick={() => setActiveMenu("/profile")}
          icon={<SettingOutlined />}
        >
          <Link to="/profile">โปรไฟล์</Link>
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default Siderbar;
