import { useEffect, useState } from "react";
import { handleOauthCallback } from "../../hook/auth/auth";

export default function OauthCallback() {
  const [status, setStatus] = useState<"pending" | "success" | "error">(
    "pending"
  );
  const [message, setMessage] = useState<string>("OAuth 콜백 처리 중...");

  useEffect(() => {
    (async () => {
      try {
        await handleOauthCallback("google");
        setStatus("success");
        setMessage("로그인 완료! 이동 중...");
        // 성공 시 홈으로 이동 (필요 시 원하는 경로로 변경)
        window.location.replace("/");
      } catch (e) {
        console.error(e);
        setStatus("error");
        setMessage(e instanceof Error ? e.message : "OAuth 처리 실패");
        // 실패 시 로그인 화면으로 이동하거나 메시지만 표시
        // window.location.replace("/login");
      }
    })();
  }, []);

  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h1>OAuth Callback</h1>
      <p>{message}</p>
      {status === "error" && (
        <button onClick={() => (window.location.href = "/login")}>
          로그인으로 돌아가기
        </button>
      )}
    </div>
  );
}
