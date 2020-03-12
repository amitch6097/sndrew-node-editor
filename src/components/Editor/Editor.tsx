import * as React from 'react';
import './Editor.css';

import SVGLayer from '../SVGLayer/SVGLayer';
import Tree from '../Tree/Tree';
import withDrag from '../../hoc/withDrag';
import * as EditorHelpers from '../../lib/Editor.helpers';

interface IEditorProps {
    currentPosition?: {
        x: number;
        y: number;
    };
    onDragContainerMouseDown?: (e: any) => void;
    Node: React.ComponentClass<any>;
    nodes: Record<string, SndrewEditor.INode>;
    headNodeIds: string[];
    childNodes: Record<string, string[]>;
    onPathClicked?: (link: SndrewEditor.ILink) => void;
}

interface IEditorState {
    zoom: number;
    links: SndrewEditor.ILink[];
}

const MIN_ZOOM = 0.01;
const MAX_ZOOM = 3;
const EDITOR_CONTAINER = 'editor-container-id';

class Editor extends React.Component<IEditorProps, IEditorState> {
    state = {
        links: [],
        zoom: 1,
    };

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
        this.resetPaths();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    componentDidUpdate(prevProps: IEditorProps) {
        if (this.props.nodes !== prevProps.nodes) {
            this.resetPaths();
        }
    }

    onWindowResize = () => {
        this.resetPaths();
    };

    resetPaths = () => {
        const { zoom } = this.state;
        const { nodes, childNodes, headNodeIds } = this.props;
        const links = EditorHelpers.getLinks({
            ids: headNodeIds,
            childNodes,
            nodes,
            zoom,
            container: EDITOR_CONTAINER,
        });
        this.setState({
            links: links,
        });
    };

    onZoom = (value: number) => {
        const { zoom } = this.state;
        const nextZoom = zoom + value;
        this.setState({
            zoom: nextZoom < MIN_ZOOM ? MIN_ZOOM : nextZoom > MAX_ZOOM ? MAX_ZOOM : nextZoom,
        });
    };

    render() {
        const { zoom, links } = this.state;
        const {
            currentPosition = { x: 0, y: 0 },
            onDragContainerMouseDown,
            Node,
            onPathClicked,
            headNodeIds,
        } = this.props;
        const { x, y } = currentPosition;

        return (
            <div
                id="editor"
                className="editor"
                onMouseDown={onDragContainerMouseDown}
                onWheel={e => {
                    // const x = e.deltaX;
                    const y = e.deltaY / 1000;
                    this.onZoom(y);
                }}
            >
                <SVGLayer
                    style={{
                        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
                    }}
                    onPathClicked={onPathClicked}
                    links={links}
                />
                <div
                    id={EDITOR_CONTAINER}
                    className="editor__tree"
                    style={{
                        transform: `translate(${x}px, ${y}px) scale(${zoom})`,
                    }}
                >
                    <Tree {...this.props} ids={headNodeIds} Node={Node} />
                </div>
            </div>
        );
    }
}

export default withDrag(Editor);
