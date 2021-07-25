import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import React, { FunctionComponent } from "react";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#469a88",
    },
    secondary: {
      main: "#375A7F",
    },
  },
  typography: {
    fontFamily: "Montserrat",
  },
});

const WithTheme: FunctionComponent<{}> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export { WithTheme };
