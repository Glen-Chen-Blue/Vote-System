import React from "react";
import {
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UseContext } from "../hook/useStatus";
import axios from "axios";
import Logout from "./logout";

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
    navigate("/voting-list");
  };

  const handleVoting = async (poll_ID, choice) => {
    const formData = new FormData();
    formData.append("poll_ID", poll_ID);
    formData.append("choice", JSON.stringify(choice));
    formData.append("vc", vc);
    const response = await axios.post("/api/voting", formData);
    if (response === "voted") {
      alert('voted')
      console.log("voted");
    } else if (response === "error") {
      alert('error')
      console.log("error");
    } else {
      alert('vote success')
      setVc(JSON.stringify(response.data));
      navigate("/voting-list");
    }

  };

  const dateTime = new Date(voteData.endTime);
  const formattedTime = dateTime.toLocaleString();
  return (
    <Grid
      className="outergrid"
      style={{ backgroundColor: "black", minHeight: "100vh" }}
      container
      direction="column"
      alignItems="center">
      <Grid
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          padding: "2rem",
        }}
        item>
        <Logout />
      </Grid>
      <Grid item>
        <Paper sx={{ p: 5, width: "50vw", borderRadius: 5 }}>
          <Typography
            style={{ fontWeight: 600, fontSize: "25px" }}
            variant="h6">
            {voteData.title}
          </Typography>
          <Typography variant="body2">{voteData.description}</Typography>
          <hr style={{ borderColor: "black", borderWidth: "0.5px" }}></hr>
          <List>
            {voteData.options &&
              voteData.options.map((option, index) => (
                <ListItem key={index}>
                  <ListItemText>
                    {option.option}
                    {currentTime < new Date(voteData.endTime) &&
                    !JSON.parse(vc).vc.credentialSubject.voted.includes(
                      voteData.id
                    ) ? (
                      <Button
                        style={{ marginLeft: "1rem", backgroundColor: "black" }}
                        variant="contained"
                        color="primary"
                        onClick={() => handleVoting(id, option)}>
                        Vote
                      </Button>
                    ) : voteData.active ? null : (
                      ` - ${option.votes} votes`
                    )}
                  </ListItemText>
                </ListItem>
              ))}
          </List>
          <hr style={{ borderColor: "black", borderWidth: "0.5px" }}></hr>
          <Typography variant="body2">End Time: {formattedTime}</Typography>
        </Paper>
      </Grid>
      <Grid style={{ padding: "3rem" }} item>
        <Button
          style={{ backgroundColor: "white", color: "black", borderRadius: 10 }}
          variant="contained"
          color="primary"
          onClick={handleBack}>
          Back to list
        </Button>
      </Grid>
    </Grid>
  );
}

export default Voting;
