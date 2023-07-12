const express = require('express');
const cors = require('cors');


module.exports = (app) => {
      // Middleware for parsing JSON request bodies
      app.use(express.json());
      // Middleware for parsing URL-encoded request bodies
      app.use(express.urlencoded({ extended: true }));
      // CORS middleware to allow cross-origin requests from all origins
      app.use(
            cors({
                  'Access-Control-Allow-Origin': '*',
            })
      );
};
