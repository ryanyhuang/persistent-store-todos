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
import * as React from 'react'
import { renderToString } from 'react-dom/server'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
// import { State, reducer } from './reducers'
// import InfoNavbar from './components/InfoNavbar'
// import App from './components/App'
import { State, reducer } from '../../react/src/reducers'
// import InfoNavbar from '../../shared_src/components/InfoNavbar'
import App from '../../react/src/components/App'

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

app.use('/images', express.static(path.join(__dirname, '../../..', 'dist-react', 'images'), { maxAge: 31557600000 }));
app.use('/libs', express.static(path.join(__dirname, '../../..', 'dist-react', 'libs'), { maxAge: 31557600000 }));
app.use('/static', express.static(path.join(__dirname, '../../..', 'dist-react', 'static'), { maxAge: 31557600000 }));
app.use('/css/index.css', (req, res) => res.sendFile(path.join(__dirname, '../../..', 'css', 'index.css')));
app.use('/css/blueprint-icons.css', (req, res) => res.sendFile(path.join(__dirname, '../../..', "node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css")));
app.use('/css/blueprint.css', (req, res) => res.sendFile(path.join(__dirname, '../../..', "node_modules/@blueprintjs/core/lib/css/blueprint.css")));
app.use('/dist-react/static/js/main.42d542fd.js', (req, res) => res.sendFile(path.join(__dirname, '../../..', "/dist-react/static/js/main.42d542fd.js")));
app.use('/css/blueprint-icons.css.map', (req, res) => res.sendFile(path.join(__dirname, '../../..', "node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css.map")));
app.use('/css/blueprint.css.map', (req, res) => res.sendFile(path.join(__dirname, '../../..', "node_modules/@blueprintjs/core/lib/css/blueprint.css.map")));
app.use('/dist-react/static/js/main.42d542fd.js.map', (req, res) => res.sendFile(path.join(__dirname, '../../..', "/dist-react/static/js/main.42d542fd.js.map")));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../..', 'dist-react', 'index.html')));

// We are going to fill these out in the sections to follow
function handleRender(req, res) {
    console.log(req.params.url);
    // Create a new Redux store instance
    const store = createStore(reducer, {
        todos: {
			todos: [
                {
                    id: '10',
                    name: 'task1',
                    done: false,
                },
                {
                    id: '11',
                    name: 'task2',
                    done: true,
                },
                {
                    id: '14',
                    name: 'task5',
                    done: false,
                },
                {
                    id: '15',
                    name: 'task6',
                    done: true,
                },
            ],
		},
    });
  
    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    );

    // // Grab the initial state from our Redux store
    const preloadedState = store.getState()

    // const html = '<div>Hello!</div>';
    // const preloadedState = {todos: {todos: []}};
  
    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState))
}

function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>Redux Universal Example</title>
                <link rel="stylesheet" type="text/css" href="./css/index.css">
            </head>
            <body>
                <div id="root">${html}</div>
                <script>
                    // WARNING: See the following for security issues around embedding JSON in HTML:
                    // http://redux.js.org/recipes/ServerRendering.html#security-considerations
                    window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
                        /</g,
                        '\\u003c'
                    )}
                </script>
                <script src="../dist-react/static/js/main.42d542fd.js"></script>
            </body>
        </html>
    `
}

// This is fired every time the server side receives a request
app.use(handleRender)

// if (process.env.NODE_ENV === 'production') {
// 	app.use('/images', express.static(path.join(__dirname, '../../..', 'dist-react', 'images'), { maxAge: 31557600000 }));
// 	app.use('/libs', express.static(path.join(__dirname, '../../..', 'dist-react', 'libs'), { maxAge: 31557600000 }));
// 	app.use('/static', express.static(path.join(__dirname, '../../..', 'dist-react', 'static'), { maxAge: 31557600000 }));
// 	app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../..', 'dist-react', 'index.html')));
// } else {
// 	app.get('/:url', (req, res) => (res.redirect('http://localhost:3001/' + req.params.url)));
// }

app.use(errorHandler());

app.listen(app.get('port'), () => {
	console.info(chalk.green('Node server compiled succesfully!'));
	console.info('App is running at ' + chalk.bold('http://localhost:' + app.get('port')) + ' in ' + chalk.bold(app.get('env').toUpperCase()) + ' mode');
});

module.exports = app;