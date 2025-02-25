import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  IconButton,
  Popover,
} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import React, { useEffect, useState, useRef } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { fetchFileSizeDistribution } from "../../api/apiList";

const HistogramComp = () => {
  const [fileSizeData, setFileSizeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const popoverTimeout = useRef(null);

  useEffect(() => {
    fetchFileSizeDistribution()
      .then(setFileSizeData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
  const id = open ? "file-size-description-popover" : undefined;

  return (
    <Paper sx={{ p: 3, height: 500, width: "100%" }}>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          File Size Distribution
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
            This bar chart represents the distribution of files based on their
            sizes. The x-axis shows different file size ranges, while the y-axis
            represents the number of files in each category.
          </Typography>
        </Box>
      </Popover>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={fileSizeData} barSize={100}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="size_range"
              label={{ value: "File Size", position: "insideBottom", dy: 10 }}
              interval={0}
            />
            <YAxis
              label={{
                value: "Number of Files",
                angle: -90,
                position: "insideLeft",
              }}
              allowDecimals={false}
            />
            <Tooltip cursor={{ fill: "rgba(0, 0, 0, 0.1)" }} />
            <Bar dataKey="count" fill="#1976d2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Paper>
  );
};

export default HistogramComp;
