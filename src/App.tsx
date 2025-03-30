import { ThemeProvider } from "styled-components";
import MainPage from "./pages/MainPage";
import GlobalStyle from "./styles/GlobalStyle";
import { theme } from "./styles/theme";
import { BrowserRouter } from "react-router-dom";
import Router from "./Router";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <GlobalStyle />
        <Router />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
