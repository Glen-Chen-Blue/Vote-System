import React from "react";
import {
  Button,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { UseContext } from "../hook/useStatus";
import axios from "axios";
import Logout from "./logout";

function Voting() {
  const navigate = useNavigate();
  const { setVc, setIsLogin, vc } = UseContext();
  const [voteData, setVoteData] = React.useState({});
  const [voted, setVoted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
    setLoading(true);
    setVoted(true);
    const response = await axios.post("/api/voting", formData);
    if (response === "voted") {
      alert("voted");
      console.log("voted");
    } else if (response === "error") {
      alert("error");
      console.log("error");
    } else {
      alert("vote success");
      setVc(JSON.stringify(response.data));
      const downloadLink = document.createElement("a");
      downloadLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(response.data)
      )}`;
      downloadLink.download = `${await response.data.vc.credentialSubject
        .name}_DID.json`;
      downloadLink.click();
      navigate("/voting-list");
    }

    setLoading(false);
  };

  const dateTime = new Date(voteData.endTime);
  const formattedTime = dateTime.toLocaleString();
  return (
    <Grid
      className="outergrid"
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
        <Logout />
      </Grid>
      <Grid item>
        <Paper sx={{ p: 5, width: "50vw", borderRadius: 5 }}>
          <Grid
            style={{ display: "flex", justifyContent: "space-between" }}
            item
          >
            <Typography
              style={{ fontWeight: 600, fontSize: "25px" }}
              variant="h6"
            >
              {voteData.title}
            </Typography>
            {loading && (
              <Box mt={2}>
                <CircularProgress />
              </Box>
            )}
          </Grid>
          <Typography variant="body2">{voteData.description}</Typography>
          <hr style={{ borderColor: "black", borderWidth: "0.5px" }}></hr>
          <List>
            {voteData.options &&
              voteData.options.map((option, index) => (
                <ListItem key={index}>
                  <ListItemText
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}
                  >
                    {option.option}

                    {currentTime < new Date(voteData.endTime) &&
                    !JSON.parse(vc).vc.credentialSubject.voted.includes(
                      voteData.id
                    ) ? (
                      <Button
                        style={{
                          marginLeft: "3rem",
                          backgroundColor: voted ? "gray" : "black",
                          cursor: voted ? "not-allowed" : "pointer",
                        }}
                        variant="contained"
                        onClick={() =>
                          voted ? () => {} : handleVoting(id, option)
                        }
                      >
                        Vote
                      </Button>
                    ) : voteData.active ? null : (
                      <Button
                        style={{
                          backgroundColor: "black",
                          color: "white",
                          marginLeft: "3rem",
                          paddingLeft: "1rem",
                          paddingRight: "1rem",
                        }}
                      >
                        {option.votes} votes
                      </Button>
                      // ` ------ ${option.votes} votes`
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
          onClick={handleBack}
        >
          Back to list
        </Button>
      </Grid>
    </Grid>
  );
}

export default Voting;
