"use client"; // this is a client component
import {useEffect, useState} from "react";
import { useRouter } from 'next/navigation';
import Loader from '@/components/Loader';
import { useAppDispatch, useAppSelector } from "@/redux/hooks/hooks";
import { RootState } from "@/redux/store/store";
import { forgotPasswordVerify, setForgetPasswordToken, setLoading, setRedirect } from "@/redux/store/slices/AuthSlice";
import ErrorMessage from "@/components/alerts/ErrorMessage";

export default function verifyResetCode() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {loading, redirect, error, errors, forgetPasswordEmail } = useAppSelector((state: RootState) => state.authUser);
    const [token, setToken] = useState('');
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
            router.push(redirect);
        }
    }, [redirect]);

    const handleSubmit = (e:any) => {
        e.preventDefault();
        e.stopPropagation();
        // dispatch(forgotPasswordVerify({token, email:forgetPasswordEmail}));
    }

    if(!render){
        return <Loader className='' fixed=''/>;
    }

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
            <h2>Verify reset password code</h2>
            <p>Please enter the reset password token that we have just sent to your registered email address.</p>
            <form role="" onSubmit={handleSubmit}>
                <div className="form-area-signup">
                    <div className='form-row-box'>
                        <input className='' value={token} type="text" name="token" id="token" onChange={(e) => setToken(e.target.value)}  />
                        <label className="title">Enter reset code</label>
                    </div>
                    <div className="form-row-box button-panel">
                        <button className="btn btn-primary" disabled={loading} type='submit'>{loading ? "VERIFYING" : "VERIFY"}</button>
                    </div>
                </div>
            </form>
        </>
    );
}
