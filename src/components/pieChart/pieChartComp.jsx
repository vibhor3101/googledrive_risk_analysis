import React, { useEffect, useState, useRef } from "react";
import { Box, Paper, Typography, IconButton, Popover } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";
import { fetchFileAgeDistribution } from "../../api/apiList";

const PieChartComp = () => {
  const [riskData, setRiskData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverTimeout = useRef(null);

  useEffect(() => {
    const getData = async () => {
      const formattedData = await fetchFileAgeDistribution();
      setRiskData(formattedData);
    };

    getData();
  }, []);

  const getColor = (ageRange) => {
    switch (ageRange) {
      case "0-1 years":
        return "#4CAF50";
      case "1-2 years":
        return "#FF9800";
      case ">2 years":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  const handleMouseEnter = (event) => {
    if (popoverTimeout.current) clearTimeout(popoverTimeout.current);
    setAnchorEl(event.currentTarget);
  };

  const handleMouseLeave = () => {
    popoverTimeout.current = setTimeout(() => {
      setAnchorEl(null);
    }, 200);
  };

  const open = Boolean(anchorEl);
  const id = open ? "file-age-popover" : undefined;

  return (
    <Paper sx={{ p: 3, height: 500, width: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          File Age Distribution
        </Typography>
        <IconButton
          aria-describedby={id}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <InfoIcon sx={{ color: "#000000" }} />
        </IconButton>
      </Box>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        disableRestoreFocus
        sx={{
          pointerEvents: "none",
        }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            About this Chart
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This pie chart represents the age distribution of files in your
            system. The different segments show the proportion of files within
            different age ranges.
          </Typography>
        </Box>
      </Popover>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "80%",
        }}
      >
        <PieChart width={400} height={340}>
          <Pie
            data={riskData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={140}
            innerRadius={60}
            label
            stroke="white"
            strokeWidth={2}
          >
            {riskData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColor(entry.name)}
                style={{ transition: "transform 0.3s ease-in-out" }}
              />
            ))}
          </Pie>
          <RechartsTooltip />
        </PieChart>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
          {riskData.map((entry, index) => (
            <Box
              key={index}
              sx={{ display: "flex", alignItems: "center", mr: 4 }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  backgroundColor: getColor(entry.name),
                  marginRight: 1,
                }}
              />
              <Typography>{entry.name}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

export default PieChartComp;
