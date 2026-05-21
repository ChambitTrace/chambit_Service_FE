import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  html {
    background: ${({ theme }) => theme.colors.bg};
  }

  body {
    margin: 0;
    min-width: 320px;
    min-height: 100vh;
    color: ${({ theme }) => theme.colors.text};
    background:
      radial-gradient(circle at top left, rgba(34, 211, 238, 0.12), transparent 30rem),
      linear-gradient(135deg, #071014 0%, #0a1419 44%, #10100c 100%);
    font-family:
      Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
      sans-serif;
  }

  button,
  input {
    font: inherit;
  }

  button {
    cursor: pointer;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  #root {
    min-height: 100vh;
  }
`;
