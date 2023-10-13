"use client"; // this is a client component
import { useEffect, useState, useRef } from "react";
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store/store";
import { forgotPasswordReset, setLoading, setRedirect } from "@/redux/store/slices/AuthSlice";
import { useTranslations } from "next-intl";
import ErrorMessage from "@/components/alerts/ErrorMessage";


export default function Login({params:{locale}}:{params:{locale:string}}) {
  const t = useTranslations('auth_forgot_password_reset');
  const et = useTranslations('messages');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const _password = useRef<any>(null);
  const _passwordConfirmation = useRef<any>(null);
    
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, redirect,  forgetPasswordEmail, forgetPasswordToken } = useAppSelector((state: RootState) => state.authUser);
    const [render, setRender] = useState(false)
    const [error, setError] = useState(false);
    
    useEffect(() => {
        if(forgetPasswordEmail !== null){
            setRender(true);
        }else{
            router.push(`/${locale}/auth/forgot-password/request`);
        }
    }, [])

    useEffect(() => {
        setPassword(_password.current?.value || '')
        setPasswordConfirmation(_passwordConfirmation.current?.value || '')
        if(redirect !== null) {
            dispatch(setRedirect(null));
            dispatch(setLoading(null));
            router.push(`/${locale}/${redirect}`);
        }
    }, [redirect]);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();

        if(password === '' || passwordConfirmation === '' || (password !== passwordConfirmation)){
            setError(true);
        }

        if(password !== '' && passwordConfirmation !== '' && (password === passwordConfirmation)){
            dispatch(forgotPasswordReset({reset_code: forgetPasswordToken, email: forgetPasswordEmail, password: password, password_confirmation: passwordConfirmation}))
        }
    }
  return (
    <>
        {error && <ErrorMessage 
                icon= {"info"}
                title= {et('errors.invalid_data')}
                error= {t('confirm_password_mismatch_label')}
        />}
      <h2>{t('page_title')}</h2>
      <p>{t('page_subtitle')}</p>
      <form role="" onSubmit={handleSubmit}>
          <div className="form-area-signup">
              <div className='form-row-box'>
                  <input ref={_password} className={password ? 'ieHack': ''} value={password} type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)} required />
                  <label className="title">{t('new_password_label')}</label>
              </div>
              <div className='form-row-box'>
                  <input ref={_passwordConfirmation} className={passwordConfirmation ? 'ieHack': ''} value={passwordConfirmation} type="password" name="password_confirmation" id="password_confirmation" required onChange={(e) => setPasswordConfirmation(e.target.value)}  />
                  <label className="title">{t('confirm_password_label')}</label>
              </div>
              <div className="form-row-box button-panel">
                  <button className="btn btn-primary" disabled={loading} type='submit'>{loading ? t('reset_button_reseting_label') : t('reset_button_label')}</button>
              </div>
          </div>
      </form>
    </>
  )
}
