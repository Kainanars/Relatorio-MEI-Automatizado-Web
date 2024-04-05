from docx import Document
import sys

def merge_documents(output_path, *input_paths):
    merged_document = Document()

    for input_path in input_paths:
        sub_doc = Document(input_path)
        for element in sub_doc.element.body:
            merged_document.element.body.append(element)

    merged_document.save(output_path)

if __name__ == "__main__":
    output_path = sys.argv[1]
    input_paths = sys.argv[2:]
    merge_documents(output_path, *input_paths)
