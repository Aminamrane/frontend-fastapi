import type { AppProps } from "next/app";
import { AuthProvider } from "../context/AuthContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ backgroundColor: "#2563EB", minHeight: "100vh" }}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </div>
  );
}