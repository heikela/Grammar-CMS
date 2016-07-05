import {
  RepetitionElement,
  SequenceElement,
  StringElement,
  MultiLineTextElement,
  IncompleteChoiceElement
} from './document';

import { ImageElement } from './CloudinaryImage';

export const serialize = (document) => document;

export const deSerialize = (document) => {
  if (document.keys !== undefined) {
    var elements = {};
    for (const key of document.keys) {
      elements[key] = deSerialize(document.elements[key]);
    }
    return new SequenceElement(
      document.keys,
      elements
    );
  } else if (document.typeToRepeat !== undefined) {
    const elems = (document.elements !== undefined) ? document.elements.map((e) => deSerialize(e)) : [];
    return new RepetitionElement(document.typeToRepeat, elems);
  } else if (document.url !== undefined) {
    return new ImageElement(document.url, document.width, document.height);
  } else if (document.alternateExpansions !== undefined) {
    return new IncompleteChoiceElement(document.alternateExpansions);
  } else if (document.type === 'MULTILINE_TEXT') {
    return new MultiLineTextElement(document.value);
  } else {
    return new StringElement(document.value);
  }
};
