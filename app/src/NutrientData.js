import React from 'react';
import recommendations from './data/recommendations';
import './NutrientData.css';
import FoodBar from './FoodBar';

const calculateTotal = (recommendations, foods, selectedFoods) => {
  return recommendations.map(recommendation => {
    return selectedFoods.reduce(
        (totalNutrientAmount, food) => {
          return totalNutrientAmount + food.amount / 100 *
              foods[food.id].nutrients[recommendation.id];
        },
        0
    );
  });
};

const formatValue = (value) => {
  return value.toFixed(value < 2 ? 1 : 0);
};

const getRecommendationToEnergy = (recommendedNutrientDensity, energy) => {
  return energy / 1000 * recommendedNutrientDensity;
};

const getNutrientTableDataArray = (
    foods, mealFoods, selectedFoods, recommendations, showRelationToEnergy) => {
  let selectedFoodPart = selectedFoods.length > 0 ? calculateTotal(
      recommendations, foods,
      mealFoods.filter(food => selectedFoods.includes(food.id))
  ) : null;
  let nonSelectedFoodPart = calculateTotal(
      recommendations, foods,
      mealFoods.filter(food => !selectedFoods.includes(food.id))
  );
  let total = calculateTotal(recommendations, foods, mealFoods);
  let totalEnergy = nonSelectedFoodPart[0];

  let dataArray = [];
  recommendations.map((recommendation, index) => {
    dataArray.push({
      name: recommendation.name,
      recommendation: showRelationToEnergy && recommendation.nutrientDensity
          ? getRecommendationToEnergy(
              recommendation.nutrientDensity, totalEnergy)
          : recommendation.male,
      total: total[index] - (selectedFoodPart ? selectedFoodPart[index] : 0),
      max: recommendation.max,
      unit: recommendation.unit,
      part1: selectedFoodPart ? nonSelectedFoodPart[index] : total[index],
      part2: selectedFoodPart ? selectedFoodPart[index] : 0,
    });
  });

  return dataArray;
};

class NutrientData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showRelationToEnergy: true,
    };

    this.toggleMeasuringType = this.toggleMeasuringType.bind(this);
  }

  toggleMeasuringType() {
    this.setState({
      showRelationToEnergy: !this.state.showRelationToEnergy,
    });
  }

  render() {
    let {foods, mealFoods, selectedFoods} = this.props;

    let dataArrayBasic = getNutrientTableDataArray(
        foods, mealFoods, selectedFoods, recommendations.basic,
        this.state.showRelationToEnergy
    );
    let dataArrayMinerals = getNutrientTableDataArray(
        foods, mealFoods, selectedFoods, recommendations.minerals,
        this.state.showRelationToEnergy
    );
    let dataArrayVitamins = getNutrientTableDataArray(
        foods, mealFoods, selectedFoods, recommendations.vitamins,
        this.state.showRelationToEnergy
    );

    return (
        <div>
          <div>
            <input type="checkbox" id="energy"
                   checked={this.state.showRelationToEnergy}
                   onChange={this.toggleMeasuringType}/>
            <label htmlFor="energy">&nbsp;Vertaa saatuun energiamäärään</label>
          </div>
          <div className="nutrient-table-header">Perusravintoaineet</div>
          <NutrientTable dataArray={dataArrayBasic}/>
          <div className="nutrient-table-header">Mineraalit</div>
          <NutrientTable dataArray={dataArrayMinerals}/>
          <div className="nutrient-table-header">Vitamiinit</div>
          <NutrientTable dataArray={dataArrayVitamins}/>
        </div>
    );
  }
}

const NutrientTable = ({dataArray}) => {
  return (
      <table className="nutrient-table">
        <thead>
        <tr>
          <th className="nutrient-table__column">Nimi</th>
          <th className="nutrient-table__column" colSpan="3">Saanti / suositus
          </th>
          <th className="nutrient-table__column">Yläraja</th>
          <th className="nutrient-table__column">Yksikkö</th>
        </tr>
        </thead>
        <tbody className="nutrient-table__section">
        {dataArray.map((data, index) =>
            <tr key={index}>
              <td className="nutrient-table__column nutrient-table__column--name">{data.name}</td>
              <td className="nutrient-table__column nutrient-table__column--no-padding">
                <div>
                  <FoodBar max={data.recommendation} part1={data.part1}
                           part2={data.part2}/>
                </div>
              </td>
              <td className="nutrient-table__column nutrient-table__column--received nutrient-table__column--no-padding">
                {formatValue(data.total)}
              </td>
              <td className="nutrient-table__column nutrient-table__column--recommended nutrient-table__column--no-padding">
                &nbsp;/&nbsp;{formatValue(data.recommendation)}
              </td>
              <td className="nutrient-table__column">
                {data.max}
              </td>
              <td className="nutrient-table__column">
                {data.unit}
              </td>
            </tr>
        )}
        </tbody>
      </table>
  );
};

export default NutrientData;