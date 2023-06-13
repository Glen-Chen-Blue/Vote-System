import React from 'react';
import { Button, Paper, Typography, List, ListItem, ListItemText, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { UseContext } from '../hook/useStatus';
import axios from 'axios';
import Logout from './logout';

function Voting() {
  const navigate = useNavigate();
  const { setVc, setIsLogin, vc } = UseContext();
  const [voteData, setVoteData] = React.useState({});
  const { id } = useParams();
  const currentTime = new Date();
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
    formData.append('vc', vc);
    const response = await axios.post('/api/voting', formData);
    if(response == 'voted'){
      console.log('voted');
    }
    else if(response == 'error'){
      console.log('error');
    }
    else{
      setVc(JSON.stringify(response.data));
      navigate('/voting-list');
    }

    
  };

  const dateTime = new Date(voteData.time);
  const formattedTime = dateTime.toLocaleString();
  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Logout/>
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
                    {currentTime < new Date(voteData.time) && !JSON.parse(vc).vc.credentialSubject.voted.includes(voteData.id) ? (
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
          <Typography variant="body2">End Time: {formattedTime}</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Voting;
