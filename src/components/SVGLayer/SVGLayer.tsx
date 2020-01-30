import * as React from "react";
import "./SVGLayer.css";

import SVGPath from "../SVGPath/SVGPath";

interface ISVGLayerProps {
  links: SndrewEditor.ILink[];
  style: object;
  stroke?: string;
  onPathClicked?: (e) => void;
}

interface ISVGLayerState {}

export default class SVGLayer extends React.Component<
  ISVGLayerProps,
  ISVGLayerState
> {
  render() {
    const { stroke = "black", style, onPathClicked, links } = this.props;
    return (
      <svg className="svg-layer" style={style}>
        {links &&
          links.map(link => {
            return (
              <SVGPath
                key={link.to + link.from}
                link={link}
                stroke={stroke}
                onClick={onPathClicked}
              />
            );
          })}
      </svg>
    );
  }
}