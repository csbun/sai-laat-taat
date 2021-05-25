import MicroApp from './micro-app';

const cachedMicroApp: { [key: string]: MicroApp } = {};

/**
 * Register micro-app
 * @param name micro-app name
 * @param entry micro-app entry js url
 * @param preload load micro-app once registered
 * @return micro-app
 */
export function registerApp(name: string, entry: string, preload = false): MicroApp {
  if (name && entry && !cachedMicroApp[name]) {
    cachedMicroApp[name] = new MicroApp(name, entry);
    if (preload) {
      cachedMicroApp[name].load();
    }
  }
  return cachedMicroApp[name];
}

/**
 * Mount micro-app to HTML Element
 * @param name registered micro-app name
 * @param element target element
 */
export function mount(name: string, element: HTMLElement): Promise<any> {
  if (cachedMicroApp[name]) {
    return cachedMicroApp[name].mount(element);
  } else {
    return Promise.reject(new Error(`micro-app "${name}" not registered`));
  }
}

/**
 * Unmount micro-app from HTML Element
 * @param name registered micro-app name
 * @param element target element
 */
export function unmount(name: string, element: HTMLElement): Promise<any> {
  if (cachedMicroApp[name]) {
    return cachedMicroApp[name].unmount();
  } else {
    return Promise.reject(new Error(`micro-app "${name}" not registered`));
  }
}

