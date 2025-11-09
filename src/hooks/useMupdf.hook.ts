import { MUPDF_LOADED, MupdfWorker } from "../workers/mupdf.worker";
import * as Comlink from "comlink";
import type { Remote } from "comlink";
import { useCallback, useEffect, useRef, useState } from "react";

export function useMupdf() {
  const [isWorkerInitialized, setIsWorkerInitialized] = useState(false);
  const mupdfWorker = useRef<Remote<MupdfWorker>>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/mupdf.worker", import.meta.url),
      {
        type: "module",
      }
    );
    mupdfWorker.current = Comlink.wrap<MupdfWorker>(worker);

    worker.addEventListener("message", (event) => {
      if (event.data === MUPDF_LOADED) {
        setIsWorkerInitialized(true);
      }
    });

    return () => {
      worker.terminate();
    };
  }, []);

  const loadDocument = useCallback((arrayBuffer: ArrayBuffer) => {
    return mupdfWorker.current!.loadDocument(arrayBuffer);
  }, []);

  const removeReferences = useCallback((arrayBuffer: ArrayBuffer) => {
    return mupdfWorker.current!.removeReferences(arrayBuffer);
  }, []);

  const downloadDocument = useCallback(async (filename: string) => {
    const download = filename.replace(".pdf", "") + "-without-references.pdf";
    const buffer = await mupdfWorker.current!.getDocumentBytes();
    const blob = new Blob([buffer as BlobPart], { type: "application/pdf"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = download;
    a.click();
  }, [])

  // ===> Here you can create hooks <===
  // ===> that use the methods of the worker. <===
  // ===> You can use useCallback to avoid unnecessary rerenders <===  

  return {
    isWorkerInitialized,
    loadDocument,
    removeReferences,
    downloadDocument,
  };
}