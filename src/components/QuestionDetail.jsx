// import React from 'react';
// import TagList from './TagList';
// import { connect } from 'react-redux';

// const QuestionDetailDisplay = ({title, body, answer_count, tags})=>(
//     <div>
//          <h3 className="mb-2">
//              {title}
//          </h3>
//          {body ? <div>
//                    <div className="mb-3">
//                       <TagList tags={tags} />
//                    </div>
//                    <Markdown source={body} />
//                    <div>
//                         {answer_count}
//                    </div>
//                  </div> : <div>
//                      <h4>
//                           Loading Questions
//                     </h4>
//                  </div>
//                  }
//     </div>
// );

// const mapStateToProps = (state, ownProps)=({
//     ...state.questions.find(({question_id})=>question_id==ownProps.question_id)
// });

// export default connect(mapStateToProps)(QuestionDetailDisplay);


