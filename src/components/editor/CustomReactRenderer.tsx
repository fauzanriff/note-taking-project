import React from 'react';
import { createRoot } from 'react-dom/client';

export class CustomReactRenderer {
  private reactElement: React.ReactElement;
  private domElement: HTMLElement;
  private contentElement: HTMLElement;
  private root: ReturnType<typeof createRoot>;

  constructor(
    component: React.ComponentType<Record<string, unknown>>,
    props: Record<string, unknown>
  ) {
    this.contentElement = document.createElement('div');
    this.domElement = document.createElement('div');
    this.domElement.appendChild(this.contentElement);
    this.reactElement = React.createElement(component, props);
    this.root = createRoot(this.contentElement);
    this.render();
  }

  updateProps(props: Record<string, unknown>) {
    this.reactElement = React.createElement(this.reactElement.type, props);
    this.render();
  }

  render() {
    this.root.render(this.reactElement);
  }

  destroy() {
    if (this.domElement.parentNode) {
      this.root.unmount();
      this.domElement.parentNode.removeChild(this.domElement);
    }
  }

  get element() {
    return this.domElement;
  }
}
