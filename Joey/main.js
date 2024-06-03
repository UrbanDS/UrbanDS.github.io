//import './style.css';
//import 'mapbox-gl/dist/mapbox-gl.css';
//import {MapboxOverlay} from '@deck.gl/mapbox';
//import { ArcLayer } from '@deck.gl/layers';
//import {load} from '@loaders.gl/core';
//import { CSVLoader } from '@loaders.gl/csv';
//import mapboxgl from 'mapbox-gl';
//import {PolygonLayer} from '@deck.gl/layers';

const MAPBOX_TOKEN = "pk.eyJ1Ijoiam9leWxlZWx6IiwiYSI6ImNqczVzOTdhbzBpd3Y0NG8xaTVwaDUzOHYifQ.NStc2mKrg3LQfLq1q32BpQ";

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/dark-v9',
  accessToken: MAPBOX_TOKEN,
  center: [-98.5124, 29.4594],
  zoom: 10.5,
  bearing: 0,
  pitch: 0,
});


const states_dictionary={ 
     "low_income_community":[90,90,90,200], 
     "middle_income_community":[153,153,153,200], 
     "high_income_community":[255,255,255,200],
	 "null":[255,255,255,0]
};
const transitions=200;
const category_colors = {
  "1": [165,0,38, transitions],
  "2": [215,48,39, transitions],
  "3": [244,109,67, transitions],
  "4": [253,174,97, transitions],
  "5": [254,224,139, transitions],
  "6": [217,239,139, transitions],
  "7": [166,217,106, transitions],
  "8": [102,189,99, transitions],
  "9": [26,152,80, transitions],
  "10": [0,104,55, transitions],
}
/*
const L2H = {
      dataset1: ['./data/nine_transits/L2H/community_detection/internal/07.csv'],
      dataset2: ['./data/nine_transits/L2H/community_detection/internal/08.csv'],
      dataset3: ['./data/nine_transits/L2H/community_detection/internal/09.csv'],
	  dataset4: ['./data/nine_transits/L2H/community_detection/internal/10.csv'],
      dataset5: ['./data/nine_transits/L2H/community_detection/internal/11.csv'],
      dataset6: ['./data/nine_transits/L2H/community_detection/internal/12.csv'],
	  dataset7: ['./data/nine_transits/L2H/community_detection/internal/13.csv'],
      dataset8: ['./data/nine_transits/L2H/community_detection/internal/14.csv'],
      dataset9: ['./data/nine_transits/L2H/community_detection/internal/15.csv'],
	  dataset10: ['./data/nine_transits/L2H/community_detection/internal/16.csv'],
      dataset11: ['./data/nine_transits/L2H/community_detection/internal/17.csv'],
      dataset12: ['./data/nine_transits/L2H/community_detection/internal/18.csv'],
	  dataset13: ['./data/nine_transits/L2H/community_detection/internal/19.csv'],
      dataset14: ['./data/nine_transits/L2H/community_detection/internal/20.csv'],
    };*/
const mobility_types = {
	  pattern1: {
		dataset1: ['Joey/data/nine_transits/L2L/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/L2L/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/L2L/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/L2L/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/L2L/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/L2L/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/L2L/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/L2L/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/L2L/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/L2L/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/L2L/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/L2L/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/L2L/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/L2L/community_detection/internal/20.csv'],
	    },
	  pattern2: {
		dataset1: ['Joey/data/nine_transits/L2M/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/L2M/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/L2M/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/L2M/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/L2M/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/L2M/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/L2M/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/L2M/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/L2M/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/L2M/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/L2M/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/L2M/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/L2M/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/L2M/community_detection/internal/20.csv'],
	    },
	  pattern3: {
		dataset1: ['Joey/data/nine_transits/L2H/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/L2H/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/L2H/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/L2H/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/L2H/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/L2H/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/L2H/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/L2H/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/L2H/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/L2H/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/L2H/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/L2H/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/L2H/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/L2H/community_detection/internal/20.csv'],
	    },
	  pattern4: {
		dataset1: ['Joey/data/nine_transits/M2L/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/M2L/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/M2L/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/M2L/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/M2L/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/M2L/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/M2L/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/M2L/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/M2L/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/M2L/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/M2L/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/M2L/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/M2L/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/M2L/community_detection/internal/20.csv'],
	    },
	  pattern5: {
		dataset1: ['Joey/data/nine_transits/M2M/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/M2M/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/M2M/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/M2M/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/M2M/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/M2M/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/M2M/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/M2M/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/M2M/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/M2M/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/M2M/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/M2M/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/M2M/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/M2M/community_detection/internal/20.csv'],
	    },
	  pattern6: {
		dataset1: ['Joey/data/nine_transits/M2H/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/M2H/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/M2H/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/M2H/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/M2H/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/M2H/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/M2H/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/M2H/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/M2H/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/M2H/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/M2H/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/M2H/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/M2H/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/M2H/community_detection/internal/20.csv'],
	    },
	  pattern7: {
		dataset1: ['Joey/data/nine_transits/H2L/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/H2L/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/H2L/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/H2L/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/H2L/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/H2L/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/H2L/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/H2L/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/H2L/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/H2L/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/H2L/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/H2L/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/H2L/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/H2L/community_detection/internal/20.csv'],
	    },
	  pattern8: {
		dataset1: ['Joey/data/nine_transits/H2M/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/H2M/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/H2M/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/H2M/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/H2M/community_detection/internal/11.csv'],
        dataset6: ['Joey/data/nine_transits/H2M/community_detection/internal/12.csv'],
	    dataset7: ['Joey/data/nine_transits/H2M/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/H2M/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/H2M/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/H2M/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/H2M/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/H2M/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/H2M/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/H2M/community_detection/internal/20.csv'],
	    },
	  pattern9: {
		dataset1: ['Joey/data/nine_transits/H2H/community_detection/internal/07.csv'],
        dataset2: ['Joey/data/nine_transits/H2H/community_detection/internal/08.csv'],
        dataset3: ['Joey/data/nine_transits/H2H/community_detection/internal/09.csv'],
	    dataset4: ['Joey/data/nine_transits/H2H/community_detection/internal/10.csv'],
        dataset5: ['Joey/data/nine_transits/H2H/community_detection/internal/11.csv'],
	    dataset7: ['Joey/data/nine_transits/H2H/community_detection/internal/13.csv'],
        dataset8: ['Joey/data/nine_transits/H2H/community_detection/internal/14.csv'],
        dataset9: ['Joey/data/nine_transits/H2H/community_detection/internal/15.csv'],
	    dataset10: ['Joey/data/nine_transits/H2H/community_detection/internal/16.csv'],
        dataset11: ['Joey/data/nine_transits/H2H/community_detection/internal/17.csv'],
        dataset12: ['Joey/data/nine_transits/H2H/community_detection/internal/18.csv'],
	    dataset13: ['Joey/data/nine_transits/H2H/community_detection/internal/19.csv'],
        dataset14: ['Joey/data/nine_transits/H2H/community_detection/internal/20.csv'],
	    },

	};
