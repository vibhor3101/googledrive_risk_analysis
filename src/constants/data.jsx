import {
  InsertDriveFile,
  Folder,
  Storage,
  Public,
  Lock,
} from "@mui/icons-material";

const dashboardData = [
  {
    icon: (
      <InsertDriveFile
        fontSize="inherit"
        sx={{ color: "white", fontSize: 80 }}
      />
    ),
    label: "Files",
    bgColor: "linear-gradient(to right, #1da256 0%, #48d483 100%)",
    key: "files",
  },
  {
    icon: <Folder fontSize="inherit" sx={{ color: "white", fontSize: 80 }} />,
    label: "Folders",
    bgColor: "linear-gradient(to right, #c012e2 0%, #eb64fe 100%)",
    key: "folders",
  },
  {
    icon: <Storage fontSize="inherit" sx={{ color: "white", fontSize: 80 }} />,
    label: "Storage",
    bgColor: "linear-gradient(to right, #2c78e5 0%, #60aff5 100%)",
    key: "storage",
  },
  {
    icon: <Public fontSize="inherit" sx={{ color: "white", fontSize: 80 }} />,
    label: "Public",
    bgColor: "linear-gradient(to right, #ff4b8a 0%, #ff85b3 100%)",
    key: "public",
  },
  {
    icon: <Lock fontSize="inherit" sx={{ color: "white", fontSize: 80 }} />,
    label: "Shared",
    bgColor: "linear-gradient(to right, #e1950e 0%, #f3cd29 100%)",
    key: "shared",
  },
];

export default dashboardData;
