import React from 'react';
import './FoodBar.css';

const FoodBar = ({max, part1, part2}) => {
  let width1 = max > 0 ? Math.min(part1 / max * 100, 100) : 100;
  let width2 = max > 0 ? Math.min(part2 / max * 100, Math.max(100 - width1, 0)) : 0;
  return (
      <div className="bar">
        <div className="bar__fill" style={{width: width1}}></div>
        <div className="bar__fill bar__fill--selected" style={{width: width2}}></div>
      </div>
  );
};

export default FoodBar;