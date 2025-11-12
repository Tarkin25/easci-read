import { MupdfWorker } from "../workers/mupdf.worker";
import * as Comlink from "comlink";
import type { Remote } from "comlink";
import { useCallback, useEffect, useRef } from "react";

export function useMupdf() {
  const mupdfWorker = useRef<Remote<MupdfWorker>>(null);

  useEffect(() => {
    const worker = new Worker(
      new URL("../workers/mupdf.worker", import.meta.url),
      {
        type: "module",
      }
    );
    mupdfWorker.current = Comlink.wrap<MupdfWorker>(worker);

    return () => {
      worker.terminate();
    };
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
  }, []);

  // ===> Here you can create hooks <===
  // ===> that use the methods of the worker. <===
  // ===> You can use useCallback to avoid unnecessary rerenders <===  

  return {
    mupdf: mupdfWorker.current,
    downloadDocument,
  };
}