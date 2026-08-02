import { useReceiptScanPendingImageStore } from './useReceiptScanPendingImageStore';

describe('useReceiptScanPendingImageStore', () => {
  beforeEach(() => {
    useReceiptScanPendingImageStore.setState({ pendingImage: null });
  });

  it('starts with no pending image', () => {
    expect(useReceiptScanPendingImageStore.getState().pendingImage).toBeNull();
  });

  it('setPendingImage stores the image', () => {
    useReceiptScanPendingImageStore
      .getState()
      .setPendingImage({ uri: 'file:///receipt.jpg' });
    expect(useReceiptScanPendingImageStore.getState().pendingImage).toEqual({
      uri: 'file:///receipt.jpg',
    });
  });

  it('setPendingImage(null) clears the image', () => {
    useReceiptScanPendingImageStore
      .getState()
      .setPendingImage({ uri: 'file:///receipt.jpg' });
    useReceiptScanPendingImageStore.getState().setPendingImage(null);
    expect(useReceiptScanPendingImageStore.getState().pendingImage).toBeNull();
  });

  it('clear() removes the pending image', () => {
    useReceiptScanPendingImageStore
      .getState()
      .setPendingImage({ uri: 'file:///receipt.jpg' });
    useReceiptScanPendingImageStore.getState().clear();
    expect(useReceiptScanPendingImageStore.getState().pendingImage).toBeNull();
  });
});
