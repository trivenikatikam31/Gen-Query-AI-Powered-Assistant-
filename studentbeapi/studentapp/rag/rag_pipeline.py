from studentapp.rag.embeddings import embed_text
from studentapp.rag.generator import generate_answer
from studentapp.rag.vector_store import search_chunks
from studentapp.rag.structured_retriever import (
    get_student_data,
    student_data_to_context
)
#main RAG pipeline:
#Connect student data,document retrieval and gemini to generate final answer

def ask_rag( question,user):
    student_data = get_student_data(user)
    structured_context = student_data_to_context(
        student_data
    )
    query_vector = embed_text(question)

    result= search_chunks(
        query_vector,
        student_id=student_data["student_id"],
        n_results=3
    )

    documents = result["documents"][0]
    metadatas = result["metadatas"][0]

    document_context = "\n\n".join(
        documents
    )

    context = f"""
STRUCTURED STUDENT DATA:

{structured_context}

UNSTRUCTURED DOCUMENT DATA:

{document_context}
"""
    result = generate_answer(
        question,
        context
    )

    sources = []
    for metadata in metadatas:
        source = metadata.ge("source")
        if source:
            sources.append({
                "document_id":metadata.get("document_id"),
                "source": source,
                "chunk_index":metadata.get("chunk_index")
            })
    response = result.model_dump()
    response["sources"] = sources
    return response