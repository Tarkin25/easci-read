import readIcon from '/read-svgrepo-com.svg'
import FilePicker from './components/FilePicker';
import { useState } from 'react';
import { useMupdf } from './hooks/useMupdf.hook';

function App() {
  const { mupdf, downloadDocument } = useMupdf();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function doRemoveReferences() {
    const pdf = file!;
    const buffer = await pdf.arrayBuffer();
    mupdf?.removeReferences(buffer);
    downloadDocument(pdf.name);
  }

  async function onRemoveReferences() {
    setLoading(true);
    await doRemoveReferences();
    setLoading(false);
  }

  return (
    <div className="h-screen flex flex-col max-w-screen">
      <header className="bg-slate-950 text-white p-4 flex items-center gap-4 md:p-8">
        <img src={readIcon} width={48} />
        <h1 className="text-4xl">EaSci-Read</h1>
      </header>
      <main className="flex grow items-center justify-center bg-slate-800">
        <div className="px-2 md:px-4 w-2xs sm:w-sm md:w-lg">
          <div className="flex grow flex-col gap-4">
            <FilePicker onFileChange={setFile} />
            <button className="text-white p-2 bg-slate-950 cursor-pointer rounded-xl disabled:bg-slate-900 disabled:cursor-not-allowed hover:bg-slate-900" onClick={onRemoveReferences} disabled={!file}>{loading ? "Loading..." : "Remove references"}</button>
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
