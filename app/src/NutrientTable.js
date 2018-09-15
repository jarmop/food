import recommendations from './data/recommendations';
import React from 'react';

const NutrientTable = ({recommendations, total}) => {
  return (
      <table>
        <thead>
        <tr>
          <th>Name</th>
          <th>Total</th>
          <th>Recommendation</th>
          <th>Max</th>
          <th>Unit</th>
        </tr>
        </thead>
        <tbody>
        {recommendations.map((recommendation, index) =>
            <tr key={index}>
              <td>{recommendation.name}</td>
              <td>
                <div className="bar">
                  <div
                      className="bar__fill"
                      style={{
                        width: Math.min(total[index] /
                            recommendation.male * 100, 100) + '%'
                      }}
                  ></div>
                </div>
                <div className="total-amount">
                  {total[index].toFixed(total[index] < 10 ? 1 : 0)}
                </div>
              </td>
              <td>
                {recommendation.male}
              </td>
              <td>
                {recommendation.max}
              </td>
              <td>
                {recommendation.unit}
              </td>
            </tr>
        )}
        </tbody>
      </table>
  );
};

export default NutrientTable;