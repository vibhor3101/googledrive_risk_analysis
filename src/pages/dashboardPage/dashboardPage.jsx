// import {
//   Box,
//   Card,
//   Grid,
//   Typography,
//   TextField,
//   CircularProgress,
// } from "@mui/material";
// import React, { useEffect, useState } from "react";
// import Sidebar from "../../components/sidebar/sidebar";
// import Navbar from "../../components/navbar/navbar";
// import { useLocation } from "react-router-dom";
// import GaugeChart from "../../components/gaugeChart/gaugeChart";
// import dashboardData from "../../constants/data";

// const useQuery = () => {
//   return new URLSearchParams(useLocation().search);
// };

// const fetchDriveMetadata = async (token) => {
//   const response = await fetch(
//     `${process.env.REACT_APP_BACKEND_URL}/api/report/analyze`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     }
//   );
//   const data = await response.json();
//   console.log("Analyze API Response:", data);
//   return data;
// };

// const fetchDriveDashboardData = async (token) => {
//   const response = await fetch(
//     `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats`,
//     {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//       credentials: "include",
//     }
//   );
//   const data = await response.json();
//   console.log("Stats API Response:", data);
//   return data;
// };

// const DashboardPage = () => {
//   const query = useQuery();
//   const token = query.get("token") || localStorage.getItem("token");
//   const [driveData, setDriveData] = useState(null);
//   const [driveDashboardData, setDriveDashboardData] = useState(null);

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//     }
//   }, [token]);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (token) {
//         try {
//           const analyzeData = await fetchDriveMetadata(token);
//           setDriveData(analyzeData);

//           const statsData = await fetchDriveDashboardData(token);
//           setDriveDashboardData(statsData);
//         } catch (error) {
//           console.error("Error fetching data:", error);
//         }
//       }
//     };

//     fetchData();
//   }, [token]);

//   if (!driveData || !driveDashboardData) {
//     return (
//       <Box
//         sx={{
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           height: "100vh",
//           flexDirection: "column",
//         }}
//       >
//         <CircularProgress />

//         <Typography marginTop={4}>Please wait,it may take a while.</Typography>
//       </Box>
//     );
//   }
//   return (
//     <>
//       <Navbar />
//       <Box height={100} />
//       <Box sx={{ display: "flex" }}>
//         <Sidebar />
//         <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
//           <Grid container spacing={3}>
//             <Grid item xs={12}>
//               <GaugeChart />
//             </Grid>

//             {dashboardData.map((item, index) => (
//               <Grid item xs={12} sm={6} md={2.4} key={index}>
//                 <Card
//                   sx={{
//                     height: 500,
//                     width: "100%",
//                     display: "flex",
//                     flexDirection: "column",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                     textAlign: "center",
//                     p: 4,
//                     borderRadius: 6,
//                     boxShadow: 6,
//                     background: item.bgColor,
//                     transition: "transform 0.3s ease, box-shadow 0.3s ease",
//                     "&:hover": {
//                       transform: "scale(1.05)",
//                       boxShadow: 10,
//                     },
//                   }}
//                 >
//                   <Box sx={{ mb: 2 }}>{item.icon}</Box>
//                   <TextField
//                     value={
//                       item.label === "Files"
//                         ? driveDashboardData.totalFiles
//                         : item.label === "Folders"
//                         ? driveDashboardData.totalFolders
//                         : item.label === "Storage"
//                         ? `${driveDashboardData.totalStorage} GB`
//                         : item.label === "Shared"
//                         ? driveDashboardData.sharedFiles
//                         : item.label === "Public"
//                         ? driveDashboardData.publicFiles
//                         : 0
//                     }
//                     variant="outlined"
//                     inputProps={{
//                       style: {
//                         textAlign: "center",
//                         color: "white",
//                         fontSize: "3rem",
//                         fontWeight: "bold",
//                       },
//                     }}
//                     sx={{
//                       mt: 2,
//                       width: "200px",
//                       height: "100px",
//                       bgcolor: "rgba(255,255,255,0.2)",
//                       borderRadius: 2,
//                       "& .MuiOutlinedInput-root": {
//                         "& fieldset": { border: "none" },
//                       },
//                     }}
//                   />
//                   <Typography
//                     variant="h4"
//                     sx={{
//                       color: "white",
//                       fontWeight: "bold",
//                       letterSpacing: 1,
//                     }}
//                   >
//                     {item.label}
//                   </Typography>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Box>
//       </Box>
//     </>
//   );
// };

