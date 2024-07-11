import { Dispatch, SetStateAction, useState } from 'react';
import { Form } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import BootstrapModal from 'react-bootstrap/Modal';
import { useTranslations } from 'next-intl';

const Index = (props: { show: boolean, onHide: () => void, pathname: string, exportEventOrders: Function, exportAllEventOrders: Function, setOpenModal: Dispatch<SetStateAction<boolean>> }) => {
  const [selectedOption, setSelectedOption] = useState('all');
  const t = useTranslations('manage-events-layout');

  return (
    <BootstrapModal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <BootstrapModal.Header closeButton className='border-0 py-2 '>
        <BootstrapModal.Title id="contained-modal-title-vcenter">
          {t('export_orders')}
        </BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body className='border-0 py-2 '>
        <Form.Check
          checked={selectedOption === 'all'}
          label={t('all_includes_group_booking')}
          name="group1"
          type={'radio'}
          onChange={() => setSelectedOption('all')}
        />
        <Form.Check
          checked={selectedOption === 'mainAttendee'}
          label={t('unique_invoice_with_header_summary')}
          name="group1"
          type={'radio'}
          onChange={() => setSelectedOption('mainAttendee')}
        />
      </BootstrapModal.Body>
      <BootstrapModal.Footer className='border-0 py-2 '>
        <Button onClick={props.onHide} className="border-0 btn btn-cancel" >Cancel</Button>
        <Button
          onClick={(e) => {
            if (!props.pathname.endsWith("/manage/events")) {
              props.exportEventOrders(props.pathname.includes('/da') ? props.pathname.split('/')[4] : props.pathname.split('/')[3], selectedOption);
            } else {
              props.exportAllEventOrders(selectedOption);
              props.setOpenModal(false)
            }
          }}
        >{t('export')}</Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  )
}

export default Index