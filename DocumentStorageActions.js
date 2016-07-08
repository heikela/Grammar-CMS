import thenify from 'thenify';

export const loadDocument = (storageProvider, reference) => {
  const p = thenify((ref, callback) => {storageProvider.load(ref, callback);});
  return p(reference).then((document) => {
      return {
        type: 'DOCUMENT_LOADED',
        document: document
      };
    }
  ).catch((e) => {
      return {
        type: 'DOCUMENT_LOAD_FAILED',
        error: e
      };
    }
  );
};

export const saveDocument = (storageProvider, document) => {
  const p = thenify((doc, callback) => {storageProvider.save(doc, callback);});
  return p(document).then(() => {
      return {
        type: 'DOCUMENT_SAVED'
      };
    }
  ).catch(() => {
      return {
        type: 'SAVING_DOCUMENT_FAILED'
      };
    }
  );
};

export const fetchListing = (storageProvider) => {
  const p = thenify((callback) => {storageProvider.list(callback);});
  return p().then((result) => {
      return {
        type: 'DOCUMENTS_LISTED',
        listing: result
      };
    }
  ).catch((e) => {
      return {
        type: 'DOCUMENT_LISTING_FAILED',
        message: e.message
      };
    }
  );
};
