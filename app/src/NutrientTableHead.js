import React from 'react';

const NutrientTableHead = () => {
  return (
      <thead>
      <tr>
        <th className="nutrient-table__column nutrient-table__column--toggle"></th>
        <th className="nutrient-table__column nutrient-table__column--name">Nimi</th>
        <th className="nutrient-table__column nutrient-table__column--amount" colSpan="3">Saanti / suositus
        </th>
        <th className="nutrient-table__column nutrient-table__column--max">Yläraja</th>
        <th className="nutrient-table__column nutrient-table__column--unit">Yksikkö</th>
      </tr>
      </thead>
  );
};

export default NutrientTableHead;