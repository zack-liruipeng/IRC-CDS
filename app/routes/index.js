const router = require('express').Router();

const helper = require('../helpers');

module.exports = () => {
    let routes = {
        'get': {
            '/': (req, res, next) => {
                res.render('login');
            },
            /*
            configure later for the mode, private chat
            */
            '/rooms': (req, res, next) => {
                res.render('rooms');
            },
            '/chat': (req, res, next) => {
                res.render('chatroom');
            }
        },
        'post': {

        },
        'NA': (req, res, next) => {
            // take Current Work Directory
            res.status(404).sendFile(process.cwd() + '/views/404.html');
        }
    }

    return helper.route(routes);
};