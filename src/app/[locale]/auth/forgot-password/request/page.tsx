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

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];


export default function requestReset({params:{locale}}:{params:{locale:string}}) {
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
          title= {"Invalid data"}
          errors= {errors}
      />}
      {error && <ErrorMessage 
          icon= {"info"}
          title= {"Sorry! Something went wrong"}
          error= {error}
      />}
      <h2>Did you forget your password ?</h2>
      <p>Enter your email address you’re using for your account below and we will send you a password reset link.</p>
      <form role="" onSubmit={handleSubmit}>
      <div className="form-area-signup">
          <div className='form-row-box'>
              <input ref={_email} className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)} required  />
              <label className="title">Enter your email</label>
          </div>
          <div className="form-row-box button-panel">
              <button className="btn btn-primary" disabled={loading} type='submit'>{loading?"SENDING...":"SEND"}</button>
          </div>
        </div>
      </form>
    </>
  );
}
