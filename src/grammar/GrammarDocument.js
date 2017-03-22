// @flow

import Grammar from './Grammar';
import Sequence from './sequence/Sequence';
import Repetition from './repetition/Repetition';
import Alternatives from './alternatives/Alternatives';
import TextField from './textField/TextField';
import Constant from './constant/Constant';

// A grammar for a document that defines a grammar
const g = new Grammar();
g.registerExpansionType(Sequence.expansionType);
g.registerExpansionType(Repetition.expansionType);
g.registerExpansionType(Alternatives.expansionType);
g.registerExpansionType(TextField.expansionType);
g.registerExpansionType(Constant.expansionType);
g.setExpansion('root', Alternatives.typeTag, [
  'sequence',
  'repetition',
  'alternatives',
  'textField',
  'constant',
]);
g.setExpansion('term', Alternatives.typeTag, [
  'sequence',
  'repetition',
  'alternatives',
  'textField',
  'constant',
]);
g.setExpansion('sequence', Repetition.typeTag, 'expansion');
g.setExpansion('expansion', Sequence.typeTag, ['termName', 'term']);
g.setExpansion('repetition', Sequence.typeTag, ['expansion']);
g.setExpansion('termName', TextField.typeTag, '');
g.setExpansion('alternatives', Repetition.typeTag, 'expansion');
g.setExpansion('textField', Constant.typeTag, '_textField');
g.setExpansion('constant', Sequence.typeTag, ['value']);
g.setExpansion('value', TextField.typeTag, '');

export default g;

import type { document } from '../DocumentEditor/DocumentEditorState';
import { ROOT_ELEMENT_ID } from '../DocumentEditor/DocumentEditorState';

const getElementWithType = (
  document: document,
  id: string,
  typeTag: string,
) => {
  const element = document.get(id);
  if (element.typeTag !== typeTag) {
    throw new Error(
      'expected element with ID: ' +
        id +
        ' to be of type: ' +
        typeTag +
        '. Found ' +
        element.typeTag +
        ' instead.',
    );
  }
  return element;
};

import { List, Set } from 'immutable';

type expansionEntry = {
  termName: string,
  termElementId: string,
};

const getExpansionEntry = (
  document: document,
  expansionElementId: string,
): expansionEntry => {
  const expansionElement = getElementWithType(
    document,
    expansionElementId,
    Sequence.typeTag,
  ); //: SequenceElementType, @TODO getting this to be typed correctly would require major changes
  const data = expansionElement.data;
  const termNameElementId = data.childElementIds.get('termName');
  const termNameElement = getElementWithType(
    document,
    termNameElementId,
    TextField.typeTag,
  );
  const termElementId = data.childElementIds.get('term');
  return {
    termName: termNameElement.data.value,
    termElementId: termElementId,
  };
};

const addTermToGrammarAndReturnEntriesForNewTerms = (
  grammar,
  document: document,
  expansionEntry: expansionEntry,
): Array<expansionEntry> => {
  const termName = expansionEntry.termName;
  const term = getElementWithType(
    document,
    expansionEntry.termElementId,
    Alternatives.typeTag,
  );
  const selectedAlternative = term.data.selectedAlternative;
  const expansionElementId = selectedAlternative.childElementId;
  switch (selectedAlternative.chosenAlternative) {
    case 'repetition': {
      const repetitionElement = getElementWithType(
        document,
        expansionElementId,
        Sequence.typeTag,
      );
      const termToRepeatElementId = repetitionElement.data.childElementIds.get(
        'expansion',
      );
      const termToRepeat = getExpansionEntry(document, termToRepeatElementId);
      grammar.setExpansion(termName, Repetition.typeTag, termToRepeat.termName);
      return [termToRepeat];
    }
    case 'sequence': {
      const sequenceElement = getElementWithType(
        document,
        expansionElementId,
        Repetition.typeTag,
      );
      const data = sequenceElement.data;
      const childElementIds = data.childElementIds;
      const sequenceTerms = childElementIds.map(id =>
        getExpansionEntry(document, id));
      grammar.setExpansion(
        termName,
        Sequence.typeTag,
        sequenceTerms.map(term => term.termName),
      );
      return sequenceTerms;
    }
    case 'alternatives': {
      const alternativesElement = getElementWithType(
        document,
        expansionElementId,
        Repetition.typeTag,
      );
      const data = alternativesElement.data;
      const childElementIds = data.childElementIds;
      const alternativeTerms = childElementIds.map(id =>
        getExpansionEntry(document, id));
      grammar.setExpansion(
        termName,
        Alternatives.typeTag,
        alternativeTerms.map(term => term.termName),
      );
      return alternativeTerms;
    }
    case 'textField': {
      grammar.setExpansion(termName, TextField.typeTag);
      return [];
    }
    case 'constant': {
      const constantElement = getElementWithType(
        document,
        expansionElementId,
        Sequence.typeTag,
      );
      const valueElement = getElementWithType(
        document,
        constantElement.data.childElementIds.get('value'),
        TextField.typeTag,
      );
      const value = valueElement.data.value;
      grammar.setExpansion(termName, Constant.typeTag, value);
      return [];
    }
    default:
      console.log('todo');
      return [];
  }
};

export const grammarFromDocument = (document: document): Grammar => {
  const grammar = new Grammar();
  grammar.registerExpansionType(Sequence.expansionType);
  grammar.registerExpansionType(Repetition.expansionType);
  grammar.registerExpansionType(Alternatives.expansionType);
  grammar.registerExpansionType(TextField.expansionType);
  grammar.registerExpansionType(Constant.expansionType);

  let termsToAdd: List<expansionEntry> = List([
    { termName: ROOT_ELEMENT_ID, termElementId: ROOT_ELEMENT_ID },
  ]);
  let termsInGrammar = Set();

  while (termsToAdd.size > 0) {
    const newTerms: List<*> = termsToAdd.flatMap(
      term =>
        addTermToGrammarAndReturnEntriesForNewTerms(grammar, document, term),
    );
    termsInGrammar = termsInGrammar.union(termsToAdd);
    termsToAdd = newTerms.filter(term => !termsInGrammar.contains(term));
  }
  return grammar;
};
