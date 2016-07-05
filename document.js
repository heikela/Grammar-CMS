// Document and element classes
export class Element {
  updatedAt(path, updateFn) {
    if (path.length !== 0) {
      throw 'A basic element does not have sub-elements to update';
    } else {
      return updateFn(this); // This means that it's the responsibility of the update function to maintain the same element type.
    }
  }
}

class CompositeElement extends Element {
  updatedAt(path, updateFn) {
    if (path.length === 0) {
      return updateFn(this);
    } else {
      const currentKey = path[0];
      return this.updateElement(currentKey, this.elements[currentKey].updatedAt(path.slice(1), updateFn));
    }
  }
}

export class SequenceElement extends CompositeElement {
  constructor(keys, elements) {
    super();
    this.keys = keys;
    this.elements = elements;
  }

  get type() {
    return 'SEQUENCE';
  }

  updateElement(key, updated) {
    return new SequenceElement(
      this.keys,
      {
        ...this.elements,
        [key]: updated
      }
    );
  }

  objectForJson() {
    var result = {};
    for (const key of this.keys) {
      result[key] = this.elements[key].objectForJson();
    }
    return result;
  }
}

export class RepetitionElement extends CompositeElement {
  constructor(typeToRepeat, elements = []) {
    super();
    this.typeToRepeat = typeToRepeat;
    this.elements = elements;
  }

  updateElement(key, updated) {
    return new RepetitionElement(
      this.typeToRepeat,
      [
        ...this.elements.slice(0, key),
        updated,
        ...this.elements.slice(key + 1)
      ]
    );
  }

  addNewElement(grammar) {
    return new RepetitionElement(
      this.typeToRepeat,
      [
        ...this.elements,
        grammar.expandTerm(this.typeToRepeat)
      ]
    );
  }

  removeElement(index) {
    return new RepetitionElement(
      this.typeToRepeat,
      [
        ...this.elements.slice(0, index),
        ...this.elements.slice(index + 1)
      ]
    );
  }

  get type() {
    return 'REPETITION';
  }

  objectForJson() {
    return this.elements.map((e) => e.objectForJson());
  }

}

export class StringElement extends Element {
  constructor(value = '') {
    super();
    this.value = value;
  }

  get type() {
    return 'STRING';
  }

  updated(updatedValue) {
    return new StringElement(updatedValue);
  }

  objectForJson() {
    return this.value;
  }
}

export class MultiLineTextElement extends Element {
  constructor(value = '') {
    super();
    this.value = value;
    this.type = 'MULTILINE_TEXT';
  }

  updated(updatedValue) {
    return new MultiLineTextElement(updatedValue);
  }

  objectForJson() {
    return {
      type: 'MULTILINE_TEXT',
      value: this.value
    };
  }
}

export class IncompleteChoiceElement extends Element {
  constructor(alternateExpansions) {
    super();
    this.alternateExpansions = alternateExpansions;
  }

  selectExpansion(grammar, selected) {
    return grammar.expandTerm(selected);
  }

  get type() {
    return 'INCOMPLETE_CHOICE';
  }

  objectForJson() {
    return 'incomplete_choice';
  }
}

export const addToRepetition = (grammar, document, path) => {
  return document.updatedAt(path, (doc) => {
    return doc.addNewElement(grammar); // Would it be better for diagnostics to explicitly check the type?
  });
};

export const selectExpansion = (grammar, document, path, selected) => {
  return document.updatedAt(path, (doc) => {
    return doc.selectExpansion(grammar, selected);
  });
};

export const updateString = (document, path, updatedValue) => {
  return document.updatedAt(path, (doc) => {
    return doc.updated(updatedValue);
  });
};

export const removeFromRepetition = (document, path) => {
  if (path.length === 0) {
    throw 'cannot remove the document root';
  }
  return document.updatedAt(path.slice(0, path.length - 1), (doc) => {
    return doc.removeElement(path[path.length - 1]);
  });
};
