//piechart api
export const fetchFileAgeDistribution = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/charts/file-age-distribution`,
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
    const data = await response.json();

    return data.map((item) => ({
      name: item.age_range,
      value: Number(item.count) || 0,
    }));
  } catch (error) {
    console.error("Error fetching risk data:", error);
    return [];
  }
};
//gaugechart api
export const fetchRiskLevel = async () => {
  const COLORS = ["#4CAF50", "#FFC107", "#F44336"];

  const RISK_MAPPING = {
    Low: { value: 30, color: COLORS[0] },
    Medium: { value: 90, color: COLORS[1] },
    High: { value: 150, color: COLORS[2] },
  };
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/dashboard/overallRiskLevel`,
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

    const data = await response.json();
    return {
      level: data.name,
      value: RISK_MAPPING[data.name]?.value || 30,
    };
  } catch (error) {
    console.error("Error fetching risk level:", error);
    return { level: "Low", value: 30 };
  }
};
//linechart api
export const fetchRiskTrend = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/charts/risk-trend`,
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
      return [];
    }

    if (response.status === 500) {
      console.error("Server error occurred.");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Unexpected error: ${response.status}`);
    }

    const data = await response.json();

    return data.map((item) => ({
      month: item.month,
      files: Number(item.files) || 0,
    }));
  } catch (error) {
    console.error("Error fetching risk data:", error);
    return [];
  }
};

//barchart api
export const fetchRiskDistribution = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/charts/risk-level-distribution`,
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
      return [];
    }

    if (response.status === 500) {
      console.error("Server error occurred.");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Unexpected error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching risk data:", error);
    return [];
  }
};

//histogram api
export const fetchFileSizeDistribution = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/charts/file-size-distribution`,
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
      return [];
    }

    if (response.status === 500) {
      console.error("Server error occurred.");
      return [];
    }

    if (!response.ok) {
      throw new Error(`Unexpected error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching file size distribution data:", error);
    return [];
  }
};

//reanalyze_button_api
export const reanalyzeReport = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/report/analyze?analyzeAgain=true`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to reanalyze report");
    }

    return await response.json();
  } catch (error) {
    console.error("Error reanalyzing report:", error);
    return { success: false, error: error.message };
  }
};
//downloadPdfapi
export const downloadPdf = async () => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/report/download-pdf`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error("Failed to download the report");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "report.pdf");
    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading the report:", error);
  }
};

//filemanager api
export const fetchFiles = async (folderId = "root") => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_BACKEND_URL}/api/file-manager/files?folderId=${folderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        credentials: "include",
      }
    );
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
};
