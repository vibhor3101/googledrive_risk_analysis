import { Paper, IconButton, Popover, Typography, Box } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React, { useEffect, useState, useRef } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  Tooltip as RechartsTooltip,
} from "recharts";
import { fetchRiskTrend } from "../../api/apiList";

const LineChartComp = () => {
  const [data, setData] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverTimeout = useRef(null);

  useEffect(() => {
    const fetchRiskData = async () => {
      const formattedData = await fetchRiskTrend();
      setData(formattedData);
    };

    fetchRiskData();
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
  const id = open ? "risk-trend-description-popover" : undefined;

  // Determine max value for Y-Axis
  const maxFiles =
    data.length > 0 ? Math.max(...data.map((d) => d.files)) + 10 : 50;

  return (
    <Paper sx={{ p: 3, height: 500, width: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Risk Trend (Last 6 Months)
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
        sx={{ pointerEvents: "none" }}
      >
        <Box sx={{ p: 2, maxWidth: 300 }}>
          <Typography variant="subtitle1" fontWeight="bold">
            About this Chart
          </Typography>
          <Typography variant="body2" color="textSecondary">
            This line chart displays the trend of risk-related files over the
            past six months. The x-axis represents the months, while the y-axis
            shows the number of risky files detected.
          </Typography>
        </Box>
      </Popover>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            label={{
              value: "No. of Files",
              angle: -90,
              position: "insideLeft",
            }}
            tickFormatter={(value) => value}
            tickMargin={8}
            domain={[0, maxFiles]}
            tickCount={6}
          />
          <RechartsTooltip />
          <Line
            type="monotone"
            dataKey="files"
            stroke="#1976d2"
            strokeWidth={3}
            dot={{ r: 5, fill: "#1976d2" }}
            activeDot={{ r: 8 }}
            animationDuration={800}
          />
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
};

export default LineChartComp;
