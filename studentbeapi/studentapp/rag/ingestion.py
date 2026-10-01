from pathlib import Path
from studentapp.rag.extract import extract_text_from_pdf
from studentapp.rag.chunker import split_text
from studentapp.rag.embeddings import embed_text
from studentapp.rag.vector_store import (
    store_chunks,
    delete_document_chunks,
)


def ingest_document(document):
    file_path = Path(document.file.path)

    if file_path.suffix.lower() != ".pdf":
        return {
            "status": "skipped",
            "message": "Only PDF files are supported currently",
        }

    text = extract_text_from_pdf(file_path)

    if not text.strip():
        return {
            "status": "failed",
            "message": "No text could be extracted from the PDF",
        }

    chunks = split_text(text)

    if not chunks:
        return {
            "status": "failed",
            "message": "No chunks were created.",
        }

    try:
        embeddings = embed_text(chunks)

    except Exception as e:
        return {
            "status": "failed",
            "message": f"Embedding failed: {str(e)}",
        }

    if len(embeddings) != len(chunks):
        return {
            "status": "failed",
            "message": (
                "Number of embeddings does not match "
                "number of chunks"
            ),
        }

    try:
        delete_document_chunks(document.id)

    except Exception as e:
        return {
            "status": "failed",
            "message": (
                f"Failed to delete old document chunks: {str(e)}"
            ),
        }

    try:
        store_chunks(
            chunks=chunks,
            embeddings=embeddings,
            student_id=document.student.id,
            document_id=document.id,
            source=document.source,
        )

    except Exception as e:
        return {
            "status": "failed",
            "message": f"ChromaDB storage failed: {str(e)}",
        }

    return {
        "status": "success",
        "document_id": document.id,
        "student_id": document.student.id,
        "chunks": len(chunks),
    }