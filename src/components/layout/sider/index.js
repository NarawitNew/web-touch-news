import { Link } from "react-router-dom";
import { HomeOutlined , UserOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';

const { Sider } = Layout;

const Siderbar = () => {
    return (
        <Sider width={280} className="site-layout-background" >
            <div className="logo">SUPER ADMIN</div>
            <Menu
                mode="inline"
                defaultSelectedKeys={['/home']}
                style={{ height: '100%', borderRight: 0 }}
            >
                <Menu.Item key="/home" icon={<HomeOutlined/>}>
                    <Link to="/home">หน้าแรก</Link>
                </Menu.Item>
                <Menu.Item key="/manage" icon={<UserOutlined/>}>
                    <Link to="/manage" >ผู้ดูแลระบบ</Link>
                </Menu.Item>
                <Menu.Item key="/profile" icon={<SettingOutlined/>}>
                    <Link to="/profile">โปรไฟล์</Link>
                </Menu.Item>
            </Menu>
        </Sider>
    );
}
export default Siderbar