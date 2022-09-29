import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import type { AppProps } from "next/app";
import { NextUIProvider } from "@nextui-org/react";
import AppContextProvider from "../features/AppContext";
import LoadingOverlay from "../features/common/LoadingOverlay";
import MainLayout from "../features/common/MainLayout";
import { ToastContainer } from "react-toastify";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <AppContextProvider>
        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
        <ToastContainer />
        <LoadingOverlay />
      </AppContextProvider>
    </NextUIProvider>
  );
}

export default MyApp;
