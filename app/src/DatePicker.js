import React from 'react';
import './DatePicker.css';
import moment from 'moment';

const date = moment();

const DatePicker = ({onDateChange}) => {
  return (
      <div className="date-picker">
        <button
            className="btn btn-primary"
            onClick={
              () => onDateChange(date.subtract(1, 'days').toDate())
            }
        >
          {'<'}
        </button>
        <span className="selected-date">
          {date.format('D.M.YYYY')}
        </span>
        <button
            className="btn btn-primary"
            onClick={
              () => onDateChange(date.add(1, 'days').toDate())
            }
        >
          {'>'}
        </button>
      </div>
  );
};

export default DatePicker;