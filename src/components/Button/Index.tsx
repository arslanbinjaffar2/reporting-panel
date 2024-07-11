import { useTranslations } from 'next-intl';
import {Dispatch,SetStateAction} from 'react'

const Button = ({ setOpenModal, }: { setOpenModal:Dispatch<SetStateAction<boolean>>}) => {
    const tranlate=useTranslations('manage-events-layout')
    return (
        <button className="btn btn-default" 
        onClick={()=>setOpenModal(true)}>
            {tranlate('export_orders')}
        </button>
    )
}

export default Button