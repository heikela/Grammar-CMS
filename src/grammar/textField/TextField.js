// @flow
import { TextFieldData } from './TextFieldData';

export const textFieldTypeTag = 'TEXT_FIELD';

const TextField = {
  expansionType: {
    typeTag: textFieldTypeTag,
    initialiser: (value: string) => new TextFieldData(value),
  },
  typeTag: textFieldTypeTag,
};

export default TextField;
