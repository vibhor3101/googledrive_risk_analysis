import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TablePagination,
} from "@mui/material";
import { ExpandMore, ExpandLess } from "@mui/icons-material";
import Navbar from "../../components/navbar/navbar";
import Sidebar from "../../components/sidebar/sidebar";
import { fetchFiles } from "../../api/apiList"; // Import API function

const FileManager = () => {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState({});
  const folderCache = useRef({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const loadFiles = async () => {
      const data = await fetchFiles();
      setFiles(data);
    };

    loadFiles();
  }, []);

  const toggleFolder = async (folderId) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));

    if (!folderCache.current[folderId]) {
      const data = await fetchFiles(folderId);
      folderCache.current[folderId] = data;
      setFiles((prevFiles) => insertChildren(prevFiles, folderId, data));
    }
  };

  const insertChildren = (fileList, folderId, children) => {
    return fileList.map((file) => {
      if (file.file_id === folderId) {
        return { ...file, children };
      }
      if (file.children) {
        return {
          ...file,
          children: insertChildren(file.children, folderId, children),
        };
      }
      return file;
    });
  };

  const renderFiles = (fileList, paddingLeft = 0) => {
    return fileList.map((file) => (
      <React.Fragment key={file.file_id}>
        <TableRow>
          <TableCell style={{ paddingLeft }}>
            {file.file_type === "vnd.google-apps.folder" ? (
              <>
                <IconButton onClick={() => toggleFolder(file.file_id)}>
                  {expandedFolders[file.file_id] ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore />
                  )}
                </IconButton>
                {file.file_name}
              </>
            ) : (
              file.file_name
            )}
          </TableCell>
          <TableCell>{file.file_type}</TableCell>
          <TableCell>
            {file.file_size
              ? (file.file_size / (1024 * 1024)).toFixed(2) + " MB"
              : "-"}
          </TableCell>
          <TableCell>{file.last_modified}</TableCell>
        </TableRow>
        {expandedFolders[file.file_id] &&
          file.children &&
          renderFiles(file.children, paddingLeft + 20)}
      </React.Fragment>
    ));
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Navbar />
      <Box height={30} />
      <Box sx={{ display: "flex" }}>
        <Sidebar />
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <h2>File Manager</h2>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: "#1976d2" }}>
                  <TableCell>File/Folder Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Last Modified</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {renderFiles(
                  files.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 15, 20]}
              component="div"
              count={files.length}
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

export default FileManager;
