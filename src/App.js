import React from 'react';
import { connect } from 'react-redux';
import QuestionList from './components/QuestionList';

const App = ({test})=> (
    <div>
        <h1>
            Isomorphic React {test}
        </h1>
        <div>
             <QuestionList/>
        </div>
    </div>
)
const mapStateToProps=(state, props) => {
    console.log('--state',state)
      return {
          ...state
      }
}
export default connect(mapStateToProps)(App);