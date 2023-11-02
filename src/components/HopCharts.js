import React, { Component } from "react";
import { Divider, Grid, Segment } from "semantic-ui-react";
import { Doughnut, HorizontalBar } from "react-chartjs-2";

// App constants
const aColors = [
  "#53483a",
  "#e6ac51",
  "#aa5343",
  "#e4715d",
  "#4db5d3",
  "#388aa1",
  "#007a4c",
  "#20b66c",
];
const aHighlights = [
  "#53483a",
  "#e6ac51",
  "#aa5343",
  "#e4715d",
  "#4db5d3",
  "#388aa1",
  "#007a4c",
  "#20b66c",
];

export default class HopCharts extends Component {
  render() {
    const { hops, currentHopIndex } = this.props;
    const currentHop = hops[currentHopIndex];
    // prepare bar chart data for alpha, beta, and total oil
    const aAcidOilLabels = [
      "Alpha Acid - Min %",
      "Alpha Acid - Max %",
      "Alpha Co-Humulone - Min %",
      "Alpha Co-Humulone - Max %",
      "Beta Acid - Min %",
      "Beta Acid - Max %",
      "Oils - Min mL/100g",
      "Oils - Max mL/100g",
    ];
    const aAcidOilValues = [
      currentHop.alpha_acids.min,
      currentHop.alpha_acids.max,
      currentHop.alpha_acids.percent_co_humulone.min,
      currentHop.alpha_acids.percent_co_humulone.max,
      currentHop.beta_acids.min,
      currentHop.beta_acids.max,
      currentHop.total_oil.min,
      currentHop.total_oil.max,
    ];
    const oAcidOilData = {
      labels: aAcidOilLabels,
      datasets: [
        {
          label: "Alpha Acid, Beta Acid, and Oil Amount Data",
          backgroundColor: [
            "#aa5343",
            "#aa5343",
            "#e4715d",
            "#e4715d",
            "#4db5d3",
            "#4db5d3",
            "#007a4c",
            "#007a4c",
          ],
          borderColor: [
            "#aa5343",
            "#aa5343",
            "#e4715d",
            "#e4715d",
            "#4db5d3",
            "#4db5d3",
            "#007a4c",
            "#007a4c",
          ],
          borderWidth: 1,
          hoverBackgroundColor: [
            "#aa5343",
            "#aa5343",
            "#e4715d",
            "#e4715d",
            "#4db5d3",
            "#4db5d3",
            "#007a4c",
            "#007a4c",
          ],
          hoverBorderColor: [
            "#aa5343",
            "#aa5343",
            "#e4715d",
            "#e4715d",
            "#4db5d3",
            "#4db5d3",
            "#007a4c",
            "#007a4c",
          ],
          data: aAcidOilValues,
        },
      ],
    };
    // prepare donut chart data for oil information
    let aOilLabels = [];
    let aOilValues = [];
    let aBackgroundColors = [];
    let aHoverBackgroundColors = [];
    currentHop.oil_data.forEach((oOil, iIndex) => {
      aOilLabels.push(Object.keys(oOil)[0]);
      aOilValues.push(Object.values(oOil)[0].min);
      aBackgroundColors.push(aColors[iIndex]);
      aHoverBackgroundColors.push(aHighlights[iIndex]);
    });

    const oOilData = {
      labels: aOilLabels,
      datasets: [
        {
          data: aOilValues,
          backgroundColor: aBackgroundColors,
          hoverBackgroundColor: aHoverBackgroundColors,
        },
      ],
    };

    return (
      <Segment>
        <Grid columns={2} relaxed="very">
          <Grid.Column>
            <HorizontalBar
              data={oAcidOilData}
              style={{ background: "#BFFFA5" }}
            />
          </Grid.Column>
          <Grid.Column>
            <Doughnut data={oOilData} />
          </Grid.Column>
        </Grid>
        <Divider vertical />
      </Segment>
    );
  }
}
