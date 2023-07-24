"use client";
import React from 'react'
import Countdown, { zeroPad } from "react-countdown";


const Completionist = () =>  
  <div className="col-12">
    <p>Date ended</p>
  </div>
;

// Renderer callback with condition
const renderer = ({ months,days,hours, minutes, seconds, completed }:any) => {
    if (completed) {
      // Render a complete state
      return <Completionist />;
    } else {
      // Render a countdown
      return (
        <React.Fragment>
              {Math.floor(days/30) > 0 && zeroPad(Math.floor(days/30))+':' }{zeroPad(Math.floor(days%30))}:{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
        </React.Fragment>
      );
    }
  };

const Index = ({date}:any) => {
  return (
    <Countdown date={date} renderer={renderer} />
  )
}

export default Index