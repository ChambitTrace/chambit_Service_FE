import React, { useRef, useState } from "react";
import "./TestPageStyle.css";
import Topbar from "./topbar/Topbar";
import { useNavigate } from "react-router-dom";

interface TestPageProps {
  title?: string;
  description?: string;
  color?: string;
}

const TestPage: React.FC<TestPageProps> = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const navigate = useNavigate();

  return (
    <section ref={ref} className="section-wrapper">
      <Topbar />
      <video
        className="background-vid"
        src="/cyber.mp4"
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlayThrough={(e) => {
          const video = e.currentTarget;
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                setVideoLoaded(true);
              })
              .catch((error) => {
                console.error("Video failed to play automatically:", error);
              });
          } else {
            setVideoLoaded(true);
          }
        }}
      />
      <div className="blackcurtain" />
      {videoLoaded && (
        <div className="contents-wrapper">
          {/* <div className="svg-box">
            <img
              className="image"
              src="/svg/hspace-logo-edited.svg"
              alt="hspace logo"
            />
          </div> */}
          <h1 style={{ color: "#fff", margin: 0 }}>
            안녕하세요 <strong>참빛</strong>입니다.
          </h1>
          <button
            className="letstart-button"
            onClick={() => navigate("/dashboard")}
          >
            대시보드로 이동하기
          </button>
        </div>
      )}
    </section>
  );
};

export default TestPage;
