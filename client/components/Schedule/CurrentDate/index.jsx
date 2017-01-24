import React, { Component, PropTypes } from 'react';

const CurrentDate = (props) => {
  const { currentDate } = this.props; 
  const dayOftheWeek = new Date(currentDate._d).toLocaleString('en-us', {  weekday: 'long' });
  const dayOftheMonth = currentDate.date();
  const currentMonth = currentDate.format("MMMM");
  return (
	  <div>
	    <div className="title__side">
	      <div className="title__month">{currentMonth}</div>
	        <div className="title__day">{dayOftheWeek}</div>
	      </div>
	      <div className="title__number">{dayOftheMonth}</div>
	  </div>
	);
};

export default CurrentDate;
