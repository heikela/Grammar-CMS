// @flow
let idSeq = 1;

export const genId = (base: string): string => {
  const paddedNum = '000000000' + idSeq;
  const num = paddedNum.substr(paddedNum.length - 10);
  idSeq++;
  return base + num;
};
