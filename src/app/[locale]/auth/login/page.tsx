"use client"; // this is a client component
import { useEffect, useRef, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";
import { loginUser } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/alerts/ErrorMessage";
import SuccessAlert from "@/components/alerts/SuccessMessage";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";


export default function Login({params:{locale}}:{params:{locale:string}}) {
  const t = useTranslations('auth_login');
    const et = useTranslations('messages');
  const dispatch = useAppDispatch();
  const router = useRouter();
  const _email = useRef<any>(null);
  const _password = useRef<any>(null);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setpasswordType] = useState(true)
  const [remember, setRemember] = useState(false);
  const {user, loading, error, errors, successMessage} = useAppSelector((state: RootState) => state.authUser);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    e.stopPropagation();
    if (email && password) {
        // @ts-ignore
        dispatch(loginUser({email, password, remember}));
    }
  }

  useEffect(() => {
    setEmail(_email.current?.value || '')
    setPassword(_password.current?.value || '')
    if(user && user.access_token) {
        router.push(`/${locale}/manage/events`);
    }
  }, [user]);

  const handleShowPass = (e:any) => {
    e.stopPropagation();
    setpasswordType(!passwordType)
  } 
  return (
    <>
        <h2>{t('page_title')}</h2>
        <p></p>
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
                {successMessage && <SuccessAlert 
                    icon= {"check"}
                    title= {et('success.password_changed')}
                    message= {successMessage}
                />}
        <form onSubmit={handleSubmit}>
        <div className="form-area-signup">
            <div className='form-row-box'>
                <input ref={_email} className={email ? 'ieHack': ''} value={email} type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  required/>
                <label className="title">{t('email_label')}</label>
            </div>
            <div className='form-row-box'>
                <span className="icon-eye">
                  <Image onClick={handleShowPass} src={`/img/${passwordType ? 'close-eye':'icon-eye'}.svg`} width="17" height="17" alt="" />
                </span>
                <input ref={_password} className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" onChange={(e) => setPassword(e.target.value)} required />
                <label className="title">{t('password_label')}</label>
            </div>
            <div className="login-others clearfix">
              <label onClick={() => setRemember(!remember)} ><i className={`material-icons`}>{remember ? 'check_box' : 'check_box_outline_blank'}</i>Remember me</label>
                <Link href={`/${locale}/auth/forgot-password/request`}>{t('forgot_password_label')}</Link>
            </div>
            <div className="form-row-box button-panel">
                <button className="btn btn-primary" disabled={loading}>{loading ? t('signin_button_processing_label') : t('signin_button_label')}</button>
            </div>
          </div>
        </form>
    </>
  );
}

