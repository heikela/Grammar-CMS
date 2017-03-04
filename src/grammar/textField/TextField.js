// @flow
import { TextFieldData } from './TextFieldData';
import { idForElement, makeElement } from '../Grammar';

export const textFieldTypeTag = 'TEXT_FIELD';

const TextField = {
  expansionType: {
    typeTag: textFieldTypeTag,
    initialiser: (rootElementId: string, value: string) => [
      idForElement(
        rootElementId,
        makeElement(textFieldTypeTag, new TextFieldData(value)),
      ),
    ],
  },
  typeTag: textFieldTypeTag,
};

export default TextField;
