'use strict';

function validUrl(url) {
    return /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/gi.test(url);
}

function validTypeImage(image) {
    return /(\.(jpg)|\.(png)|\.(jpeg))/gi.test(image);
}

function base64ToNode(buffer) {
    return buffer.toString('base64');
}

function readFileAndConvert(fileName) {
    var fileSystem = require('fs');
    var path = require('path');

    if (fileSystem.statSync(fileName).isFile()) {
        return base64ToNode(fileSystem.readFileSync(path.resolve(fileName)).toString('base64'));
    }
    return null;
}

function isImage(urlOrImage) {
    if (validTypeImage(urlOrImage)) {
        return Promise.resolve(readFileAndConvert(urlOrImage));
    } else {
        return Promise.reject('[*] Occurent some error... [validTypeImage] == false');
    }
}

function imageToBase64Server(urlOrImage) {
    if (validUrl(urlOrImage)) {
        var fetch = require('node-fetch');
        return fetch(urlOrImage).then(function(response) {
            return response.buffer();
        }).then(base64ToNode);
    } else {
        return isImage(urlOrImage);
    }
}

module.exports = imageToBase64Server;