import sys
import whisper

def transcrever_audio(audio_filepath):
    model = whisper.load_model("medium")
    result = model.transcribe(audio_filepath, language='portuguese')
    return result['text']

if __name__ == "__main__":
    audio_filepath = sys.argv[1]
    transcricao = transcrever_audio(audio_filepath)
    print(transcricao)
