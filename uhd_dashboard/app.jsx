import React, {useCallback, useState, useRef, useMemo, useEffect } from 'react';
import {createRoot} from 'react-dom/client';
import {MapboxOverlay} from '@deck.gl/mapbox';
import {ArcLayer} from '@deck.gl/layers';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {scaleLog} from 'd3-scale';
import {cellToLatLng} from 'h3-js';
import {load} from '@loaders.gl/core';
import {CSVLoader} from '@loaders.gl/csv';
import {Map, NavigationControl, useControl, Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
// import {GeoJSONLoader} from '@loaders.gl/json';
import {scaleLinear} from 'd3-scale';
import {GeoJsonLayer} from '@deck.gl/layers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';


const DATA_URL =
  'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/safegraph/sf-pois.csv';

// Set your mapbox token here
const MAPBOX_TOKEN = 'pk.eyJ1Ijoiam9leWxlZWx6IiwiYSI6ImNqczVzOTdhbzBpd3Y0NG8xaTVwaDUzOHYifQ.NStc2mKrg3LQfLq1q32BpQ'; // eslint-disable-line
//console.log('MAPBOX_TOKEN:', MAPBOX_TOKEN);




// const geojson_1_URL = 'geojson/san_antonio_hispanic_84_updated.geojson';
const geojson_2_URL = 'geojson/san_antonio_land_use_selected.geojson';
// const geojsonData = await load(geojson_1_URL, GeoJSONLoader);

const geojsonURLs = {
  'Block Group Level: 2022': 'geojson/san_antonio_hispanic_84_updated.geojson',
  'Census Tract Level: 2022': 'geojson/san_antonio_tract_mean.geojson',
  // Add more GeoJSON URLs here
};

const colorScale_json_1 = scaleLinear()
  .domain([0, 0.42, 0.57,0.74,1.0]) 
  .range([
  [5, 133, 176],
  [146, 197, 222],
  [247, 247, 247],
  [244, 165, 130],
  [202, 0, 32],]);

const colorScale_json_2 = scaleLinear()
.domain([4, 10, 19.3, 34.67,100]) 
.range([
  [0, 104, 55],
  [49, 163, 84],
  [120, 198, 121],
  [194, 230, 153],
  [255, 255, 204],
  ]);



const keyMapping_block = {
  census_data_B03002_processed_001E: 'Population',
  census_data_B03002_processed_002E: 'Not Hispanic Population',
  census_data_B03002_processed_012E: 'Hispanic Population',
  census_data_B03002_processed_hispanic_percentage: '% Hispanic Population',
  ACS_income_classes_30_60_median_income: 'Median Income($)',
  ACS_income_classes_30_60_income_category: 'Income Category (30%, 60%)',
  census_data_B01001_density_denisty: 'Population Density (persons/km2)'

};

const keyMapping_parcel = {
  OCC_CLS: 'Occupation Type',
  PRIM_OCC: 'Primiary Occupation',
  PROP_ADDR: 'Address',
  PROP_ZIP: 'ZIP Code',
  HEIGHT: 'Height',
  SQMETERS: 'SQMETERS',
  census_data_B25077_processed_median_price_2: 'House Price ($x10k)',
  
};

const CSVDATA_URL = 'geojson/generated_data.csv'; // 替换为你的 CSV 文件路径
const CSVPriceDATA_URL = 'geojson/generated_houseprice_data.csv'; // 替换为你的 CSV 文件路径

  
  const MapLegend = ({ title, colorScale, domain, range }) => {
    const legendItems = domain.map((value, index) => ({
      value,
      color: range[index] 
    }));
  
    return (
      <div
        style={{
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '8px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          marginBottom: '10px'
        }}
      >
        <h4>{title}</h4>
        {legendItems.map((item, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
            <div
              style={{
                width: '20px',
                height: '20px',
                backgroundColor: `rgb(${item.color.join(',')})`, 
                marginRight: '10px'
              }}
            ></div>
            <span>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };


function PopulationChart({ data }) {
  const maxY = Math.max(...data.map(item => Math.max(item.population)));
  const minY = Math.min(...data.map(item => Math.min(item.population)));
  return (
    <LineChart width={350} height={150} data={data}>
      <XAxis dataKey="name" />
      <YAxis domain={[Math.floor(minY*.95), Math.ceil(maxY*1.05)]}
         />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="population" stroke="#542788" name="Population"/>
    </LineChart>
  );
}

function HispanicNonHispanicChart({ data }) {
  return (
    <LineChart width={350} height={150} data={data}>
      <XAxis dataKey="name" />
      <YAxis />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="hispanic" stroke="#4575b4" name="Non-Hispanic"/>
      <Line type="monotone" dataKey="non_hispanic" stroke="#d73027" name="Hispanic"/>
    </LineChart>
  );
}

function MedianIncomeChart({ data }) {
  const maxY = Math.max(...data.map(item => Math.max(item.median_income)));
  const minY = Math.min(...data.map(item => Math.min(item.median_income)));
  return (
    
    <LineChart width={350} height={150} data={data}>
      <XAxis dataKey="name" />
      <YAxis domain={[Math.floor(minY*.95), Math.ceil(maxY*1.05)]} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="median_income" stroke="#fc8d59" name="Median Income"/>
    </LineChart>
  );
}

function PopDensityChart({ data }) {
  const maxY = Math.max(...data.map(item => Math.max(item.density)));
  const minY = Math.min(...data.map(item => Math.min(item.density)));
  return (
    
    <LineChart width={350} height={150} data={data}>
      <XAxis dataKey="name" />
      <YAxis domain={[Math.floor(minY*.98), Math.ceil(maxY*1.02)]} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="density" stroke="#d73027" name="Population Density(Person/KM2)"/>
    </LineChart>
  );
}

function PriceChart({ data }) {
  const maxY = Math.max(...data.map(item => Math.max(item.price)));
  const minY = Math.min(...data.map(item => Math.min(item.price)));
  console.log(maxY, minY);
  return (
    <LineChart width={350} height={150} data={data}>
      <XAxis dataKey="name" />
      <YAxis domain={[Math.floor(minY*.98), Math.ceil(maxY*1.02)]} />
      <CartesianGrid strokeDasharray="3 3" />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="price" stroke="#542788" name="House Price"/>
    </LineChart>
  );
}


function DeckGLOverlay(props) {
  const overlay = useControl(() => new MapboxOverlay(props));
  overlay.setProps(props);
  return null;
}

export default function App({data}) {
  
  const [firstLabelLayerId, setFirstLabelLayerId] = useState();
  const mapRef = useRef();

  const onMapLoad = useCallback(() => {
    setFirstLabelLayerId(getFirstLabelLayerId(mapRef.current.getStyle()));
  }, []);

  function hideHouseNumber(address) {
    const regex = /\d+/g;
    const newAddress = address.replace(regex, '');
    return newAddress.trim();
  }

  const [selectedGeoJson, setSelectedGeoJson] = useState('Block Group Level: 2022'); // Default GeoJSON
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [geoJsonInfo, setGeoJsonInfo] = useState(null); // First Click
  const [landUseInfo, setLandUseInfo] = useState(null); // Second Click
  const [selectedBlockGroupData, setSelectedBlockGroupData] = useState(null); // 用于存储折线图数据的状态
  const [csvData, setCsvData] = useState(null); 
  const [csvPriceData, setPriceCsvData] = useState(null);


  useEffect(() => {
    load(CSVPriceDATA_URL, CSVLoader).then(data => {
      setPriceCsvData(data.data);
    });
  }, []); 

  useEffect(() => {
    load(CSVDATA_URL, CSVLoader).then(data => {
      setCsvData(data.data); 
    });
  }, []); 

  

  useEffect(() => {
    const loadGeoJson = async () => {
      const url = geojsonURLs[selectedGeoJson];
      if (url) {
        try {
          const data = await load(url);
          setGeoJsonData(data);
        } catch (error) {
          console.error("Error loading GeoJSON:", error);
        }
      }
    };

    loadGeoJson();
  }, [selectedGeoJson]);
  const geoJsonLayer = useMemo(() => {
    if (!geoJsonData) return null; // Render nothing if data isn't loaded yet
    return new GeoJsonLayer({
      id: 'geojson-layer',
      data: geoJsonData,
      pickable: true,
      stroked: true,
      filled: true,
      extruded: false,
      getFillColor: d => {
        const percentage = d.properties.census_data_B03002_processed_hispanic_percentage; // Dynamically find percentage/price/income property
        const value = colorScale_json_1(percentage);
        return value;
      },
      opacity: 0.5,
      getLineColor: [255, 255, 255],
      getLineWidth: 2,
      autoHighlight: true,
      onClick: ({ object }) => {
        if (object && csvData ) {
          setGeoJsonInfo(object.properties);
          const blockGroupId = object.properties.GEOID;
          console.log(object.properties);
          const dataRow = csvData.find(row => String(row.geoid) === String(blockGroupId));
          if (dataRow) { 
            const formattedData = [];

            for (const key in dataRow) {
              if (dataRow.hasOwnProperty(key)) {
                const parts = key.split('_');
                const year = parts[0];
                const dataType = key.substring(5);
                if (year && (dataType === 'population' || dataType === 'hispanic' || dataType === 'non_hispanic' || dataType === 'median_income' || dataType === 'density')) {
                  const dataItem = { name: year };
                  dataItem[dataType] = dataRow[key];

                  const existingItem = formattedData.find(item => item.name === year);
                  if (existingItem) {
                    existingItem[dataType] = dataRow[key]; 
                  } else {
                    formattedData.push(dataItem); 
                  }
                }
              }
            }
            setSelectedBlockGroupData(formattedData);
          }
        }
      },
      });
    }, [geoJsonData, selectedGeoJson, csvData]);

    const [open, setOpen] = useState(false);
    const [modalData, setModalData] = useState([]);
    const [modalTitle, setModalTitle] = useState('');

    const handleClickOpen = (landuse) => {
        const landuseId = landuse.BUILD_ID; 
        const dataRow = csvPriceData.find(row => String(row.geoid) === String(landuseId));

        if (dataRow) { 
          const formattedData = [];

          for (const key in dataRow) {
            if (dataRow.hasOwnProperty(key)) {
              const parts = key.split('_');
              const year = parts[0];
              const dataType = parts[1];

              if (year && (dataType === 'price' )) {
                const dataItem = { name: year };
                dataItem[dataType] = dataRow[key];

                const existingItem = formattedData.find(item => item.name === year);
                if (existingItem) {
                  existingItem[dataType] = dataRow[key]; 
                } else {
                  formattedData.push(dataItem); 
                }
              }
            }
          }
        setModalData(formattedData);
        setModalTitle('House Price ($x10k) [Simulated Data]'); 
        setOpen(true);
        }
        
    };

    const handleClose = () => {
        setOpen(false);
    };

    const geoJsonLanduse = useMemo(() => {  // Use useMemo for geoJsonLanduse
      return new GeoJsonLayer({
        id: 'geojson-landuse',
        data: geojson_2_URL, // Keep using the URL directly
        pickable: true,
        stroked: false,
        filled: true,
        extruded: true,
        wireframe: true,
        getElevation: f => f.properties.HEIGHT,
        getFillColor: d => {
          const percentage = d.properties.census_data_B25077_processed_median_price_2;
          const value = colorScale_json_2(percentage);
          return value;
        },
        opacity: 1,
        getLineColor: [255, 255, 255],
        autoHighlight: true,
        onClick: ({ object }) => {
          if (object) {
            setLandUseInfo(object.properties);
            handleClickOpen(object.properties);
          }
        },
      });
    }, [csvPriceData]); // Empty dependency array ensures it only creates the layer once
  

    const handleGeoJsonSelect = (event) => {
      setSelectedGeoJson(event.target.value);
      setGeoJsonInfo(null); // Clear info when changing GeoJSON
      setLandUseInfo(null);
    };

    

  

  return (

    <div style={{ display: 'flex', height: '100vh' }}>
      <div
      style={{
        width: '280px',
        backgroundColor: '#f8f9fa',
        padding: '10px',
        borderRight: '1px solid #ddd',
        overflowY: 'auto'
      }}
    >
    {/* Logo */}
    <div style={{ marginBottom: '20px' }}>
      <img
        src="logo/TAMU.png" 
        alt="Logo 1"
        style={{
          width: '220px',
          height: 'auto',
          bottom: '100px',
          marginBottom: '10px' 
        }}
      />
      <img
        src="logo/CHHS.png" 
        alt="Logo 2"
        style={{
          width: '220px',
          height: 'auto'
        }}
      />
    </div>
      

      {/* Titile */}
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 1000,
          textAlign: 'center'
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: '20px',
            fontWeight: 'bold',
            color: '#333'
          }}
        >
          Distributions of Hispanic Population and Related Median House Price in San Antonio
        </h1>
      </div>
      <div>
        <label htmlFor="geojson-select">Select Spatial Level:</label>
        <select id="geojson-select" value={selectedGeoJson} onChange={handleGeoJsonSelect}>
          {Object.keys(geojsonURLs).map(key => (
            <option key={key} value={key}>{key}</option>
          ))}
        </select>
      </div>

      <h2>Attritubes Table</h2>
      {geoJsonInfo ? (
          <div>
            <h3>Attritubes of census group</h3>
            {Object.entries(geoJsonInfo)
            .filter(([key]) => keyMapping_block[key]) 
            .map(([key, value]) => {
              let formattedValue = value;

              if (key === 'census_data_B03002_processed_hispanic_percentage') {
                formattedValue = value * 100;
              } else if (key === 'census_data_B01001_density_denisty') {
                formattedValue = (value * 1000).toFixed(4); 
              } else if (key === 'census_data_B03002_processed_hispanic_percentage') {
                formattedValue = value.toFixed(4); 
              }
              
              return (
                <div key={key} style={{ marginBottom: '2px' }}>
                  <strong>{keyMapping_block[key]}:</strong> {formattedValue}
                </div>
              );
      })}
  </div>
        ) : (
          <p>Click census group for more details</p>
        )}

        {landUseInfo ? (
          <div>
            <h3>Attritubes of Land Parcel</h3>
            {Object.entries(landUseInfo).filter(([key]) => keyMapping_parcel[key]).map(([key, value]) => {
              const label = keyMapping_parcel[key];
              let displayValue = value;

              if (key === 'PROP_ADDR') { 
                displayValue = hideHouseNumber(value); 
              }

              if (key === 'HEIGHT') { 
                displayValue = value.toFixed(4); 
              }
              if (key === 'SQMETERS') { 
                displayValue = value.toFixed(4); 
              }

              return (
                <div key={key} style={{ marginBottom: '2px' }}>
                  <strong>{label}:</strong> {displayValue}
                </div>
              );
            })}
          </div>
        ) : (
          <p>Click residential land parcel for more details</p>
        )}
    </div>
      {/* Legend Settings */}
      <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '2px',
            zIndex: 1000,
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          {/* First Legend */}
          <MapLegend
            title="Hispanic Percentage"
            titleStyle={{ 
              whiteSpace: 'normal', 
              width: '80px' 
            }}
            colorScale={colorScale_json_1}
            domain={[0, 0.42, 0.57,0.74,1.0]}
            range={[
              [5, 133, 176],
              [146, 197, 222],
              [247, 247, 247],
              [244, 165, 130],
              [202, 0, 32]
            ]}
            style={{ marginRight: '20px' }}
          />

          {/* Second Legend */}
          <MapLegend
            title="Median Price ($x10k)"
            colorScale={colorScale_json_2}
            domain={[4, 10, 19.3, 34.67, 100]}
            range={[
              [0, 104, 55],
              [49, 163, 84],
              [120, 198, 121],
              [194, 230, 153],
              [255, 255, 204]
            ]}
          />
        </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Map
          ref={mapRef}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/joeyleelz/cm49g3ltp00j301rz52c4guuw"
          antialias={true}
          initialViewState={{
            longitude: -98.5181,
            latitude: 29.4444,
            zoom: 12,
            bearing: 0,
            pitch: 60
          }}
          onLoad={onMapLoad}
        >
          <DeckGLOverlay interleaved={true} layers={[geoJsonLayer ? [geoJsonLayer] : [], geoJsonLanduse]} /> {/* Conditionally render */}
          <NavigationControl />
        </Map>
      </div>

      <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogContent>
          <PriceChart data={modalData} /> 
          </DialogContent>
      </Dialog>

      {selectedBlockGroupData && (
        <div style={{ 
          
          display: 'grid', 
          gridTemplateColumns: '.20fr .20fr .20fr .20fr', 
          gridGap: '1px',
          position: 'fixed', 
          bottom: 0, 
          left: 300, 
          width: '100%', 
          height: '150px',
          backgroundColor: '#f8f9fa', 
          padding: '20px', 
          borderTop: '1px solid #ccc',
          zIndex: 1000 
        }}>
          <span style={{
            position: 'absolute', 
            bottom: '5px', 
            left: '50%', 
            transform: 'translateX(-120%)' 
          }}>Demographic Trends over the Past Decade (Simulated Data) 
          <span style={{ fontSize: 'smaller', color: '#888' }}>* Value 0 denotes NULL</span>
          </span>
          <PopulationChart data={selectedBlockGroupData} /> 
          <HispanicNonHispanicChart data={selectedBlockGroupData} /> 
          <MedianIncomeChart data={selectedBlockGroupData} /> 
          <PopDensityChart data={selectedBlockGroupData} />
        </div>
      )}
    
  </div>
   
  );
}




function getFirstLabelLayerId(style) {
  const layers = style.layers;
  // Find the index of the first symbol (i.e. label) layer in the map style
  for (let i = 0; i < layers.length; i++) {
    if (layers[i].type === 'symbol') {
      return layers[i].id;
    }
  }
  return undefined;
}

export function renderToDOM(container) {
  const root = createRoot(container);
  root.render(<App />);

  load(DATA_URL, CSVLoader).then(data => {
    root.render(<App data={data.data} />);
  });
}
