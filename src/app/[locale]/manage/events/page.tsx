'use client'
import React, { useEffect, useState, useMemo } from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { userEventsStats, userEventsFilters } from '@/redux/store/slices/EventsSlice';
import { RootState } from '@/redux/store/store';
import { authHeader, getSelectedLabel } from '@/helpers';
import Pagination from '@/components/pagination';
import Loader from '@/components/Loader';
import moment from 'moment';
import Link from 'next/link';
import axios from 'axios';
import { AGENT_ENDPOINT } from '@/constants/endpoints';
import FullPageLoader from '@/components/FullPageLoader';
import DateTime from '@/components/DateTimePicker';
import { useTranslations } from 'next-intl';

// const eventFilters = [
//   {id: 'active_future', name: "Active and future events"},
//   {id: 'active', name: "Active events"},
//   {id: 'future', name: "Future events"},
//   {id: 'expired', name: "Expired events"},
//   {id: 'name', name: "All events"}
// ];
// const sortFilters = [
//   {id: 'name', name: "Event name"},
//   {id: 'organizer_name', name: "Organizer name"},
//   {id: 'start_date', name: "Start date"},
//   {id: 'end_date', name: "End date"}
// ];
// const rangeFilters = [
//   { id: 'today', name: "Today" },
//   { id: 'thisw', name: "This week" },
//   { id: 'prevw', name: "Previous week" },
//   { id: 'thism', name: "This month" },
//   { id: 'prevm', name: "Previous month" },
//   { id: 'custom', name: "Custom range" },
//   { id: '-1', name: "All stats" },
// ];




