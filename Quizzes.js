import {
  SequenceExpansion,
  RepeatExpansion,
  AlternativesExpansion,
  MultiLineTextExpansion,
  Grammar
} from './grammar';

import { DocumentType } from './DocumentType';

import { ImageTerm } from './CloudinaryImage';

var _quizzes = null;

export const quizzes = () => {
  if (!_quizzes) {
    throw new Error('Trying to use the Quizzes document type before initialising it');
  } else {
    return _quizzes;
  }
}

export const initQuizzes = (firebaseForCourses, store) => {
  _quizzes = new DocumentType(
    new Grammar(
      {
        root: new SequenceExpansion(['title', 'modules']),
        modules: new RepeatExpansion(['module']),
        module: new SequenceExpansion(['title', 'steps', 'completion']),
        steps: new RepeatExpansion(['step']),
        step: new SequenceExpansion(['title', 'activities']),
        activities: new RepeatExpansion(['activity']),
        activity: new AlternativesExpansion(
          [
            'introduction',
            'video',
            'quiz',
            'text',
            'completion'
          ]
        ),
        quiz: new SequenceExpansion(['optionalIntroScreenText', 'questions']),
        optionalIntroScreenText: new RepeatExpansion(['introScreenText']),
        introScreenText: new MultiLineTextExpansion(),
        text: new MultiLineTextExpansion(),
        completion: new MultiLineTextExpansion(),
        introduction: new MultiLineTextExpansion(),
        video: new SequenceExpansion(['introScreenText', 'videoAsset']),
        videoAsset: new ImageTerm(),
        questions: new RepeatExpansion('question'),
        question: new AlternativesExpansion([
          'openQuestion',
          'multipleChoiceQuestion'
        ]),
        openQuestion: new SequenceExpansion(['questionPrompt', 'answer', 'feedback']),
        multipleChoiceQuestion: new SequenceExpansion(['questionPrompt', 'answerChoices']),
        answerChoices: new RepeatExpansion('answerOption'),
        answerOption: new SequenceExpansion(['answer', 'correctOrNot', 'feedback'])
      }
    ),
    firebaseForCourses,
    store
  );
}