const mobility_values = {
	pattern1: [1.0, 470.0],
	pattern2: [1.0, 470.0],
	pattern3: [1.0, 470.0],
	pattern4: [1.0, 783.0],
	pattern5: [1.0, 783.0],
	pattern6: [1.0, 783.0],
	pattern7: [1.0, 601.0],
	pattern8: [1.0, 601.0],
	pattern9: [1.0, 601.0],
};
	

/*
const polygonlayer = new PolygonLayer({
  id: 'PolygonLayer',
  data: './data/ACS_zones_category_new.geojson',
  getPolygon: d => d.features.geometry.coordinates[0][0],
  getFillColor: d => [states_dictionary[d.OD_income_entropy_30_60_income_category]],
  getLineColor: [255, 255, 255],
  getLineWidth: 20,
  lineWidthMinPixels: 1,
  pickable: true
});
*/

map.once('load', () => {
  console.log("map is loaded");
  let income_contour_data = undefined;
  let external_mobility_data = undefined;
  let internal_mobility_data = undefined;
  let selectedDataset = undefined;
  let selectedType = undefined;

  fetch("Joey/data/ACS_zones_wgs84_new.geojson")
    .then(res => res.json())
    .then((data) => {
      // preprocessing
      const features = data.features;
      let my_data = [];
      features.forEach((feature) => {
        const my_dict = {};
		my_dict["geoid"] = feature.properties.GEOID
        my_dict["contour"] = feature.geometry.coordinates[0][0];
        my_dict["income"] = states_dictionary[feature.properties.OD_income_entropy_30_60_income_category]
        my_data.push(my_dict);
      });
      income_contour_data = my_data;
	  
	  document.getElementById('dataset-select').addEventListener('change', (event) => {
		selectedType = mobility_types[event.target.value];
		//console.log(selectedType);
	  document.getElementById('data-select').addEventListener('change', (event) => {
		selectedDataset = selectedType[event.target.value];
		
		//console.log(selectedDataset);
      d3.csv(selectedDataset[0], function(data) {
		
        internal_mobility_data = data;
        console.log(income_contour_data);
		console.log(internal_mobility_data);
		
        if (income_contour_data && internal_mobility_data) {
          console.log("Gotcha!")
          // create layer
          const polygonlayer = new PolygonLayer({
            id: 'PolygonLayer',
            data: income_contour_data,
            getPolygon: d => d.contour,
            getFillColor: d => d.income,
            getLineColor: [255, 255, 255],
            getLineWidth: 20,
            lineWidthMinPixels: 1,
            pickable: false
          });

          //var min = Math.min.apply(null, internal_mobility_data.map(x => x.weight));
          //var max = Math.max.apply(null, internal_mobility_data.map(x => x.weight));
		  var min = 1.0;
          var max = 783.0;
          //console.log(min, max)

          // create internal layer
          const arcLayer = new ArcLayer({
            id: 'arc-internal',
            data: internal_mobility_data,
            getSourcePosition: d => [d["O_id_x"], d["O_id_y"]],
            getTargetPosition: d => [d["D_id_x"], d["D_id_y"]],
            getSourceColor: d => category_colors[d["category"]],
            getTargetColor: d => category_colors[d["category"]],
            getHeight: d => (d["weight"]-min)/(max-min)* 5,
            getWidth: d => ((d["weight"]-min)/(max-min)) * 20,
          });
      
          const deckOverlay = new MapboxOverlay({
            interleaved: true,
            //layers: [polygonlayer, arcLayer]
          });
		  console.log(deckOverlay);
          map.addControl(deckOverlay);
		  
		  // Update layers
		  deckOverlay.setProps({
		    layers: [polygonlayer, arcLayer]
		  });
        }
	  });
    });
	});
});
});



