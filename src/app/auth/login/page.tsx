"use client"; // this is a client component
import { useEffect, useState } from "react";
import Image from 'next/image';
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";
import { loginUser } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/alerts/ErrorMessage";
import SuccessAlert from "@/components/alerts/SuccessMessage";
import { useRouter } from "next/navigation";

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function Login() {
  const dispatch = useAppDispatch();
  const router = useRouter();
 
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
    if(user && user.access_token) {
        router.push('/manage/events');
    }
  }, [user]);

  const handleShowPass = (e:any) => {
    e.stopPropagation();
    setpasswordType(!passwordType)
  } 
  return (
    <>
        <h2>Sign in</h2>
        <p></p>
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
                {successMessage && <SuccessAlert 
                    icon= {"check"}
                    title= {"Success"}
                    message= {successMessage}
                />}
        <form onSubmit={handleSubmit}>
        <div className="form-area-signup">
            <div className='form-row-box'>
                <input className={email ? 'ieHack': ''} value={email} type="email" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  required/>
                <label className="title">Enter your email</label>
            </div>
            <div className='form-row-box'>
                <span className="icon-eye">
                  <Image onClick={handleShowPass} src={`/img/${passwordType ? 'close-eye':'icon-eye'}.svg`} width="17" height="17" alt="" />
                </span>
                <input className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" onChange={(e) => setPassword(e.target.value)} required />
                <label className="title">Password</label>
            </div>
            <div className="login-others clearfix">
              <label onClick={() => setRemember(!remember)} ><i className={`material-icons`}>{remember ? 'check_box' : 'check_box_outline_blank'}</i>Remember me</label>
                <Link href="/auth/forgot-password/request">Forgot Password?</Link>
            </div>
            <div className="form-row-box button-panel">
                <button className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' :"Sign in"}</button>
            </div>
          </div>
        </form>
    </>
  );
}

