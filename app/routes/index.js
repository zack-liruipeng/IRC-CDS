const router = require('express').Router();

const helper = require('../helpers');
const passport = require('passport');

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
                res.render('rooms', {
                    user: req.user
                });
            },
            '/chat': (req, res, next) => {
                res.render('chatroom');
            },
            //demo for the session
            '/getsession': (req, res, next) => {
                res.send('My favorite color: ' + req.session.favColor);
            },
            '/setsession': (req, res, next) => {
                req.session.favColor = 'red';
                res.send('color set');
            },
            //auth
            '/auth/facebook': passport.authenticate('facebook'),
            '/auth/facebook/callback': passport.authenticate('facebook', {
                successRedirect:'/rooms',
                failureRedirect:'/'
            })
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