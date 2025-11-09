import readIcon from '/read-svgrepo-com.svg'
import FilePicker from './components/FilePicker';
import { useState } from 'react';
import { useMupdf } from './hooks/useMupdf.hook';

function App() {
  const { removeReferences, downloadDocument } = useMupdf();
  const [file, setFile] = useState<File | null>(null);

  async function onRemoveReferences() {
    const pdf = file!;
    const buffer = await pdf.arrayBuffer();
    removeReferences(buffer);
    downloadDocument(pdf.name);
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="bg-slate-950 text-white p-8 flex items-center gap-4">
        <img src={readIcon} width={48} />
        <h1 className="text-4xl">EaSci-Read</h1>
      </header>
      <main className="flex grow items-center justify-center bg-slate-800">
        <div className="flex flex-col gap-4">
          <FilePicker onFileChange={setFile} />
          <button className="text-white p-2 bg-slate-950 cursor-pointer rounded-xl disabled:bg-slate-900 disabled:cursor-not-allowed hover:bg-slate-900" onClick={onRemoveReferences} disabled={!file}>Remove references</button>
        </div>
      </main>
    </div>
  )
}

export default App
