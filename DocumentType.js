/**
 * This class contains the information that defines a particular document type:
 * the grammar and the storage provider.
 *
 * The intention behind separating this class
 * is to make the storage provider pluggable.
 */
export class DocumentType {
  constructor(grammar, storageProvider, store) {
    this.grammar = grammar,
    this.storageProvider = storageProvider,
    this.store = store
  }

  save(document) {
    this.storageProvider.save(document);
  }

  list() {
    this.storageProvider.list((listing) => this.store.dispatch({
      type: 'DOCUMENTS_LISTED',
      listing: listing
    }));
  }

  load(reference) {
    this.storageProvider.load(reference, (document) => this.store.dispatch('DOCUMENT_LOADED', document));
  }
}
