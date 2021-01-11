import { Modal } from 'antd'

const Modals = (props) => {
    return (
        <Modal
            visible={props.isModalVisible}
            title={[<div className="modal-Text">{props.modalData.icon}{props.modalData.title}</div>]}
            cancelButtonProps={{ style: { display: props.modalData.cancelButton } }}
            okButtonProps={{ style: props.modalData.okButton }}
            onOk={props.onOk}
            okText={props.modalData.okText}
            onCancel={props.onCancel}
            cancelText='ยกเลิก'
        >
            {props.modalData.type === 'show' ?
                <>
                    <p style={{ paddingLeft: '60px' }}>อีเมล : {props.modalData.email}</p>
                    <p style={{ paddingLeft: '60px' }}>รหัสผ่าน :</p>
                    <p style={{ color: 'red', paddingLeft: '40px' }}>*ระบบจะแสดงข้อมูลเพียงครั้งเดียว*</p>
                </>
                :
                <>
                    <p style={{ paddingLeft: '100px' }}>{props.modalData.email}</p>
                </>}
        </Modal>

    );
}
export default Modals