export = SndrewEditor;
export as namespace SndrewEditor;

declare namespace SndrewEditor {
    interface INode {
        id: string;
        children: INode[];
        parents: INode[];
    }

    interface ILink {
        to: string;
        from: string;
        paths: string[];
    }

    interface IPoint {
        x: number;
        y: number;
    }
}
