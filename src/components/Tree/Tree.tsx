import * as React from 'react';
import './Tree.css';

interface TreeProps {
    ids: string[];
    nodes: Record<string, SndrewEditor.INode>;
    childNodes: Record<string, string[]>;
    Node: React.ComponentClass<any>;
    headNode?: boolean;
    drawn?: {
        [nodeId: string]: boolean;
    };
}

export default function Tree(props: TreeProps) {
    const { ids, childNodes, nodes, Node, headNode = true, drawn = {} } = props;

    const hasDrawn = (id: string) => {
        return Boolean(drawn[id]);
    };
    const setDrawn = (id: string) => {
        drawn[id] = true;
    };

    return (
        <div className="tree">
            {ids &&
                ids
                    .filter(id => !hasDrawn(id))
                    .map(id => {
                        setDrawn(id);
                        const node = nodes[id];
                        const childIds = childNodes[id].filter(cid => !hasDrawn(cid));
                        return (
                            node && (
                                <div
                                    key={node.id}
                                    id={headNode ? 'tree__node-head-node' : ''}
                                    className="tree__node-container"
                                >
                                    <div id={node.id} className="tree__node-container-node">
                                        <Node {...node} />
                                    </div>
                                    {childIds && childIds.length > 0 && (
                                        <Tree {...props} ids={childIds} headNode={false} drawn={drawn} />
                                    )}
                                </div>
                            )
                        );
                    })}
        </div>
    );
}
