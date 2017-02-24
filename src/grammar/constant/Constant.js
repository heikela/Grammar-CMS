// @flow
export const constantTypeTag = 'CONSTANT';

const Constant = {
  expansionType: {
    typeTag: constantTypeTag,
    initialiser: (x: *) => x,
  },
  typeTag: constantTypeTag,
};

export default Constant;
