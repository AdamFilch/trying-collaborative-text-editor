"use client"
import '@blocknote/core/fonts/inter.css';
import '@blocknote/mantine/style.css';
import '../../app/page.module.css';

import YPartyKitProvider from 'y-partykit/provider';
import { WebrtcProvider } from 'y-webrtc';
import * as Y from 'yjs';

import { BlockNoteView } from '@blocknote/mantine';
import { useCreateBlockNote } from '@blocknote/react';

// Our <Editor> component we can reuse later
export default function Editor() {
    const ydoc = new Y.Doc()
    const provider = new YPartyKitProvider("blocknote-dev.yousefed.partykit.dev", 'adam-datum-editor-room', ydoc)
    // Creates a new editor instance.
    const editor = useCreateBlockNote({
        initialContent: [
            {
                type: "paragraph",
                content: "Welcome to this demo!",
            },
            {
                type: "paragraph",
            },
        ],
        collaboration: {
            // The Yjs Provider responsible for transporting updates:
            provider,
            // Where to store BlockNote data in the Y.Doc:
            fragment: ydoc.getXmlFragment("document-store"),
            // Information (name and color) for this user:
            user: {
                name: "My Username",
                color: "#ff0000",
            },
            // When to show user labels on the collaboration cursor. Set by default to
            // "activity" (show when the cursor moves), but can also be set to "always".
            showCursorLabels: "activity"
        },
    });



    // Renders the editor instance using a React component.
    return <BlockNoteView editor={editor} />;
}