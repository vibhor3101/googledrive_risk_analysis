import React, { useEffect, useState, useRef } from "react";
import { Paper, Box, Typography, IconButton, Popover } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { fetchRiskDistribution } from "../../api/apiList";

const COLORS = {
  High: "#F44336",
  Medium: "#FF9800",
  Low: "#4CAF50",
};

const BarChartComp = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverTimeout = useRef(null);

  useEffect(() => {
    fetchRiskDistribution().then(setData);
  }, []);

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
  const id = open ? "bar-chart-popover" : undefined;

  return (
    <Paper sx={{ p: 3, height: 500, width: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Risk Level Distribution
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
            This bar chart shows the distribution of files across different risk
            levels. High-risk files are represented in red, medium-risk in
            orange, and low-risk in green.
          </Typography>
        </Box>
      </Popover>

      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} barSize={80}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="riskLevel" />
          <YAxis />
          <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
          <Legend />
          <Bar dataKey="files" radius={[10, 10, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.riskLevel]}
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.transform = "scale(1)")}
                onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default BarChartComp;
