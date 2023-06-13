import React, { useEffect, useState } from "react";
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

function VotingList() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const { setIsLogin, setVc } = UseContext();
  const [pollList, setPollList] = useState([]);

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

  const handleLogout = () => {
    setIsLogin(0);
    setVc('');
    navigate("/");
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
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
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
            if (value === 0) return vote.active && !vote.voted;
            else if (value === 1) return vote.voted;
            else return !vote.active;
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
              <Typography variant="body2">End Time: {Date(vote.time).toLocaleString()}</Typography>
            </Paper>
          ))}
      </Grid>
    </Grid>
  );
}

export default VotingList;
