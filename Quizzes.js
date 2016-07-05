import {
  SequenceExpansion,
  RepeatExpansion,
  AlternativesExpansion,
  MultiLineTextExpansion,
  Grammar
} from './grammar';

import { ImageTerm } from './CloudinaryImage';

export const quizzes = new Grammar(
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
);
