// @flow
const constantTypeTag = 'CONSTANT';

const Constant = {
  expansionType: {
    expansionTypeTag: constantTypeTag,
    initialiser: (x: *) => x,
  },
  typeTag: constantTypeTag,
};

export default Constant;
