import { useRef, useState, type ChangeEvent } from "react"

export type FilePickerProps = {
    onFileChange: (file: File | null) => void;
}

export default function FilePicker(props: FilePickerProps) {

    const inputRef = useRef<HTMLInputElement>(null as unknown as HTMLInputElement);
    const [file, setFile] = useState<File | null>(null);

    const openFileDialog = () => {
        inputRef.current.click();
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setFile(file);
        props.onFileChange(file);
    }

    return (
        <div className=" text-white flex items-center w-lg">
            <input ref={inputRef} className="hidden" type="file" accept="application/pdf" multiple={false} onChange={handleInputChange} />
            <button className="bg-slate-950 rounded-l-xl p-2 cursor-pointer hover:bg-slate-900 shadow-2xl" onClick={openFileDialog}>Select File</button>
            <div className="bg-slate-600 p-2 rounded-r-xl grow text-center">{file?.name || "No file selected"}</div>
        </div>
    )
}