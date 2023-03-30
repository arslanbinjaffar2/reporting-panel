'use client'
import React, { useEffect } from 'react';
import Image from 'next/image'
import Dropdown from '@/app/components/DropDown';

export default function Dashboard() {
  
  useEffect(() => {
    document.body.addEventListener('click',handleBody,false)
    return () => {
      document.body.removeEventListener('click',handleBody,false)
    }
  }, [])
  
  const handleBody = (e:any) => {
    var _items = document.querySelectorAll('.ebs-btn-dropdown');
    _items.forEach(element => {
      element.classList.remove('ebs-active')
    });
  }
  const handleToggle = (e:any) => {
    e.stopPropagation();
    e.preventDefault();
    e.target.classList.toggle('ebs-active');
  }
  return (
   <>
    <header className="header">
      <div className="container">
        <div className="row bottom-header-elements">
          <div className="col-8">
          </div>
          <div className="col-4 d-flex justify-content-end">
            <ul className="main-navigation">
              <li>Irfan Danish <i className="material-icons">expand_more</i>
              <ul>
                <li><a href="">My account</a></li>
                <li><a href=""> Change password</a></li>
                <li><a href="">Logout</a></li>
              </ul>
              </li>
              <li>English <i className="material-icons">expand_more</i>
              <ul>
                <li><a href="">English</a></li>
                <li><a href=""> Danish</a></li>
              </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
    <main className="main-section" role="main">
      <div className="container">
        <div className="wrapper-box">
          <div className="container-box main-landing-page">
            <div className="top-landing-page">
              <div className="row d-flex">
                <div className="col-4">
                  <div className="logo">
                    <a href="">
                      <Image src={require('@/app/assets/img/logo.svg')} alt="" width="200" height="29" className='logos' />
                    </a>
                  </div>
                </div>
                <div className="col-8">
                  <div className="right-top-header">
                    <button className="btn btn-default">Export Orders</button>
                  </div>
                </div>
              </div>
              <div className="row d-flex ebs-search-events align-items-center">
                <div style={{padding: '0 22px'}} className="col-4">
                  <input type="text" className="ebs-search-area m-0 w-100" defaultValue="Search" />
                </div>
                <div style={{padding: '0 22px'}} className="col-8 d-flex justify-content-end">
                  <strong>10 events</strong>
                </div>
              </div>
              <div className="row d-flex ebs-search-grid">
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={[
                        { id: 'active_future', name: "Active and future events" },
                        { id: 'active', name: "Active events" },
                        { id: 'future', name: "Future events" },
                        { id: 'expired', name: "Expired events" },
                        { id: 'name', name: "All events" }
                      ]}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={[
                        { id: 'active_future', name: "Active and future events" },
                        { id: 'active', name: "Active events" },
                        { id: 'future', name: "Future events" },
                        { id: 'expired', name: "Expired events" },
                        { id: 'name', name: "All events" }
                      ]}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={[
                        { id: 'active_future', name: "Active and future events" },
                        { id: 'active', name: "Active events" },
                        { id: 'future', name: "Future events" },
                        { id: 'expired', name: "Expired events" },
                        { id: 'name', name: "All events" }
                      ]}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={[
                        { id: 'active_future', name: "Active and future events" },
                        { id: 'active', name: "Active events" },
                        { id: 'future', name: "Future events" },
                        { id: 'expired', name: "Expired events" },
                        { id: 'name', name: "All events" }
                      ]}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={[
                        { id: 'active_future', name: "Active and future events" },
                        { id: 'active', name: "Active events" },
                        { id: 'future', name: "Future events" },
                        { id: 'expired', name: "Expired events" },
                        { id: 'name', name: "All events" }
                      ]}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={[
                        { id: 'active_future', name: "Active and future events" },
                        { id: 'active', name: "Active events" },
                        { id: 'future', name: "Future events" },
                        { id: 'expired', name: "Expired events" },
                        { id: 'name', name: "All events" }
                      ]}
                    />
                  </label>
                </div>
              </div>
            </div>
            <div className="main-data-table">
                <div className="ebs-ticket-section">
                  <h4>Tickets</h4>
                  <div className="row d-flex">
                    <div className="col-6">
                      <div className="row">
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>4</strong>
                            <span>LEFT</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>33</strong>
                            <span>sold</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>34</strong>
                            <span>total</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                     <div className="row d-flex align-items-end h-100">
                      <div className="col-8 h-100">
                        <div className="ebs-time-counter d-flex align-items-center">
                          <div className="col-5">
                            <div className="p-1">
                              <strong>0,00 DKK</strong>
                              <span>Revenue</span>
                            </div>
                          </div>
                          <div className="col-7">
                            <div className="ebs-border-left p-1">
                              <strong>18854.98 DKK</strong>
                              <span>Total Revenue</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <p className='m-0 ebs-info-vat'><i className="material-symbols-outlined">info</i>All prices are excluding VAT.</p>
                      </div>
                     </div>
                    </div>
                  </div>
                </div>
                <div className="ebs-order-list-section">
                  <div className="ebs-order-header">
                    <div className="row">
                      <div className="col-5 d-flex">
                        <h4 className='m-0'>Reports list</h4>
                      </div>
                      <div className="col-7 d-flex justify-content-end align-items-center">
                        <button className="btn-full-screen">
                          <Image src={require("@/app/assets/img/ico-fullscreen.svg")} alt="" width="27" height="28" />
                        </button>
                        <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                          <button onClick={handleToggle} className="ebs-btn-dropdown btn-select">
                            2 <i className="material-symbols-outlined">expand_more</i>
                          </button>
                          <div className="ebs-dropdown-menu">
                            <button className="dropdown-item">10</button>
                            <button className="dropdown-item">20</button>
                            <button className="dropdown-item">500</button>
                            <button className="dropdown-item">1000</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ebs-data-table ebs-order-table">
                    <div className="d-flex align-items-center ebs-table-header">
                      <div className="ebs-table-box ebs-box-1"><strong>Event Logo</strong></div>
                      <div style={{width: 210}}  className="ebs-table-box ebs-box-2"><strong>Event Name</strong></div>
                      <div style={{width: 170}}  className="ebs-table-box ebs-box-2"><strong>Event Date</strong></div>
                      <div style={{width: 140}}  className="ebs-table-box ebs-box-1"><strong>Organized by</strong></div>
                      <div style={{width: 140}}  className="ebs-table-box ebs-box-4"><strong>Tickets Waiting</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Sold Tickets</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Total Tickets</strong></div>
                      <div className="ebs-table-box ebs-box-1"><strong>Revenue</strong></div>
                      <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><strong>Total Revenue</strong></div>
                      <div className="ebs-table-box ebs-box-1" style={{width: 80}}  />
                    </div>
                    {[...Array(10)].map((item,k) => 
                    <div key={k} className="d-flex align-items-center ebs-table-content">
                      <div className="ebs-table-box ebs-box-1">
                        <Image src={require('@/app/assets/img/logo-placeholder.png')} alt="" width={100} height={34} />
                      </div>
                      <div style={{width: 210}}  className="ebs-table-box ebs-box-2"><p style={{fontWeight: 600, color: '#404242'}}>Parent event leadevent 2.0…</p></div>
                      <div style={{width: 170}}  className="ebs-table-box ebs-box-2"><p>30/09/23 - 02/10/23</p></div>
                      <div style={{width: 140}}  className="ebs-table-box ebs-box-1"><p>Mr Creig</p></div>
                      <div style={{width: 140}} className="ebs-table-box ebs-box-4"><p>{k}</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>1</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>52315 DKK</p></div>
                      <div className="ebs-table-box ebs-box-1" ><p>0,00 DKK</p></div>
                      <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><p>43128 Dkk</p></div>
                      <div style={{width: 80}} className="ebs-table-box ebs-box-1 d-flex justify-content-end">
                        <ul className='d-flex ebs-panel-list m-0 p-0'>
                          <li>
                            <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                              <button onClick={handleToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                                <i className="material-icons">more_horiz</i>
                              </button>
                              <div style={{minWidth: 130}} className="ebs-dropdown-menu">
                                <button className="dropdown-item">View details</button>
                                <button className="dropdown-item">Export orders</button>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>)}
                  </div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </main>
   </>
  )
}
