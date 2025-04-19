import React from 'react';
import { createPortal, render } from 'react-dom';

export class CustomReactRenderer {
  private reactElement: React.ReactElement;
  private domElement: HTMLElement;
  private contentElement: HTMLElement;

  constructor(
    component: React.ComponentType<any>,
    props: Record<string, any>
  ) {
    this.contentElement = document.createElement('div');
    this.domElement = document.createElement('div');
    this.domElement.appendChild(this.contentElement);
    this.reactElement = React.createElement(component, props);
    this.render();
  }

  updateProps(props: Record<string, any>) {
    this.reactElement = React.createElement(this.reactElement.type, props);
    this.render();
  }

  render() {
    render(this.reactElement, this.contentElement);
  }

  destroy() {
    if (this.domElement.parentNode) {
      this.domElement.parentNode.removeChild(this.domElement);
    }
  }

  get element() {
    return this.domElement;
  }
}
