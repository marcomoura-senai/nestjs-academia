export function removeAccents(content: string): string {
  return content.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}
