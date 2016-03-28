export const initDocument = () => {
  return {
    type: 'SEQUENCE',
    elements: [
      {
        fieldName: 'title',
        type: 'STRING',
        value: '',
      },
      {
        fieldName: 'questions',
        type: 'REPETITION',
        value: []
      }
    ]
  };
}

const stringPlaceholder = () => { return null; }
