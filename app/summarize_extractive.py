from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.lex_rank import LexRankSummarizer

def summarize_extractive(text):
    parser = PlaintextParser.from_string(text, Tokenizer("portuguese"))
    summarizer = LexRankSummarizer()
    summary = summarizer(parser.document, 3)  # número de sentenças no sumário

    return " ".join([str(sentence) for sentence in summary])

if __name__ == "__main__":
    import sys
    text = sys.argv[1]
    print(summarize_extractive(text))
