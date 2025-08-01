import { LitElement, html, svg, css } from 'lit';
import { customElement } from 'lit/decorators.js';

export class Max7219Matrix extends LitElement {
  static styles = css`
    svg {
      min-width: 340px;
      max-width: 100%;
      height: auto;
      display: block;
    }
  `;

  render() {
    return html`
   <svg width="340.157480319" height="75.590551182" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: block;"><defs><path id="pinl" fill="#c6bf95" d="m26.5-1.44h-26.5a1.44 1.44 0 0 0-1.41 1.44 1.44 1.44 0 0 0 1.41 1.44v0.00195h26.5z"></path><path id="pinr" fill="#c6bf95" d="m-26.5-1.44h26.5a1.44 1.44 0 0 1 1.41 1.44 1.44 1.44 0 0 1-1.41 1.44v0.00195h-26.5z"></path></defs><use xlink:href="#pinl" x="2" y="18.595275590772"></use><use xlink:href="#pinl" x="2" y="28.195275590886"></use><use xlink:href="#pinl" x="2" y="37.795275591"></use><use xlink:href="#pinl" x="2" y="47.39527559111399"></use><use xlink:href="#pinl" x="2" y="56.995275591228"></use><use xlink:href="#pinr" x="338.157480319" y="18.595275590772"></use><use xlink:href="#pinr" x="338.157480319" y="28.195275590886"></use><use xlink:href="#pinr" x="338.157480319" y="37.795275591"></use><use xlink:href="#pinr" x="338.157480319" y="47.39527559111399"></use><use xlink:href="#pinr" x="338.157480319" y="56.995275591228"></use></svg>
    `;
  }
}
if (typeof window !== 'undefined' && !customElements.get('wokwi-max7219-matrix')) {
  customElements.define('wokwi-max7219-matrix', Max7219Matrix);
}
