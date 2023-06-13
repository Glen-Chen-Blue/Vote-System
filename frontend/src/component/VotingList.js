import React, { useEffect, useState } from "react";
import { format } from 'date-fns';
import {
  Button,
  Tabs,
  Tab,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UseContext } from "../hook/useStatus";
import axios from "axios";
import Logout from "./logout";
function VotingList() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const { setIsLogin, setVc,vc } = UseContext();
  const [pollList, setPollList] = useState([]);
  const currentTime = new Date();
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get('/api/getAllPoll');
      setPollList(response.data);
      console.log(response.data);
    }
    fetchData();
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleCreate = () => {
    navigate("/create-vote");
  };

  const handleVoteClick = (id) => {
    navigate(`/voting/${id}`);
  };

  return (
    <Grid container direction="column" alignItems="center" spacing={2}>
      <Grid item>
        <Logout/>
        <Button variant="contained" color="primary" onClick={handleCreate}>
          Create Vote
        </Button>
      </Grid>
      <Grid item>
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Can Vote" />
          <Tab label="Voted" />
          <Tab label="End Vote" />
        </Tabs>
      </Grid>
      <Grid item>
        {pollList
          .filter((vote) => {
            if (value===2) return currentTime > new Date(vote.time)
            else if (value === 1) return JSON.parse(vc).vc.credentialSubject.voted.includes(vote.id)
            else return currentTime < new Date(vote.time) && !JSON.parse(vc).vc.credentialSubject.voted.includes(vote.id)
          })
          .map((vote) => (
            <Paper
              key={vote.id}
              onClick={() => handleVoteClick(vote.id)}
              sx={{ width: '60vw', mb: 1, p: 1, cursor: 'pointer' }}
            >
              <Typography variant="h6">{vote.title}</Typography>
              <Typography variant="body2">{vote.description}</Typography>
              <List>
                {vote.options.map((option, index) => (
                  <ListItem key={index}>
                    <ListItemText>
                      {option}
                      {vote.active ? "" : ":" + option.votes}
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
              <Typography variant="body2">End Time: {format(new Date(vote.time), 'yyyy-MM-dd HH:mm')}</Typography>
            </Paper>
          ))}
      </Grid>
    </Grid>
  );
}

export default VotingList;
