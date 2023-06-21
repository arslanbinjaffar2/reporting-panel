"use client"; // this is a client component
import { useState } from "react";
import Image from 'next/image';
import Link from "next/link";


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setpasswordType] = useState(true)
  const [remember, setRemember] = useState(false);
  const handleShowPass = (e:any) => {
    e.stopPropagation();
    setpasswordType(!passwordType)
  } 
  return (
    <>
        <h2>Sign in</h2>
        <p></p>
        <form role="">
        <div className="form-area-signup">
            <div className='form-row-box'>
                <input className={email ? 'ieHack': ''} value={email} type="text" name="email" id="email" onChange={(e) => setEmail(e.target.value)}  />
                <label className="title">Enter your email</label>
            </div>
            <div className='form-row-box'>
                <span className="icon-eye">
                  <Image onClick={handleShowPass} src={`/img/${passwordType ? 'close-eye':'icon-eye'}.svg`} width="17" height="17" alt="" />
                </span>
                <input className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" onChange={(e) => setPassword(e.target.value)}  />
                <label className="title">Password</label>
            </div>
            <div className="login-others clearfix">
              <label onClick={() => setRemember(!remember)} ><i className={`material-icons`}>{remember ? 'check_box' : 'check_box_outline_blank'}</i>Remember me</label>
                <Link href="/auth/forgot-password/request">Forgot Password?</Link>
            </div>
            <div className="form-row-box button-panel">
                <button className="btn btn-primary">Sign in</button>
            </div>
          </div>
        </form>
    </>
  );
}

