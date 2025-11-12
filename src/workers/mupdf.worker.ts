/// <reference lib="webworker" />
import * as Comlink from "comlink";
import type { PDFDocument } from "mupdf";
import * as mupdf from "mupdf"

export const MUPDF_LOADED = "MUPDF_LOADED";

export class MupdfWorker {
    private pdfdocument?: mupdf.Document;

    constructor() {
        this.initializeMupdf();
    }

    private initializeMupdf() {
        try {
            postMessage(MUPDF_LOADED);
        } catch (error) {
            console.error("Failed to initialize MuPDF:", error);
        }
    }

    // ===> Here you can create methods <===
    // ===> that call statics and methods <===
    // ===> from mupdf (in ./node_modules/mupdf/dist/mupdf.js) <===

    loadDocument(document: ArrayBuffer) {

        this.pdfdocument = mupdf.Document.openDocument(
            document,
            "application/pdf"
        ) as PDFDocument;

        return this.pdfdocument;
    }

    getPageCount(): number {
        if (!this.pdfdocument) throw new Error("Document not loaded");

        return this.pdfdocument.countPages();
    }

    removeReferences(document: ArrayBuffer): void {
        this.loadDocument(document);
        const doc = this.pdfdocument!.asPDF()!;
        const regex = /\([^)]*[\d]+[^)]*\)/g;

        for (let pageNumber = 0; pageNumber < doc.countPages(); pageNumber++) {
            const page = doc.loadPage(pageNumber) as mupdf.PDFPage;
            const text = page.toStructuredText().asText();
            const matches = text.matchAll(regex);
            console.debug(text);

            if (matches) {
                for (const match of matches) {
                    console.debug("found", match);
                    const hits = page.search(match[0]);

                    for (const quads of hits) {
                        const annotation = page.createAnnotation("Redact");
                        annotation.setQuadPoints(quads);
                        annotation.setColor([1, 1, 1]);
                    }
                }

                page.applyRedactions(false);
            }

        }
    }

    async getDocumentBytes() {
        if (!this.pdfdocument) throw new Error("Document not loaded");

        const buffer = this.pdfdocument.asPDF()?.saveToBuffer().asUint8Array()!;
        return buffer;

    }
}

Comlink.expose(new MupdfWorker());