import { createContext, useState, useContext } from "react";

const UploadRefreshContext = createContext({
  needsRefresh: false,
  setNeedsRefresh: () => {},
});

export const UploadRefreshProvider = ({ children }) => {
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Debug state changes
  const handleRefreshChange = (newValue) => {
    console.log(`🔄 Upload refresh state changing to: ${newValue}`);
    setNeedsRefresh(newValue);
  };

  return (
    <UploadRefreshContext.Provider
      value={{
        needsRefresh,
        setNeedsRefresh: handleRefreshChange,
      }}
    >
      {children}
    </UploadRefreshContext.Provider>
  );
};

// Custom hook for easier context usage
export const useUploadRefresh = () => {
  const context = useContext(UploadRefreshContext);
  if (!context) {
    throw new Error("useUploadRefresh must be used within an UploadRefreshProvider");
  }
  return context;
};

export default UploadRefreshContext;
