function chave(slug: string) {
  return `zc:token:${slug}`;
}

export function getToken(slug: string): string | null {
  return localStorage.getItem(chave(slug));
}

export function setToken(slug: string, token: string): void {
  localStorage.setItem(chave(slug), token);
}

export function clearToken(slug: string): void {
  localStorage.removeItem(chave(slug));
}
