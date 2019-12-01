import React from 'react';
import FoodBar from './FoodBar';
import './NutrientData.css';

const formatValue = (value) => {
  return value.toFixed(value > 0 && value < 10 ? 1 : 0);
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
                {data.recommendation !== null &&
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

export default NutrientTableSection;