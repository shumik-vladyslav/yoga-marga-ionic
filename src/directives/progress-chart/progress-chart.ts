import { Directive, Input, Component } from "@angular/core";

/**
 * Generated class for the ProgressChartDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */

@Component({
  selector: "progress-chart", // Attribute selector
  template: `
<svg viewBox="0 0 36 36" version="1.1" id="Calque_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <radialGradient cx="50%" cy="50%" fx="50%" fy="50%" r="50%" gradientTransform="translate(0.500000,0.500000),rotate(-90.000000),scale(1.000000,0.982161),translate(-0.500000,-0.500000)"
        id="radialGradient-1">
        <stop stop-color="#000000" offset="0%"></stop>
        <stop stop-color="#FFFFFF" offset="100%"></stop>
      </radialGradient>
    </defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
      <circle id="Oval" fill="url(#radialGradient-1)" cx="17.9155" cy="17.9155" r="15.9155"></circle>
      <circle id="Oval-Copy" fill="#FFFFFF" cx="17.9155" cy="17.9155" r="13.9155"></circle>
    </g>

    <path d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
      stroke="#f0f0f2" stroke-width="0.5" [attr.stroke-dasharray]="progress+', 100'" />

    <path d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
      stroke="#81d8d4" stroke-width="0.5" stroke-dasharray="75, 100" />

    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" fill-opacity="0.8" font-family="Helvetica"
      font-weight="normal">
      <text id="52%" font-size="10" fill="#808082" text-anchor="middle" x="17.9155" y="20">
        {{progress}}%
      </text>
      <text id="Выполнено" font-size="3" fill="#95DCD4" text-anchor="middle" x="17.9155" y="26">
        Выполнено
      </text>
    </g>

</svg>
`
})
export class ProgressChartDirective {
  @Input()
  progress: number;
  constructor() {
    console.log("Hello ProgressChartDirective Directive");
  }
}
