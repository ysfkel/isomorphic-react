
import App from './App';
import ReactDom from 'react-dom';
import React from 'react';
import { Provider } from 'react-redux';
import getStore from './getStore';
import { ConnectedRouter } from 'connected-react-router';
import createHistory from 'history/createBrowserHistory';

const history = createHistory();
const initialState = {
    questions:[]
}
const store = getStore(history,initialState);

const fetchDataForLocation =()=> {
    store.dispatch({type: 'REQUEST_FETCH_QUESTIONS'})
}

const render = (_App) => {
    const doc =  document.getElementById('AppContainer');

    ReactDom.render(
        <Provider store={store}>
          <ConnectedRouter history={history} >
              <_App/>
          </ConnectedRouter>
        </Provider>,
        document.getElementById('AppContainer')
    )
}


/**
 * cause render to happen again when a change occurs
 * without causing the whole page reload / api calls
 */
if(module.hot) {
   module.hot.accept('./App', ()=> {
        //reload app
        const NextApp = require('./App').default;
        render(NextApp);
   })
}

store.subscribe(()=>{
    const state = store.getState();
    if(state.questions.length>0) {
        console.info('Mounting app');
        render(App);
    }else {
        console.info('App not yet mounting')
    }
})
 fetchDataForLocation();