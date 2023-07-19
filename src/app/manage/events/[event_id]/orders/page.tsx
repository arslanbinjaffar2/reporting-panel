'use client'
import React, { useEffect } from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import Pagination from '@/components/pagination';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { userEventStatsAndOrders } from '@/redux/store/slices/EventSlice';
import { RootState } from '@/redux/store/store';

export default function OrderListing({ params }: { params: { event_id: string } }) {
  const dispatch = useAppDispatch();
  const {event_orders, event_stats} = useAppSelector((state: RootState) => state.event);
  
  useEffect(() => {
    const promise1 = dispatch(userEventStatsAndOrders({event_id:params.event_id}));
    return () =>{
        promise1.abort();
    }
  }, []);

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
  const handlePageChange = (page: number) => {
    console.log('change event')
  };
  return (
    <>
              {/* <div className="top-landing-page">
                <div className="row d-flex">
                  <div className="col-4">
                    <div className="logo">
                      <a href="">
                        <Image
                          src={"/img/logo.svg"}
                          alt=""
                          width="200"
                          height="29"
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
              </div> */}
              <div style={{ background: "#fff", borderRadius: '0 0 8px 8px' }} className="main-data-table">
              <div className="ebs-ticket-section">
                  <h4>Tickets</h4>
                  <div className="row d-flex">
                    <div className="col-6">
                      <div className="row">
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>f4</strong>
                            <span>LEFT</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>33</strong>
                            <span>sold</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
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
                    <h4>Orders List</h4>
                    <div className="row">
                      <div className="col-8 d-flex">
                        <input style={{ width: "410px" }} type="text" className="ebs-search-area" defaultValue="Search" />
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label="Select type"
                            listitems={[
                              { id: "active_future", name: "Active and future events" },
                              { id: "active", name: "Active events" },
                              { id: "future", name: "Future events" },
                              { id: "expired", name: "Expired events" },
                              { id: "name", name: "All events" },
                            ]}
                          />
                        </label>
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label="Select type"
                            listitems={[
                              { id: "active_future", name: "Active and future events" },
                              { id: "active", name: "Active events" },
                              { id: "future", name: "Future events" },
                              { id: "expired", name: "Expired events" },
                              { id: "name", name: "All events" },
                            ]}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="ebs-data-table ebs-order-table">
                    <div className="d-flex align-items-center ebs-table-header">
                      <div className="ebs-table-box ebs-box-1"><strong>Order #</strong></div>
                      <div className="ebs-table-box ebs-box-1"><strong>Date <i className="material-icons">unfold_more</i></strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>Name</strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>Email</strong></div>
                      <div style={{width: 150}} className="ebs-table-box ebs-box-2"><strong>Job Title</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Company</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Amount</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Sales Agent</strong></div>
                      <div className="ebs-table-box ebs-box-4" style={{width: 150}}><strong>Payment STATus</strong></div>
                    </div>
                    {[...Array(10)].map((item,k) => 
                    <div key={k} className="d-flex align-items-center ebs-table-content">
                      <div className="ebs-table-box ebs-box-1"><p>25100{k}</p></div>
                      <div className="ebs-table-box ebs-box-1"><p>12/04/2022</p></div>
                      <div className="ebs-table-box ebs-box-2 ebs-attendee-name-list">
                        {k%2 === 0 ? <p>Mudassir Umer Reg</p> : (
                           <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                            <div className="d-flex align-items-center">
                              <p>Mudassir Umer Reg</p>  
                              <button onClick={handleToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                                <i className="material-icons">expand_more</i>
                              </button>
                              <div style={{minWidth: 180}} className="ebs-dropdown-menu">
                                <h5>attendees (8)</h5>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                                <div className="ebs-dropdown-list">
                                  <p className="name">Walter White</p>
                                  <p className="email">ge_info@mail.com</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="ebs-table-box ebs-box-2"><p>sales_info@mail.com</p></div>
                      <div style={{width: 150}} className="ebs-table-box ebs-box-2"><p>Project manager</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>Ab Tech</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>1</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>52315 DKK</p></div>
                      <div className="ebs-table-box ebs-box-4" style={{width: 150}}><p style={{fontWeight: 600, color: '#AB8D2E'}}>Pending</p></div>
                    </div>)}
                  </div>
                  <div className='d-flex justify-content-end align-items-center pt-5 mb-4'>
                      <Pagination
                          currentPage={1}
                          totalPages={5}
                          onPageChange={handlePageChange}
                      />
                    <div style={{minWidth: 60}} onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
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
    </>
  );
}
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

