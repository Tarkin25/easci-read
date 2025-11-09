import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import dummyPdf from '/do-you-feel-young-enough.pdf'
import './App.css'
import { useMupdf } from '@/hooks/useMupdf.hook'

async function downloadFromURL(url: string): Promise<ArrayBuffer> {
  const buffer = await fetch(url).then(res => res.arrayBuffer());
  return buffer;
}

function App() {
  const { removeReferences, downloadDocument } = useMupdf();

  async function onRemoveReferences() {
    const buffer = await downloadFromURL(dummyPdf);
    removeReferences(buffer);
    downloadDocument();
  }

  return (
    <>
      <h1 style={{color: "white"}}>Easci-Read</h1>
      <button onClick={onRemoveReferences}>Remove References</button>
    </>
  )
}

export default App
