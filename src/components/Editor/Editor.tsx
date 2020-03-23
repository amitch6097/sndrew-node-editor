import * as React from 'react';
import './Editor.css';

import SVGLayer from '../SVGLayer/SVGLayer';
import Tree from '../Tree/Tree';
import withDrag from '../../hoc/withDrag';
import * as EditorHelpers from '../../lib/Editor.helpers';

interface IEditorProps {
    Node: React.ComponentClass<any>;
    nodes: Record<string, SndrewEditor.INode>;
    headNodeIds: string[];
    childNodes: Record<string, string[]>;
    currentPosition?: {
        x: number;
        y: number;
    };
    zoom?: number;
    controlled?: boolean;
    onZoom?: (nextZoom: number) => void;
    onPan?: (nextPosition: { x: number; y: number }) => void;
    onDragContainerMouseDown?: (e: any) => void;
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
        const { nodes, childNodes, headNodeIds } = this.props;
        const zoom = this.getZoom();
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
        this.setZoom(value);
    };

    setZoom = (zoom: number) => {
        const lastZoom = this.getZoom();
        const nextZoom = lastZoom + zoom;
        const nextZoomSafe = nextZoom < MIN_ZOOM ? MIN_ZOOM : nextZoom > MAX_ZOOM ? MAX_ZOOM : nextZoom;

        if (this.props.controlled && this.props.onZoom) {
            this.props.onZoom(nextZoomSafe);
        } else {
            this.setState({
                zoom: nextZoomSafe,
            });
        }
    };

    getZoom = () => {
        const { zoom: zoomState } = this.state;
        const { controlled, zoom: zoomProp } = this.props;
        const zoom = (controlled && zoomProp) || zoomState;
        return zoom < MIN_ZOOM ? MIN_ZOOM : zoom > MAX_ZOOM ? MAX_ZOOM : zoom;
    };

    render() {
        const { links } = this.state;
        const {
            currentPosition = { x: 0, y: 0 },
            onDragContainerMouseDown,
            Node,
            onPathClicked,
            headNodeIds,
        } = this.props;
        const { x, y } = currentPosition;

        const zoom = this.getZoom();
        return (
            <div
                id="editor"
                className="editor"
                onMouseDown={onDragContainerMouseDown}
                onWheel={e => {
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
