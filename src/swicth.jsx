import React, { useState } from "react";
import { Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import FixedFilters from "./FixedFilters";
import CustomFilters from "./CustomFilters";
 // Import the second page component

function App() {
  const [selectedPage, setSelectedPage] = useState("");

  const handleChange = (event) => {
    setSelectedPage(event.target.value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <FormControl fullWidth>
        <InputLabel id="pageLabel">Select Page</InputLabel>
        <Select
          onChange={handleChange}
          value={selectedPage}
          labelId="pageLabel"
          label="Select Page"
        >
          <MenuItem value="fixedfilters">Manual Dataset</MenuItem>
          <MenuItem value="customfilters">AI Dataset</MenuItem>
        </Select>
      </FormControl>

      {selectedPage === "fixedfilters" && <FixedFilters />}
      {selectedPage === "customfilters" && <CustomFilters />}
    </Box>
  );
}

export default App;
