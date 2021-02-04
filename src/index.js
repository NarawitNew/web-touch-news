import ContextProider from './context';
import React from 'react';
import ReactDOM from 'react-dom';
import Root from './Root';
import { from } from 'form-data';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  // <React.StrictMode>
  <ContextProider>
    <Root/>
  </ContextProider>
  // </React.StrictMode>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
