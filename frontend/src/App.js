import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import SignIn from "./component/SignIn";
import VotingList from "./component/VotingList";
import Voting from "./component/Voting";
import CreateVote from "./component/CreateVote";
import { UseContext } from "./hook/useStatus";
function App() {
  // 检查 localStorage 中的 islogin 值
  const { isLogin,vc } = UseContext();
  return (
    <Router>
      <Routes>
        {isLogin === 1 && vc !== "" ? (
          <>
            <Route path="/voting-list" element={<VotingList />} />
            <Route path="/voting/:id" element={<Voting />} />
            <Route path="/create-vote" element={<CreateVote />} />
            <Route path="*" element={<Navigate to="/voting-list" />} />
          </>
        ) : (
          <>
            <Route path="/" element={<SignIn />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
