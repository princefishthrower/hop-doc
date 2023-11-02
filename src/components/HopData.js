import React, { Component } from "react";

export default class HopData extends Component {
  render() {
    const { hops, currentHopIndex } = this.props;
    const currentHop = hops[currentHopIndex];
    const {
      name,
      description,
      type,
      country_of_origin,
      aroma_profile,
      beer_styles,
    } = currentHop;
    let sAromaProfile, sBeerStyles;
    if (aroma_profile.length) {
      sAromaProfile = aroma_profile.join(", ");
    }
    if (beer_styles.length) {
      sBeerStyles = beer_styles.join(", ");
    }
    return (
      <>
        <h1>{name}</h1>
        <h2>{description}</h2>
        <h3>{type}</h3>
        <h4>ORIGINAL COUNTRY OF ORIGIN: {country_of_origin}</h4>
        <h5>AROMA NOTES: {sAromaProfile}</h5>
        <h6>TYPICAL BEER STYLES: {sBeerStyles}</h6>
      </>
    );
  }
}