// export default DashboardPage;

///using useContext
import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Card,
  Grid,
  Typography,
  TextField,
  CircularProgress,
  useMediaQuery,
} from "@mui/material";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import GaugeChart from "../../components/gaugeChart/gaugeChart";
import dashboardData from "../../constants/data";
import { DashboardContext } from "../../context/dashboardContext";
import { useLocation, useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { driveData, driveDashboardData, loading } =
    useContext(DashboardContext);
  const location = useLocation();
  const [localToken, setLocalToken] = useState(null);

  const [randomValues, setRandomValues] = useState({});
  const [finalValues, setFinalValues] = useState({});
  const getTokenFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("token");
  };
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery("(max-width:1100px)");

  useEffect(() => {
    const queryToken = getTokenFromQuery();

    if (queryToken) {
      localStorage.setItem("token", queryToken);
      setLocalToken(queryToken);
      console.log("Token set from URL:", queryToken);
    } else if (localStorage.getItem("token")) {
      setLocalToken(localStorage.getItem("token"));
      console.log(
        "Token retrieved from localStorage:",
        localStorage.getItem("token")
      );
    }

    const newUrl = location.pathname;
    navigate(newUrl, { replace: true });

    console.log("Token set from URL and removed:", queryToken);
  }, [location.search, navigate]);

  useEffect(() => {
    const intervalIds = {};

    dashboardData.forEach((item) => {
      intervalIds[item.label] = setInterval(() => {
        setRandomValues((prev) => ({
          ...prev,
          [item.label]: Math.floor(Math.random() * 1000),
        }));
      }, 100);
    });

    setTimeout(() => {
      Object.keys(intervalIds).forEach((key) =>
        clearInterval(intervalIds[key])
      );
      if (!loading) {
        setFinalValues({
          Files: driveDashboardData.totalFiles,
          Folders: driveDashboardData.totalFolders,
          Storage: `${driveDashboardData.totalStorage} GB`,
          Shared: driveDashboardData.sharedFiles,
          Public: driveDashboardData.publicFiles,
        });
      }
    }, 2000);

    return () => {
      Object.keys(intervalIds).forEach((key) =>
        clearInterval(intervalIds[key])
      );
    };
  }, [driveDashboardData]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography marginTop={4}>Please wait, it may take a while.</Typography>
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box height={100} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <GaugeChart />
            </Grid>

            {dashboardData.map((item, index) => (
              <Grid item xs={12} sm={6} md={2.4} key={index}>
                <Card
                  sx={{
                    height: 500,
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "space-between",
                    textAlign: "center",
                    p: 4,
                    borderRadius: 6,
                    boxShadow: 6,
                    background: item.bgColor,
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    "&:hover": { transform: "scale(1.05)", boxShadow: 10 },
                  }}
                >
                  <Box sx={{ mb: 2 }}>{item.icon}</Box>
                  <Box
                    sx={{
                      mt: 2,
                      width: isSmallScreen ? "150px" : "210px",
                      height: isSmallScreen ? "80px" : "100px",
                      bgcolor: "rgba(255,255,255,0.2)",
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant={isSmallScreen ? "h4" : "h3"}
                      sx={{
                        textAlign: "center",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {finalValues[item.label] ?? randomValues[item.label] ?? 0}
                    </Typography>
                  </Box>

                  <Typography
                    variant="h4"
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      letterSpacing: 1,
                    }}
                  >
                    {item.label}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default DashboardPage;
