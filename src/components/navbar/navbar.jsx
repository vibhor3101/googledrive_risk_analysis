import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import { useAppStore } from "../../appStore";
import { useNavigate } from "react-router-dom";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

export default function Navbar() {
  const updateOpen = useAppStore((state) => state.updateOpen);
  const dopen = useAppStore((state) => state.dopen);
  const [username, setUsername] = React.useState("");
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("token");

    navigate("/");
  };

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );

        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };

    fetchUsername();
  }, []);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => updateOpen(!dopen)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {username ? `Hi, ${username}` : "Loading..."}
          </Typography>
          <Button
            onClick={handleSignOut}
            sx={{
              fontSize: "18px",
              backgroundColor: "white",
              color: "black",
              fontWeight: "35px",
            }}
          >
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
