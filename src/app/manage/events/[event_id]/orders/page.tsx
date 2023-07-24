'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import Pagination from '@/components/pagination';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { userEventStatsAndOrders, clearAllState } from '@/redux/store/slices/EventSlice';
import { RootState } from '@/redux/store/store';
import moment from 'moment';
import { getSelectedLabel } from '@/helpers';
import Loader from '@/components/Loader';

const rangeFilters = [
  { id: 'today', name: "Today" },
  { id: 'thisw', name: "This week" },
  { id: 'prevw', name: "Previous week" },
  { id: 'thism', name: "This month" },
  { id: 'prevm', name: "Previous month" },
  { id: 'custom', name: "Custom range" },
  { id: '-1', name: "All stats" },
];
const fieldFilters = [
  { id: '', name: "Select field" },
  { id: 'order_number', name: "Order Number" },
  { id: 'name', name: "Name" },
  { id: 'email', name: "Email" },
  { id: 'job_title', name: "Job Title" },
  { id: 'company', name: "Company" }
];

let storedOrderFilterData =
    typeof window !== "undefined" && localStorage.getItem("orderFilterData");
const storedOrderFilters =
    storedOrderFilterData && storedOrderFilterData !== undefined ? JSON.parse(storedOrderFilterData) : null;

export default function OrderListing({ params }: { params: { event_id: string } }) {
  const dispatch = useAppDispatch();
  const {event_orders, event_stats, totalPages, currentPage} = useAppSelector((state: RootState) => state.event);
  const [sortCol, setSortCol] = useState(storedOrderFilters!== null ? storedOrderFilters.sortCol : 'order_number');
  const [sort, setSort] = useState(storedOrderFilters!== null ? storedOrderFilters.sort : 'desc');
  const [limit, setLimit] = useState(storedOrderFilters !== null ? storedOrderFilters.limit : 10);
  const [orderFilterData, setOrderFilterData] = useState(storedOrderFilters !== null ? storedOrderFilters : {
      field:'',
      range:'',
      start_date:'',
      end_date:'',
      searchText:'',
      limit:10,
      page:1,
  });

  useEffect(() => {
    const promise1 = dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterData}));
    return () =>{
        promise1.abort();
        dispatch(clearAllState());
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
  const savefiltersToLocalStorage = (updatedOrderFilters:any) => {
    if(window !== undefined){
      localStorage.setItem('orderFilterData', JSON.stringify(updatedOrderFilters));
    }
  }

  const handleSearchTextFilter = (e:any) => {
    const {value} = e.target;
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate.searchText = value;
    orderFilterDataUpdate['page'] = 1;
    // Update the requestData state with the modified array
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
  }

  const handleRangeFilter = (e:any) => {
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['range'] = e.value;
    orderFilterDataUpdate['page'] = 1;
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
  }
  
  const handleFieldFilter = (e:any) => {
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['field'] = e.value;
    orderFilterDataUpdate['page'] = 1;
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
  }

  const handlePageChange = (page: number) => {
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['page'] = page;
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
  };

  const handleLimitChange = (e:any, value: number) => {
    setLimit(value); 
    handleToggle(e);
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['limit'] = value;
    orderFilterDataUpdate['page'] = 1;
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
  };

  const handleSortChange = (sort:string, sortCol: string) => {
    setSort(sort);
    setSortCol(sortCol);
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['sort'] = sort;
    orderFilterDataUpdate['sort_col'] = sortCol;
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
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
                        
                        {event_stats !== null && event_stats?.event_stats?.total_tickets != 0 ? <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.event_tickets_left}</strong>
                            <span>LEFT</span>
                          </div>
                        </div> : null}
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.reporting_data?.total_tickets}</strong>
                            <span>sold</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.event_stats?.total_tickets}</strong>
                            <span>total</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6">
                     <div className="row d-flex align-items-end h-100">
                      <div className="col-8 h-100">
                        <div className="ebs-time-counter d-flex align-items-center">
                          <div className="col-6">
                            <div className="p-1">
                              <strong>{event_stats?.orders_range_stats?.total_range_revenue_text}</strong>
                              <span>Revenue</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="ebs-border-left p-1">
                              <strong>{event_stats?.reporting_data?.total_revenue_text}</strong>
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
                        <input style={{ width: "410px" }} type="text" className="ebs-search-area" placeholder='Search' value={orderFilterData.searchText} onKeyUp={(e) => { e.key === 'Enter' ? handleSearchTextFilter(e): null}} onChange={(e)=>{setOrderFilterData((prev:any)=> ({...prev, searchText:e.target.value}))}} />
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label="Select field"
                            listitems={fieldFilters}
                            selected={orderFilterData.field} 
                            onChange={handleFieldFilter}
                            selectedlabel={getSelectedLabel(fieldFilters,orderFilterData.field)}
                          />
                        </label>
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label="Select Range"
                            listitems={rangeFilters}
                            selected={orderFilterData.range} 
                            onChange={handleRangeFilter}
                            selectedlabel={getSelectedLabel(rangeFilters,orderFilterData.range)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="ebs-data-table ebs-order-table position-relative">
                    <div className="d-flex align-items-center ebs-table-header">
                      <div className="ebs-table-box ebs-box-1">
                        <strong>
                          Order #
                          <span className='d-flex flex-column'>
                            <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_number')}}>keyboard_arrow_up</em> 
                            <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_number')}}>keyboard_arrow_down</em>
                          </span>
                        </strong>
                      </div>
                      <div className="ebs-table-box ebs-box-1"><strong>Date 
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_date' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_date')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_date' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_date')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>Name
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'name' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'name')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'name' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'name')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>Email
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'email' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'email')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'email' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'email')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div style={{width: 150}} className="ebs-table-box ebs-box-2"><strong>Job Title
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'job_title' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'job_title')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'job_title' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'job_title')}}>keyboard_arrow_down</em>
                    </span>  
                      </strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Company
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'company' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'company')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'company' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'company')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Amount
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'amount' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'amount')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'amount' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'amount')}}>keyboard_arrow_down</em>
                    </span></strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>Sales Agent
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'sales_agent')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'sales_agent')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-4" style={{width: 150}}><strong>Payment Status</strong></div>
                    </div>
                    <div style={{minHeight:"calc(100vh - 720px)"}}>
                      {event_orders !== null ? event_orders.data.length > 0 ? event_orders.data.map((order:any,k:number) => 
                      <div key={k} className="d-flex align-items-center ebs-table-content">
                        <div className="ebs-table-box ebs-box-1"><p>{order.order_number}</p></div>
                        <div className="ebs-table-box ebs-box-1"><p>{moment(order.order_date).format('L')}</p></div>
                        <div className="ebs-table-box ebs-box-2 ebs-attendee-name-list">
                          {order.order_attendees.length <= 1 ? <p>{`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}</p> : (
                            <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                              <div className="d-flex align-items-center">
                                <p>{`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}</p>  
                                <button onClick={handleToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                                  <i className="material-icons">expand_more</i>
                                </button>
                                <div style={{minWidth: 180}} className="ebs-dropdown-menu">
                                  <h5>attendees ({order.order_attendees.length})</h5>
                                  {order?.order_attendees?.map((attendee:any, k:number)=>(
                                    <div className="ebs-dropdown-list" key={k}>
                                      <p className="name">{`${attendee.attendee_detail?.first_name} ${attendee.attendee_detail?.last_name}`}</p>
                                      <p className="email">{attendee.attendee_detail?.email}</p>
                                    </div>
                                  ))}
                                  
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="ebs-table-box ebs-box-2"><p>{order?.order_attendee?.email}</p></div>
                        <div style={{width: 150}} className="ebs-table-box ebs-box-2"><p>{order?.order_attendee?.detail?.title}</p></div>
                        <div className="ebs-table-box ebs-box-4"><p>{order?.order_attendee?.detail?.company_name}</p></div>
                        <div className="ebs-table-box ebs-box-4"><p>{order?.reporting_panel_total_text}</p></div>
                        <div className="ebs-table-box ebs-box-4"><p>{order?.sales_agent_name}</p></div>
                        <div className="ebs-table-box ebs-box-4" style={{width: 150}}><p style={{fontWeight: 600, color: '#AB8D2E'}}>{order.is_payment_received == 1 ? 'Received' : 'Pending'}</p></div>
                      </div>) : (
                        <div style={{minHeight: '335px', backgroundColor: '#fff', borderRadius: '8px'}} className='d-flex align-items-center justify-content-center h-100 w-100'>
                        <div className="text-center">
                          <Image
                              src={'/no_record_found.svg'} alt="" width="100" height="100"
                          />
                          <p className='pt-3 m-0'>No data available</p>
                        </div>
                      </div>
                      ) : <div>
                      <Loader className={''} fixed={''}/> 
                    </div>
                      }
                    </div>
                  </div>
                  <div className='d-flex justify-content-end align-items-center pt-5 mb-4'>
                      <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                      />
                    <div style={{minWidth: 60}} onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                        <button onClick={handleToggle} className="ebs-btn-dropdown btn-select">
                          {limit}<i className="material-symbols-outlined">expand_more</i>
                        </button>
                        <div className="ebs-dropdown-menu">
                          {[2, 10, 20, 50, 100, 500].map((l)=>(<button key={l} className="dropdown-item" onClick={(e)=> { handleLimitChange(e, l) }}>{l}</button>))}
                        </div>
                      </div>
                    </div>
                </div>
              </div>
    </>
  );
}

