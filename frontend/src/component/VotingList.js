import React from "react";
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
import data from "./data";
import { UseContext } from "../hook/useStatus";
function VotingList() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  const {setIsLogin,setVc} = UseContext();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleLogout = () => {
    setIsLogin(0)
    setVc('')
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
      {data
          .filter(vote => {
              if (value === 0) return vote.active && !vote.voted;
              else if (value === 1) return vote.voted;
              else return !vote.active;
          })
          .map(vote => (
            <Paper key={vote.id} onClick={() => handleVoteClick(vote.id)} sx={{ width: '60vw', mb: 1, p: 1, cursor: 'pointer' }}>
              <Typography variant="h6">{vote.title}</Typography>
              <Typography variant="body2">{vote.description}</Typography>
              <List>
                {vote.options.map((option, index) => (
                  <ListItem key={index}>
                    <ListItemText>
                      {option.option}
                      {vote.active ? "" : ":" + option.votes}
                    </ListItemText>
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
