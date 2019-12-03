import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Home from './pages/home';
import Landing from './pages/landing';
import Configuration from './pages/configuration';


function App(props: any) {
  return (
    <Router>
      <Switch>
        <Route path='/' >
          <Landing />
        </Route>
        <Route path='/home' >
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
