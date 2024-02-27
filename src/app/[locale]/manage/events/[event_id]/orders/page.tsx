'use client'
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import Pagination from '@/components/pagination';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { userEventStatsAndOrders, clearAllState, userEventFormBasedStats } from '@/redux/store/slices/EventSlice';
import { RootState } from '@/redux/store/store';
import moment from 'moment';
import { getSelectedLabel } from '@/helpers';
import Loader from '@/components/Loader';
import DateTime from '@/components/DateTimePicker';
import TicketDetail from '@/components/TicketDetail';
import { useTranslations } from 'next-intl';

// const rangeFilters = [
//   { id: 'today', name: "Today" },
//   { id: 'thisw', name: "This week" },
//   { id: 'prevw', name: "Previous week" },
//   { id: 'thism', name: "This month" },
//   { id: 'prevm', name: "Previous month" },
//   { id: 'custom', name: "Custom range" },
//   { id: '-1', name: "All stats" },
// ];
// const fieldFilters = [
//   { id: '', name: "Select field" },
//   { id: 'order_number', name: "Order Number" },
//   { id: 'name', name: "Name" },
//   { id: 'email', name: "Email" },
//   { id: 'job_title', name: "Job Title" },
//   { id: 'company', name: "Company" }
// ];



export default function OrderListing({ params }: { params: { locale:string, event_id: string } }) {
  const t = useTranslations('manage-orders-page');

  const dispatch = useAppDispatch();

  let storedOrderFilterData = typeof window !== "undefined" && localStorage.getItem("orderFilterData");
  const storedOrderFilters = storedOrderFilterData && storedOrderFilterData !== undefined ? JSON.parse(storedOrderFilterData) : null;

  const {event_orders, event_stats, totalPages, currentPage, form_stats, event} = useAppSelector((state: RootState) => state.event);
  const [sortCol, setSortCol] = useState(storedOrderFilters!== null ? storedOrderFilters.sortCol : 'order_number');
  const [sort, setSort] = useState(storedOrderFilters!== null ? storedOrderFilters.sort : 'desc');
  const [showCustomRange, setShowCustomRange] = useState(storedOrderFilters !== null && storedOrderFilters.range === 'custom' ? true : false);
  const [limit, setLimit] = useState(storedOrderFilters !== null ? storedOrderFilters.limit : 10);
  const [regFormId, setRegFromId] = useState(0);
  const [toggle, setToggle] = useState(false)
  const [startDate, setStartDate] = useState(storedOrderFilters !== null ? storedOrderFilters.start_date : '');
  const [endDate, setEndDate] = useState(storedOrderFilters !== null ? storedOrderFilters.end_date : '');
  const [orderFilterData, setOrderFilterData] = useState(storedOrderFilters !== null ? {...storedOrderFilters, regFormId:0} : {
      field:'',
      range:'today',
      start_date:'',
      end_date:'',
      searchText:'',
      sort:'desc',
      sort_col:'order_number',
      limit:10,
      page:1,
      regFormId:0
  });

  useEffect(() => {
    savefiltersToLocalStorage(orderFilterData);
    const promise1 = dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterData}));
    const promise2 = dispatch(userEventFormBasedStats({event_id:params.event_id, ...orderFilterData}));
    return () =>{
        promise1.abort();
        promise2.abort();
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
      if(e.target != element){
        element.classList.remove('ebs-active')
      }
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

  const rangeFilters = useMemo(() => [
    { id: 'today', name: t('range_filters.today') },
    { id: 'thisw', name: t('range_filters.thisw') },
    { id: 'prevw', name: t('range_filters.prevw') },
    { id: 'thism', name: t('range_filters.thism') },
    { id: 'prevm', name: t('range_filters.prevm') },
    { id: 'custom', name: t('range_filters.custom') },
    { id: '-1', name: t('range_filters.-1') },
  ], [params.locale])

  const fieldFilters = useMemo(() => [
    { id: '', name: t('field_filters.select_field') },
  { id: 'order_number', name: t('field_filters.order_number') },
  { id: 'name', name: t('field_filters.name') },
  { id: 'email', name: t('field_filters.email') },
  { id: 'job_title', name: t('field_filters.job_title') },
  { id: 'company', name: t('field_filters.company') }
  ], [params.locale])

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
    if(e.value !== 'custom'){
      orderFilterDataUpdate['start_date'] = '';
      orderFilterDataUpdate['end_date'] = '';
    }
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    if(e.value !== 'custom'){
      setShowCustomRange(false);
      dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
    }else{
        setShowCustomRange(true);
    }
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

  const handleStartDateChange = (date: any) => {
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['start_date'] = date.format('MM/DD/YYYY');
    setStartDate(orderFilterDataUpdate['start_date']);
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    if(orderFilterDataUpdate.end_date !== ''){
      dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
    }
  };
  
  const handleEndDateChange = (date: any) => {
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['end_date'] = date.format('MM/DD/YYYY');
    setEndDate(orderFilterDataUpdate['end_date']);
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    if(orderFilterDataUpdate.start_date !== ''){
      dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
    }
  };
  
  const handleRegFormByFilter = (e: any) => {
    setRegFromId(e.value);
    const orderFilterDataUpdate = orderFilterData;
    orderFilterDataUpdate['regFormId'] = e.value
    setOrderFilterData(orderFilterDataUpdate);
    savefiltersToLocalStorage(orderFilterDataUpdate);
    dispatch(userEventStatsAndOrders({event_id:params.event_id, ...orderFilterDataUpdate}));
  };

  const handlePopup = (e:any) => {
    setToggle(false);
  }
  
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
                  <div className='d-flex justify-content-between mb-2'>
                    <h4>{t('tickets_label')}</h4>
                    <div className='cron-notification'>
                        <p> <strong>{t('last_updated')}</strong> :  {moment().startOf('hour').format('HH:ss')}  {moment().format('DD-MM-YYYY')} </p>
                        <p> <strong>{t('next_update_at')}</strong> : {moment().startOf('hour').add(1,'hours').format('HH:ss')}  {moment().format('DD-MM-YYYY')} </p>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-6">
                      <div className="row">
                        {event?.registration_form_id === 1 && form_stats && <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                              <button onClick={() => setToggle(true)} className='btn'><em className="material-symbols-outlined">local_activity</em></button>
                          </div>
                        </div>}
                        {event_stats !== null && event_stats?.reporting_data?.waiting_tickets != "0" ? <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.reporting_data?.waiting_tickets}</strong>
                            <span>{t('stats_waiting_tickets')}</span>
                          </div>
                        </div> : null}
                        {event_stats !== null && event_stats?.event_stats?.total_tickets != 0 ? <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.event_tickets_left}</strong>
                            <span>{t('stats_left_tickets')}</span>
                          </div>
                        </div> : null}
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.orders_range_stats?.range_sold_tickets}</strong>
                            <span>{t('stats_sold_tickets')}</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information ebs-bg-light">
                            <strong>{event_stats?.event_stats?.total_tickets}</strong>
                            <span>{t('stats_total_tickets')}</span>
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
                              <span>{t('stats_revenue')}</span>
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="ebs-border-left p-1">
                              <strong>{event_stats?.reporting_data?.total_revenue_text}</strong>
                              <span>{t('stats_total_revenue')}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-4">
                        <p className='m-0 ebs-info-vat'><i className="material-symbols-outlined">info</i>{t('tickets_vat_label')}</p>
                      </div>
                     </div>
                    </div>
                  </div>
                </div>
                {toggle && <TicketDetail handleClose={handlePopup} event_id={params.event_id} form_stats={form_stats} />}
                <div className="ebs-order-list-section">
                  <div className="ebs-order-header">
                    <h4>{t('order_list')}</h4>
                    <div className="row">
                      <div className="col-8 d-flex">
                        <input style={{ width: "410px" }} type="text" className="ebs-search-area" placeholder={t('search')} value={orderFilterData.searchText} onKeyUp={(e) => { e.key === 'Enter' ? handleSearchTextFilter(e): null}} onChange={(e)=>{setOrderFilterData((prev:any)=> ({...prev, searchText:e.target.value}))}} />
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label={t('field_filter_label')}
                            listitems={fieldFilters}
                            selected={orderFilterData.field} 
                            onChange={handleFieldFilter}
                            searchLabel={t('search')}
                            selectedlabel={getSelectedLabel(fieldFilters,orderFilterData.field)}
                          />
                        </label>
                        {form_stats && form_stats?.length > 0 && <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label="Registration forms"
                            selected={regFormId} 
                            onChange={handleRegFormByFilter}
                            selectedlabel={getSelectedLabel([{id:0,name:"Registration forms"},...form_stats.map((item:any)=>({id:item.id, name:item.attendee_type.attendee_type}))],regFormId)}
                            listitems={[{id:0,name:"Registration forms"},...form_stats.map((item:any)=>({id:item.id, name:item.attendee_type.attendee_type}))]}
                          />
                        </label>}
                        <label style={{ width: "210px" }} className="label-select-alt">
                          <Dropdown
                            label={t('range_filter_label')}
                            listitems={rangeFilters}
                            selected={orderFilterData.range} 
                            onChange={handleRangeFilter}
                            searchLabel={t('search')}
                            selectedlabel={getSelectedLabel(rangeFilters,orderFilterData.range)}
                          />
                        </label>
                      </div>
                    </div>
                    {showCustomRange && <div className='row mt-3'>
                      <div className='col-4 d-flex'>
                      
                          <label className="label-select-alt m-0 w-100">
                            <DateTime
                              showtime={false}
                              showdate={'DD-MM-YYYY'}
                              label={t('range_filters.start_date')}
                              value={orderFilterData.start_date}
                              maxDate={ endDate ? moment(endDate).add('days', 1).format('MM/DD/YYYY') : '' }
                              key={endDate}
                              onChange={handleStartDateChange}
                            />
                          </label>
                          <label className="label-select-alt m-0 w-100">
                          <DateTime
                            showtime={false}
                            showdate={'DD-MM-YYYY'}
                            label={t('range_filters.end_date')}
                            value={orderFilterData.end_date}
                            minDate={startDate ?  moment(startDate).subtract('days', 1).format('MM/DD/YYYY') : '' }
                            key={startDate}
                            onChange={handleEndDateChange}
                          />
                          </label>
                        
                      </div>
                    </div>}
                  </div>
                  <div className="ebs-data-table ebs-order-table position-relative">
                    <div className="d-flex align-items-center ebs-table-header">
                      <div className="ebs-table-box ebs-box-1">
                        <strong>
                          {t('order_table.number')}
                          <span className='d-flex flex-column'>
                            <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_number')}}>keyboard_arrow_up</em> 
                            <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_number' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_number')}}>keyboard_arrow_down</em>
                          </span>
                        </strong>
                      </div>
                      <div className="ebs-table-box ebs-box-1"><strong>                          
                        {t('order_table.date')} 
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_date' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_date')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_date' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_date')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>
                      {t('order_table.attendee_name')}
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'name' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'name')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'name' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'name')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-2"><strong>
                      {t('order_table.attendee_email')}
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'email' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'email')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'email' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'email')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div style={{width: 150}} className="ebs-table-box ebs-box-2"><strong>
                      {t('order_table.job_title')}
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'job_title' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'job_title')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'job_title' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'job_title')}}>keyboard_arrow_down</em>
                    </span>  
                      </strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>
                      {t('order_table.company')}
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'company' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'company')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'company' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'company')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>
                      {t('order_table.amount')}
                       
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'amount' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'amount')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'amount' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'amount')}}>keyboard_arrow_down</em>
                    </span></strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>
                      {t('order_table.sales_agent')}
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'sales_agent')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'sales_agent' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'sales_agent')}}>keyboard_arrow_down</em>
                    </span>
                      </strong></div>
                      <div className="ebs-table-box ebs-box-4" style={{width: 150}}><strong>
                      {t('order_table.order_status')}
                      <span className='d-flex flex-column'>
                      <em className={`material-symbols-outlined ${sort === 'asc' && sortCol === 'order_status' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('asc', 'order_status')}}>keyboard_arrow_up</em> 
                      <em className={`material-symbols-outlined ${sort === 'desc' && sortCol === 'order_status' ? 'fw-bolder' : 'cursor-pointer'}`} onClick={()=>{handleSortChange('desc', 'order_status')}}>keyboard_arrow_down</em>
                    </span>
                        </strong></div>
                    </div>
                    <div style={{minHeight:"calc(100vh - 720px)"}}>
                      {event_orders !== null ? event_orders.data.length > 0 ? event_orders.data.map((order:any,k:number) => 
                      <div key={order.id} >
                        <div key={k} className="d-flex align-items-center ebs-table-content" style={{cursor:'text'}}>
                          <div className="ebs-table-box ebs-box-1"><p>{order.order_number}</p></div>
                          <div className="ebs-table-box ebs-box-1"><p>{moment(order.order_date).format('DD-MM-YYYY')}</p></div>
                          <div className="ebs-table-box ebs-box-2 ebs-attendee-name-list">
                            <p>{`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}</p>
                            {/* {order.order_attendees.length <= 1 ? <p>{`${order?.order_attendee?.first_name} ${order?.order_attendee?.last_name}`}</p> : (
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
                            )} */}
                          </div>
                          <div className="ebs-table-box ebs-box-2"><p>{order?.order_attendee?.email}</p></div>
                          <div style={{width: 150}} className="ebs-table-box ebs-box-2"><p>{order?.order_attendee?.detail?.title}</p></div>
                          <div className="ebs-table-box ebs-box-4"><p>{order?.order_attendee?.detail?.company_name}</p></div>
                          <div className="ebs-table-box ebs-box-4"><p>{order?.reporting_panel_total_text}</p></div>
                          <div className="ebs-table-box ebs-box-4"><p>{order?.sales_agent_name}</p></div>
                          <div className="ebs-table-box ebs-box-4" style={{width: 150}}><p style={{fontWeight: 600, color: order.billing_order_status == 'completed' ? '#60A259' : '#AB8D2E'}}>{order.billing_order_status}</p></div>
                        </div>
                        {order?.order_attendees?.length > 1 && <MoreAttendees data={order.order_attendees} />}
                      </div>
                      ) : (
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
                          {[10, 20, 50, 100, 500].map((l)=>(<button key={l} className="dropdown-item" onClick={(e)=> { handleLimitChange(e, l) }}>{l}</button>))}
                        </div>
                      </div>
                    </div>
                </div>
              </div>
    </>
  );
}


