import React from "react";
import Sidebar from "../../components/sidebar/sidebar";
import Navbar from "../../components/navbar/navbar";
import { Box, Grid } from "@mui/material";

import LineChartComp from "../../components/lineChart/lineChartComp";
import PieChartComp from "../../components/pieChart/pieChartComp";
import HistogramComp from "../../components/histogram/histogramComp";
import BarChartComp from "../../components/barChart/barChartComp";

const ChartsPage = () => {
  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} sx={{ mt: 3 }}>
              <BarChartComp />
            </Grid>

            <Grid item xs={12} md={6} sx={{ mt: 3 }}>
              <PieChartComp />
            </Grid>

            <Grid item xs={12} md={6}>
              <LineChartComp />
            </Grid>

            <Grid item xs={12} md={6}>
              <HistogramComp />
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default ChartsPage;
