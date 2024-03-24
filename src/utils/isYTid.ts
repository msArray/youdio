export function isYoutubeId(id: string): boolean {
  const re = /^[a-zA-Z0-9_-]{11}$/;
  return re.test(id);
}
