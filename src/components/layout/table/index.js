import { Table } from 'antd'

const Tables = (props) => {
    return (
        <>
            <Table columns={props.columns} dataSource={props.dataSource} style={{ marginTop: '10px' }} />
        </>
    );
}
export default Tables