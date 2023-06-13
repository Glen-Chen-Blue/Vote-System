import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignIn from "./component/SignIn";
import VotingList from "./component/VotingList";
import Voting from "./component/Voting";
import CreateVote from "./component/CreateVote";
// import TestVoting from "./component/TestVoting";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SignIn />} />
        {/* <Route path="/" element={<TestVoting />} /> */}
        <Route path="/voting-list" element={<VotingList />} />
        <Route path="/voting/:id" element={<Voting />} />
        <Route path="/create-vote" element={<CreateVote />} />
      </Routes>
    </Router>
  );
}

export default App;
