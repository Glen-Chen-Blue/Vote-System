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
      alert('create success')
    } catch (error) {
      console.error(error);
      alert('create error')
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
    <Grid style={{ backgroundColor: 'black', minHeight: '100vh'}} container direction="column" alignItems="center">
      <Grid style={{ width:'100%', display:'flex', justifyContent:'flex-end', padding:'2rem' }} item>
        <Logout/>
      </Grid>
      <Grid item>
        <Paper sx={{ p: 5, width: '50vw', borderRadius:5 }}>
          <Typography style={{ fontWeight:600, fontSize:'25px' }} variant="h6">Create New Vote</Typography>
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
                  color="black"
                  onClick={() => handleRemoveOption(index)}
                  disabled={options.length === 1}
                  sx={{ ml: 2 }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
              </Box>
            ))}
            <IconButton color="black" onClick={handleAddOption}>
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
              <Button style={{ marginLeft:'0rem', backgroundColor:'black'}} variant="contained" color="primary" onClick={handleCreate}>
                Create Vote
              </Button>
              <Button style={{ marginLeft:'1rem', backgroundColor:'black'}} variant="contained" onClick={handleCancel} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Grid>
      <Grid style={{ padding:'3rem' }} item>
        <Button style={{ backgroundColor:'white', color:'black', borderRadius:10 }} variant="contained" color="primary" onClick={handleCancel}>
          Back to list
        </Button>
      </Grid>
    </Grid>
  );
}

export default CreateVote;
