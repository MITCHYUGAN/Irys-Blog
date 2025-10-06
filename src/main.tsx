import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Write from "./pages/Write.tsx";
import "@rainbow-me/rainbowkit/styles.css";

import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { config } from "./lib/wagmiConfig.ts";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { PostDetail } from "./components/PostDetail.tsx";
import SimpleMd from "./components/SimpleMd.tsx";
import UserArticles from "./pages/UserArticles.tsx";

const customTheme = darkTheme({
  accentColor: "#00FFD1", // your Irys green/blue
  accentColorForeground: "#000000",
  borderRadius: "large",
  fontStack: "rounded",
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="app-container">
        <App />
      </div>
    ),
  },
  {
    path: "/write",
    element: (
      <div>
        <div className="app-container">
          <Write />
        </div>
        <div  style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
          <SimpleMd />
        </div>
      </div>
    ),
  },
  {
    path: "/me/articles",
    element: <div className="app-container"><UserArticles /></div>,
  },
  {
    path: "/post/:id",
    element: <div className="app-container"><PostDetail /></div>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={customTheme}>
          <RouterProvider router={router} />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
