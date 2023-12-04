import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import * as React from "react";
import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";
import Main from "./pages/main";

import Home from "./pages/homepage";
import Tracks from "./pages/tracks";
import Artists from "./pages/artists";
import Genres from "./pages/genres";
import { AppBar } from "@mui/material";
import ResponsiveAppBar from "./pages/appbar";

//import { createTheme, ThemeProvider, styled } from "@mui/material/styles";
//import { Theme } from "./frontend/pages/theme";
const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

function App() {
  const theme = useTheme();
  const colorMode = React.useContext(ColorModeContext);
  return (
    <div className="App">
      <Router>
        {/* <ResponsiveAppBar /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/main" element={<Main />} />
          <Route path="/tracks" element={<Tracks />} />
          <Route path="/artists" element={<Artists />} />
          <Route path="/genres" element={<Genres />} />
        </Routes>
      </Router>
    </div>
  );
}

export default function ToggleColorMode() {
  const [mode, setMode] = React.useState("light");
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    []
  );

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: "light",
          background: {
            default: "#F3F3F3",
          },
          // lightGreen: "#7FD486",
        },
        typography: {
          fontFamily: "EB Garamond",
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

//export default App;
