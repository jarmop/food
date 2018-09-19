import React from 'react';
import './DatePicker.css';

const DAY_IN_MS = 86400000;

/**
 * @param Date
 * @returns {string}
 */
const formatDate = (date) => {
  return date.getDate() + '.' + date.getMonth() + '.' + date.getFullYear();
};

const getDateByDay = (day) => {
  let newDate = new Date();
  newDate.setDate(day);

  return newDate;
};

const DatePicker = ({selectedDate, onDateChange}) => {
  return (
      <div className="date-picker">
        <button
            className="btn btn-primary"
            onClick={
              () => onDateChange(getDateByDay(selectedDate.getDate() - 1))
            }
        >
          {'<'}
        </button>
        <span className="selected-date">
          {formatDate(selectedDate)}
        </span>
        <button
            className="btn btn-primary"
            onClick={
              () => onDateChange(getDateByDay(selectedDate.getDate() + 1))
            }
        >
          {'>'}
        </button>
      </div>
  );
};

export default DatePicker;