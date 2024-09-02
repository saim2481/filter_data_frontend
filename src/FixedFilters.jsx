import React, { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Box from '@mui/material/Box';
import axios from "axios";


// const DataTable = () => {
//   const [data, setData] = useState([]);

//   useEffect(() => {
//     axios.get(`http://127.0.0.1:8001/api/v1/filters/data/?region=${selectedRegion}&category=${selectedCategory}&sector=${selectedSector}&source=${selectedSource}&year=${sele}`) // Replace with your actual endpoint
//       .then(response => {
//         setData(response.data);
//       })
//       .catch(error => {
//         console.error('Error fetching data:', error);
//       });
//   }, []);


function FixedFilters() {
  const cols = [
    { field: 'activity_id', headerName: 'Activity ID', width: 700 },
    { field: 'name', headerName: 'Activity Name', width: 500 },
  ]
  const [data, setData] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sources, setSources] = useState([]);
  const [regions, setRegions] = useState([]);
  const [years, setYears] = useState([]);
  
  const [selectedSector, setSelectedSector] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSource, setSelectedSource] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedYear, setSelectedYear] = useState("");


  useEffect(() => {
    axios.get("http://127.0.0.1:8003/api/v1/filters/sectors/").then(response => setSectors(response.data));
    axios.get("https://urban-dictionary7.p.rapidapi.co/0/define?term=yeet",{headers:{"x-rapidapi-host": "urban-dictionary7.p.rapidapi.com","x-rapidapi-key": "23ff918c53msh8497dde4cd331b5p17ea29jsn57033da596b4"}});
  }, []);

  useEffect(() => {
    if (selectedSector) {
      axios.get(`http://127.0.0.1:8003/api/v1/filters/categories/?sector=${selectedSector}`).then(response => {
        setCategories(response.data);
        setSources([]);
        setRegions([]);
        setYears([]);
        setSelectedCategory("");
        setSelectedSource("");
        setSelectedRegion("");
        setSelectedYear("");
      });
    }
  }, [selectedSector]);

  useEffect(() => {
    if (selectedCategory) {
      axios.get(`http://127.0.0.1:8003/api/v1/filters/sources/?category=${selectedCategory}`).then(response => {
        setSources(response.data);
        setRegions([]);
        setYears([]);
        setSelectedSource("");
        setSelectedRegion("");
        setSelectedYear("");
      });
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSource) {
      axios.get(`http://127.0.0.1:8003/api/v1/filters/regions/?source=${selectedSource}&category=${selectedCategory}&sector=${selectedSector}`).then(response => {
        setRegions(response.data);
        setYears([]);
        setSelectedRegion("");
        setSelectedYear("");
      });
    }
  }, [selectedSource]);

  useEffect(() => {
    if (selectedRegion) {
      axios.get(`http://127.0.0.1:8003/api/v1/filters/years/?region=${selectedRegion}&category=${selectedCategory}&sector=${selectedSector}&source=${selectedSource}`).then(response => {
        setYears(response.data);
        setSelectedYear("");
      });
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (selectedYear) {
      axios.get(`http://127.0.0.1:8003/api/v1/filters/data/?region=${selectedRegion}&category=${selectedCategory}&sector=${selectedSector}&source=${selectedSource}&year=${selectedYear}`)
        .then(response => {
          setData(response.data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  }, [selectedYear]);

  return (
    <>
    
    <Box sx={{ display: 'flex', padding: 2 }}>
      <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel id="sectorLabel">Sector</InputLabel>
          <Select
            onChange={e => setSelectedSector(e.target.value)}
            value={selectedSector}
            labelId="sectorLabel"
            label="Sector"
          >
            <MenuItem value="">
              <em>Select Sector</em>
            </MenuItem>
            {sectors.map(sector => <MenuItem key={sector} value={sector}>{sector}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="categoryLabel">Category</InputLabel>
          <Select
            onChange={e => setSelectedCategory(e.target.value)}
            value={selectedCategory}
            labelId="categoryLabel"
            label="Category"
            disabled={!selectedSector}
          >
            <MenuItem value="">
              <em>Select Category</em>
            </MenuItem>
            {categories.map(category => <MenuItem key={category} value={category}>{category}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="sourceLabel">Source</InputLabel>
          <Select
            onChange={e => setSelectedSource(e.target.value)}
            value={selectedSource}
            labelId="sourceLabel"
            label="Source"
            disabled={!selectedCategory}
          >
            <MenuItem value="">
              <em>Select Source</em>
            </MenuItem>
            {sources.map(source => <MenuItem key={source} value={source}>{source}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="regionLabel">Region</InputLabel>
          <Select
            onChange={e => setSelectedRegion(e.target.value)}
            value={selectedRegion}
            labelId="regionLabel"
            label="Region"
            disabled={!selectedSource}
          >
            <MenuItem value="">
              <em>Select Region</em>
            </MenuItem>
            {regions.map(region => <MenuItem key={region} value={region}>{region}</MenuItem>)}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="yearLabel">Year</InputLabel>
          <Select
            onChange={e => setSelectedYear(e.target.value)}
            value={selectedYear}
            labelId="yearLabel"
            label="Year"
            disabled={!selectedRegion}
          >
            <MenuItem value="">
              <em>Select Year</em>
            </MenuItem>
            {years.map(year => <MenuItem key={year} value={year}>{year}</MenuItem>)}
          </Select>
        </FormControl>
      </Box>

      <Box sx={{ width: '80%', paddingLeft: 2 }}>
        <div style={{ height: 700, width: '100%' }}>
          <DataGrid
            rows={data}
            columns={cols}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[5, 10]}
            checkboxSelection
          />
        </div>
      </Box>
    </Box>

      

    </>
  )
}

export default FixedFilters

