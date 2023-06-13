import React from 'react';
import { Button, Paper, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { UseContext } from '../hook/useStatus';
import axios from 'axios';

function Voting() {
  const navigate = useNavigate();
  const { setVc, setIsLogin } = UseContext();
  const [voteData, setVoteData] = React.useState({});
  const { id } = useParams();

  React.useEffect(() => {
    async function fetchData() {
      const response = await axios.get(`/api/getPoll/${id}`);
      setVoteData(response.data);
      console.log(response.data);
    }
    fetchData();
  }, []);

  const handleBack = () => {
    navigate('/voting-list');
  };

  const handleVoting = async (poll_ID, choice) => {
    const formData = new FormData();
    formData.append('poll_ID', poll_ID);
    formData.append('choice', choice);
    const response = await axios.post('/api/voting', formData);
    console.log(response.data);
    navigate('/voting-list');
  };

  const handleLogout = () => {
    setIsLogin(0);
    setVc('');
    navigate('/');
  };

  const dateTime = new Date(voteData.time);
  const formattedTime = dateTime.toLocaleString();

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
        <Paper sx={{ p: 2, width: '60vw' }}>
          <Typography variant="h6">{voteData.title}</Typography>
          <Typography variant="body2">{voteData.description}</Typography>
          <List>
            {voteData.options &&
              voteData.options.map((option, index) => (
                <ListItem key={index}>
                  <ListItemText>
                    {option}
                    {!voteData.voted && voteData.active ? (
                      <Button variant="contained" color="primary" onClick={()=>handleVoting(id,option)}>
                        Vote
                      </Button>
                    ) : voteData.active ? null : (
                      ` - ${option.votes} votes`
                    )}
                  </ListItemText>
                </ListItem>
              ))}
          </List>
          <Typography variant="body2">End Time: {Date(voteData.time).toLocaleString()}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Voting;
