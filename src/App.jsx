import { hot } from 'react-hot-loader';
import React from 'react';
import Story from './Story';
import './App.css';

const message = 'Hacker News';
const App = () => (
  <>
    <div className="App">
      <h1>{message}</h1>
    </div>
    <Story />
  </>
);

export default hot(module)(App);
