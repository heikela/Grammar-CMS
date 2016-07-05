export const NO_IMAGE = 'no_image';

import { Element } from './document';

export class ImageElement extends Element {
  constructor(url = NO_IMAGE, width = 0, height = 0) {
    super();
    this.url = url;
    this.width = width;
    this.height = height;
  }

  objectForJson() {
    return {
      url: this.url,
      width: this.width,
      height: this.height
    };
  }

  updateUrlAndSize(url, width, height) {
    return new ImageElement(url, width, height);
  }

  get type() {
    return 'IMAGE';
  }
}

export class ImageTerm {
  expand(/*grammar*/) {
    return new ImageElement();
  }

  toString() {
    return 'image';
  }
}

export const updateImage = (element, path, url, width, height) => {
  return element.updatedAt(path, (el) => {
    return el.updateUrlAndSize(url, width, height);
  });
};
