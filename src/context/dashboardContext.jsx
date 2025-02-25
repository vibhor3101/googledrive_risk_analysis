import React, { createContext, useState, useEffect } from "react";

export const DashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
  const [driveData, setDriveData] = useState(null);
  const [driveDashboardData, setDriveDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // let token = localStorage.getItem("token");
  let token = null;
  console.log("Outside useeffect", token);

  useEffect(() => {
    const fetchData = async () => {
      console.log("Inside useeffect", token);
      if (!token) {
        token = localStorage.getItem("token");
      }
      if (token) {
        try {
          const analyzeResponse = await fetch(
            `${process.env.REACT_APP_BACKEND_URL}/api/report/analyze`,
            {
              method: "POST",
              headers: { Authorization: `Bearer ${token}` },
              credentials: "include",
            }
          );

          // if (analyzeResponse.status === 401) {
          //   console.warn("Unauthorized access. Redirecting to login...");
          //   localStorage.removeItem("token");
          //   window.location.href = "/";
          //   return { level: "Unauthorized", value: 0 };
          // }

          // if (analyzeResponse.status === 500) {
          //   console.error("Server error occurred.");
          //   return { level: "Error", value: 30 };
          // }

          // if (!analyzeResponse.ok) {
          //   throw new Error(`Unexpected error: ${analyzeResponse.status}`);
          // }
          const analyzeData = await analyzeResponse.json();

          const statsResponse = await fetch(
            ` ${process.env.REACT_APP_BACKEND_URL}/api/dashboard/stats   `,
            {
              method: "GET",
              headers: { Authorization: ` Bearer ${token}` },
              credentials: "include",
            }
          );
          // if (statsResponse.status === 401) {
          //   console.warn("Unauthorized access. Redirecting to login...");
          //   localStorage.removeItem("token");
          //   window.location.href = "/";
          //   return { level: "Unauthorized", value: 0 };
          // }

          // if (statsResponse.status === 500) {
          //   console.error("Server error occurred.");
          //   return { level: "Error", value: 30 };
          // }

          // if (!statsResponse.ok) {
          //   throw new Error(`Unexpected error: ${statsResponse.status}`);
          // }
          const statsData = await statsResponse.json();

          setDriveData(analyzeData);
          setDriveDashboardData(statsData);
        } catch (error) {
          console.error("Error fetching dashboard data:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!driveData || !driveDashboardData) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [token, driveDashboardData, driveData]);

  return (
    <DashboardContext.Provider
      value={{ driveData, driveDashboardData, loading }}
    >
      {children}
    </DashboardContext.Provider>
  );
};
