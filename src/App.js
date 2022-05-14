import { CardContent, FormControl, MenuItem, Select } from '@mui/material';
import React, { useState, useEffect } from 'react';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { Card } from '@mui/material'
import './App.css';
import { sortData } from './util';
function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
      });
  }, [])
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  }
  console.log("Table Data", tableData);
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
          <InfoBox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths} />
        </div>
        {/* map */}
        <Map />
      </div>
      <Card className='app-right'>
        {/* table */}
        {/* graph */}
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide New Cases</h3>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
