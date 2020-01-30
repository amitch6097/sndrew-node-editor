interface IGetLinksParams {
  nodes: SndrewEditor.INode[];
  zoom: number;
  container: string;
}

interface IDrawn {
  [nodeId: string]: boolean;
}
type TPaths = Array<SndrewEditor.IPath>;

export function getLinks({ nodes, zoom, container }: IGetLinksParams) {
  if (!nodes) return [];
  let drawn: IDrawn = {};
  let paths: TPaths = [];
  const links = _getLinks({ nodes, paths, zoom, drawn, container });
  return links;
}

function _getLinks({
  nodes,
  paths,
  zoom,
  drawn,
  container
}: IGetLinksParams & { drawn: IDrawn; paths: TPaths }) {
  if (!nodes) return paths;
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (drawn[node.id]) continue;
    else drawn[node.id] = true;
    const recursiveChildrenLinks = _getLinks({
      nodes: node.children,
      paths,
      zoom,
      drawn,
      container
    });

    paths = recursiveChildrenLinks ? [...recursiveChildrenLinks] : paths;
    paths = getLinksForThisNode({ node, paths, zoom, container });
  }
  return paths;
}

function getLinksForThisNode({ node, paths, zoom, container }) {
  const { children } = node;
  if (children) {
    const from = getPositionFrom(container, node.id, zoom);
    for (let j = 0; j < children.length; j++) {
      const subNode = children[j];
      const to = getPositionTo(container, subNode.id, zoom);
      let pathFunction = bezierStringFromTwoPoints;
      if (to && from) {
        if (isToHigherThanFrom({ p1: from, p2: to })) {
          pathFunction = upLink;
        }
        const nextPaths = pathFunction(
          {
            p1: from,
            p2: to
          },
          paths,
          subNode.id, //toId
          node.id, //from id
          zoom
        );
        paths = nextPaths;
      }
    }
  }
  return paths;
}

function adjustParamsToScale(containerElem: any, element: any, scale: number) {
  const parentRect = containerElem.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();
  const adjust = (x, y) => {
    return (x - y) / scale;
  };
  return {
    left: adjust(elementRect.left, parentRect.left),
    top: adjust(elementRect.top, parentRect.top),
    bottom: adjust(elementRect.bottom, parentRect.top),
    right: adjust(elementRect.right, parentRect.left)
  };
}

function getPositionFrom(container: string, id: string, scale: number) {
  const element = document.getElementById(id);
  const containerElem = document.getElementById(container);
  if (!containerElem || !element) return;

  const rect = adjustParamsToScale(containerElem, element, scale);
  const width = Math.abs(rect.right - rect.left);
  const halfWidth = width / 2;
  return (
    rect && {
      x: rect.left + halfWidth,
      y: rect.bottom
    }
  );
}

function getPositionTo(container: string, id: string, scale: number) {
  const element = document.getElementById(id);
  const containerElem = document.getElementById(container);
  if (!containerElem || !element) return;

  const rect = adjustParamsToScale(containerElem, element, scale);
  const width = Math.abs(rect.right - rect.left);
  const halfWidth = width / 2;
  return (
    rect && {
      x: rect.left + halfWidth,
      y: rect.top
    }
  );
}

const withComma = ({ x, y }) => `${x},${y}`;

const bezierString = ({ p1, p2, p3, p4 }): string =>
  `M${withComma(p1)}
      C${withComma(p2)}
      ${withComma(p3)}
      ${withComma(p4)}`;

const bezierFromTwoPoints = ({ p1, p2 }) => {
  const minY = Math.min(p1.y, p2.y);
  const distY = Math.abs(p1.y - p2.y);
  const middleY = minY + distY / 2;

  const newP2Y = { y: middleY, x: p1.x };
  const newP3Y = { y: middleY, x: p2.x };
  return { p1, p2: newP2Y, p3: newP3Y, p4: p2 };
};

const bezierStringFromTwoPoints = (
  points,
  paths: TPaths,
  toId: string,
  fromId: string,
  zoom
): TPaths => {
  const path = bezierString(bezierFromTwoPoints(points));
  if (path) {
    const newPath = {
      to: toId,
      from: fromId,
      paths: [path]
    };
    return [...paths, newPath];
  } else {
    return paths;
  }
};

const isToHigherThanFrom = ({ p1, p2 }): boolean => {
  return p2.y < p1.y;
};

const upLink = (
  { p1, p2 },
  paths: TPaths,
  toId: string,
  fromId: string,
  zoom
): TPaths => {
  const isLeft = p1.x < p2.x;
  const pad = isLeft ? -45 : 45;
  const sweep = isLeft ? 1 : 0;
  const cardSize = isLeft
    ? document.getElementById("editor").getBoundingClientRect().left
    : document.getElementById("editor").getBoundingClientRect().right;
  /**
   * Need to create a component that will own a bunch of these links
   * and handle on hover to highlight them all and give it a key
   */
  const newPath = {
    to: toId,
    from: fromId,
    paths: [
      [
        `M ${p1.x} ${p1.y}`,
        `A 45 45, 0, 0, ${sweep}, ${p1.x + pad} ${p1.y + 45}`
      ].join(""),
      [`M ${p1.x + pad} ${p1.y + 45}`, `L ${cardSize} ${p1.y + 45}`].join(""),
      [
        `M ${cardSize} ${p1.y + 45}`,
        `A 45 45, 0, 0, ${sweep}, ${cardSize + pad} ${p1.y}`
      ].join(""),
      [`M ${cardSize + pad} ${p1.y}`, `L ${cardSize + pad} ${p2.y}`].join(""),
      [
        `M ${cardSize + pad} ${p2.y}`,
        `A 45 45, 0, 0, ${sweep}, ${cardSize} ${p2.y - 45}`
      ].join(""),
      [`M ${cardSize} ${p2.y - 45}`, `L ${p2.x + pad} ${p2.y - 45}`].join(""),
      [
        `M ${p2.x + pad} ${p2.y - 45}`,
        `A 45 45, 0, 0, ${sweep}, ${p2.x} ${p2.y}`
      ].join("")
    ]
  };

  return [...paths, newPath];
};