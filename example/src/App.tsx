import React, { Component } from 'react';
import { Editor } from './reactComponentLib';

function Node(props: any) {
  return (
    <div
      style={{
        background: 'teal',
        width: '100px',
        height: '100px',
        borderRadius: '50px',
      }}
    >
      {props.id}
    </div>
  );
}

export default function App() {
  return (
    <div className="App">
      <Editor
        Node={Node}
        nodes={[
          {
            id: '1',
            children: [
              {
                id: '2a',
                children: [
                  {
                    id: '3a',
                    children: [
                      {
                        id: '1',
                      },
                    ],
                  },
                ],
              },
              {
                id: '2b',
                children: [
                  {
                    id: '3b',
                    children: [
                      {
                        id: '1',
                      },
                    ],
                  },
                  {
                    id: '3c',
                    children: [
                      {
                        id: '4a',
                        children: [
                          {
                            id: '1',
                          },
                        ],
                      },
                    ],
                  },
                  {
                    id: '3d',
                  },
                ],
              },
            ],
          },
        ]}
      />
    </div>
  );
}
