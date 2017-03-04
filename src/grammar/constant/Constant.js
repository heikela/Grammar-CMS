// @flow
import { idForElement, makeElement } from '../Grammar';

export const constantTypeTag = 'CONSTANT';

const Constant = {
  expansionType: {
    typeTag: constantTypeTag,
    initialiser: (rootElementId: string, x: *) => [
      idForElement(rootElementId, makeElement(constantTypeTag, x)),
    ],
  },
  typeTag: constantTypeTag,
};

export default Constant;
