import React, { Component } from "react";
import Beer from "./components/Beer";
import HopOverview from "./components/HopOverview";
const axios = require("axios");

class App extends Component {
  constructor() {
    super();
    this.state = {
      bLoading: true,
      hops: []
    };
  }
  componentWillMount() {
    axios
      .get(process.env.REACT_APP_URL + "/data.json")
      .then((oResponse) => {
        this.setState({
          bLoading: false,
          hops: oResponse.data.hops,
        }); 
      })
      .catch((oError) => {
        console.log(oError);
      });
  }
  render() {
    const { bLoading, hops } = this.state;
    return (
      <div>
        {bLoading && (
            <Beer />
        )}
        {!bLoading && (
          <>
            <HopOverview hops={hops} currentHopIndex={0}/>
            <span>compare with:</span>
            <HopOverview hops={hops} currentHopIndex={hops.length - 1}/>
          </>
        )}
      </div>
    );
  }
}

export default App;
