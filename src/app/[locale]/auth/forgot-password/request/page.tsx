"use client"; // this is a client component
import { useEffect, useState, useRef } from "react";
import Image from 'next/image';
import Illustration from '@/assets/img/illustration.png'
import AlertMessage from "@/components/alerts/AlertMessage";
import Loader from '@/components/Loader';
import { useRouter } from 'next/navigation';
import {useAppDispatch, useAppSelector} from "@/redux/hooks/hooks";
import { RootState, store } from "@/redux/store/store";
import { forgotPasswordRequest, setForgetPasswordEmail, setLoading, setRedirect } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/alerts/ErrorMessage";
import { useTranslations } from "next-intl";



export default function requestReset({params:{locale}}:{params:{locale:string}}) {
  const t = useTranslations('auth_forgot_password_request');
  const et = useTranslations('messages');

  const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, redirect, error, errors} = useAppSelector((state: RootState) => state.authUser);
    const [email, setEmail] = useState('');
    const _email = useRef<any>(null);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        if(email !== ''){
          dispatch(setForgetPasswordEmail(email));
          dispatch(forgotPasswordRequest({email}));
        }
    }

    useEffect(() => {
      setEmail(_email.current?.value || '')
      if(redirect !== null) {
        dispatch(setRedirect(null));
        dispatch(setLoading(null));
        router.push(`/${locale}/${redirect}`);
      }
  }, [redirect]);


    return (
    <>
      {errors && errors.length > 0 && <ErrorMessage 
          icon= {"info"}
          title= {et('errors.invalid_data')}
          errors= {errors}
      />}
      {error && <ErrorMessage 
          icon= {"info"}
          title= {et('errors.someting_went_wrong')}
          error= {error}
      />}
      <h2>{t('page_title')}</h2>
      <p>{t('page_subtitle')}</p>
      <form role="" onSubmit={handleSubmit}>
      <div className="form-area-signup">
          <div className='form-row-box'>
              <input ref={_email} className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} required  />
              <label className="title">{t('email_label')}</label>
          </div>
          <div className="form-row-box button-panel">
              <button className="btn btn-primary" disabled={loading} type='submit'>{loading ? t('send_button_sending_label') :  t('send_button_label')}</button>
          </div>
        </div>
      </form>
    </>
  );
}
