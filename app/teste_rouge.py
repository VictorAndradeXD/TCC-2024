from rouge_score import rouge_scorer

def calculate_rouge(predicted, reference):
    scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
    scores = scorer.score(reference, predicted)
    return {key: score.fmeasure for key, score in scores.items()}

if __name__ == "__main__":
    # Textos avulsos para teste
    correct_transcription = "Polícia militar, bombeiro militar emergência. Bom dia é porque desde ontem tem um carro parado aqui na praça, aqui na Ulisses Guimarães no bairro Promorar e esse carro tá... foi ontem pela manhã aí tinha dois caras dentro do carro entendeu? Aí saíram quando foi de tardezinha os mesmos caras passaram e aí quando foi de madrugada quando o meu namorado vinha chegando do serviço entendeu? Os caras tavam sentados no banco e o carro até hoje tá aqui não tem não consta negócio de roubo? Qual a placa do veículo? É LWM. Pode falar. 4337. É um palio. Só um momento é um palio de cor prata não é isso? É Ele ele não é... ele é um prata mas um prata escuro não é aquele claro não. Até o momento não tem nenhum registro de furto ou roubo. Pois desde ontem pela manhã entendeu? e os dois caras pelo jeito que aqui o pessoal tão vendo acha que o carro foi roubado ou alguma coisa porque desde ontem... O carro tá mal estacionado? Tá estacionado? Tá atrapalhando a saída de alguma garagem algo assim? não tá atrapalhando nada não porque deixaram ele aqui na praça desde ontem porque tem gente que deixa carro aqui mesmo mas é porque trabalha na drogaria trabalha no quiosque trabalha ali na coisa de peça de moto mas esse aqui não entendeu? Pronto, até o momento não tem nenhum registro de furto ou roubo e como não está atrapalhando a passagem nem nada não tem como a viatura ir até o local. Pois tá bom então viu pois tá eu só tô passando a informação. Ajudo em algo mais? Só isso mesmo, obrigada. Por nada tenha um bom dia. Bom dia."
    predicted_transcription = "Polícia Militar, Bombera Militar, Emergência? Bom dia, é porque desde ontem tem um carro que está parado aqui na praça, aqui na Ulice de Maranhos, no bairro Promorá. E esse carro foi ontem pela manhã, aí tinha dois caras dentro do carro, entendeu? Aí saíram. Quando foi de tarde vinha os mesmos caras passaram. E aí quando foi de madrugada, quando o meu namorado vinha chegando feliz, entendeu? Os caras estavam sentados no banco. E o carro até hoje está aqui. Qual a placa do veículo? LWM 4337. É um palio. Só um momento. É um palio de cor prata, é isso? É. Ele não é assim um... é um prata, mas é um prata escuro, não tem? Não é aquele claro não. Até o momento não tem nenhum resíquio de furto ou roubo? Pois desde ontem pela manhã, entendeu? E os dois caras, pelo jeito que aqui os pessoal estão vendo, acha que o carro foi roubado, alguma coisa, porque desde... O carro está mais estacionado? Está estacionado, ele. Está atrapalhando alguma saída de garagem ou algo assim? Não, ele não está atrapalhando nada não, porque deixaram ele aqui na praça desde ontem. Porque tem gente que deixa carro aqui mesmo. Mas é porque trabalha na drogaria, trabalha no quiosque, trabalha ali na coisa de peças de moto. Mas esse aqui não, entendeu? Pronto, assim, até o momento não tem nenhuma restrição de furto ou roubo. E como não está atrapalhando passagens nem nada, não tem como aviatoria até o local. Pois está bom então, viu? Pois está. Eu só estou passando a informação... Você vai ajudar um mais? Não, só isso mesmo, obrigada. Por nada, senhora. Bom dia. Bom dia."
    
    correct_summary = "A raposa pula sobre o cão."
    predicted_summary = "A raposa salta sobre o cachorro."

    # Cálculo do ROUGE para transcrição
    transcription_rouge = calculate_rouge(predicted_transcription, correct_transcription)
    print("ROUGE para Transcrição:")
    print(transcription_rouge)

    # Cálculo do ROUGE para resumo
    summary_rouge = calculate_rouge(predicted_summary, correct_summary)
    print("\nROUGE para Resumo:")
    print(summary_rouge)
