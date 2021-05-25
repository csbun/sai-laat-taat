const ELEMENT_PROP_MICRO_APP = 'slt-micro-app';
const ATTR_MICRO_APP_NAME = 'data-slt-micro-app-name';

export default class MicroApp {
  name: string;
  entry: string;
  isLoaded: boolean;
  _isLoading: Promise<any> | null;
  _element: HTMLElement | null;

  constructor(name: string, entry: string) {
    this.name = classCase(name);
    this.entry = entry;
  }

  get mountFunctionName(): string {
    return `sltMount${this.name}`;
  }

  get unmountFunctionName(): string {
    return `sltUnmount${this.name}`;
  }

  async load(): Promise<any> {
    if (this.isLoaded) {
      return Promise.resolve();
    }
    if (!this._isLoading) {
      this._isLoading = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.id = `slt-app-script-${this.name}`;
        script.onload = () => {
          this.isLoaded = true;
          this._isLoading = null;
          resolve(script);
        };
        script.onerror = (e) => {
          this._isLoading = null;
          reject(e);
        };
        script.src = this.entry;
        document.head.appendChild(script);
      });
    }
    return this._isLoading;
  }

  async _loadAndCallFunctionToElement(fn: string, element: HTMLElement) {
    return this.load().then(() => {
      return window[fn](element);
    })
  }

  async mount(element: HTMLElement): Promise<any> {
    if (!element) {
      throw new Error(`element is required for micro-app "${this.name}"`);
    }
    // unmount existing micro-app on element
    if (element[ELEMENT_PROP_MICRO_APP] && element[ELEMENT_PROP_MICRO_APP] instanceof MicroApp) {
      await element[ELEMENT_PROP_MICRO_APP].unmount();
    }
    // call mount function
    await this._loadAndCallFunctionToElement(this.mountFunctionName, element);
    // link micro-app to element
    element[ELEMENT_PROP_MICRO_APP] = this;
  }

  async unmount(): Promise<any> {
    if (this._element) {
      return this._loadAndCallFunctionToElement(this.unmountFunctionName, this._element)
        .then(this._element = null);
    }
    return Promise.resolve();
  }
}