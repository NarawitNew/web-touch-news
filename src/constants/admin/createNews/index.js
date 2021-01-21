import { Breadcrumb, Button, Col, Layout, Row } from 'antd';
import React, { useEffect, useState } from "react"

import { Link } from "react-router-dom";

const { Content } = Layout;


const CreateNews = (props) => {
    const params = props.match.params;
    return (
        <>
            {params.type === "create" ?
                <Breadcrumb style={{ margin: '4px 0' }}>
                    <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
                    <Breadcrumb.Item>เพิ่ม</Breadcrumb.Item>
                </Breadcrumb>
                :
                <Breadcrumb style={{ margin: '4px 0' }}>
                    <Breadcrumb.Item>หน้าแรก</Breadcrumb.Item>
                    <Breadcrumb.Item>แก้ไข</Breadcrumb.Item>
                </Breadcrumb>
            }
            <Content className="create-home-content">
                {params.id}
                <Row justify="end">
                    <Button className="create-home-button" type="primary" ghost>บันทึก</Button>
                    <Link to="/home">
                        <Button className="create-home-button">ยกเลิก</Button>
                    </Link>
                </Row>
            </Content>
        </>
    );
}
export default CreateNews