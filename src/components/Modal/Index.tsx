import { Dispatch, SetStateAction } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import BootstrapModal from 'react-bootstrap/Modal';
const Index = (props:{ show: boolean,onHide: () => void,pathname: string, exportEventOrders: Function, exportAllEventOrders: Function,setOpenModal:Dispatch<SetStateAction<boolean>> }) => {
    
  return (
    <BootstrapModal
    {...props}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
  >
    <BootstrapModal.Header closeButton className='border-0 py-2 '>
      <BootstrapModal.Title id="contained-modal-title-vcenter">
      Are you sure? export reports
      </BootstrapModal.Title>
    </BootstrapModal.Header>
    <BootstrapModal.Body className='border-0 py-2 '>
    <Form.Check
            label="change something"
            name="group1"
            type={'radio'}
            id='change something'
          />
      <Form.Check
          
            label="change something 2"
            name="group1"
            type={'radio'}
            id='change something 2'
          />
    </BootstrapModal.Body>
    <BootstrapModal.Footer className='border-0 py-2 '>
      <Button onClick={props.onHide} className="p-2 border-0 btn btn-secondary" >Cancel</Button>
      <Button
      className="p-2"
      onClick={(e) => {
        if (!props.pathname.endsWith("/manage/events")) {
            props.exportEventOrders(props.pathname.includes('/da') ? props.pathname.split('/')[4] : props.pathname.split('/')[3]);
        } else {
            props.exportAllEventOrders();
            props.setOpenModal(false)
        }
    }}
      >Submit</Button>
    </BootstrapModal.Footer>
  </BootstrapModal>
  )
}

export default Index