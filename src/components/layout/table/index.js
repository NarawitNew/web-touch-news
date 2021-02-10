import { Table } from 'antd'

const Tables = (props) => {
    const pagination = {
        pageSize: props.perPage,
        total: props.totalPage,
        current: props.pageCurrent
    }
    const onChange = (pagination, filters, sorter, extra) => {
        // console.log('params', pagination, filters, sorter, extra)
        props.setCurrentPage(pagination.current)
    }
    return (
        <>
            <Table
                loading={props.loading}
                pagination={false}
                columns={props.columns}
                dataSource={props.dataSource}
                onChange={onChange}
                style={{ marginTop: '10px' }}
                pagination={pagination}
                scroll={{ x: 'fit-content' }}
            />
        </>
    );
}
export default Tables