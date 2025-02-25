import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  TableSortLabel,
  Button,
  CircularProgress,
  Checkbox,
  Alert,
  Snackbar,
} from "@mui/material";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import { useLocation, useNavigate } from "react-router-dom";
import { downloadPdf, reanalyzeReport } from "../../api/apiList";

const ReportPage = () => {
  const [data, setData] = useState([]); // Store fetched data
  const [filteredData, setFilteredData] = useState([]); // Filtered data
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(16);
  const [riskFilter, setRiskFilter] = useState([]);
  const [fileTypeFilter, setFileTypeFilter] = useState([]);
  const [modifiedDateFilter, setModifiedDateFilter] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "modified_date",
    direction: "desc",
  });
  //search
  const [searchQuery, setSearchQuery] = useState("");
  const [apiSearchQuery, setApiSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/report/get-report-data?search=${apiSearchQuery}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            credentials: "include",
          }
        );
        if (response.status === 401) {
          console.warn("Unauthorized access. Redirecting to login...");
          localStorage.removeItem("token");
          window.location.href = "/";
          return { level: "Unauthorized", value: 0 };
        }

        if (response.status === 500) {
          console.error("Server error occurred.");
          return { level: "Error", value: 30 };
        }

        if (!response.ok) {
          throw new Error(`Unexpected error: ${response.status}`);
        }

        const result = await response.json();

        const formattedData = result.map((row) => ({
          name: row.file_name,
          riskLevel: row.risk_level,
          accessType: row.access_type,
          fileType: row.file_type,
          fileSize: (row.file_size / (1024 * 1024)).toFixed(2) + " MB",
          modifiedDate: row.modified_date,
        }));
        console.log("Fetched Data:", formattedData);
        setData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [apiSearchQuery]);
  const handleClearSearch = () => {
    setSearchQuery("");
    setApiSearchQuery("");
  };

  useEffect(() => {
    let filtered = [...data];

    if (riskFilter.length > 0) {
      filtered = filtered.filter((item) => riskFilter.includes(item.riskLevel));
    }

    if (fileTypeFilter.length > 0) {
      filtered = filtered.filter((item) =>
        fileTypeFilter.includes(item.fileType)
      );
    }

    if (modifiedDateFilter) {
      filtered = filtered.filter(
        (item) =>
          new Date(item.modifiedDate).toISOString().split("T")[0] ===
          modifiedDateFilter
      );
    }

    if (sortConfig.key) {
      filtered = filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key])
          return sortConfig.direction === "asc" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key])
          return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  }, [riskFilter, fileTypeFilter, modifiedDateFilter, sortConfig, data]);

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  //for reanalyze button
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const location = useLocation();

  const getReanalyzeFromQuery = () => {
    const params = new URLSearchParams(location.search);
    return params.get("reanalyze");
  };
  const handleReanalyze = async () => {
    setLoading(true);
    const result = await reanalyzeReport();
    setLoading(false);
    if (result.success !== false) {
      setSnackbarOpen(true);
      setTimeout(() => navigate("/report?reanalyze=true"), 3000);
    } else {
      alert("Failed to reanalyze. Please try again.");
    }
  };
  useEffect(() => {
    const q = getReanalyzeFromQuery();
    if (q) {
      setSnackbarOpen(true);
    }
  }, []);

  //to download pdf

  const handleDownload = () => {
    downloadPdf();
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 3 }}>
          <Box sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}>
            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="risk-level-label">Risk Level</InputLabel>
              <Select
                label="risk-level-label"
                multiple
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
              >
                {["High", "Medium", "Low"].map((level) => (
                  <MenuItem key={level} value={level}>
                    <Checkbox checked={riskFilter.indexOf(level) > -1} />
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 150 }}>
              <InputLabel id="file-type-label">File Type</InputLabel>
              <Select
                label="file-type-label"
                multiple
                value={fileTypeFilter}
                onChange={(e) => setFileTypeFilter(e.target.value)}
                renderValue={(selected) => selected.join(", ")}
              >
                {["jpeg", "pdf", "json", "docx", "csv"].map((type) => (
                  <MenuItem key={type} value={type}>
                    <Checkbox checked={fileTypeFilter.indexOf(type) > -1} />
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              type="date"
              label="Modified Date"
              InputLabelProps={{ shrink: true }}
              value={modifiedDateFilter}
              onChange={(e) => setModifiedDateFilter(e.target.value)}
            />
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                label="Search by Name"
                variant="outlined"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ minWidth: 200 }}
              />
              <Button
                variant="contained"
                onClick={() => setApiSearchQuery(searchQuery)} // Update API search query on click
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Search
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearSearch} // New button to reset search
                sx={{
                  color: "black",
                  borderColor: "black",
                  "&:hover": { borderColor: "#333" },
                }}
              >
                Clear
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 2, ml: "auto" }}>
              <Button
                variant="contained"
                onClick={handleReanalyze}
                disabled={loading}
                sx={{
                  minWidth: 150,
                  height: 50,
                  position: "relative",
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                {loading ? (
                  <>
                    <CircularProgress
                      size={24}
                      sx={{ color: "white", mr: 1 }}
                    />
                    Reanalyzing...
                  </>
                ) : (
                  "Reanalyze"
                )}
              </Button>
              <Button
                variant="contained"
                onClick={handleDownload}
                sx={{
                  backgroundColor: "black",
                  color: "white",
                  "&:hover": { backgroundColor: "#333" },
                }}
              >
                Download Report
              </Button>
            </Box>

            <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert onClose={() => setSnackbarOpen(false)} severity="success">
                Successfully reanalyzed report!
              </Alert>
            </Snackbar>
          </Box>

          <TableContainer
            component={Paper}
            sx={{ borderRadius: 2, boxShadow: 3 }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "name"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("name")}
                    >
                      Folder/File Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "riskLevel"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("riskLevel")}
                    >
                      Risk Level
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "accessType"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("accessType")}
                    >
                      Access Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "fileType"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("fileType")}
                    >
                      File Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "fileSize"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("fileSize")}
                    >
                      {" "}
                      File Size
                    </TableSortLabel>
                  </TableCell>
                  <TableCell
                    sx={{
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "1.2rem",
                    }}
                  >
                    <TableSortLabel
                      active={sortConfig.key === "modifiedDate"}
                      direction={sortConfig.direction}
                      onClick={() => handleSort("modifiedDate")}
                    >
                      Modified Date
                    </TableSortLabel>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Array.isArray(filteredData) &&
                  filteredData
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor:
                            row.riskLevel === "High"
                              ? "#FFCDD2"
                              : index % 2 === 0
                              ? "white"
                              : "#e3f2fd",
                        }}
                      >
                        <TableCell sx={{ fontSize: "1.0rem" }}>
                          {row.name}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.0rem" }}>
                          {row.riskLevel}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.0rem" }}>
                          {row.accessType}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.0rem" }}>
                          {row.fileType}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.0rem" }}>
                          {row.fileSize}
                        </TableCell>
                        <TableCell sx={{ fontSize: "1.0rem" }}>
                          {new Date(row.modifiedDate).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
              </TableBody>
            </Table>

            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              component="div"
              count={filteredData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Box>
      </Box>
    </>
  );
};

export default ReportPage;
