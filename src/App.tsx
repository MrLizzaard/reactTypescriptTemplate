import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Router from "./Router";
import SessionExpiredBanner from "./components/SessionExpiredBanner";
import GlobalStyle from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import GlobalLoading from "./components/GlobalLoading";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        <GlobalLoading />
        <SessionExpiredBanner />
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
