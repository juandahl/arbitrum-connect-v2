function setItem(key: string, value: any) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getItem<T>(key: string) {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : null;
}

function removeItem(key: string) {
  localStorage.removeItem(key);
}

function clear() {
  localStorage.clear();
}

export default { clear, getItem, removeItem, setItem };
