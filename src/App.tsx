import React, { useMemo } from 'react';
import {
  HashRouter as Router,
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
import useMediaQuery from '@material-ui/core/useMediaQuery';

function App(props: any) {

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const theme = useMemo(() => {
    return createMuiTheme(
      {
        palette: {
          type: prefersDarkMode ? 'dark' : 'light',
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
      }
    )
  }, [prefersDarkMode]);

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
