# sndrew-node-editor

A React Library for creating UI Nodes

[![npm version](https://img.shields.io/npm/v/sndrew-node-editor.svg?style=flat-square)](https://www.npmjs.com/package/sndrew-node-editor)
[![npm downloads](https://img.shields.io/npm/dm/sndrew-node-editor.svg?style=flat-square)](https://www.npmjs.com/package/sndrew-node-editor)

![Imgur Image](https://i.imgur.com/iw4VNsH.png)

### Installation

Make sure you have [Node](https://nodejs.org/)
installed and run:

    npm install sndrew-node-editor
    
### Usage 

Check out my example here on [CodeSandbox](https://codesandbox.io/s/import-sndrew-node-editor-h4mz5)

The sndrew-node-editor library creates a React component for you to use called Editor.  
```ts 
import { Editor } from "sndrew-node-editor";
```

You need to supply Editor with an object describing your graph of nodes in the formate below.

```ts 
interface INode {
  id: string;
  children: INode[]
}
```
Finally you need to describe what a Node should look like, by supplying Editor with a prop Node, a React Component, which will recieve a single INode data.

```ts 
interface IEditorProps {
  Node: React.Component<INode>;
  nodes: INode[];
}
```








