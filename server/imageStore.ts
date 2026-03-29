const imageStore = new Map<string, { data: Buffer; mimeType: string }>();

export function setImage(productId: string, data: Buffer, mimeType: string) {
  imageStore.set(productId, { data, mimeType });
}

export function getImage(productId: string) {
  return imageStore.get(productId);
}

export function deleteImage(productId: string) {
  imageStore.delete(productId);
}

export function hasImage(productId: string): boolean {
  return imageStore.has(productId);
}
