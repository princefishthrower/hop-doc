import React, { Component } from 'react';
import { Dropdown, Divider, Grid, Segment } from 'semantic-ui-react';
import { HorizontalBar } from 'react-chartjs-2';
import { Doughnut } from 'react-chartjs-2';

// custom components
import Beer from './components/Beer';

// 3rd party requires
const axios = require('axios');

// App constants
const aColors = ["#53483a","#e6ac51","#aa5343", "#e4715d", "#4db5d3", "#388aa1", "#007a4c", "#20b66c"];
const aHighlights = ["#53483a","#e6ac51","#aa5343", "#e4715d", "#4db5d3", "#388aa1", "#007a4c", "#20b66c"];
const CITRA = "CITRA";

class App extends Component {
  constructor() {
    super();
    this.state = {
      bLoading: true,
      sCurrentHopName: CITRA,
      hops: [],
      name: "",
      description: "",
      type: "",
      country_of_origin: "",
      aroma_profile: "",
      beer_styles: "",
      oAcidOilData: {},
      oOilData: []
    }
    this.setHopData = this.setHopData.bind(this);
    this.onChangeDropdown = this.onChangeDropdown.bind(this);
  }
  componentWillMount() {
    axios.get(process.env.REACT_APP_URL + "/data.json")
    .then((oResponse) => {
      this.setHopData(oResponse.data.hops, this.state.sCurrentHopName);
    })
    .catch((oError) => {
      console.log(oError);
    });
  }
  setHopData(aHops, sNewHop) {
    const aCurrentHop = aHops.filter((oHop) => {
      return oHop.name === sNewHop;
    });
    const oHopData = aCurrentHop[0];
    // prepare bar chart data for alpha beta and total oil
    const aAcidOilLabels = ["Alpha Acid - Min %", "Alpha Acid - Max %", "Alpha Co-Humulone - Min %", "Alpha Co-Humulone - Max %", "Beta Acid - Min %", "Beta Acid - Max %", "Oils - Min mL/100g", "Oils - Max mL/100g"];
    const aAcidOilValues = [oHopData.alpha_acids.min, oHopData.alpha_acids.max, oHopData.alpha_acids.percent_co_humulone.min, oHopData.alpha_acids.percent_co_humulone.max, oHopData.beta_acids.min, oHopData.beta_acids.max, oHopData.total_oil.min, oHopData.total_oil.max];
    const oAcidOilData = {
    	labels: aAcidOilLabels,
    	datasets: [
    		{
    			label: "Alpha Acid, Beta Acid, and Oil Amount Data",
          backgroundColor: ["#aa5343", "#aa5343", "#e4715d", "#e4715d", "#4db5d3", "#4db5d3", "#007a4c", "#007a4c"],
          borderColor: ["#aa5343", "#aa5343", "#e4715d", "#e4715d", "#4db5d3", "#4db5d3", "#007a4c", "#007a4c"],
          borderWidth: 1,
          hoverBackgroundColor: ["#aa5343", "#aa5343", "#e4715d", "#e4715d", "#4db5d3", "#4db5d3", "#007a4c", "#007a4c"],
          hoverBorderColor: ["#aa5343", "#aa5343", "#e4715d", "#e4715d", "#4db5d3", "#4db5d3", "#007a4c", "#007a4c"],
    			data: aAcidOilValues
    		}
      ]
    };
    // prepare donut chart data for oil information
    let aOilLabels = [];
    let aOilValues = [];
    let aBackgroundColors = [];
    let aHoverBackgroundColors = [];
    oHopData.oil_data.forEach((oOil, iIndex) => {
      aOilLabels.push(Object.keys(oOil)[0]);
      aOilValues.push(Object.values(oOil)[0].min);
      aBackgroundColors.push(aColors[iIndex]);
      aHoverBackgroundColors.push(aHighlights[iIndex]);
    });
    
    const oOilData = {
    	labels: aOilLabels,
    	datasets: [{
    		data: aOilValues,
    		backgroundColor: aBackgroundColors,
    		hoverBackgroundColor: aHoverBackgroundColors
    	}]
    };
    console.log(oOilData);
    this.setState({bLoading: false, sCurrentHopName: sNewHop, hops: aHops, oAcidOilData, oOilData, ...oHopData}); // spread all the hop data into the state
  }
  onChangeDropdown(oEvent) {
    console.log(oEvent);
    this.setHopData(this.state.hops, oEvent.target.textContent);
  }
  render() {
    const { bLoading, sCurrentHopName, hops, name, description, type, country_of_origin, aroma_profile, beer_styles, oAcidOilData, oOilData } = this.state;
    let sAromaProfile, sBeerStyles;
    let aHopOptions = [];
    if (aroma_profile.length) {
      sAromaProfile = aroma_profile.join(", ");
    }
    if (beer_styles.length) {
      sBeerStyles = beer_styles.join(", ");
    }
    if (hops) {
      console.log(hops);
      hops.forEach((oHop) => {
        aHopOptions.push({'key': oHop.name, 'value': oHop.name, 'text': oHop.name});
      })
    }
    
    return (
      <div>
        { bLoading && <div>
          <Beer/>
        </div> } 
        { !bLoading && <div>
          <Dropdown closeOnChange={true} placeholder='Hop...' value={sCurrentHopName} search selection options={aHopOptions} onChange={this.onChangeDropdown}/>
          <h1>{name}</h1>
          <h2>{description}</h2>
          <h3>{type}</h3>
          <h4>ORIGINAL COUNTRY OF ORIGIN: {country_of_origin}</h4>
          <h5>AROMA NOTES: {sAromaProfile}</h5>
          <h6>TYPICAL BEER STYLES: {sBeerStyles}</h6>
          <Segment>
            <Grid columns={2} relaxed='very'>
              <Grid.Column>
                <HorizontalBar data={oAcidOilData} style={{'background': '#BFFFA5'}}/>
              </Grid.Column>
              <Grid.Column>
                <Doughnut data={oOilData}/>
              </Grid.Column>
            </Grid>
            <Divider vertical></Divider>
          </Segment>
        </div> }
      </div>
    );
  }
}

export default App;
