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
import Froala from "./components/Froala.tsx";
import AllArticles from "./pages/AllArticles.tsx";
import { Profile } from "./pages/Profile.tsx";
import ProfileCheckWrapper from "./components/ProfileCheckWrapper.tsx"; // Change: Import wrapper
import { Button } from "./components/ui/button"; // Change: For errorElement
import { ArrowLeft } from "lucide-react"; // Change: For errorElement
import { Link } from "react-router-dom";
import ReactQuillEditor from "./components/ReactQuillEditor.tsx";

const customTheme = darkTheme({
  accentColor: "#00FFD1",
  accentColorForeground: "#000000",
  borderRadius: "large",
  fontStack: "rounded",
});

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    element: <ProfileCheckWrapper />, // Change: Wrap all routes with ProfileCheckWrapper
    errorElement: (
      <>
        {/* <Navbar /> */}
        <div className="min-h-screen flex items-center justify-center text-white">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4 font-display">
              Oops Wrong Page
            </h2>
            <p className="text-gray-400 mb-6 font-display-inter">
              The page you're trying to access doesn't exist.
            </p>
            <Link to={"/"}>
              <Button
                variant="ghost"
                className="text-main hover:text-main/80 font-display-inter"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Go Back Home
              </Button>
            </Link>
          </div>
        </div>
      </>
    ),
    children: [
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
            <div
              className="app-container"
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <ReactQuillEditor />
              {/* <Froala /> */}
            </div>
          </div>
        ),
      },
      {
        path: "/all/articles",
        element: (
          <div className="app-container">
            <AllArticles />
          </div>
        ),
      },
      {
        path: "/post/:id",
        element: (
          <div className="app-container">
            <PostDetail />
          </div>
        ),
      },
      {
        path: "/profile/:username",
        element: (
          <div className="app-container">
            <Profile />
          </div>
        ),
      },
    ],
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
