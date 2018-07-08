import path from 'path';
import express from 'express';
import webpack from 'webpack';
import yields from 'express-yields';
import fs from 'fs-extra';
import App from '../src/App';
import { delay } from 'redux-saga';
import { renderToString } from 'react-dom/server'
import React from 'react'
import { argv } from 'optimist';
import { questions, question } from '../data/api-real-url';
import { get } from 'request-promise';
import { ConnectedRouter } from 'connected-react-router';
import getStore from '../src/getStore'
import { Provider } from 'react-redux';
import createHistory from 'history/createMemoryHistory';

const port = process.env.PORT || 3000;
const app = express();

const useLiveData = argv.useLiveData === true;
const useServerRender = argv.useServerRender ==="true"

function * getQuestions() {
    let data;
    if(useLiveData) {
        data = yield get(questions, {gzip: true});
    }else {
        data = yield fs.readFile('./data/mock-questions.json','utf-8');
    }
    console.log('use live', useLiveData, argv)
    return JSON.parse(data);
}

function * getQuestion(question_id) {
    let data;
    if(useLiveData) {
        data = yield get(question(question_id), {gzip: true, jsob: true})
    } else {
        const questions = yield getQuestions();
        let question = questions.items.find(q=>q.question_id==question_id);
        question.body = `Mock question body: ${question_id}`;
        data = {
            items: [question]
        }

        return data

    }
}

app.get('/api/questions', function * (req, res){
      
    const data = yield getQuestions();
    yield delay(150);
    res.json(data);
})

app.get('/api/question/:id', function * (req, res){

    const data = yield getQuestion(req.params.id);
    yield delay(150);
    res.json(data);
})

// function * getQ() {
//     yield 1;
//     yield 2;
//     yield 3
//     return 4;
// }


if(process.env.NODE_ENV === 'development') {
    const config = require('../webpack.config.dev.babel').default;
    const compiler =  webpack(config);

    app.use(require('webpack-dev-middleware')(compiler, {
        noInfo: true //reduce console logs
    }));

    app.use(require('webpack-hot-middleware')(compiler))    
}

app.get(['/'], function * (req, res){

    let index =  yield fs.readFile('./public/index.html', 'utf-8');

    const history = createHistory({
        /**
         * By setting initialEntries to the current path, the application will correctly render into the
         * right view when server rendering
         */
        initialEntries: [req.path],
    });

    const initialState = {
        questions:[]
    }

    const questions = yield getQuestions();
    initialState.questions = questions.items;
    /**
     * Create a redux store that will be used only for server-rendering our application (the client will use a different store)
     */
    const store = getStore(history,initialState);
    if(useServerRender) {
        const appRendered=renderToString(
            <Provider store={store}>
              <ConnectedRouter history={history}>
                <App/>
              </ConnectedRouter>
            </Provider>
        );
       index = index.replace(`<%= preloadedApplication %>`, appRendered)
    }else {
        index = index.replace(`<%= preloadedApplication %>`, `Please wait while we load the application`)
    }
  //  const gen = getQ();
    // console.log('value', gen.next().value);
    // console.log('value', gen.next().value);
    // console.log('value', gen.next().value);
    // console.log('value', gen.next().value);
    res.send(index);
});

app.listen(port, '0.0.0.0', ()=> console.info('App listening on ${port}'));


