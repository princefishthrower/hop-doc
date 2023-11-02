import React, { Component } from "react";
import { Dropdown } from "semantic-ui-react";

export default class HopDropdown extends Component {
  render() {
    const { hops, currentHopIndex, onChangeDropdown } = this.props;
    const currentHop = hops[currentHopIndex];
    const { name } = currentHop;
    let aHopOptions = [];
    if (hops) {
      hops.forEach((oHop) => {
        aHopOptions.push({ key: oHop.name, value: oHop.name, text: oHop.name });
      });
    }
    return (
      <Dropdown
        closeOnChange={true}
        placeholder="Hop..."
        value={name}
        search
        selection
        options={aHopOptions}
        onChange={onChangeDropdown}
      />
    );
  }
}
