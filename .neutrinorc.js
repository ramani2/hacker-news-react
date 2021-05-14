const airbnb = require('@neutrinojs/airbnb');
const react = require('@neutrinojs/react');

module.exports = {
  options: {
    root: __dirname,
  },
  use: [
    airbnb(),
    react({
      html: {
        title: 'hacker-news-react'
      },
      devServer: {
        port: 3000
      }
    })
  ]
};
