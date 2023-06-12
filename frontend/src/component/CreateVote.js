import React, { useState } from 'react';
import { Button, TextField, Box, Paper, Typography, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';

function CreateVote() {
  const navigate = useNavigate();
  const [options, setOptions] = useState([""]);

  const handleCreate = () => {
    navigate('/voting-list');
  };

  const handleCancel = () => {
    navigate('/voting-list');
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleRemoveOption = (index) => {
    setOptions(options.filter((_, optionIndex) => optionIndex !== index));
  };

  const handleOptionChange = (event, index) => {
    const newOptions = [...options];
    newOptions[index] = event.target.value;
    setOptions(newOptions);
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="contained" color="primary" onClick={handleCancel}>
            Back to list
        </Button>
      </Grid>
      <Grid item>
        <Paper sx={{ p: 2, width: '90vw' }}>
          <Typography variant="h6">Create New Vote</Typography>
          <Box mt={2}>
            <TextField fullWidth label="Vote Title" variant="outlined" />
            <TextField fullWidth label="Vote Content" variant="outlined" multiline sx={{ mt: 2 }}/>
            {options.map((option, index) => (
              <Box display="flex" alignItems="center" sx={{ mt: 2 }} key={index}>
                <TextField
                  fullWidth
                  label={`Option ${index + 1}`}
                  variant="outlined"
                  value={option}
                  onChange={(event) => handleOptionChange(event, index)}
                />
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length === 1}
                  sx={{ ml: 2 }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <IconButton color="primary" onClick={handleAddOption}>
              <AddCircleOutlineIcon />
            </IconButton>
            <TextField
              fullWidth
              label="End Time"
              type="datetime-local"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{ mt: 2 }}
            />
            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={handleCreate}>
                Create Vote
              </Button>
              <Button variant="contained" onClick={handleCancel} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default CreateVote;
