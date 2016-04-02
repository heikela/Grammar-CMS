export const NO_IMAGE = 'no_image';

export class ImageTerm {
  expand(grammar) {
    return new ImageElement();
  }

  toString() {
    return 'image';
  }
}

import { Element } from './document';

export class ImageElement extends Element {
  constructor(url = NO_IMAGE, width=0, height=0) {
    super();
    this.url = url;
    this.width = width,
    this.height = height
  }

  objectForJson() {
    return {
      url: this.url,
      width: this.width,
      height: this.height
    }
  }

  updateUrlAndSize(url, width, height) {
    return new ImageElement(url, width, height);
  }

  get type() {
    return 'IMAGE';
  }
}

export const updateImage = (element, path, url, width, height) => {
  return element.updatedAt(path, (element) => {
    return element.updateUrlAndSize(url, width, height);
  });

}
