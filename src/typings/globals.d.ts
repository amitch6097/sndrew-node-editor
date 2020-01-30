export = SndrewEditor;
export as namespace SndrewEditor;

declare namespace SndrewEditor {
  interface INode {
    id: string;
    children: INode[];
    parents: INode[];
  }
}
