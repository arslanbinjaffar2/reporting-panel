"use client";
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { RootState } from '@/redux/store/store';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import Image from 'next/image'
import { logOutUser } from '@/redux/store/slices/AuthSlice';
import axios from 'axios';
import { authHeader } from '@/helpers';
import moment from 'moment';
import { AGENT_ENDPOINT } from '@/constants/endpoints';
import FullPageLoader from '@/components/FullPageLoader';
import { useLocale, useTranslations } from 'next-intl';

const languages = [{ id: 1, name: "English", locale:'en' }, { id: 2, name: "Danish", locale:'da' }];


export default function RootLayout({ children, params}: { children: React.ReactNode, params: { locale:string, event_id: string } }) {
    const t = useTranslations('manage-events-layout');
    const router = useRouter();
    const {user} = useAppSelector((state: RootState) => state.authUser);
    const { event } = useAppSelector((state: RootState) => state.event);
    const dispatch = useAppDispatch();
    const pathname = usePathname();
    const [downloading, setDownloading] = useState(false);
    useEffect(() => {
         (user === null) ? router.push('auth/login') : null;
    }, [user]);

    const [isPending, startTransition] = useTransition();
    const locale = useLocale();

    function onLanguageChange(value:string) {
        console.log(`${pathname}`, 'selectchange');

        let replaceUrl = value === 'en' ? pathname.replace('/da', '/en') : pathname.includes('/da') ? `${pathname}` : `/${value}${pathname}`;

        window.location.href = replaceUrl;

    }

    const exportAllEventOrders = () =>{
      setDownloading(true);
      let storedEventFilterData = typeof window !== "undefined" ? localStorage.getItem("eventFilterData") : null;
      const storedEventFilters = (storedEventFilterData && storedEventFilterData !== undefined) ? JSON.parse(storedEventFilterData) : {};
      axios.post(`${AGENT_ENDPOINT}/export-orders`, storedEventFilters, {
        headers: authHeader('GET'),
        responseType: 'blob'
      }).then((res)=>{
        let url = window.URL.createObjectURL(res.data);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'Orders-' + moment().valueOf() + '.xlsx';
        a.click();
        setDownloading(false);
      })
      .catch((err)=>{
        console.log(err);
        setDownloading(false);
      });
    }

    const exportEventOrders = (event_id:string) =>{
      setDownloading(true);
      let storedOrderFilterData =
      typeof window !== "undefined" && localStorage.getItem("orderFilterData");
      const storedOrderFilters = storedOrderFilterData && storedOrderFilterData !== undefined ? JSON.parse(storedOrderFilterData) : null;
      axios.post(`${AGENT_ENDPOINT}/export-event-orders/${event_id}`, storedOrderFilters, {
        headers: authHeader('GET'),
        responseType: 'blob'
      }).then((res)=>{
        let url = window.URL.createObjectURL(res.data);
        let a = document.createElement('a');
        a.href = url;
        a.download = 'Orders-' + moment().valueOf() + '.xlsx';
        a.click();
        setDownloading(false);
      })
      .catch((err)=>{
        console.log(err);
        setDownloading(false);
      });
    }
    
  return (
    <>
    <header className="header">
        <div className="container">
          <div className="row bottom-header-elements">
            <div className="col-8">
              <div className="ebs-bottom-header-left">
              {pathname !== `${params.locale === 'da' ? '/da' : '' }/manage/events` ? <p>
                        <a href="#!" onClick={(e)=>{e.preventDefault(); 
                            console.log('pathname', pathname);
                            if(pathname.includes('invoice') || pathname.includes('create') || pathname.includes('edit')){
                                router.push(`/${params.locale}/manage/events/${pathname.split('/')[3]}/orders`);
                            }
                            else if(pathname.includes('orders')){
                                router.push(`/${params.locale}/manage/events`);
                            }
                            else{
                                router.push(`/${params.locale}/manage/events`);
                            }
                        }}>
                            <i className="material-icons">arrow_back</i> {t('return_to_list_label')}
                        </a>
                    </p>: null}
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
                {locale === 'da' ? 'Danish' : 'English'} <i className="material-icons">expand_more</i>
                  <ul>
                  {languages.map((value, key) => {
                      return (
                          <li key={key}>
                              <a href='' onClick={(e)=>{e.preventDefault(); onLanguageChange(value.locale)}}>{value.name}</a>
                          </li>
                      );
                  })}
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
    </header> 
    <main className="main-section" role="main">
        <div className="container">
            <div style={{borderRadius: '8px'}} className="wrapper-box">
                <div className="container-box main-landing-page" style={{position:'relative'}}>
                <div className="top-landing-page">
                <div className="row d-flex">
                  <div className="col-4">
                    <div className="logo">
                      <a href="">
                        <Image
                          // src={"/img/logo.svg"}
                          src={event !== null ? (event.brand_logo ? (`${process.env.serverImageHost +  event.brand_logo}`) : `${process.env.serverImageHost + '/_admin_assets/images/eventbuizz_logo.png'}`) : '/img/logo-old.png'}
                          
                          alt=""
                          width="150"
                          height="38"
                          className="logos"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="col-8">
                    <div className="right-top-header">
                      <button className="btn btn-default" onClick={(e)=>{
                          if(pathname !== "/manage/events"){
                            exportEventOrders(pathname.split('/')[3]);
                          }else{
                            exportAllEventOrders();
                          }
                        }}>
                        {t('export_orders')}
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
      {downloading ? <FullPageLoader className={''} fixed={''}/> : null}
    </>
  )
}
