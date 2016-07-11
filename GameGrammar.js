import {
  Grammar,
  SequenceExpansion,
  RepeatExpansion,
  AlternativesExpansion
} from './grammar';

export const gameGrammar = new Grammar(
  {
    root: new SequenceExpansion(['title', 'players', 'components']),
    components: new RepeatExpansion('component'),
    component: new AlternativesExpansion([
        'grid'
    ]),
    grid: new SequenceExpansion(['title', 'width', 'height'])
  }
);
