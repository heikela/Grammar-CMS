/**
 * This class contains the information that defines a particular document type:
 * the grammar and the storage provider.
 *
 * The intention behind separating this class
 * is to make the storage provider pluggable.
 */
export class DocumentType {
  constructor(grammar, storageProvider) {
    this.grammar = grammar,
    this.storageProvider = storageProvider
  }

  save(document) {
    this.storageProvider.save(document);
  }

  list() {
    return this.storageProvider.list();
  }

  load(reference) {
    return this.storageProvider.load(reference);
  }
}
