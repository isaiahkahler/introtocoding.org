import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Home from './pages/home';
import Landing from './pages/landing';
import Configuration from './pages/configuration';
import Lab from './pages/learning/lab';
import Grades from './pages/grades';
import Learning from './pages/learning';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#3CB3F6",
      contrastText: "#fcfcfc"
    }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
});

function App(props: any) {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route path='/home' >
            <Home />
          </Route>
          <Route path='/grades'>
            <Grades />
          </Route>
          <Route path='/learning'>
            <Learning />
          </Route>
          <Route path='/' >
            <Landing />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
