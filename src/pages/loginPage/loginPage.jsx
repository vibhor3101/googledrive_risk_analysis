// import React from "react";
// import { Box, Button, Typography } from "@mui/material";
// import GoogleIcon from "@mui/icons-material/Google";
// import glassLogin from "../../assets/glassLogin.jpg";
// import logos from "../../assets/logos.png";

// const LoginPage = () => {
//   return (
//     <Box
//       sx={{
//         height: "100vh",
//         display: "flex",
//         justifyContent: "flex-start",
//         alignItems: "center",
//         position: "relative",
//         overflow: "hidden",
//         "@media (max-width: 600px)": {
//           justifyContent: "center",
//           textAlign: "center",
//         },
//       }}
//     >
//       <Box
//         sx={{
//           position: "absolute",
//           width: "100%",
//           height: "100%",
//           backgroundImage: `url(${glassLogin})`,
//           backgroundSize: "cover",
//           backgroundPosition: "left center",
//           zIndex: -1,
//         }}
//       />

//       <Box
//         sx={{
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "flex-start",
//           p: 4,
//           borderRadius: "10px",
//           textAlign: "left",
//           marginLeft: "8%",
//           "@media (max-width: 600px)": {
//             alignItems: "center",
//             marginLeft: "0%",
//             p: 2,
//           },
//         }}
//       >
//         <Box
//           sx={{
//             alignSelf: "flex-start",
//             ml: -5,
//             "@media (max-width: 600px)": {
//               ml: 0,
//               display: "flex",
//               justifyContent: "center",
//               width: "100%",
//             },
//           }}
//         >
//           <img
//             src={logos}
//             alt="Logo"
//             style={{
//               width: "400px",
//               height: "300px",
//               marginBottom: "10px",
//               "@media (max-width: 600px)": {
//                 width: "80%",
//                 height: "auto",
//               },
//             }}
//           />
//         </Box>

//         <Typography
//           variant="h2"
//           fontWeight="bold"
//           color="black"
//           sx={{
//             "@media (max-width: 600px)": {
//               fontSize: "1.8rem",
//             },
//           }}
//         >
//           Google Drive Risk Analysis
//         </Typography>
//         <Typography
//           variant="h5"
//           sx={{
//             mt: 2,
//             color: "black",
//             opacity: 0.9,
//             "@media (max-width: 600px)": {
//               fontSize: "1rem",
//             },
//           }}
//         >
//           Secure your data, analyze risks effectively.
//         </Typography>
//         <Button
//           variant="contained"
//           startIcon={<GoogleIcon />}
//           sx={{
//             mt: 4,
//             padding: "14px 28px",
//             fontSize: "1.2rem",
//             backgroundColor: "#4285F4",
//             color: "white",
//             mb: 10,
//             "@media (max-width: 600px)": {
//               fontSize: "1rem",
//               padding: "10px 20px",
//               width: "90%",
//             },
//           }}
//           onClick={() => {
//             window.location.href = `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`;
//           }}
//         >
//           Access Google Drive
//         </Button>
//       </Box>
//     </Box>
//   );
// };

// export default LoginPage;
import React from "react";
import { Box, Button, Typography } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import glassLogin from "../../assets/glassLogin.jpg";
import logos from "../../assets/logos.png";

const LoginPage = () => {
  const handleGoogleLogin = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/google`,
        { method: "GET", credentials: "include" }
      );

      if (!response.ok) {
        throw new Error("Failed to authenticate");
      }

      const data = await response.json(); // Parse JSON response

      if (data.redirectUrl) {
        window.location.href = data.redirectUrl; // Redirect to Google OAuth
      } else {
        throw new Error("Redirect URL not found in response");
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        "@media (max-width: 600px)": {
          justifyContent: "center",
          textAlign: "center",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundImage: `url(${glassLogin})`,
          backgroundSize: "cover",
          backgroundPosition: "left center",
          zIndex: -1,
        }}
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          p: 4,
          borderRadius: "10px",
          textAlign: "left",
          marginLeft: "8%",
          "@media (max-width: 600px)": {
            alignItems: "center",
            marginLeft: "0%",
            p: 2,
          },
        }}
      >
        <Box
          sx={{
            alignSelf: "flex-start",
            ml: -5,
            "@media (max-width: 600px)": {
              ml: 0,
              display: "flex",
              justifyContent: "center",
              width: "100%",
            },
          }}
        >
          <img
            src={logos}
            alt="Logo"
            style={{
              width: "400px",
              height: "300px",
              marginBottom: "10px",
              "@media (max-width: 600px)": {
                width: "80%",
                height: "auto",
              },
            }}
          />
        </Box>

        <Typography
          variant="h2"
          fontWeight="bold"
          color="black"
          sx={{
            "@media (max-width: 600px)": {
              fontSize: "1.8rem",
            },
          }}
        >
          Google Drive Risk Analysis
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mt: 2,
            color: "black",
            opacity: 0.9,
            "@media (max-width: 600px)": {
              fontSize: "1rem",
            },
          }}
        >
          Secure your data, analyze risks effectively.
        </Typography>
        <Button
          variant="contained"
          startIcon={<GoogleIcon />}
          sx={{
            mt: 4,
            padding: "14px 28px",
            fontSize: "1.2rem",
            backgroundColor: "#4285F4",
            color: "white",
            mb: 10,
            "@media (max-width: 600px)": {
              fontSize: "1rem",
              padding: "10px 20px",
              width: "90%",
            },
          }}
          onClick={handleGoogleLogin}
        >
          Access Google Drive
        </Button>
      </Box>
    </Box>
  );
};

export default LoginPage;
