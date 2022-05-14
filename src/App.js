import { CardContent, FormControl, MenuItem, Select } from '@mui/material';
import React, { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import { Card } from '@mui/material'
import './App.css';
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
  }
  return (
    <div className="app">
      <div className='app-left'>
        <div className='app-header'>
          <h1>Covid-19 Tracker</h1>
          <FormControl className='app-dropdown'>
            <Select variant='outlined' onChange={onCountryChange} value={country} >
              <MenuItem value='worldwide'>Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>

        <div className='app-stats'>
          <InfoBox title='coronavirus cases' cases={2334} total={1000} />
          <InfoBox title='recovered' cases={89480} total={2000} />
          <InfoBox title='deaths' cases={4397874} total={3000} />
        </div>
        {/* map */}
        <Map />
      </div>
      <Card className='app-right'>
        {/* table */}
        {/* graph */}
        <CardContent>
          <h3>Live Cases By Country</h3>
          <h3>Worldwide New Cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
