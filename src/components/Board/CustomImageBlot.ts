import Quill from 'quill';

const Embed = Quill.import('blots/block/embed');

interface CustomImageValue {
  id: string;
  url: string;
}

class CustomImageBlot extends Embed {
  static create(value: CustomImageValue) {
    const node = super.create();
    node.setAttribute('src', value.url);
    node.setAttribute('id', value.id);
    return node;
  }

  static value(node: HTMLElement): CustomImageValue {
    return {
      id: node.getAttribute('id') || '',
      url: node.getAttribute('src') || '',
    };
  }
}

CustomImageBlot.blotName = 'customImage';
CustomImageBlot.tagName = 'img';

export default CustomImageBlot;
