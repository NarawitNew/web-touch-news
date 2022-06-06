import { Pagination } from 'antd';

const Paginations = (props) => {
    return (
        <div style={{textAlign:'right', marginTop: '10px'}}>
            <Pagination defaultCurrent={props.defaultCurrent} total={props.total} showSizeChanger={false} onChange={props.onChange} />
        </div>
    );
}
export default Paginations