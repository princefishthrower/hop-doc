'use strict';
const util = require('util');

// converts HTML data to JSON for frontend / API uses. Tests are run seperately by tester.js

// example of complete JSON entry for a hop:
// {
// 	"hops": [{
// 		"name": "admiral",
// 		"type": "bittering",
// 		"description": "Bred at Wye College and released in 1998, Admiral is a cross between Challenger and Northdown and was designed to be a complement to Target. Its mild aroma characteristics make it suitable for late-hopping and dry hopping applications in combination with other varieties.",
// 		"country_of_origin": "United Kingdom",
// 		"aroma_profile": ["orange", "tea", "fresh", "sap"],
// 		"beer_styles": ["english-style ale", "english-style bitter", "pale ale", "ipa", "weisse"],
// 		"alpha_acids": {
// 			"min": 13,
// 			"max": 15,
// 			"percent_co_humulone": {
// 				"min": 37,
// 				"max": 45
// 			}
// 		},
// 		"beta_acids": {
// 			"min": 13,
// 			"max": 15
// 		},
// 		"total_oil": {
// 			"min": 1,
// 			"max": 1.7
// 		},
// 		"oil_data": [{
// 				"myrecene": {
// 					"max": 39,
// 					"min": 48
// 				}
// 			},
// 			{
// 				"caryophyllene": {
// 					"max": 6,
// 					"min": 8
// 				}
// 			},
// 			{
// 				"Farnesene": {
// 					"max": 0,
// 					"min": 2
// 				}
// 			},
// 			{
// 				"humulene": {
// 					"max": 23,
// 					"min": 26
// 				}
// 			},
// 			{
// 				"other": {
// 					"max": 16,
// 					"min": 32
// 				}
// 			}
// 		]
// 	}]
// }

// vars
const fs = require('fs');
const cheerio = require('cheerio');
let oData = {"hops": []}; // start of data (just an array labeled 'hops')

fs.readFile('src/data/data.html', 'utf8', function (oError, oHTML) {
    if (oError) {
      console.log(oError);
    } else {
      const $ = cheerio.load(oHTML);
      $(".page").each(function (iIndex) { // loop through each hop
        let oHop = {};
        oHop.name = getName($, $(this));
        oHop.type = getType($, $(this));
        oHop.description = getDescription($, $(this));
        oHop.country_of_origin = getCountry($, $(this));
        oHop.aroma_profile = getAromaProfile($, $(this));
        oHop.beer_styles = getBeerStyles($, $(this));
        oHop.alpha_acids = getAlphaAcidData($, $(this));
        oHop.beta_acids = getBetaAcidData($, $(this));
        oHop.total_oil = getTotalOilData($, $(this));
        oHop.oil_data = getOilData($, $(this));
        oData.hops.push(oHop); // add this hop's data to the javascript object
        console.log(iIndex);
        // console.log(oHop);
      });
      console.log(util.inspect(oData, false, null, true /* enable colors */))
      console.log(oData.hops.ZYTHOS);
      writeJSON(oData);
    }
});

// get hop name
function getName($, oPage) {
  let sName = "";
  oPage.children().find("span[class='cls_003']").each(function () {
    sName = $(this).text();
  });
  return sName;
}

// hop type (bittering, aroma, pellet blend)
function getType($, oPage) {
  let sType;
  oPage.children().find("span[class='cls_004']").each(function () {
    sType = $(this).text();
  });
  if (!sType) {
    oPage.children().find("span[class='cls_038']").each(function () {
      sType = $(this).text();
    });
  }
  if (!sType) {
    oPage.children().find("span[class='cls_072']").each(function () {
      sType = $(this).text();
    });
  }
  if (!sType) {
    oPage.children().find("span[class='cls_023']").each(function () {
      sType = $(this).text();
    });
  }
  return sType;
}

// hop description
function getDescription($, oPage) {
  let sDescription = ""; // initialize var - we will need to concat
  oPage.children().find("span[class='cls_006']").each(function () {
    if (!$(this).text().includes("% of total oil")) { // ignore those
      sDescription += " " + $(this).text();
    }
  });
  return sDescription;
}

// original country of origin
function getCountry($, oPage) {
  let sCountry = "";
  oPage.children().find("span[class='cls_008']").each(function () {
    sCountry = $(this).text();
  });
  return sCountry;
}

