"use client"
import './styles.scss';

import React from 'react';
import YPartyKitProvider from 'y-partykit/provider';
import * as Y from 'yjs';

import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Document from '@tiptap/extension-document';
import Paragraph from '@tiptap/extension-paragraph';
import Text from '@tiptap/extension-text';
import { EditorContent, useEditor } from '@tiptap/react';

const doc = new Y.Doc() // Initialize Y.Doc for shared editing

export default function CollaborativeEditor() {
  const provider = new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", 'adam-datum-editor-room', doc)
  const editor = useEditor({
    extensions: [
      Document,
      Paragraph,
      Text,
      Collaboration.configure({
        document: doc, // Configure Y.Doc for collaboration
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: { name: "User " + Math.floor(Math.random() * 100) },
      }),
    ],
    content: `
      <p>
        This is a radically reduced version of Tiptap. It has support for a document, with paragraphs and text. That’s it. It’s probably too much for real minimalists though.
      </p>
      <p>
        The paragraph extension is not really required, but you need at least one node. Sure, that node can be something different.
      </p>
    `,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        spellcheck: "false",
      },
    },
  })

  return <EditorContent editor={editor} />
}








