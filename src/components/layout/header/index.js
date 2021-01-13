import config from 'config'
import axios from 'axios'
import { Layout, Row, Col, Tooltip, Avatar, Badge} from 'antd';
import { ExportOutlined , BellOutlined } from '@ant-design/icons';

const { Header} = Layout;
const username = "narawit"

const Headerbar = () => {
    const onLogout = () => {
        axios.post(`${config.authanURL}/logout`,null)
          .then(function (response) {
            console.log('response:', response.data)
            if (response.data) {
                localStorage.setItem('token', '')
                window.location.reload()
            } else {
            }
          })
          .catch(function (error) {
            console.log(error);
            
          });
      }
    return (
        <Header className="header">
                <Row>
                    <Col span={8}>
                        <div className="header-text">
                            touch korat news
                        </div>
                    </Col>
                    <Col span={8} offset={8}>
                        <Row justify="end">
                            <Col>
                                <Avatar
                                    size={40}
                                    src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
                                />
                            </Col>
                            <Col className="header-name">{username}</Col>
                            <Col className="header-col-icon">
                            <Badge count={1} size="small">
                                <BellOutlined className="header-icon" /> 
                                </Badge>
                            </Col>
                            <Col>
                                <Tooltip placement="bottomRight" title="ออกจากระบบ" >
                                    <ExportOutlined  className="header-icon" onClick={onLogout}/>
                                </Tooltip>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Header>
    );
}
export default Headerbar