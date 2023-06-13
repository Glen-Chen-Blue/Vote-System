import data from "./data";
import coutingVotes from "./iota/coutingVotes";
function endVote(poll_id) {
  const poll = data.filter((d) => d.id === poll_id);
  const result = coutingVotes(poll.options, poll.lastBlockID);
  const newpoll = {
    id: poll.id,
    title: poll.title,
    description: poll.description,
    options: result,
    active: false,
    endTime: poll.endTime,
    lastBlockID: poll.lastBlockID,
  };
  data = data.map((d) => (d = d.id === poll_id ? newpoll : d));
}
export default endVote;
