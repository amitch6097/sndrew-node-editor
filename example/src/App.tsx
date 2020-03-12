import React from 'react';
import { Editor } from './reactComponentLib';

function Node(props: any) {
  return (
    <div
      style={{
        background: 'teal',
        width: '100px',
        height: '100px',
        borderRadius: '50px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
      }}
    >
      {props.id}
    </div>
  );
}

const nodes = {
  '1': {
    id: '1',
  },
  '2a': {
    id: '2a',
  },
  '2b': {
    id: '2b',
  },
  '3a': {
    id: '3a',
  },
  '3b': {
    id: '3b',
  },
  '3c': {
    id: '3c',
  },
  '3d': {
    id: '3d',
  },
  '4a': {
    id: '4a',
  },
};

const children = {
  '1': ['2a', '2b'],
  '2a': ['3a'],
  '2b': ['3b', '3c', '3d'],
  '3a': ['1'],
  '3b': ['1'],
  '3c': ['4a'],
  '3d': [],
  '4a': ['1'],
};

export default function App() {
  return (
    <div className="App">
      <Editor headNodeIds={['1']} Node={Node} childNodes={children} nodes={nodes} />
    </div>
  );
}
