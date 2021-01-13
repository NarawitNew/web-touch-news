import { Table } from 'antd'

const Tables = (props) => {
    return (
        <>
            <Table pagination={false} columns={props.columns} dataSource={props.dataSource} style={{ marginTop: '10px' }} />
        </>
    );
}
export default Tables