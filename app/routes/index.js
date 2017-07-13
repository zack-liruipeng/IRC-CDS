'use strict';

const router = require('express').Router();

const helper = require('../helpers');
const passport = require('passport');
const config = require('../config');

module.exports = () => {
    let routes = {
        'get': {
            '/': (req, res, next) => {
                res.render('login');
            },
            /*
            configure later for the mode, private chat
            */
            //secure the routes
            '/rooms': [helper.isAuthenticated, (req, res, next) => {
                res.render('rooms', {
                    user: req.user,
                    host: config.host
                });
            }],
            '/chat/:id': [helper.isAuthenticated, (req, res, next) => {
                //find a chatroom with the given id
                //render it if the id is found
                let getRoom = helper.findRoomById(req.app.locals.chatrooms, req.params.id);
                if (getRoom === undefined) {
                    return next();
                } else {
                    res.render('chatroom', {
                        user: req.user,
                        host: config.host,
                        room: getRoom.room,
                        roomID: getRoom.roomID
                    });
                }
            }],
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
                successRedirect: '/rooms',
                failureRedirect: '/'
            }),
            '/auth/twitter': passport.authenticate('twitter'),
            '/auth/twitter/callback': passport.authenticate('twitter', {
                successRedirect: '/rooms',
                failureRedirect: '/'
            }),
            '/logout': (req, res, next) => {
                req.logout();
                res.redirect('/');
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