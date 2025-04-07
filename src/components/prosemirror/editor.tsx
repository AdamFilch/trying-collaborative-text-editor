"use client";

import 'prosemirror-view/style/prosemirror.css';

import { exampleSetup } from 'prosemirror-example-setup';
import { DOMParser, Schema } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import React, { useEffect, useRef } from 'react';

const ProseMirrorEditor = () => {
    const editorRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const mySchema = new Schema({
            nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
            marks: schema.spec.marks,
        });

        const view = new EditorView(editorRef.current, {
            state: EditorState.create({
                doc: DOMParser.fromSchema(mySchema).parse(document.createElement("div")),
                plugins: exampleSetup({ schema: mySchema }),
            }),
        });

        return () => view.destroy();
    }, []);

    return (
        <div>
            <h2>ProseMirror Editor</h2>
            <div ref={editorRef} className="editor-container" />
            <style jsx>{`
        .editor-container {
          min-height: 300px;
          width: 100%;
          border: 1px solid #ddd;
          padding: 10px;
        }

        .ProseMirror-menubar {
            display: flex;
        }

        .ProseMirror {
          min-height: 300px;
          padding: 10px;
          border: 1px solid #ccc;
          outline: none;
          background: white;
        }
      `}</style>
        </div>
    );
};

export default ProseMirrorEditor;
