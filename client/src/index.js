import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import createBrowserHistory from 'history/createBrowserHistory';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import App from './components/app';
import '../styles/style.css';


injectTapEventPlugin();


// Override font of material ui to Open Sans
// const fontFamily = "'Open Sans', sans-serif";
// const muiTheme = getMuiTheme({ fontFamily });
const muiTheme = getMuiTheme(darkBaseTheme);

// Router
const history = createBrowserHistory();

const Main = () => (
  <MuiThemeProvider muiTheme={muiTheme}>
    <Router history={history}>
      <App />
    </Router>
  </MuiThemeProvider>
);

ReactDOM.render(<Main />, document.querySelector('.container'));
