import * as express from 'express';
import * as compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as logger from 'morgan';
import * as errorHandler from 'errorhandler';
import * as lusca from 'lusca';
import * as dotenv from 'dotenv';
import * as flash from 'express-flash';
import * as path from 'path';
import * as clear from 'clear-console';
import * as chalk from 'chalk';
import expressValidator = require('express-validator');

if (process.env.NODE_ENV !== 'production') {
	dotenv.config({ path: '.env' });
	clear({toStart: true});
	clear({toStart: true});
}

const app = express();

app.set('port', process.env.PORT || 3000);

app.use(compression());
app.use(logger('dev'));
app.use(bodyParser.json());	
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: process.env.SESSION_SECRET
}));
app.use(flash());
app.use(lusca.xframe('SAMEORIGIN'));
app.use(lusca.xssProtection(true));

// An api endpoint that returns a short list of items
app.get('/api/getList', (req, res) => {
    var list = ["item1", "item2", "item3"];
    res.json(list);
    console.log('Sent list of items');
});

app.post('/db_dispatch', (req, res) => {
    console.log(req.body);
    res.json({success: true});
    console.log('posted');
});

// Handles any requests that don't match the ones above
// app.get('*', (req,res) => {
//     res.sendFile(path.join(__dirname+'/../dist-react/index.html'));
// });

app.use('/images', express.static(path.join(__dirname, '..', 'dist-react', 'images'), { maxAge: 31557600000 }));
app.use('/libs', express.static(path.join(__dirname, '..', 'dist-react', 'libs'), { maxAge: 31557600000 }));
app.use('/static', express.static(path.join(__dirname, '..', 'dist-react', 'static'), { maxAge: 31557600000 }));
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist-react', 'index.html')));

// if (process.env.NODE_ENV === 'production') {
// 	app.use('/images', express.static(path.join(__dirname, '..', 'dist-react', 'images'), { maxAge: 31557600000 }));
// 	app.use('/libs', express.static(path.join(__dirname, '..', 'dist-react', 'libs'), { maxAge: 31557600000 }));
// 	app.use('/static', express.static(path.join(__dirname, '..', 'dist-react', 'static'), { maxAge: 31557600000 }));
// 	app.get('*', (req, res) => res.sendFile(path.join(__dirname, '..', 'dist-react', 'index.html')));
// } else {
// 	app.get('/:url', (req, res) => (res.redirect('http://localhost:3001/' + req.params.url)));
// }

app.use(errorHandler());

app.listen(app.get('port'), () => {
	console.info(chalk.green('Node server compiled succesfully!'));
	console.info('App is running at ' + chalk.bold('http://localhost:' + app.get('port')) + ' in ' + chalk.bold(app.get('env').toUpperCase()) + ' mode');
});

module.exports = app;