'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import Dropdown from '@/components/DropDown';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hooks';
import { userEventsStats, userEventsFilters } from '@/redux/store/slices/EventsSlice';
import { AsyncThunkAction, Dispatch, AnyAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store/store';
import { getSelectedLabel } from '@/helpers';
import Pagination from '@/components/pagination';
import Loader from '@/components/Loader';

const eventFilters = [
  {id: 'active_future', name: "Active and future events"},
  {id: 'active', name: "Active events"},
  {id: 'future', name: "Future events"},
  {id: 'expired', name: "Expired events"},
  {id: 'name', name: "All events"}
];
const sortFilters = [
  {id: 'name', name: "Event name"},
  {id: 'organizer_name', name: "Organizer name"},
  {id: 'start_date', name: "Start date"},
  {id: 'end_date', name: "End date"}
];
const rangeFilters = [
  { id: 'today', name: "Today" },
  { id: 'thisw', name: "This week" },
  { id: 'prevw', name: "Previous week" },
  { id: 'thism', name: "This month" },
  { id: 'prevm', name: "Previous month" },
  { id: 'custom', name: "Custom range" },
  { id: '-1', name: "All stats" },
];

let storedEventFilterData =
    typeof window !== "undefined" && localStorage.getItem("eventFilterData");
const storedEventFilters =
    storedEventFilterData && storedEventFilterData !== undefined ? JSON.parse(storedEventFilterData) : null;


export default function Dashboard() {
  const dispatch = useAppDispatch();
  const {events, loading, totalPages, currentPage, event_countries, office_countries, currencies, allEventsStats} = useAppSelector((state: RootState) => state.events);
  const [searchText, setSearchText] = useState('')
  const [limit, setLimit] = useState(storedEventFilters !== null ? storedEventFilters.limit : 10);
  const [eventFilterData, setEventFilterData] = useState(storedEventFilters !== null ? storedEventFilters : {
      sort_by:'',
      event_action:'',
      country:0,
      office_country_id:0,
      currency:208,
      range:'',
      start_date:'',
      end_date:'',
      searchTextEvents:'',
      limit:10,
      page:1,
  });

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
    setEventFilterData(eventFilterDataUpdate);
    savefiltersToLocalStorage(eventFilterDataUpdate);
    dispatch(userEventsStats(eventFilterDataUpdate));
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

  return (
   <>
            <div className="top-landing-page shadow-none">
              <div className="row d-flex ebs-search-events align-items-center">
                <div style={{padding: '0 22px'}} className="col-4">
                  <input type="text" className="ebs-search-area m-0 w-100" placeholder='Search' value={eventFilterData.search_text} onKeyUp={(e) => { e.key === 'Enter' ? handleSearchTextFilter(e): null}} onChange={(e)=>{setEventFilterData((prev:any)=> ({...prev, search_text:e.target.value}))}} />
                </div>
                <div style={{padding: '0 22px'}} className="col-8 d-flex justify-content-end">
                  <strong>{events.length > 0 ? events.length : 0} events</strong>
                </div>
              </div>
              <div className="row d-flex ebs-search-grid">
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      selected={eventFilterData.sort_by} 
                      onChange={handleSortByFilter}
                      selectedlabel={getSelectedLabel(sortFilters,eventFilterData.sort_by)}
                      listitems={sortFilters}
                    />
                  </label>
                </div>
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      selected={eventFilterData.event_action} 
                      onChange={handleEventActionFilter}
                      selectedlabel={getSelectedLabel(eventFilters,eventFilterData.event_action)}
                      listitems={eventFilters}
                    />
                  </label>
                </div>
                {event_countries?.length > 0 && 
                  <div className="col">
                    <label className="label-select-alt m-0 w-100">
                      <Dropdown 
                        label="Filter by"
                        listitems={event_countries}
                        selected={eventFilterData.country} 
                        onChange={handleCountryFilter}
                        selectedlabel={getSelectedLabel(event_countries,eventFilterData.country)}
                      />
                    </label>
                  </div>
                }
                {office_countries?.length > 0 && 
                  <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={office_countries}
                      selected={eventFilterData.office_country_id} 
                      onChange={handleOfficeCountryFilter}
                      selectedlabel={getSelectedLabel(office_countries,eventFilterData.office_country_id)}
                    />
                  </label>
                </div>
                }
                {currencies?.length > 0 && 
                  <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={currencies}
                      selected={eventFilterData.currency} 
                      onChange={handleCurrencyFilter}
                      selectedlabel={getSelectedLabel(currencies,eventFilterData.currency)}
                    />
                  </label>
                </div>
                }
                <div className="col">
                  <label className="label-select-alt m-0 w-100">
                    <Dropdown 
                      label="Filter by"
                      listitems={rangeFilters}
                      selected={eventFilterData.range} 
                      onChange={handleRangeFilter}
                      selectedlabel={getSelectedLabel(rangeFilters,eventFilterData.range)}
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
                            <strong>{allEventsStats !== null && allEventsStats.tickets_left  > 0 ? allEventsStats.tickets_left : 0}</strong>
                            <span>LEFT</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>{allEventsStats !== null && allEventsStats.total_sold_tickets  > 0 ? allEventsStats.total_sold_tickets : 0}</strong>
                            <span>sold</span>
                          </div>
                        </div>
                        <div className="col">
                          <div className="ebs-ticket-information">
                            <strong>{allEventsStats !== null && allEventsStats.total_tickets  > 0 ? allEventsStats.total_tickets : 0}</strong>
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
                              <strong>{allEventsStats !== null &&  allEventsStats?.range_reporting_stats?.total_range_revenue_text }</strong>
                              <span>Revenue</span>
                            </div>
                          </div>
                          <div className="col-7">
                            <div className="ebs-border-left p-1">
                              <strong>{allEventsStats !== null && allEventsStats.total_revenue_text }</strong>
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
                  <div className="ebs-data-table ebs-order-table position-relative">
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
                    {events.length > 0 && !loading  ? events.map((event,k) => 
                    <div key={k} className="d-flex align-items-center ebs-table-content">
                      <div className="ebs-table-box ebs-box-1">
                        <Image 
                        src={event.header_logo ? (`${process.env.serverImageHost + '/assets/event/branding/' + event.header_logo}`) : '/img/logo-placeholder.svg'}
                        alt={event.name} width={100} height={34} />
                      </div>
                      <div style={{width: 210}}  className="ebs-table-box ebs-box-2"><p style={{fontWeight: 600, color: '#404242'}}>{event.name}</p></div>
                      <div style={{width: 170}}  className="ebs-table-box ebs-box-2"><p>30/09/23 - 02/10/23</p></div>
                      <div style={{width: 140}}  className="ebs-table-box ebs-box-1"><p>{event.owner}</p></div>
                      <div style={{width: 140}} className="ebs-table-box ebs-box-4"><p>{event?.reporting_data.waiting_tickets}</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>{event?.reporting_data.sold_tickets}</p></div>
                      <div className="ebs-table-box ebs-box-4"><p>{event?.reporting_data.total_tickets}</p></div>
                      <div className="ebs-table-box ebs-box-1" ><p>{event?.reporting_data.total_revenue_text}</p></div>
                      <div className="ebs-table-box ebs-box-4" style={{paddingRight: 0}}><p>{event?.reporting_data.total_revenue_text}</p></div>
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
                    </div>) : 
                      loading ? 
                      <div style={{minHeight:'250px'}}>
                        <Loader className={''} fixed={''}/> 
                      </div>
                      : "No data available"
                    }
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
                          {[2, 10, 20, 50, 100, 500].map((i, k)=>(
                            <button key={k} className="dropdown-item" onClick={(e)=> { handleLimitChange(e, i) }}>{i}</button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
   </>
  )
}