export default function Dashboard({params:{locale}}:{params:{locale:string}}) {
  const t = useTranslations('manage-events-page');

  const dispatch = useAppDispatch();

  let storedEventFilterData = typeof window !== "undefined" && localStorage.getItem("eventFilterData");
  const storedEventFilters =storedEventFilterData && storedEventFilterData !== undefined ? JSON.parse(storedEventFilterData) : null;

  const {events, loading, totalPages, currentPage, event_countries, office_countries, currencies, allEventsStats, totalevents} = useAppSelector((state: RootState) => state.events);
  const [showCustomRange, setShowCustomRange] = useState(storedEventFilters !== null && storedEventFilters.range === 'custom' ? true : false);
  const [limit, setLimit] = useState(storedEventFilters !== null ? storedEventFilters.limit : 10);
  const [downloading, setDownloading] = useState(false);
  const [eventFilterData, setEventFilterData] = useState(storedEventFilters !== null ? storedEventFilters : {
      sort_by:'',
      event_action:'active_future',
      country:0,
      office_country_id:0,
      currency:208,
      range:'today',
      start_date:'',
      end_date:'',
      searchTextEvents:'',
      limit:10,
      page:1,
  });

  const [startDate, setStartDate] = useState(storedEventFilters !== null ? storedEventFilters.start_date : '')
  const [endDate, setEndDate] = useState(storedEventFilters !== null ? storedEventFilters.end_date : '')

  useEffect(() => {
      const promise1 = dispatch(userEventsFilters({}));
      const promise2 = dispatch(userEventsStats(eventFilterData));
      return () =>{
          promise1.abort();
          promise2.abort();
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

  const savefiltersToLocalStorage = (updatedEventFilters:any) => {
      if(window !== undefined){
        localStorage.setItem('eventFilterData', JSON.stringify(updatedEventFilters));
      }
  }

  const eventFilters = useMemo(() => [
    {id: 'active_future', name: t('event_filters.active_future')},
    {id: 'active', name: t('event_filters.active')},
    {id: 'future', name: t('event_filters.future')},
    {id: 'expired', name: t('event_filters.expired')},
    {id: 'name', name: t('event_filters.name')}
  ], [locale])

  const sortFilters = useMemo(() => [
      {id: 'name', name: t('sort_filters.name')},
      {id: 'organizer_name', name: t('sort_filters.organizer_name')},
      {id: 'start_date', name: t('sort_filters.start_date')},
      {id: 'end_date', name: t('sort_filters.end_date')}
  ], [locale])
  
  const rangeFilters = useMemo(() => [
    { id: 'today', name: t('range_filters.today') },
    { id: 'thisw', name: t('range_filters.thisw') },
    { id: 'prevw', name: t('range_filters.prevw') },
    { id: 'thism', name: t('range_filters.thism') },
    { id: 'prevm', name: t('range_filters.prevm') },
    { id: 'custom', name: t('range_filters.custom') },
    { id: '-1', name: t('range_filters.-1') },
  ], [locale])

  const handleSearchTextFilter = (e:any) => {
    const {value} = e.target;
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate.searchTextEvents = value;
    eventFilterDataUpdate['page'] = 1;
    // Update the requestData state with the modified array
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }

  const handleSortByFilter = (e:any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['sort_by'] = e.value;
    eventFilterDataUpdate['page'] = 1;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }
  
  const handleEventActionFilter = (e:any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['event_action'] = e.value;
    eventFilterDataUpdate['page'] = 1;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }
  
  const handleCountryFilter = (e:any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['country'] = e.value;
    eventFilterDataUpdate['page'] = 1;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }
  
  const handleOfficeCountryFilter = (e:any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['office_country_id'] = e.value;
    eventFilterDataUpdate['page'] = 1;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }
  
  const handleCurrencyFilter = (e:any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['currency'] = e.value;
    eventFilterDataUpdate['page'] = 1;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }
  const handleRangeFilter = (e:any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['range'] = e.value;
    eventFilterDataUpdate['page'] = 1;
    if(e.value !== 'custom'){
      eventFilterDataUpdate['start_date'] = '';
      eventFilterDataUpdate['end_date'] = '';
    }
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    if(e.value !== 'custom'){
      setShowCustomRange(false);
      dispatch(userEventsStats(eventFilterDataUpdate));
    }else{
        setShowCustomRange(true);
    }
  }
  const handleLimitChange = (e:any, value:any) => {
    setLimit(value); 
    handleToggle(e);
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['limit'] = value;
    eventFilterDataUpdate['page'] = 1;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  }

  const handlePageChange = (page: number) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['page'] = page;
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
  };
  
  const handleStartDateChange = (date: any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['start_date'] = date.format('MM/DD/YYYY');
    setStartDate(eventFilterDataUpdate['start_date']);
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    if(eventFilterDataUpdate.end_date !== ''){
      dispatch(userEventsStats(eventFilterDataUpdate));
    }
  };
  
  const handleEndDateChange = (date: any) => {
    const eventFilterDataUpdate = eventFilterData;
    eventFilterDataUpdate['end_date'] = date.format('MM/DD/YYYY');
    setEndDate(eventFilterDataUpdate['end_date']);
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    if(eventFilterDataUpdate.start_date !== ''){
      dispatch(userEventsStats(eventFilterDataUpdate));
    }
  };

  const exportEventOrders = (event_id:string) =>{
    setDownloading(true);
    axios.post(`${AGENT_ENDPOINT}/export-event-orders/${event_id}`, eventFilterData, {
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
            <div className="top-landing-page shadow-none">
              <div className="row d-flex ebs-search-events align-items-center">
                <div style={{padding: '0 22px'}} className="col-4">
                  <input type="text" className="ebs-search-area m-0 w-100" placeholder={t('search')} value={eventFilterData.search_text} onKeyUp={(e) => { e.key === 'Enter' ? handleSearchTextFilter(e): null}} onChange={(e)=>{setEventFilterData((prev:any)=> ({...prev, search_text:e.target.value}))}} />
                </div>
                <div style={{padding: '0 22px'}} className="col-8 d-flex justify-content-end">
                  <strong>{totalevents} events</strong>
                </div>
              </div>
              <div className="row d-flex ebs-search-grid">
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label={t('sort_filter_label')}
                      selected={eventFilterData.sort_by} 
                      onChange={handleSortByFilter}
                      selectedlabel={getSelectedLabel(sortFilters,eventFilterData.sort_by)}
                      searchLabel={t('search')}
                      listitems={sortFilters}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label={t('event_filter_label')}
                      selected={eventFilterData.event_action} 
                      onChange={handleEventActionFilter}
                      selectedlabel={getSelectedLabel(eventFilters,eventFilterData.event_action)}
                      searchLabel={t('search')}

                      listitems={eventFilters}
                    />
                  </label>
                </div>
                {event_countries?.length > 0 && 
                  <div className="col">
                    <label className="label-select-alt m-0 w-100">
                      <Dropdown 
                        label={t('country_filter_label')}
                        listitems={[{ id: '', name: t('country_filter_label') },...event_countries]}
                        selected={eventFilterData.country} 
                        onChange={handleCountryFilter}
                      searchLabel={t('search')}
                        selectedlabel={getSelectedLabel(event_countries,eventFilterData.country)}
                      />
                    </label>
                  </div>
                }
                {office_countries?.length > 0 && 
                  <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label={t('office_filter_label')}
                      listitems={[{ id: '', name: t('office_filter_label') }, ...office_countries]}
                      selected={eventFilterData.office_country_id} 
                      onChange={handleOfficeCountryFilter}
                      searchLabel={t('search')}
                      selectedlabel={getSelectedLabel(office_countries,eventFilterData.office_country_id)}
                    />
                  </label>
                </div>
                }
                {currencies?.length > 0 && 
                  <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Select currency"
                      listitems={currencies}
                      selected={eventFilterData.currency} 
                      onChange={handleCurrencyFilter}
                      searchLabel={t('search')}
                      selectedlabel={getSelectedLabel(currencies,eventFilterData.currency)}
                    />
                  </label>
                </div>
                }
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label={t('range_filter_label')}
                      listitems={rangeFilters}
                      selected={eventFilterData.range} 
                      onChange={handleRangeFilter}
                      searchLabel={t('search')}
                      selectedlabel={getSelectedLabel(rangeFilters,eventFilterData.range)}
                    />
                  </label>
                </div>
                
              </div>
              {showCustomRange && <div className='row  d-flex ebs-search-grid'> 
              <div className="col-2">
                  <label className="label-select-alt m-0 w-100">
                  <DateTime
                    showtime={false}
                    showdate={'DD-MM-YYYY'}
                    label={t('sort_filters.start_date')}
                    value={eventFilterData.start_date}
                    maxDate={endDate}
                    key={endDate}
                    onChange={handleStartDateChange}
                  />
                  </label>
                </div>
              <div className="col-2">
                  <label className="label-select-alt m-0 w-100">
                  <DateTime
                    showtime={false}
                    showdate={'DD-MM-YYYY'}
                    label={t('sort_filters.end_date')}
                    value={eventFilterData.end_date}
                    minDate={ moment(startDate).substract(1, "days") }
                    key={startDate}
                    onChange={handleEndDateChange}
                  />
                  </label>
                </div>
              </div>}
            </div>
            <div className="main-data-table">
                <div className="ebs-ticket-section">
                  <div className='d-flex justify-content-between mb-2'>
                    <h4>{t('tickets')}</h4>
                    <div className='cron-notification'>
                        <p> <strong>{t('last_updated')}</strong> :  {moment().startOf('hour').format('HH:ss')}  {moment().format('DD-MM-YYYY')} </p>
                        <p> <strong>{t('next_update_at')}</strong> : {moment().startOf('hour').add(1,'hours').format('HH:ss')}  {moment().format('DD-MM-YYYY')} </p>
                    </div>
                  </div>
                  <div className="row d-flex">
                    <div className="col-6">
                      <div className="row">
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>{allEventsStats !== null && allEventsStats.range_reporting_stats?.range_waiting_list_attendees  > 0 ? allEventsStats.range_reporting_stats?.range_waiting_list_attendees : 0}</strong>
                            <span>{t('tickets_waiting_label')}</span>
                          </div>
                        </div>
                        {/* <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>{allEventsStats !== null && allEventsStats.tickets_left  > 0 ? allEventsStats.tickets_left : 0}</strong>
                            <span>LEFT</span>
                          </div>
                        </div> */}
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>{allEventsStats !== null && allEventsStats?.range_reporting_stats?.range_sold_tickets  > 0 ? allEventsStats?.range_reporting_stats?.range_sold_tickets : 0}</strong>
                            <span>{t('tickets_sold_label')}</span>
                          </div>
                        </div>
                        {/* <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>{allEventsStats !== null && allEventsStats.total_tickets  > 0 ? allEventsStats.total_tickets : 0}</strong>
                            <span>total</span>
                          </div>
                        </div> */}
                      </div>
                    </div>
                    <div className="col-6">
                     <div className="row d-flex align-items-end h-100">
                      <div className="col-8 h-100">
                        <div className="ebs-time-counter d-flex align-items-center">
                          <div className="col-5">
                            <div className="p-1">
                              <strong>{allEventsStats !== null &&  allEventsStats?.range_reporting_stats?.total_range_revenue_text }</strong>
                              <span>{t('tickets_revenue_label')}</span>
                            </div>
                          </div>
                          <div className="col-7">
                            <div className="ebs-border-left p-1">
                              <strong>{allEventsStats !== null && allEventsStats.total_revenue_text }</strong>
                              <span>{t('tickets_total_revenue_label')}</span>
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
                <div className="ebs-order-list-section" >
                  <div className="ebs-data-table ebs-order-table position-relative">
                    <div className="d-flex align-items-center ebs-table-header">
                      <div className="ebs-table-box ebs-box-1"><strong>{t('event_table.event_logo')}</strong></div>
                      <div style={{width: 210}}  className="ebs-table-box ebs-box-2"><strong>{t('event_table.event_name')}</strong></div>
                      <div style={{width: 170}}  className="ebs-table-box ebs-box-2"><strong>{t('event_table.event_date')}</strong></div>
                      <div style={{width: 140}}  className="ebs-table-box ebs-box-1"><strong>{t('event_table.organized_by')}</strong></div>
                      <div style={{width: 140}}  className="ebs-table-box ebs-box-4"><strong>Tickets Waiting</strong></div>
                      <div className="ebs-table-box ebs-box-4"><strong>{t('event_table.sold_tickets')}</strong></div>
                      {/* <div className="ebs-table-box ebs-box-4"><strong>Total Tickets</strong></div> */}
                      <div className="ebs-table-box ebs-box-1"><strong>{t('event_table.revenue')}</strong></div>
                      <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><strong>{t('event_table.total_revenue')}</strong></div>
                      <div className="ebs-table-box ebs-box-1" style={{width: 80}}  />
                    </div>
                    <div style={{minHeight:"calc(100vh - 720px)"}}>
                        {events.length > 0 && !loading  ? events.map((event,k) => 
                            <Link href={'/manage/events/'+event.id +'/orders'} className="dropdown-item">
                              <div key={k} className="d-flex align-items-center ebs-table-content" >
                                <div className="ebs-table-box ebs-box-1">
                                  <Image 
                                  src={event.header_logo ? (`${process.env.serverImageHost + '/assets/event/branding/' + event.header_logo}`) : `${process.env.serverImageHost + '/_admin_assets/images/eventbuizz_logo.png'}`}
                                  alt={event.name} width={100} height={34} />
                                </div>
                                <div style={{width: 210}}  className="ebs-table-box ebs-box-2"><p style={{fontWeight: 600, color: '#404242'}}>{event.name}</p></div>
                                <div style={{width: 170}}  className="ebs-table-box ebs-box-2"><p>{moment(event.start_date).format('DD-MM-YYYY')} - {moment(event.end_date).format('DD-MM-YYYY')}</p></div>
                                <div style={{width: 140}}  className="ebs-table-box ebs-box-1"><p>{event.organizer_name}</p></div>
                                <div style={{width: 140}} className="ebs-table-box ebs-box-4"><p>{event?.reporting_data.range_waiting_list_attendees}</p></div>
                                <div className="ebs-table-box ebs-box-4"><p>{event?.reporting_data.range_sold_tickets}</p></div>
                                {/* <div className="ebs-table-box ebs-box-4"><p>{event?.reporting_data.total_tickets}</p></div> */}
                                <div className="ebs-table-box ebs-box-1" ><p>{event?.reporting_data.total_range_revenue_text}</p></div>
                                <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><p>{event?.reporting_data.total_revenue_text}</p></div>
                                <div style={{width: 80}} className="ebs-table-box ebs-box-1 d-flex justify-content-end">
                                  <ul className='d-flex ebs-panel-list m-0 p-0'>
                                    <li>
                                      <div onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                                        <button onClick={handleToggle} className='ebs-btn-panel ebs-btn-dropdown'>
                                          <i className="material-icons">more_horiz</i>
                                        </button>
                                        <div style={{minWidth: 130}} className="ebs-dropdown-menu">
                                          <Link href={'/manage/events/'+event.id +'/orders'} className="dropdown-item">{t('view_details')}</Link>
                                          <button className="dropdown-item" onClick={(e)=>{ e.preventDefault(); exportEventOrders(event.id) }}>{t('export_orders')}</button>
                                        </div>
                                      </div>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Link>
                        ) : 
                          loading ? 
                          <div>
                            <Loader className={''} fixed={''}/> 
                          </div>
                          : 
                          <div style={{minHeight: '335px', backgroundColor: '#fff', borderRadius: '8px'}} className='d-flex align-items-center justify-content-center h-100 w-100'>
                            <div className="text-center">
                              <Image
                                  src={'/no_record_found.svg'} alt="" width="100" height="100"
                              />
                              <p className='pt-3 m-0'>{t('no_data_available')}</p>
                            </div>
                          </div>
                        }
                    </div>
                    <div className='d-flex justify-content-end align-items-center pt-3'>
                      <Pagination
                          currentPage={currentPage}
                          totalPages={totalPages}
                          onPageChange={handlePageChange}
                      />
                    <div style={{minWidth: 60}} onClick={(e) => e.stopPropagation()} className="ebs-dropdown-area">
                        <button onClick={handleToggle} className="ebs-btn-dropdown btn-select">
                          {limit} <i className="material-symbols-outlined">expand_more</i>
                        </button>
                        <div className="ebs-dropdown-menu">
                          {[ 10, 20, 50, 100, 500].map((i, k)=>(
                            <button key={k} className="dropdown-item" onClick={(e)=> { handleLimitChange(e, i) }}>{i}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
      {downloading ? <FullPageLoader className={''} fixed={''}/> : null}

   </>
  )
}


