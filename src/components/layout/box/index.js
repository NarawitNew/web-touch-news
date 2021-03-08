import { Col, Row } from "antd";

const Box = (props) => {
  return (
    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
      <div className={"box " + props.color}>
        <Row align="middle">
          <Col span={8} offset={4}>
            <div className="box-icon">{props.icon}</div>
          </Col>
          <Col span={8}>
            <p className="admin-home-number"> {props.number}</p>
            <p className="admin-home-text">{props.text}</p>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

export default Box;
