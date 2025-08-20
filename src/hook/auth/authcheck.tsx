import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { tokenStore } from "./auth"; // adjust path if different

export function useAuthCheck() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = tokenStore.getAccessToken();
    if (accessToken) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);
}

export function useRequireAuth() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = tokenStore.getAccessToken();
    if (!accessToken) {
      navigate("/login", { replace: true });
    }
  }, [navigate]);
}
