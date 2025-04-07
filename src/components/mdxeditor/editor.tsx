import { useEffect, useMemo, useRef, useState } from 'react';
import YPartyKitProvider from 'y-partykit/provider';
import * as Y from 'yjs';

import {
    BlockTypeSelect, BoldItalicUnderlineToggles, frontmatterPlugin, headingsPlugin,
    InsertAdmonition, InsertFrontmatter, InsertTable, InsertThematicBreak, listsPlugin, ListsToggle,
    MDXEditor, quotePlugin, tablePlugin, thematicBreakPlugin, toolbarPlugin, UndoRedo
} from '@mdxeditor/editor';

export default function Editor() {
    const editorRef = useRef(null);
    const ydoc = useMemo(() => new Y.Doc(), []);
    const provider = useMemo(
        () => new YPartyKitProvider("localhost:1999", "mdx-editor-collab-room", ydoc),
        [ydoc]
    );
    const yText = useMemo(() => ydoc.getText("shared"), [ydoc]);
    const [markdown, setMarkdown] = useState("");
    const [status, setStatus] = useState("disconnected");
    const [users, setUsers] = useState<any>([]);

    // Handle connection status
    useEffect(() => {
        const handleStatusChange = (event: any) => {
            setStatus(event.status);
        };

        provider.on('status', handleStatusChange);
        return () => provider.off('status', handleStatusChange);
    }, [provider]);

    // Handle awareness (who's online)
    useEffect(() => {
        const awareness = provider.awareness;

        // Set local user state
        awareness.setLocalState({
            name: 'User ' + Math.floor(Math.random() * 100),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16),
        });

        // Track other users
        const updateUsers = () => {
            const states = Array.from(awareness.getStates().values());
            setUsers(states);
        };

        awareness.on('change', updateUsers);
        updateUsers();

        return () => awareness.off('change', updateUsers);
    }, [provider]);

    // Handle markdown sync
    useEffect(() => {
        const update = () => {
            const value = yText.toString();
            setMarkdown(value);
        };

        yText.observe(update);
        update();

        return () => {
            yText.unobserve(update);
        };
    }, [yText]);

    const handleEditorChange = (value: any) => {
        if (value !== yText.toString()) {
            ydoc.transact(() => {
                yText.delete(0, yText.length);
                yText.insert(0, value);
            });
        }
    };

    return (
        <div className="editor" style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
            <div className="status-bar">
                <div>Connection: {status}</div>
                <div>Users online: {users.length}</div>
            </div>

            <MDXEditor
                ref={editorRef}
                markdown={markdown}
                onChange={handleEditorChange}
                plugins={[
                    headingsPlugin(),
                    listsPlugin(),
                    quotePlugin(),
                    tablePlugin(),
                    thematicBreakPlugin(),
                    frontmatterPlugin(),
                    toolbarPlugin({
                        toolbarContents: () => (
                            <>
                                <UndoRedo />
                                <BoldItalicUnderlineToggles />
                                <ListsToggle />
                                <BlockTypeSelect />
                                <InsertTable />
                                <InsertThematicBreak />
                                <InsertAdmonition />
                                <InsertFrontmatter />
                            </>
                        )
                    })
                ]}
                suppressHtmlProcessing
            />
        </div>
    );
}