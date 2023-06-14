import { useNavigate } from "react-router-dom";
import { UseContext } from "../hook/useStatus";
import { Button } from "@mui/material";
function Logout() {
  const navigate = useNavigate();
  const { setVc, setIsLogin, vc } = UseContext();
  const logout = async () => {
    const downloadLink = document.createElement("a");
    downloadLink.href = `data:text/json;charset=utf-8,${encodeURIComponent(
      vc
    )}`;
    downloadLink.download = `${await JSON.parse(vc).vc.credentialSubject
      .name}_DID.json`;
    downloadLink.click();
    setIsLogin(0);
    setVc("");
    navigate("/");
  };
  return (
    <Button
      style={{
        backgroundColor: "white",
        color: "black",
        borderRadius: "20px",
        fontWeight: 600,
      }}
      variant="contained"
      color="secondary"
      onClick={logout}
    >
      Logout
    </Button>
  );
}
export default Logout;
