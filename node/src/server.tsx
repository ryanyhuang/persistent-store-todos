import * as express from 'express';
import * as compression from 'compression';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
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
import { State, reducer } from '../../react/src/reducers'
import App from '../../react/src/components/App'
import * as randomWords from 'random-words'
import * as DispatchDB from '../dispatch_db'

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
app.use(cookieParser());
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
    let boardId = req.cookies.boardId;
    DispatchDB.dispatchActionToDB(boardId, req.body);
    res.json({success: true});
});

// Handles any requests that don't match the ones above
// app.get('*', (req,res) => {
//     res.sendFile(path.join(__dirname+'/../dist-react/index.html'));
// });

app.use('/images', express.static(path.join(__dirname, '../../..', 'dist-react', 'images'), { maxAge: 31557600000 }));
app.use('/libs', express.static(path.join(__dirname, '../../..', 'dist-react', 'libs'), { maxAge: 31557600000 }));
app.use('/static', express.static(path.join(__dirname, '../../..', 'dist-react', 'static'), { maxAge: 31557600000 }));
app.use('/dist-react/static', express.static(path.join(__dirname, '../../..', 'dist-react', 'static'), { maxAge: 31557600000 }));
// app.use('/dist-react/static/js/main.js', (req, res) => res.sendFile(path.join(__dirname, '../../..', "/dist-react/static/js/main.js")));
// app.use('/dist-react/static/js/main.js.map', (req, res) => res.sendFile(path.join(__dirname, '../../..', "/dist-react/static/js/main.js.map")));
// app.use('/dist-react/static/css/main.css', (req, res) => res.sendFile(path.join(__dirname, '../../..', "/dist-react/static/css/main.css")));
// app.get('*', (req, res) => res.sendFile(path.join(__dirname, '../../..', 'dist-react', 'index.html')));

// We are going to fill these out in the sections to follow
async function handleRender(req, res) {
    let boardId = req.cookies.boardId;
    if (boardId === undefined) {
        const randomWordConfig = {
            exactly: 1,
            wordsPerString: 3,
            formatter: (word: string, index: number) => {
                return word.slice(0,1).toUpperCase().concat(word.slice(1));
            },
            separator: '',
        };
        boardId = randomWords(randomWordConfig)[0];

        const newStore = {
            boardInfo: {
                boardId,
            },
            todos: {
                todos: [
                    {
                        id: '10',
                        name: 'complete me!',
                        done: false,
                    },
                ],
            },
        } as State;
        
        console.log(`creating new board: ${boardId}`);
        await DispatchDB.setStateToDB(boardId, newStore);
    }

    const loadedStore = await DispatchDB.getStateFromDB(boardId);

    // Create a new Redux store instance
    const beStore = createStore(reducer, loadedStore);

    // Render the component to a string
    const html = renderToString(
        <Provider store={beStore}>
            <App />
        </Provider>
    );

    // // Grab the initial state from our Redux store
    const preloadedState = beStore.getState()

    // const html = '<div>Hello!</div>';
    // const preloadedState = {todos: {todos: []}};
  
    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState))
}

function renderFullPage(html:string, preloadedState: State) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>SSR Redux Universal Example</title>
                <link rel="stylesheet" type="text/css" href="../dist-react/static/css/main.css">
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
                <script src="../dist-react/static/js/main.js"></script>
            </body>
        </html>
    `;
}

// This is fired every time the server side receives a request
// app.use(handleRender)
app.get('/', handleRender);

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