import React from 'react';
import recommendations from './data/recommendations';
import './NutrientData.css';
import NutrientTableSection from './NutrientTableSection';
import NutrientTableHead from './NutrientTableHead';

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


const getRecommendationToEnergy = (recommendedNutrientDensity, energy) => {
  return energy / 1000 * recommendedNutrientDensity;
};

const getNutrientTableDataArray = (
    foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations, showRelationToEnergy, totalEnergy
) => {
  const selectedFoodPart = selectedMealFoods.length > 0 ? calculateTotal(
      recommendations, foods,
      selectedMealFoods
  ) : null;
  const nonSelectedFoodPart = calculateTotal(
      recommendations, foods,
      nonSelectedMealFoods
  );

  const total = selectedFoodPart ? calculateTotal(recommendations, foods, mealFoods) : nonSelectedFoodPart;

  const dataArray = [];
  recommendations.forEach((recommendation, index) => {
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
      showRelationToEnergy: false,
    };

    this.toggleMeasuringType = this.toggleMeasuringType.bind(this);
  }

  toggleMeasuringType() {
    this.setState({
      showRelationToEnergy: !this.state.showRelationToEnergy,
    });
  }

  render() {
    const {foods, mealFoods, selectedFoods} = this.props;
    const selectedMealFoods = mealFoods.filter(food => selectedFoods.includes(food.id));
    const nonSelectedMealFoods = mealFoods.filter(food => !selectedFoods.includes(food.id));
    const totalEnergy = calculateTotal(recommendations.basic.slice(0,1), foods, nonSelectedMealFoods).pop();
    const dataArrayBasic = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.basic,
        this.state.showRelationToEnergy, totalEnergy
    );
    const dataArrayMinerals = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.minerals,
        this.state.showRelationToEnergy, totalEnergy
    );
    const dataArrayVitamins = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.vitamins,
        this.state.showRelationToEnergy, totalEnergy
    );
    const dataArrayFats = getNutrientTableDataArray(
        foods, mealFoods, selectedMealFoods, nonSelectedMealFoods, recommendations.fats,
        this.state.showRelationToEnergy, totalEnergy
    );
    const dataArrayCarbs = getNutrientTableDataArray(
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

export default NutrientData;