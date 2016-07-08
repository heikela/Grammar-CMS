import {
  Grammar,
  SequenceExpansion
} from './grammar';

export const gameGrammar = new Grammar(
  {
    root: new SequenceExpansion(['title', 'players'])
  }
);
