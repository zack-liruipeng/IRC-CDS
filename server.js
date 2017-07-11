const express = require('express');
//first instance
const app = express();
const wetalk = require('./app');
const passport = require('passport');

//configure later for multi-server
app.set('port', process.env.PORT || 3000);
app.use(express.static('public'));
app.set('view engine', 'ejs');

//implement the session
app.use(wetalk.session);

app.use(passport.initialize());
app.use(passport.session());

//router
app.use('/', wetalk.router);

//configure later for multi-server
app.listen(app.get('port'), () => {
    console.log('Wetalk running on the port', app.get('port'));
});
