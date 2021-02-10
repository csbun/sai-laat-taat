function classCase(str: string) {
  return str.replace(
    /\w\S*/g,
    function(txt) {
      const s = txt.trim();
      return s.charAt(0).toUpperCase() + s.substr(1).toLowerCase();
    }
  );
}


export default class App {
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
    return this.unmount()
      .then(() => this._loadAndCallFunctionToElement(this.mountFunctionName, element))
      .then(() => this._element = element);
  }

  async unmount(): Promise<any> {
    if (this._element) {
      return this._loadAndCallFunctionToElement(this.unmountFunctionName, this._element)
        .then(this._element = null);
    }
    return Promise.resolve();
  }
}