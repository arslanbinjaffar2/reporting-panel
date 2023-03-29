"use client"; // this is a client component
import { useState } from "react";
import Image from 'next/image';
import Illustration from '@/app/assets/img/illustration.png'


const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordType, setpasswordType] = useState(true)
  const handleShowPass = (e:any) => {
    e.stopPropagation();
    setpasswordType(!passwordType)
  } 
  return (
    <div className="signup-wrapper">
      <main className="main-section" role="main">
        <div className="container">
          <div className="wrapper-box">
            <div className="container-box">
              <div className="row">
                <div className="col-6">
                  <div className="left-signup">
                    <Image src={require('@/app/assets/img/logo.svg')} alt="" width="200" height="29" className='logos' />
                    <div className="text-block">
                      <h4>WELCOME TO PLUG’N’PLAY</h4>
                      <p>Minimize your efforts. Maximize the results.</p>
                      <ul>
                        <li>Create your own event in a few clicks</li>
                        <li>Sort out event registration in no time</li>
                        <li>Get your own customized event app</li>
                        <li>Feel safe with our step by step navigation</li>
                      </ul>
                    </div>
                    <Image src={Illustration} alt="" width="300" height="220" className='illustration' />
                  </div>
                </div>
                <div className="col-6">
                  <div className="right-section-blank">
                    <ul className="main-navigation">
                      <li>
                          <a href="#!">
                            <i className="icons"><Image src={require('@/app/assets/img/ico-globe.svg')} alt="" width="16" height="16" /></i>
                            <span id="language-switch">English</span><i className="material-icons">keyboard_arrow_down</i>
                          </a>
                          <ul>
                              {languages.map((value, key) => {
                                  return (
                                      <li key={key}>
                                          <a>{value.name}</a>
                                      </li>
                                  );
                              })}
                          </ul>
                      </li>
                    </ul>
                    <div className="right-formarea">
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
                                <Image onClick={handleShowPass} src={require(`@/app/assets/img/${passwordType ? 'close-eye':'icon-eye'}.svg`)} width="17" height="17" alt="" />
                              </span>
                              <input className={password ? 'ieHack': ''} type={passwordType ? 'password' : 'text'} value={password} id="password" onChange={(e) => setPassword(e.target.value)}  />
                              <label className="title">Password</label>
                          </div>
                          <div className="login-others clearfix">
                            <label><i className={`material-icons`}>check_box_outline_blank</i>Remember me</label>
                              <a href="#!">Forgot Password?</a>
                          </div>
                          <div className="form-row-box button-panel">
                              <button className="btn btn-primary">Sign in</button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