// aroma profile
function getAromaProfile($, oPage) {
  let aAromas = [];
  oPage.children().find("span[class='cls_009']").each(function () {
    aAromas.push.apply(aAromas, $(this).text().split(",")); // extend itself since in the HTML this list can go over multiple lines
  });
  let aAromasClean = aAromas.map(function(sAroma) {
    return sAroma.trim();
  });
  let aAromasFiltered = aAromasClean.filter(function(sAroma) {
    return sAroma !== "";
  })
  return aAromasFiltered;
}

// beer styles
function getBeerStyles($, oPage) {
  let aStyles = [];
  oPage.children().find("span[class='cls_010']").each(function () {
    aStyles.push.apply(aStyles, $(this).text().split(",")); // extend itself since in the HTML this list can go over multiple lines
  });
  let aStylesClean = aStyles.map(function(sStyle) {
    return sStyle.trim();
  });
  let aStylesFiltered = aStylesClean.filter(function(sStyle) {
    return sStyle !== "";
  })
  return aStylesFiltered;
}

// alpha acids (min, max, and min & max for % co-humulone acids)
function getAlphaAcidData($, oPage) {
  let oAlphaAcidData = {
    "min": "",
    "max": "",
    "percent_co_humulone": {
      "min": "",
      "max": ""
    }
  };
  oPage.children().find("span[class='cls_012']").each(function () {
    let sAlphaAcidData = $(this).text();
    let aAlphaAcidData = sAlphaAcidData.split("-");
    oAlphaAcidData.min = aAlphaAcidData[0];
    oAlphaAcidData.max = aAlphaAcidData[1];
  });
  oPage.children().find("span[class='cls_022']").each(function () {
    let sCoHumuloneData = $(this).text();
    sCoHumuloneData = sCoHumuloneData.replace("% CO-HUMULONE)", ""); // delete un-needed text
    sCoHumuloneData = sCoHumuloneData.replace("(", ""); // this too
    let aCoHumuloneData = sCoHumuloneData.split("-");
    oAlphaAcidData.percent_co_humulone.min = aCoHumuloneData[0];
    oAlphaAcidData.percent_co_humulone.max = aCoHumuloneData[1];
  });
  return oAlphaAcidData;
}

// beta acids (min, max)
function getBetaAcidData($, oPage) {
  let oBetaAcidData = {};
  oPage.children().find("span[class='cls_014']").each(function () {
    let sBetaAcidData = $(this).text();
    let aBetaAcidData = sBetaAcidData.split("-");
    oBetaAcidData.min = aBetaAcidData[0];
    oBetaAcidData.max = aBetaAcidData[1];
  });
  return oBetaAcidData;
}

// total oil data (min, max mL/100g)
function getTotalOilData($, oPage) {
  let oTotalOilData = {};
  oPage.children().find("span[class='cls_016']").each(function () {
    let sTotalOilData = $(this).text();
    let aTotalOilData = sTotalOilData.split("-");
    oTotalOilData.min = aTotalOilData[0];
    oTotalOilData.max = aTotalOilData[1];
  });
  return oTotalOilData;
}

// oil data (array of each type of oil present in the hop)
function getOilData($, oPage) {
  let aNames = [];
  let aValues = [];
  let aOilData = [];
  oPage.children().find("span[class='cls_005']").each(function () { // oil names
    let sName = $(this).text(); // the text content inside this class IS the oil name
    aNames.push(sName);
  });
  
  oPage.children().find("span[class='cls_006']").each(function () { // oil values (string, need to parse stuff out)
    if ($(this).text().includes("% of total oil")) {
      let sValueText = $(this).text();
      let aOilValues = [];
      let oValues = {}
      sValueText = sValueText.replace("% of total oil", ""); // remove that
      sValueText = sValueText.replace("~", ""); // also any of that
      aOilValues = sValueText.split(" - ");
      oValues.min = aOilValues[0];
      oValues.max = aOilValues[1] || ""; // can be undefined if percent is <1
      aValues.push(oValues);
    }
  });
  
  // zip oil names together with high/low values
  aOilData = aNames.map(function (sName, iIndex) {
    var oObj = {};
    oObj[sName] = aValues[iIndex];
    return oObj;
  })
  return aOilData;
}

function writeJSON(oData) {
  var oJSON = JSON.stringify(oData); // convert javascript object to JSON object
  fs.writeFile('src/data/data.json', oJSON, 'utf8', function (oError) {
    if (oError) {
      console.log(oError);
    } else {
      console.log("Done.")
    }
  });
}

