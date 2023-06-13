import React, { useState } from 'react';
import { Button, TextField, Box, Paper, Typography, Grid, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import { UseContext } from '../hook/useStatus';
import Logout from './logout';
axios.defaults.baseURL = 'http://localhost:4000';

function CreateVote() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [endtime, setEndtime] = useState('');
  const [options, setOptions] = useState(['']);
  const { setVc, setIsLogin } = UseContext();

  const handleCreate = async () => {
    console.log(title, content, options, endtime);
    if (title.trim() === '' || content.trim() === '' || endtime.trim() === '') {
      alert('Please fill in all fields');
      return;
    }
    const currentDatetime = new Date();
    const selectedDatetime = new Date(endtime);
    if (selectedDatetime < currentDatetime) {
      alert('End time cannot be earlier than current time');
      return;
    }
    try {
      let formData = new FormData();
      formData.append('title', title);
      formData.append('description', content);
      formData.append('options', JSON.stringify(options));
      formData.append('endTime', endtime);
      const response = await axios.post('/api/createPoll', formData);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
    navigate('/voting-list');
  };

  const handleCancel = () => {
    navigate('/voting-list');
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
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
        <Logout/>
        <Button variant="contained" color="primary" onClick={handleCancel}>
          Back to list
        </Button>
      </Grid>
      <Grid item>
        <Paper sx={{ p: 2, width: '90vw' }}>
          <Typography variant="h6">Create New Vote</Typography>
          <Box mt={2}>
            <TextField
              fullWidth
              label="Vote Title"
              variant="outlined"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
            <TextField
              fullWidth
              label="Vote Content"
              variant="outlined"
              multiline
              sx={{ mt: 2 }}
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
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
              value={endtime}
              onChange={(event) => setEndtime(event.target.value)}
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