const MoreAttendees = ({data}: any) => {
  const [toggle, setToggle] = useState(false)
  return (
    <div style={{background: '#EEF2F4',}} className='rounded-4'>
      <div style={{background: '#EEF2F4', cursor:'default'}} className="d-flex align-items-center ebs-table-content" >
          <div className="ebs-table-box ebs-box-1" />
          <div className="ebs-table-box ebs-box-1" />
        <div className="ebs-table-box ebs-box-2"><p><strong onClick={() => setToggle(!toggle)}> <i  style={{fontSize: 18}} className="material-icons">{toggle ? 'expand_more' : 'chevron_right' }</i>  <span style={{marginRight:'5px'}}>{data?.length - 1}</span> {"more attendees"}  </strong></p></div>
        <div className="ebs-table-box ebs-box-2" />
        <div className="ebs-table-box  ebs-box-4" />
       <div className="ebs-table-box ebs-box-4" />
       <div className="ebs-table-box ebs-box-4" />
       <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
       <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
       <div className="ebs-table-box ebs-box-3 d-flex justify-content-end" />
      </div>
      {toggle && <React.Fragment>
        {data.map((attendee:any,k:any) =>
         k === 0 ? null : (<div style={{background: '#EEF2F4', cursor:'default'}} key={attendee.id} className="d-flex align-items-center ebs-table-content">
          <div className="ebs-table-box ebs-box-1" />
          <div className="ebs-table-box ebs-box-1" />
          <div className="ebs-table-box ebs-box-2" style={{paddingLeft:'32px'}}>
            <p><strong>{attendee?.attendee_detail?.first_name} {attendee?.attendee_detail?.last_name}</strong></p>
            <p>{attendee?.attendee_detail?.email} </p>
            </div>
          <div className="ebs-table-box ebs-box-2"></div>
          <div className="ebs-table-box  ebs-box-4" />
        <div className="ebs-table-box ebs-box-4" />
        <div className="ebs-table-box ebs-box-4" />
        <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
        <div className="ebs-table-box ebs-box-3" style={{paddingRight: 0}} />
        <div className="ebs-table-box ebs-box-3 d-flex justify-content-end" />
        </div>)
      )}
      </React.Fragment>}
    </div>
  )
}
