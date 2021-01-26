import { HomeOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

import { Link } from "react-router-dom";

const { Sider } = Layout;

const Siderbar = (props) => {
    return (
        <Sider width={200} className="site-layout-background" >
            <div className="logo">
                {props.type === 'super' ?
                    <>SUPER ADMIN</>
                    :
                    <>ADMIN</>
                }
            </div>
            <Menu
                mode="inline"
                defaultSelectedKeys={['/home']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="/home" icon={<HomeOutlined />}>
                    <Link to="/home">หน้าแรก</Link>
                </Menu.Item>
                {props.type === 'super' ?
                    <Menu.Item key="/manage" icon={<UserOutlined />}>
                        <Link to="/manage" >ผู้ดูแลระบบ</Link>
                    </Menu.Item>
                    : <></>
                }
                <Menu.Item key="/profile" icon={<SettingOutlined />}>
                    <Link to="/profile/123456789">โปรไฟล์</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}
export default Siderbar