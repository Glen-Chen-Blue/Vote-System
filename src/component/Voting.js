import React from 'react';
import { Button, Paper, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import data from './data';
function Voting() {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Find the vote with the given id
  const vote = data.find(vote => vote.id === Number(id));

  const handleBack = () => {
    navigate('/voting-list');
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
        <Grid item>
            <Button variant="contained" color="secondary" onClick={handleLogout}>
                Logout
            </Button>
            <Button variant="contained" color="primary" onClick={handleBack}>
                Back to list
            </Button>
        </Grid>
      <Grid item>
        <Paper sx={{ p: 2,width: '60vw' }}>
          <Typography variant="h6">{vote.title}</Typography>
          <Typography variant="body2">{vote.description}</Typography>
          <List>
            {vote.options.map((option, index) => (
              <ListItem key={index}>
                <ListItemText>
                  {option.option}
                  {vote.active ? (
                    <Button variant="contained" color="primary">
                      Vote
                    </Button>
                  ) : (
                    ` - ${option.votes} votes`
                  )}
                </ListItemText>
              </ListItem>
            ))}
          </List>
          <Typography variant="body2">End Time: {vote.endTime}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Voting;
