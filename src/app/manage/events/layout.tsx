"use client";
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image'
import { logOutUser } from '@/redux/store/slices/AuthSlice';

const languages = [{ id: 1, name: "English" }, { id: 2, name: "Danish" }];

export default function RootLayout({ children}: { children: React.ReactNode }) {
    const router = useRouter();
    const {user} = useAppSelector((state: RootState) => state.authUser);
    const { event } = useAppSelector((state: RootState) => state.event);
    const dispatch = useAppDispatch();
    const pathname = usePathname();

    useEffect(() => {
         (user === null) ? router.push('auth/login') : null;
    }, [user]);
    
  return (
    <>
    <header className="header">
        <div className="container">
          <div className="row bottom-header-elements">
            <div className="col-8">
              <div className="ebs-bottom-header-left">
                {pathname !== "/manage/events" ? <p>
                  <a href="#!" onClick={(e)=>{e.preventDefault(); router.back();}} >
                    <i className="material-icons">arrow_back</i> Return to list
                  </a>
                </p> : null}
                {event !== null ? <>
                    <h3>
                        <a href="#!">{event?.event_name}</a>
                    </h3>
                    <ul>
                        <li>
                            <i className="material-symbols-outlined">calendar_month</i>{event?.event_date}
                        </li>
                        <li>
                            <i className="material-symbols-outlined">place</i>{event?.event_location}
                        </li>
                    </ul>
                </>: null }
              </div>
            </div>
            <div className="col-4 d-flex justify-content-end">
              <ul className="main-navigation">
                {user ? <li>
                    {user?.first_name} {user?.last_name} <i className="material-icons">expand_more</i>
                  <ul>
                    <li>
                        <li><a href="" onClick={(e)=>{e.preventDefault(); dispatch(logOutUser({}));}}>Logout</a></li>
                    </li>
                  </ul>
                </li> : null}
                <li>
                  English <i className="material-icons">expand_more</i>
                  <ul>
                    <li>
                      <a href="">English</a>
                    </li>
                    <li>
                      <a href=""> Danish</a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </header> 
    <main className="main-section" role="main">
        <div className="container">
            <div style={{borderRadius: '0 0 8px 8px'}} className="wrapper-box">
                <div className="container-box main-landing-page" style={{position:'relative'}}>
                <div className="top-landing-page">
                <div className="row d-flex">
                  <div className="col-4">
                    <div className="logo">
                      <a href="">
                        <Image
                          src={"/img/logo.svg"}
                          alt=""
                          width="150"
                          height="32"
                          className="logos"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="right-top-header">
                      <button className="btn btn-default">
                        Export Orders
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                    {children}
                </div>
            </div>
        </div>
    </main>
    </>
  )
}
