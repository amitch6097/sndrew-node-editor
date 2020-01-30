import * as React from "react";
import "./Tree.css";

interface TreeProps {
  nodes: SndrewEditor.INode[];
  Node: React.ComponentClass<any>;
  headNode?: boolean;
  drawn?: {
    [nodeId: string]: boolean;
  };
}

export default function Tree(props: TreeProps) {
  const { nodes, Node, headNode = true, drawn = {} } = props;

  const hasDrawn = (id: string) => {
    return Boolean(drawn[id]);
  };
  const setDrawn = (id: string) => {
    drawn[id] = true;
  };

  return (
    <div className="tree">
      {nodes &&
        nodes
          .filter(node => !hasDrawn(node.id))
          .map(node => {
            setDrawn(node.id);
            const children =
              node.children &&
              node.children.filter(child => !hasDrawn(child.id));
            return (
              node && (
                <div
                  key={node.id}
                  id={headNode ? "tree__node-head-node" : ""}
                  className="tree__node-container"
                >
                  <div id={node.id} className="tree__node-container-node">
                    <Node {...node} />
                  </div>
                  {/* 
                    
                    It would be ineterssting to do an algorithm where you wait to draw
                    a child until all parent refrences have bbeen drawn, have to make sure direct
                    child is not parent
                    
                    */}
                  {children && children.length !== 0 && (
                    <Tree
                      {...props}
                      nodes={children}
                      headNode={false}
                      drawn={drawn}
                    />
                  )}
                </div>
              )
            );
          })}
    </div>
  );
}