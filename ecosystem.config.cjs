// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "chambit-fe-dev",
      script: "pnpm",
      args: "run dev --host",
      cwd: "/home/ubuntu/CodeSpace/service/chambit-fe", // 프로젝트 경로
      interpreter: "none", // pnpm은 자체 실행 파일이므로 node가 아님
      env: {
        NODE_ENV: "development",
      },
    },
  ],
};
