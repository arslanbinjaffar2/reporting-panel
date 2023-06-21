"use client"; // this is a client component
import { useEffect, useState } from "react";
import Image from 'next/image'
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { useRouter } from "next/navigation";
import { RootState } from "@/redux/store/store";


export default function Login() {
  const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, redirect, error, errors, forgetPasswordEmail, forgetPasswordToken } = useAppSelector((state: RootState) => state.authUser);
    const [render, setRender] = useState(false)
    
    useEffect(() => {
        // if(forgetPasswordEmail !== null){
            setRender(true);
        // }else{
        //     router.push('/auth/forgot-password/request');
        // }
    }, [])

    useEffect(() => {
        if(redirect !== null) {
            // dispatch(setRedirect(null));
            // dispatch(setLoading(null));
            // router.push(redirect);
        }
    }, [redirect]);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        if(password !== '' && passwordConfirmation !== '' && (password === passwordConfirmation)){
            // dispatch(forgotPasswordReset({reset_code: forgetPasswordToken, email: forgetPasswordEmail, password: password, password_confirmation: passwordConfirmation}))
        }
    }
  return (
    <>
      <h2>Reset password</h2>
      <p>Enter new password and confirm new password to reset password.</p>
      <form role="" onSubmit={handleSubmit}>
          <div className="form-area-signup">
              <div className='form-row-box'>
                  <input className='' value={password} type="password" name="password" id="password" onChange={(e) => setPassword(e.target.value)}  />
                  <label className="title">Enter new password</label>
              </div>
              <div className='form-row-box'>
                  <input className='' value={passwordConfirmation} type="password" name="password_confirmation" id="password_confirmation" onChange={(e) => setPasswordConfirmation(e.target.value)}  />
                  <label className="title">Confirm new password</label>
              </div>
              <div className="form-row-box button-panel">
                  <button className="btn btn-primary" disabled={loading} type='submit'>{loading ? "Sending..." : "RESET PASSWORD"}</button>
              </div>
          </div>
      </form>
    </>
  )
}
