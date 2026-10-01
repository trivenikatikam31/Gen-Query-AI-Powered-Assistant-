from studentapp.rag.embeddings import embed_text
from studentapp.rag.generator import generate_answer
from studentapp.rag.vector_store import search_chunks
from studentapp.rag.structured_retriever import (
    get_student_data,
    student_data_to_context
)

def ask_conversation(question, user, history):
    student_data = get_student_data(user)
    structured_context = student_data_to_context(
        student_data
    )
    query_vector = embed_text(question)
    
    results = search_chunks(
        query_vector,
        student_id=student_data["student_id"],
        n_results=3
    )
    documents = results["documents"][0]
    metadatas = results["metadatas"][0]
    document_context = "\n\n".join(
        documents
    )
    context = f"""
    STRUCTURED STUDENT DATA:
    {structured_context}
    UNSTRUCTURED DOCUMENT DATA:
    {document_context}
    """
    history_text = "" 
    for message in history:
        history_text += f'{message["role"]}: {message["content"]}\n'
        
    conversation_prompt = f"""
    you are conversational AI assistant inside student portal
    Use the provided student information
    and document information to answer the 
    user's question.
    you also have access to the previous
    conversation.
    CONVERSATION_HISTORY:
    {history_text}
    RAG_CONTEXT:
    {context}
    CURRENT QUESTION:
    {question}
    Insructions:
    -Use only the provided context.
    -Use conversation history whwn it helps
    understand the current questions.
    Do not invent information 
    -If the information is not available,
    say that you dont knew.
    -Return the answer using the required structured format.
    """
    result = generate_answer(
        question=question,
        context=conversation_prompt
    )
    response = result.model_dump()
    sources = []
    for metadata in metadatas:
        source = metadata.get("source")
        if source:
            sources.append({
                "document_id": metadata.get("document_id"),
                "source": source,
                "chunk_index": metadata.get("chunk_index")
            })
            
    response["sources"] = sources
    return response