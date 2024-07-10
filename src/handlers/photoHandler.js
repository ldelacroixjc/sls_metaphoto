'use strict';
const photoService = require('../services/photoService');

const getPhotos = async (event, context, callback) => {
  let response = {
    statusCode: 500,
    body: JSON.stringify({ message: 'Error Internal Server - Handler' }),
  }
  try {
    const result = await photoService.getPhotos(event.queryStringParameters);
    response = {
      statusCode: result.status,
      body: JSON.stringify(result.data)
    }
  } catch (error) {
    response = {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    }
  }
  callback(null, response);
}

module.exports = {
  getPhotos
}