import { createRoot } from "react-dom/client";
import { AuthProvider } from "./hooks/useAuth";
import App from "./App";
import "./index.css";
import { loadDemoData } from "./lib/demoData";

// Initialize demo data for evaluation
loadDemoData();

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

