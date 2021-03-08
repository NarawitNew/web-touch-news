import Content from "components/router/index";
import Header from "components/layout/header/index";
import { Layout } from "antd";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Sider from "components/layout/sider/index";

function App(props) {
  const type = localStorage.getItem("role");

  return (
    <Layout breakpoint="xl" style={{ minHeight: "100vh" }}>
      <Header />
      <Layout>
        <Router>
          <Sider {...props} />
          <Layout style={{ padding: "0 24px 24px" }}>
            <Content type={type} />
          </Layout>
        </Router>
      </Layout>
    </Layout>
  );
}
export default App;
