import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClientProvider } from "@tanstack/react-query";

import App from "../app/App";
import { queryClient } from "../app/lib/queryClient";
import { initializeAnalytics } from "../app/lib/analytics";
import { initializeClarity } from "../app/lib/clarity";

import "../app/styles/globals.css";

initializeAnalytics();
initializeClarity();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </HelmetProvider>
  </React.StrictMode>
);