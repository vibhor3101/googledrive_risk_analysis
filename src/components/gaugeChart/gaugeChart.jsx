import { Box, Card, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Cell, Pie, PieChart } from "recharts";
import { fetchRiskLevel } from "../../api/apiList";

const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

const RISK_MAPPING = {
  Low: { value: 30, color: COLORS[0] },
  Medium: { value: 90, color: COLORS[1] },
  High: { value: 150, color: COLORS[2] },
};
const GaugeChart = () => {
  const [riskData, setRiskData] = useState({ level: "Low", value: 30 });
  const [currentAngle, setCurrentAngle] = useState(180);
  const [direction, setDirection] = useState(-1);
  const [isRevolving, setIsRevolving] = useState(true);

  useEffect(() => {
    fetchRiskLevel().then((data) => setRiskData(data));
  }, []);

  useEffect(() => {
    if (!isRevolving) return;

    let angle = 180;
    const interval = setInterval(() => {
      angle += direction * 10;

      if (angle <= 0 || angle >= 180) {
        setDirection((prev) => -prev);
      }

      setCurrentAngle(angle);
    }, 50);

    setTimeout(() => {
      clearInterval(interval);
      setCurrentAngle(riskData.value);
      setIsRevolving(false);
    }, 2000);

    return () => clearInterval(interval);
  }, [isRevolving, riskData.value, direction]);

  return (
    <Card
      sx={{
        height: 450,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        textAlign: "center",
        p: 4,
        borderRadius: 6,
        boxShadow: 6,
        background: "linear-gradient(to right, #0A192F, #1B2A41)",
      }}
    >
      <Box sx={{ width: "60%", textAlign: "left" }}>
        <Typography
          variant="h2"
          sx={{ color: "white", fontWeight: "bold", mb: 2 }}
        >
          Google Drive Risk Analysis Dashboard
        </Typography>
        <Typography variant="h6" sx={{ color: "white" }}>
          Monitor and manage the security risks of your Google Drive files
          efficiently.
        </Typography>
      </Box>

      <Box
        sx={{
          width: "40%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <PieChart width={450} height={350}>
          <Pie
            data={[
              { name: "Low", value: 30, color: COLORS[0] },
              { name: "Medium", value: 30, color: COLORS[1] },
              { name: "High", value: 30, color: COLORS[2] },
            ]}
            dataKey="value"
            cx="50%"
            cy="85%"
            startAngle={180}
            endAngle={0}
            innerRadius="60%"
            outerRadius="100%"
            paddingAngle={3}
          >
            {Object.keys(RISK_MAPPING).map((key, index) => (
              <Cell key={`cell-${index}`} fill={RISK_MAPPING[key].color} />
            ))}
          </Pie>

          <line
            x1="225"
            y1="295"
            x2={225 + 120 * Math.cos((180 - currentAngle) * (Math.PI / 180))}
            y2={295 - 120 * Math.sin((180 - currentAngle) * (Math.PI / 180))}
            stroke="white"
            strokeWidth={4}
            strokeLinecap="round"
          />

          <text x="81" y="280" fill="white" fontSize="16" fontWeight="bold">
            Low
          </text>
          <text x="200" y="170" fill="white" fontSize="16" fontWeight="bold">
            Medium
          </text>
          <text x="330" y="280" fill="white" fontSize="16" fontWeight="bold">
            High
          </text>
        </PieChart>

        <Typography variant="h4" sx={{ mb: 2, color: "white" }}>
          Overall Risk Level
        </Typography>
      </Box>
    </Card>
  );
};

export default GaugeChart;
