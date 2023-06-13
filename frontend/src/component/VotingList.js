import React, { useEffect, useState } from "react";
import { format } from "date-fns";
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
  const { setIsLogin, setVc, vc } = UseContext();
  const [pollList, setPollList] = useState([]);
  const currentTime = new Date();
  useEffect(() => {
    async function fetchData() {
      const response = await axios.get("/api/getAllPoll");
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
    <Grid
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      container
      direction="column"
      alignItems="center"
    >
      <Grid
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          padding: "2rem",
        }}
        item
      >
        <Button
          style={{
            backgroundColor: "white",
            color: "black",
            borderRadius: 20,
            marginRight: "3rem",
          }}
          variant="contained"
          color="primary"
          onClick={handleCreate}
        >
          Create Vote
        </Button>
        <Logout />
      </Grid>
      <Grid item>
        <Tabs value={value} onChange={handleChange} indicatorColor="white">
          <Tab
            label="Can Vote"
            style={{
              color: value === 0 ? "white" : "gray",
              fontWeight: value === 0 ? 600 : 400,
            }}
          />
          <Tab
            label="Voted"
            style={{
              color: value === 1 ? "white" : "gray",
              fontWeight: value === 1 ? 600 : 400,
            }}
          />
          <Tab
            label="Vote Counting"
            style={{
              color: value === 2 ? "white" : "gray",
              fontWeight: value === 2 ? 600 : 400,
            }}
          />
          <Tab
            label="End Vote"
            style={{
              color: value === 3 ? "white" : "gray",
              fontWeight: value === 3 ? 600 : 400,
            }}
          />
        </Tabs>
      </Grid>
      <Grid item>
        {pollList
          .filter((vote) => {
            if (value === 3)
              return currentTime > new Date(vote.endTime) && !vote.active;
            else if (value === 2)
              return currentTime > new Date(vote.endTime) && vote.active;
            else if (value === 1)
              return JSON.parse(vc).vc.credentialSubject.voted.includes(
                vote.id
              );
            else
              return (
                currentTime < new Date(vote.endTime) &&
                !JSON.parse(vc).vc.credentialSubject.voted.includes(vote.id)
              );
          })
          .map((vote) => (
            <Paper
              key={vote.id}
              onClick={() => handleVoteClick(vote.id)}
              sx={{
                width: "50vw",
                mb: 1,
                p: 5,
                cursor: "pointer",
                borderRadius: 5,
              }}
            >
              <Typography
                style={{ fontWeight: 600, fontSize: "25px" }}
                variant="h6"
              >
                {vote.title}
              </Typography>
              <Typography variant="body2">{vote.description}</Typography>
              <hr style={{ borderColor: "black", borderWidth: "0.5px" }}></hr>
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
              <hr style={{ borderColor: "black", borderWidth: "0.5px" }}></hr>
              <Typography variant="body2">
                End Time: {format(new Date(vote.endTime), "yyyy-MM-dd HH:mm")}
              </Typography>
            </Paper>
          ))}
      </Grid>
    </Grid>
  );
}

export default VotingList;
