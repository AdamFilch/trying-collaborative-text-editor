"use client"
import dynamic from 'next/dynamic';

export const DynProseMirrorEditor = dynamic(() => import("./editor"), {
    ssr: false, // Ensure it runs only on the client
});
