const express = require('express');
const multer = require('multer');

const uploader = multer({
    dest: './profilePhotos/'
})

module.exports = uploader;