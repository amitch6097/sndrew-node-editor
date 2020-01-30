import * as React from "react";
import * as SVGLayerHelpers from "../../lib/SVGLayer.helpers";
import "./SVGLayer.scss";

interface SVGLayerProps {
  zoom: number;
  style: object;
  nodes: SndrewEditor.INode[];
  stroke?: string;
}

export default function SVGLayer({
  zoom,
  style,
  stroke = "black",
  nodes
}: SVGLayerProps) {
  const [state, setState] = React.useState(undefined);

  React.useEffect(() => {
    const paths = SVGLayerHelpers.getLinks({
      nodes,
      zoom
    });
    setState(paths);
  }, [nodes]);

  return (
    <svg className="svg-layer" style={style}>
      {state &&
        //@ts-ignore
        state.map(path => {
          return (
            <path
              onClick={console.log}
              key={path}
              d={path}
              stroke={stroke}
              strokeWidth="2"
              fill="none"
            />
          );
        })}
    </svg>
  );
}
