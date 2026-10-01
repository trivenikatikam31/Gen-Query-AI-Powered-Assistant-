import re

def split_into_sentences(text):
    # Fix 1 & 2: Added 'text' parameter, added missing comma in re.sub
    text = re.sub(
        r'\s+',
        ' ',
        text
    ).strip()
    
    if not text:
        return []

    # split text after . ! or ?
    sentences = re.split(
        r'(?<=[.?!])\s+',
        text
    )
    
    # Fix 3: Changed sentences.strip() to sentence.strip()
    return [
        sentence.strip()
        for sentence in sentences
        if sentence.strip()
    ]

# split the document into context aware chunks
def split_text(
    text,
    chunk_size=1000,
    overlap_sentences=2
):
    # separate the doc into paragraphs
    paragraphs = re.split(
        r'\n\s*\n',
        text
    )
    paragraphs = [
        paragraph.strip()
        for paragraph in paragraphs
        if paragraph.strip()
    ]

    chunks = []

    # build chunks sentence by sentence
    current_sentences = []
    current_length = 0           
    for paragraph in paragraphs:
        sentences = split_into_sentences(paragraph)

        for sentence in sentences:
            # Fix 4: Add a trailing space to sentences so they join cleanly
            sentence_with_space = sentence + " "
            sentence_length = len(sentence_with_space)

            if (
                current_sentences
                and current_length + sentence_length > chunk_size
            ):
                chunks.append(
                    "".join(current_sentences).strip()
                )

                current_sentences = (
                    current_sentences[
                        -overlap_sentences:
                    ]
                )

                current_length = sum(
                    len(s)
                    for s in current_sentences
                )
                
            current_sentences.append(
                sentence_with_space
            )
            current_length += sentence_length
            
    # add the final remaining chunk
    if current_sentences:
        chunks.append(
            "".join(current_sentences).strip()
        )
    return chunks
