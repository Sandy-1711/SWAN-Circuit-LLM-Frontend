import { LitElement, html, svg, css } from 'lit';
import { customElement } from 'lit/decorators.js';

export class RelayModule extends LitElement {
  static styles = css`
    svg {
      min-width: 128px;
      max-width: 100%;
      height: auto;
      display: block;
    }
  `;

  render() {
    return html`
    <svg width="128.001" height="58.239" viewBox="0 0 33.867 15.409" xml:space="preserve"  diagramPart="AnonymousModel@/parts/4" class="diagram-part_diagramItem__IbJC1 diagram-part_selectable__qT1rF diagram-part_editMode__6lC9N" id="relay1" data-draggable="true" wokwi-controller="wokwi-relay-module" style="top: -364.6px; left: -278.4px; transform: rotate(0deg); text-rendering: geometricprecision; user-select: none;"><defs><filter id="ledFilter" x="-0.8" y="-0.8" height="2.2" width="2.8"><feGaussianBlur stdDeviation="1"></feGaussianBlur></filter></defs><path fill="#d40000" d="M4.016 0h29.851v15.409H4.016z"></path><path fill="#1989ff" d="M15.439 2.88h12.475v9.939H15.439zM28.599 3.86h3.098v7.941h-3.098z"></path><g transform="translate(-94.511 -113.95)"><circle cx="124.6" cy="121.82" r="0.857" fill="#a8a8a8" stroke="#454545" stroke-width="0.285"></circle><circle cx="124.7" cy="124.36" r="0.857" fill="#a8a8a8" stroke="#454545" stroke-width="0.285"></circle><circle cx="110.89" cy="125.97" r="0.533" fill="#5769f9" stroke="#5359ab" stroke-width="0.177"></circle><ellipse cx="124.6" cy="119.28" rx="0.857" ry="0.858" fill="#a8a8a8" stroke="#454545" stroke-width="0.285"></ellipse></g><g fill="#fff"><text transform="rotate(-90 -104.23 -9.72)" font-size="1.273"><tspan x="-125.8" y="127.5">NO</tspan><tspan x="-123.136" y="127.583">COM</tspan><tspan x="-119.614" y="127.589">NC</tspan></text><text font-size="1.27" transform="translate(-94.511 -113.95)"><tspan x="103.398" y="119.476">VCC</tspan><tspan x="103.398" y="122.016">GND</tspan><tspan x="103.452" y="124.502">IN</tspan></text></g><g clip-rule="evenodd" stroke-linecap="round" stroke-miterlimit="1.5"><g fill-rule="evenodd"><path d="M8.193 11.3V3.737h-2.22V11.3z" fill="#1c2546" stroke="#fff" stroke-linejoin="round" stroke-width="0.238122"></path><g fill="#29261c"><path d="M7.95 5.816V4.082H6.216v1.734zM7.95 8.388V6.654H6.216v1.734zM7.95 10.965V9.231H6.216v1.734z"></path></g><g fill="#9f9f9f"><path d="M7.03 5.33a.38.38 0 0 0 0-.763H.114a.112.112 0 0 0-.112.112v.539c0 .062.05.112.112.112H7.03zM7.03 7.903a.38.38 0 0 0 0-.763H.114a.112.112 0 0 0-.112.112v.539c0 .061.05.112.112.112H7.03zM7.03 10.48a.38.38 0 0 0 0-.763H.114a.112.112 0 0 0-.112.112v.538c0 .062.05.112.112.112H7.03z"></path></g></g><path d="M7.829 14.63h1.977v-2.558H7.829M6.549 14.63H4.572v-2.558h1.977" fill="none" stroke="#fff" stroke-width="0.286"></path><g fill-rule="evenodd"><path fill="#dae3eb" d="M4.982 12.627h4.42v1.46h-4.42z"></path><path fill="#fffefe" d="M6.078 12.576h2.23v1.561h-2.23z"></path><text x="104.815" y="127.671" fill="#fffefe" font-family="ArialMT, Arial, sans-serif" font-size="1.171" transform="translate(-94.511 -113.95)">LED1</text></g><path d="M7.889 3.11h1.977V.551H7.889M6.619 3.11H4.642V.551h1.977" fill="none" stroke="#fff" stroke-width="0.286"></path><g fill-rule="evenodd"><path fill="#dae3eb" d="M5.046 1.097h4.42v1.46h-4.42z"></path><path fill="#fffefe" d="M6.142 1.046h2.23v1.561h-2.23z"></path><text x="104.751" y="116.334" fill="#fffefe" font-family="ArialMT, Arial, sans-serif" font-size="1.171" transform="translate(-94.511 -113.95)">PWR</text></g></g><text x="110.636" y="116.086" fill="#fff" font-size="1.458" stroke="#858585" stroke-width="0.157" xml:space="preserve" transform="translate(-94.511 -113.95)"><tspan x="112.5" y="122" stroke="none" font-size="3.171">Relay </tspan><tspan x="113" y="123.4" stroke="none" letter-spacing="0.1">Module</tspan></text><circle cx="7.1" cy="1.8" r="2.3" fill="#FF355E" filter="url(#ledFilter)" opacity="0"></circle><circle cx="7.1" cy="13.6" r="2.3" fill="lime" filter="url(#ledFilter)" opacity="0"></circle></svg>
    `;
  }
}
if (typeof window !== 'undefined' && !customElements.get('wokwi-relay-module')) {
  customElements.define('wokwi-relay-module', RelayModule);
}
