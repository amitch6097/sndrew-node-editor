import * as React from "react";

interface ISVGPathProps {
  stroke: string;
  link: SndrewEditor.ILink;
  onClick?: (e) => void;
}

export default function SVGPath({ link, stroke, onClick }: ISVGPathProps) {
  const [hover, setHover] = React.useState(false);
  const { to, from, paths } = link;
  return (
    (paths &&
      paths.map(p => {
        return (
          <path
            onClick={onClick}
            onMouseOver={() => setHover(true)}
            onMouseOut={() => setHover(false)}
            key={p}
            d={p}
            stroke={stroke}
            strokeWidth={hover ? "5" : "2"}
            fill="none"
          />
        );
      })) || <div />
  );
}