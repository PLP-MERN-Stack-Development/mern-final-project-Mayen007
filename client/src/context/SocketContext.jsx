import { createContext, useContext, useEffect, useState } from "react";
import { io as ioClient } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    let s = null;

    const connect = () => {
      // Determine socket URL: explicit VITE_SOCKET_URL or fallback to VITE_API_URL or same origin
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_URL ||
        window.location.origin;

      // Prefer sessionStorage token (tab-specific), fallback to localStorage
      const token =
        sessionStorage.getItem("token") ||
        localStorage.getItem("token") ||
        null;

      // Do not force websocket-only transport — allow polling fallback for environments
      // where websockets are blocked (proxies, dev servers, etc.).
      s = ioClient(socketUrl, {
        auth: { token },
        withCredentials: true,
      });

      const onConnect = () => console.debug("Socket connected", s.id);
      const onConnectError = (err) => console.warn("Socket connect error", err);
      const onDisconnect = (reason) =>
        console.debug("Socket disconnected", reason);

      s.on("connect", onConnect);
      s.on("connect_error", onConnectError);
      s.on("disconnect", onDisconnect);

      setSocket(s);
    };

    // Initial connect: probe server health first to avoid immediate ERR_CONNECTION_REFUSED
    let intervalId = null;
    let stopped = false;

    const tryConnect = async () => {
      const socketUrl =
        import.meta.env.VITE_SOCKET_URL ||
        import.meta.env.VITE_API_URL ||
        window.location.origin;

      const healthUrl = `${socketUrl.replace(/\/$/, "")}/api/health`;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        const resp = await fetch(healthUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!resp.ok) throw new Error(`health check failed: ${resp.status}`);

        // Server is reachable — establish socket
        if (!stopped) connect();
        // stop retrying
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
      } catch (err) {
        console.debug(
          `Socket health check failed (${healthUrl}):`,
          err.message
        );
        // keep retrying — if not already scheduled, schedule periodic retry
        if (!intervalId && !stopped) {
          intervalId = setInterval(() => {
            tryConnect();
          }, 5000);
        }
      }
    };

    // Start first attempt
    tryConnect();

    // Reconnect when token in localStorage changes (helps propagate login/logout across tabs)
    const onStorage = (e) => {
      if (e.key === "token") {
        console.debug("Socket: token changed, reconnecting socket");
        try {
          if (s) {
            s.disconnect();
          }
        } catch (err) {
          console.warn("Error disconnecting socket:", err);
        }
        // reset stopped flag and attempt connect (which will probe health)
        stopped = false;
        tryConnect();
      }
    };

    window.addEventListener("storage", onStorage);

    return () => {
      stopped = true;
      window.removeEventListener("storage", onStorage);
      if (intervalId) clearInterval(intervalId);
      try {
        if (s) {
          s.disconnect();
        }
      } catch (err) {
        /* ignore */
      }
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
