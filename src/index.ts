import App from './app';

const cachedApp: { [key: string]: App } = {};

export function registerApp(name: string, entry: string, preload = false) {
  if (name && entry && !cachedApp[name]) {
    cachedApp[name] = new App(name, entry);
    if (preload) {
      cachedApp[name].load();
    }
  }
}

export function mount(element: HTMLElement, name: string): Promise<any> {
  if (cachedApp[name]) {
    return cachedApp[name].mount(element);
  }
}