import React, { Component } from "react";
import HopDropdown from "./HopDropdown";
import HopData from "./HopData";
import HopCharts from "./HopCharts";

// Each 'hopoverview' class has its own copy of hops passed down from the parent collection - this allows us to call the API just once
export default class HopOverview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hops: props.hops,
      currentHopIndex: props.currentHopIndex,
    };
    this.setSelectedHopByName = this.setSelectedHopByName.bind(this);
    this.onChangeDropdown = this.onChangeDropdown.bind(this);
  }
  setSelectedHopByName(sNewHop) {
    this.setState({
      currentHopIndex: this.state.hops.findIndex((hop) => hop.name === sNewHop),
    });
  }
  onChangeDropdown(oEvent) {
    this.setSelectedHopByName(oEvent.target.textContent);
  }
  render() {
    return (
      <>
        <HopDropdown {...this.state} onChangeDropdown={this.onChangeDropdown} />
        <HopData {...this.state} />
        <HopCharts {...this.state} />
      </>
    );
  }
}
