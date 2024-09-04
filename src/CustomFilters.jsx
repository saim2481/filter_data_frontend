import React, { useState, useEffect } from "react";
import { Select, MenuItem, FormControl, InputLabel, OutlinedInput, Box, TextField, Button, Chip, CircularProgress} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";

function CustomFilters() {
  const cols = [
    { field: 'id', headerName: 'Activity ID', width: 500 },
    { field: 'activity_id', headerName: 'Activity Name', width: 700 },
  ]
  const [data, setData] = useState([]);
  const [years, setYears] = useState([]);
  const [countries, setCountries] = useState([]);
  const [excludedWords, setExcludedWords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [availableCountries, setAvailableCountries] = useState([]);
  const [inputExcludedWord, setInputExcludedWord] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  useEffect(() => {
    // Fetch available years
    axios.get("http://api-ahyaos.codelabs.inc:443/api/v1/general_settings/years/",{
      params: {
        start_year:2001,
        end_year:2024
      }
    })
      .then(response => setAvailableYears(response.data))
      .catch(error => console.error('Error fetching years:', error));

    // Fetch available countries
    axios.get("http://api-ahyaos.codelabs.inc:443/api/v1/general_settings/countries/?skip=0&limit=100")
      .then(response => {
        const iso2Countries = response.data.map(country => country.iso2);
        setAvailableCountries(iso2Countries)})
      .catch(error => console.error('Error fetching countries:', error));
  }, []);

  const handleAddExcludedWord = () => {
    if (inputExcludedWord && !excludedWords.includes(inputExcludedWord)) {
      setExcludedWords([...excludedWords, inputExcludedWord]);
      setInputExcludedWord("");
    }
  };

  const handleDeleteExcludedWord = (wordToDelete) => {
    setExcludedWords(excludedWords.filter(word => word !== wordToDelete));
  };

  const handleSearch = async () => {
    setLoading(true); // Start loading
    const params = new URLSearchParams();
  
    // Add years as multiple Year_filter parameters
    years.forEach(year => params.append('Year_filter', year));
  
    // Add countries as a single parameter (if needed)
    countries.forEach(country => params.append('Country_filter', country));
  
    // Add excluded words as a single parameter
    // Add countries as a single parameter (if needed)
    excludedWords.forEach(excludedWord => params.append('Exclude_words', excludedWord));
  
    // Add the search term
    params.append('footprint_description', searchTerm);
  
    await axios.get(`http://127.0.0.1:8003/search/?${params.toString()}`)
      .then(response => {setData(response.data); console.log(response.data);setLoading(false);})
      .catch(error => {console.error('Error fetching data:', error),setLoading(false);});
  };

  return (
    <Box sx={{ display: 'flex', padding: 2 }}>
      <Box sx={{ width: '20%', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="yearsLabel">Years</InputLabel>
          <Select
            labelId="yearsLabel"
            multiple
            value={years}
            onChange={(e) => setYears(e.target.value)}
            input={<OutlinedInput label="Years" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ marginBottom: 2 }}>
          <InputLabel id="countriesLabel">Countries</InputLabel>
          <Select
            labelId="countriesLabel"
            multiple
            value={countries}
            onChange={(e) => setCountries(e.target.value)}
            input={<OutlinedInput label="Countries" />}
            renderValue={(selected) => selected.join(', ')}
          >
            {availableCountries.map((country) => (
              <MenuItem key={country} value={country}>
                {country}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ marginBottom: 2 }}>
          <TextField
            fullWidth
            label="Add Excluded Word"
            variant="outlined"
            value={inputExcludedWord}
            onChange={(e) => setInputExcludedWord(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddExcludedWord()}
          />
          <Button onClick={handleAddExcludedWord} sx={{ marginTop: 1 }}>
            Add Excluded Word
          </Button>
          <Box sx={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {excludedWords.map((word, index) => (
              <Chip
                key={index}
                label={word}
                onDelete={() => handleDeleteExcludedWord(word)}
                sx={{ margin: '2px' }}
              />
            ))}
          </Box>
        </Box>

        <TextField
          fullWidth
          label="Search Term"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ marginBottom: 2 }}
        />

        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        
      </Box>
      {/* <Box sx={{ width: '80%', paddingLeft: 2 }}>
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
        </Box> */}
        {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400,padding:5 }}>
          <CircularProgress />
        </Box>
      ) : (
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
      )}
    </Box>
    
  );
}
export default CustomFilters

