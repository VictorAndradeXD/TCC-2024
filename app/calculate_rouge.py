import json
import sys
from rouge_score import rouge_scorer

if len(sys.argv) < 6:
    print(json.dumps({"error": "Invalid arguments provided."}))
    sys.exit(1)

correct_data_path = sys.argv[1]
audio_key = sys.argv[2]
transcription = sys.argv[3]
abstractive_summary = sys.argv[4]
extractive_summary = sys.argv[5]

try:
    with open(correct_data_path, "r", encoding="utf-8") as file:
        correct_data = json.load(file)

    # Log the keys available in correct_data.json
    available_keys = list(correct_data.keys())
    print(f"Available keys in correct_data.json: {available_keys}", file=sys.stderr)

    if audio_key not in correct_data:
        raise KeyError(f"Key '{audio_key}' not found in correct_data.json. Available keys: {available_keys}")

    correct_transcription = correct_data[audio_key]["transcription"]
    correct_summary = correct_data[audio_key]["summary"]

    scorer = rouge_scorer.RougeScorer(["rouge1", "rouge2", "rougeL"], use_stemmer=True)

    # Calculate ROUGE scores
    transcription_scores = scorer.score(correct_transcription, transcription)
    abstractive_scores = scorer.score(correct_summary, abstractive_summary)
    extractive_scores = scorer.score(correct_summary, extractive_summary)

    results = {
        "transcription_scores": transcription_scores,
        "abstractive_scores": abstractive_scores,
        "extractive_scores": extractive_scores,
    }

    print(json.dumps(results))
except KeyError as e:
    print(json.dumps({"error": str(e)}))
except Exception as e:
    print(json.dumps({"error": f"An unexpected error occurred: {str(e)}"}))
