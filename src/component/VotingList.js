import React from 'react';
import { Button, Tabs, Tab, Paper, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import data from './data'


function VotingList() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    navigate('/');
  };

  const handleCreate = () => {
    navigate('/create-vote');
  };

  const handleVoteClick = (id) => {
    navigate(`/voting/${id}`);
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2} >
      <Grid item>
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create Vote
        </Button>
      </Grid>
      <Grid item>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Active Votes" />
          <Tab label="Past Votes" />
        </Tabs>
      </Grid>
      <Grid item>
      {data
          .filter(vote => (value === 0 ? vote.active : !vote.active))
          .map(vote => (
            <Paper key={vote.id} onClick={() => handleVoteClick(vote.id)} sx={{ width: '60vw', mb: 1, p: 1, cursor: 'pointer' }}>
              <Typography variant="h6">{vote.title}</Typography>
              <Typography variant="body2">{vote.description}</Typography>
              <List>
                {vote.options.map((option, index) => (
                  <ListItem key={index}>
                    <ListItemText>{option.option}{vote.active?"":":"+option.votes}</ListItemText>
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2">End Time: {vote.endTime}</Typography>
            </Paper>
          ))}
      </Grid>
    </Grid>
  );
}

export default VotingList;
