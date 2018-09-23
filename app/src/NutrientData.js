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
  return value.toFixed(value < 10 ? 1 : 0);
};

const getRecommendationToEnergy = (recommendedNutrientDensity, energy) => {
  return energy / 1000 * recommendedNutrientDensity;
};

const getNutrientTableDataArray = (
    foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations, showRelationToEnergy, totalEnergy
) => {
  let selectedFoodPart = selectedMealFoods.length > 0 ? calculateTotal(
      recommendations, foods,
      selectedMealFoods
  ) : null;
  let nonSelectedFoodPart = calculateTotal(
      recommendations, foods,
      nonSelectedMealFoods
  );

  let total = selectedFoodPart ? calculateTotal(recommendations, foods, mealFoods) : nonSelectedFoodPart;

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
    let selectedMealFoods = mealFoods.filter(food => selectedFoods.includes(food.id));
    let nonSelectedMealFoods = mealFoods.filter(food => !selectedFoods.includes(food.id));
    let totalEnergy = calculateTotal(recommendations.basic.slice(0,1), foods, nonSelectedMealFoods).pop();
    let dataArrayBasic = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.basic,
        this.state.showRelationToEnergy, totalEnergy
    );
    let dataArrayMinerals = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.minerals,
        this.state.showRelationToEnergy, totalEnergy
    );
    let dataArrayVitamins = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.vitamins,
        this.state.showRelationToEnergy, totalEnergy
    );
    let dataArrayFats = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.fats,
        this.state.showRelationToEnergy, totalEnergy
    );
    let dataArrayCarbs = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.carbs,
        this.state.showRelationToEnergy, totalEnergy
    );

    return (
        <div>
          <div>
            <input type="checkbox" id="energy"
                   checked={this.state.showRelationToEnergy}
                   onChange={this.toggleMeasuringType}/>
            <label htmlFor="energy">&nbsp;Vertaa saatuun energiamäärään</label>
          </div>
          <table className="nutrient-table">
            <NutrientTableHead/>
            <NutrientTableSection dataArray={dataArrayBasic} isToggleEnabled={false}/>
            <NutrientTableSection dataArray={dataArrayMinerals} name="Mineraalit"/>
            <NutrientTableSection dataArray={dataArrayVitamins} name="Vitamiinit"/>
            <NutrientTableSection dataArray={dataArrayFats} name="Rasvat"/>
            <NutrientTableSection dataArray={dataArrayCarbs} name="Hiilihydraatit"/>
          </table>
        </div>
    );
  }
}

const NutrientTableHead = ({dataArray}) => {
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

class NutrientTableSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVisible: 'isVisible' in props ? props.isVisible : true,
      isToggleEnabled: 'isToggleEnabled' in props ? props.isToggleEnabled : true,
    };

    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  show() {
    this.setState({
      isVisible: true,
    });
  }

  hide() {
    this.setState({
      isVisible: false,
    });
  }

  render() {
    let {dataArray, name} = this.props;

    return (
        <tbody className="nutrient-table__section">
        {!this.state.isVisible &&
          <tr>
            <td valign="top">
              <button className="nutrient-table__section-toggle" onClick={this.show}>+</button>
            </td>
            <td colSpan="6">{name}</td>
          </tr>
        }
        {this.state.isVisible && dataArray.map((data, index) =>
            <tr key={index}>
              {index === 0 &&
              <td rowSpan={dataArray.length} valign="top">
                {this.state.isToggleEnabled &&
                  <button className="nutrient-table__section-toggle" onClick={this.hide}>-</button>
                }
              </td>
              }
              <td className="nutrient-table__column nutrient-table__column--name">{data.name}</td>
              <td className="nutrient-table__column nutrient-table__column--no-padding">
                <div>
                  <FoodBar
                      max={data.recommendation}
                      part1={data.part1}
                      part2={data.part2}
                  />
                </div>
              </td>
              <td className="nutrient-table__column nutrient-table__column--received nutrient-table__column--no-padding">
                {formatValue(data.total)}&nbsp;
              </td>
              <td className="nutrient-table__column nutrient-table__column--recommended nutrient-table__column--no-padding">
                {data.recommendation &&
                  '/ ' + formatValue(data.recommendation)
                }
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
    );
  }
}

export default NutrientData;