import { Button, Modal } from 'antd'

const Modals = (props) =>{
    return (
        
        <Modal 
            width={450}
            visible={props.isModalVisible}
            title={<div className="modal-text">{props.modalData.icon}{props.modalData.title}</div>}
            onCancel={props.onCancel}
            footer={[props.modalData.type === 'show' ?
                
                    <Button key={'1'} className="modal-button" onClick={props.onOk}
                        style={{ backgroundColor: 'white', color: props.modalData.okColor, borderColor: props.modalData.okColor }}>
                        {props.modalData.okText}
                    </Button>
                :
                  <div key={'2'}>  <Button  className="modal-button" onClick={props.onCancel}>
                        ยกเลิก
                    </Button>,
                    <Button  className="modal-button" onClick={props.onOk}
                        style={{ backgroundColor: 'white', color: props.modalData.okColor, borderColor: props.modalData.okColor }}>
                        {props.modalData.okText}
                    </Button>
                </div>
            ]}
        >
            {props.children}
        </Modal>

    );
}
export default Modals