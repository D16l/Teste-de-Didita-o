const inputElement = document.getElementById('input');
const timerElement = document.getElementById('timer');
let words = [];
let phrase = "";
const phraseContainer = document.querySelector('.standardPhrase');
let hasStarted = false;
let wordTimeStamps = [];
let startTime = null;
let defaultTimeLeft = 60;
let timeLeft = 60;
let timerInterval;
let testFinished = false;
let isCommandMode = true;
let currentWordIndex = 0;
let isRandomPhrase = true;
let isRandomTime = true;
const predefinedQuotes = [
    "A vida é aquilo que acontece enquanto você está ocupado fazendo outros planos. Portanto, é essencial encontrar tempo para valorizar os momentos simples e as pessoas ao nosso redor. Seja a mudança que você deseja ver no mundo, pois pequenas atitudes diárias podem ter impactos profundos e transformar a realidade à sua volta.",
    "Seja a mudança que você deseja ver no mundo, pois pequenas atitudes diárias podem ter impactos profundos e transformar a realidade à sua volta.",
    "O sucesso é ir de fracasso em fracasso sem perder o entusiasmo, porque cada desafio enfrentado é uma oportunidade de aprendizado e crescimento pessoal.",
    "A única forma de fazer um ótimo trabalho é amar o que você faz. Quando você trabalha com paixão, a excelência se torna uma consequência natural do seu esforço.",
    "O futuro pertence àqueles que acreditam na beleza de seus sonhos, pois é através da visão e da determinação que as grandes conquistas se tornam possíveis.",
    "Não espere o momento perfeito, pois ele talvez nunca chegue. A ação é o que cria as oportunidades, e o agora é sempre o melhor momento para começar.",
    "Você é mais forte do que imagina e mais capaz do que acredita. Quando enfrentamos nossos medos e desafios, descobrimos que o nosso potencial é ilimitado.",
    "A persistência é o caminho para o êxito. Mesmo que a jornada seja longa e cheia de obstáculos, cada passo dado o aproxima de seus objetivos.",
    "A felicidade não é algo que se encontra ao final de um caminho, mas sim a forma como escolhemos percorrer cada etapa da nossa jornada.",
    "Acredite em si mesmo e em sua capacidade de transformar dificuldades em oportunidades, pois o primeiro passo para alcançar qualquer objetivo começa com a confiança no próprio potencial."
];


//Escolhe randomicamente uma das frases no array predefinedQuotes e retorna uma string
function getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * predefinedQuotes.length);
    return predefinedQuotes[randomIndex];
}

//Utiliza o getRandomQuote para gerar uma nova frase randomica
function renderNewQuote() {
    const quote = getRandomQuote();
    phraseContainer.textContent = quote;
    phrase = quote;
    //Realiza a contagem de caracteres e palavras dentro da frase que irá aparecer para o usuário e usa como base para alterar o tempo
    if(isRandomTime){
        const wordsCount = phrase.split(' ').length;
        const charactersCount = phrase.length;
        timeLeft = Math.round(Math.max(10, Math.min(3 * wordsCount, 0.5 * charactersCount)));
        defaultTimeLeft = Math.round(Math.max(10, Math.min(3 * wordsCount, 0.5 * charactersCount)));
        updateTimerDisplay();
    }
                
}

//Renderiza a frase que aparece para o usuário com um fundo branco para melhor destaque e visibilidade, caso o index do usuário não esteja na palavra então rendereiza sem o fundo branco
function renderPhraseWithHighlights() {
    const arrayPhrase = phrase.split(' ');
    const phraseContainer = document.querySelector('.standardPhrase');

    phraseContainer.innerHTML = arrayPhrase
        .map((word, index) => {
            if (index === currentWordIndex) {
                return `<span id="highlightedWord" style="background-color: gray; padding: 2px 6px 2px 2px; border-radius: 4px; height: 45px">${word}</span>`;
            }
            return `<span style="padding: 2px 6px 2px 2px; height: 45px" >${word}</span>`;
        })
        .join(' ');

    scrollToHighlightedWord();
}

//Realiza a função de scroll assim que o usuário finaliza uma linha
function scrollToHighlightedWord() {
    const phraseContainer = document.querySelector('.standardPhrase');
    const highlightedWord = document.getElementById('highlightedWord');
    const words = phraseContainer.querySelectorAll('span');

    //Utiliza o metodo getBoundingClienteRect para pegar os atributos border-boxes do CSS associados ao elemento
    if (highlightedWord) {
        const containerRect = phraseContainer.getBoundingClientRect();
        const highlightedRect = highlightedWord.getBoundingClientRect();
        //Utiliza o ForEach para validar se a quantidade de caracteres é igual a highlightedWord e maior que zero
        let isNewLine = false;
        for (let i = 0; i < words.length; i++) {
            if (words[i] === highlightedWord && i > 0) {
                //Caso for irá guardar a informação de Rect em uma variável
                const previousWordRect = words[i - 1].getBoundingClientRect();
                //Se o valor top do objeto atual for maior que o objeto anterior então irá atualizar a variável isNewLine
                if (highlightedRect.top > previousWordRect.top) {
                    isNewLine = true;
                    break;
                }
            }
        }
        //Se isNewLine for true, então irá diminuir o Rect do container com o Rect da palavra em destaque e usar como valor para usar o metodo scrollTop
        if (isNewLine) {
            const scrollAmount = highlightedRect.top - containerRect.top;
            phraseContainer.scrollTop += scrollAmount;
        }
    }
}

//Atualiza a nova palavra baseado no index atual e chama o renderPhraseWithHighlights
function updateCurrentWord() {
    if (currentWordIndex < phrase.split(' ').length - 1) {
        currentWordIndex++;
        renderPhraseWithHighlights();
    }
}

//Função que inicia o timer e renderiza na tela o valor decrementado até 0
function startTimer() {
    startTime = Date.now();
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            inputElement.disabled = true;
            alert('O tempo acabou!');
            testFinished = true;
            handleTestConclusion();
        }
    }, 1000);
};

//Atualiza o time na tela transformando o valor no formato de minutos e segundos
function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerElement.innerText = `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

//Event listener para aguardar a tecla Enter ser precionada
inputElement.addEventListener('keydown', async (ev) => {
    if (ev.key === 'Enter' || ev.code === 'Enter' || ev.keyCode === 13) {
        ev.preventDefault();
        const input = ev.target;
        const inputCommand = input.value.trim();
        //Reseta os valores para padrão caso for escrito 'exit'
        if (inputCommand === 'exit') {
            inputElement.value = '';
            phraseContainer.innerText = 
            `Bem vindo(a)!
            Digite '/help' para mais informações`;
            currentWordIndex = 0;
            words = [];
            isCommandMode = true;
            clearInterval(timerInterval)
            timeLeft = defaultTimeLeft;
            updateTimerDisplay();
            hasStarted = false;
            return;
        };
        //Previne que caso não tenha começado ou não tenha nenhuma palavra guardada, não comece o teste
        if(words.length > 0 || hasStarted) {
            ev.preventDefault();
            return;
        }
        //Switch case para os comandos do teste
        switch (true) {
            case inputCommand === '/start':
                inputElement.value = '';
                phraseContainer.innerText = '';
                await loadingScreen();
                renderPhraseWithHighlights();
                if(isRandomPhrase){
                    isRandomTime = true;
                    renderNewQuote();
                    renderPhraseWithHighlights();
                }
                isCommandMode = false;
                break;
            case inputCommand.startsWith('/time '):
                isRandomTime = false;
                timeLeft = inputCommand.slice('/time '.length);
                defaultTimeLeft = inputCommand.slice('/time '.length);
                updateTimerDisplay();
                inputElement.value = '';
                break;

            case inputCommand.startsWith('/help'):
                document.querySelector('.standardPhrase').style.paddingTop = '.1rem';
                    const helpScreenHTML = `
                        <div class="command-screens">
                            <h4>Lista de comandos para personalisar seu teste</h4>
                            <p>/start - Inicia o teste</p>
                            <p>/time + Espaço + Valor - Define o tempo</p>
                            <p>/words + Espaço + Texto - Define a frase;palavras que estarão no teste</p>
                            <p>/random - Faz as frases serem aleatórias</p>
                            <p>/dev - ???</p>
                            <p>Esc - Para dar restart no teste (Após o término)</p>
                            <p id="exit-help-screen">Para sair digite 'exit'</p>
                            <p style="font-style: italic;">Nota: Pressione Enter para confirmar o comando</p>
                        </div>
                    `;
                phraseContainer.innerHTML = helpScreenHTML;
                inputElement.value = '';
                break;

            case inputCommand.startsWith('/words '):
                phrase = inputCommand.slice('/words '.length).trim();
                currentWordIndex = 0;
                inputElement.value = '';
                isRandomPhrase = false;
                break;

            case inputCommand.startsWith('/dev'):
                document.querySelector('.standardPhrase').style.paddingTop = '.1rem';
                const devScreenHTML = `
                        <div class="command-screens">
                            <h4>Você pode fazer download do código por aqui:</h4>
                            <p style="pointer-events: all;" target="_blank" rel="noopener noreferrer"><a href="https://github.com/D16l/Teste-de-Diditacao">Github</a></p>
                            <p id="exit-help-screen">Para sair digite 'exit'</p>
                        </div>
                    `;
                phraseContainer.innerHTML = devScreenHTML;
                inputElement.value = '';
                break;

            case inputCommand.startsWith('/random'):
                isRandomTime = !isRandomTime;
                isRandomPhrase = !isRandomPhrase;
                inputElement.value = '';
                break;
            default:
                break;
        }
    }
})

//Renderiza uma 'loading screen' na tela para dar um efeito visual melhor
function loadingScreen(duration = 4000){
    return new Promise((resolve) =>{
        let loadingText = 'Loading';
        let dotCount = 0;

        phraseContainer.innerText = loadingText;

        const interval = setInterval(() => {
            if(dotCount < 3) {
                loadingText += '.';
                dotCount++;
            } else {
                loadingText = 'Loading';
                dotCount = 0;
            }
            phraseContainer.innerText = loadingText;
        }, 1000);

        setTimeout(() => {
           clearInterval(interval);
           phraseContainer.innerText = '';
           resolve() 
        }, duration);
    });
}

//Event listener principal, usado para guardar na variável 'words' as strings que são colocadas no input
inputElement.addEventListener('keydown', (ev) => {
    const currentTargetValue = ev.target.value;
    const nextTargetValue = ev.key.length === 1 ? currentTargetValue + ev.key : currentTargetValue;
    //Previne de guardar as strings na vairável 'words'
    if (isCommandMode && (nextTargetValue.startsWith('/') || ev.key === 'Enter')) {
        return;
    }

    if (!hasStarted && !isCommandMode) {
        hasStarted = true;
        startTimer();
    }
    
    if ((ev.key === ' ' || ev.code === 'Space' || ev.keyCode === 32) && !isCommandMode) {
        ev.preventDefault();
        const inp = ev.target;
        const userWord = inp.value.trim();

        words.push(userWord);
        wordTimeStamps.push(Date.now());
        updateCurrentWord();

        inp.value = '';
        //Se o tamanho das palavras digitadas forem maiores ou iguais que a frase atual, irá finalizar o teste para prevenir erros
        if (words.length >= phrase.split(' ').length) {
            clearInterval(timerInterval);
            inp.disabled = true;
            handleTestConclusion();
        }
    }
});

//Função para calcular o PPM usando o array de tempos
function calculateWPM() {
    if (wordTimeStamps.length === 0) return 0;

    const start = wordTimeStamps[0];
    const end = Date.now();
    const durationInMinutes = (end - start) / 60000;
    //Previne erros e tempos negativos
    if (durationInMinutes <= 0) return 0;
    //Conta quantas palavras digitadas pelo usuário correspondem exatamente às palavras da frase, comparando os índices, pois apenas as palavras corretas precisam ser consideradas
    const correctWordsCount = words.filter((word, index) => {
        const phraseWords = phrase.split(' ');
        return word === phraseWords[index];
    }).length;
    //Calculo de WPM de quantidade de palavras dividido pela duração do teste
    const wpm = correctWordsCount / durationInMinutes;
    return Math.round(wpm);
}

//Função para validar as palavras incorretas e corretas das palavras digitadas pelo usuário
function handlePhraseValidation(correctPhrase, userWords) {
    const arrayPhrase = correctPhrase.split(' ');

    const errors = {
        spellingErrors: [],
        wrongWords: [],
    };
    //Distancia de Levenshtein
    function levenshteinDistance(a, b) {
        const matrix = Array.from({ length: a.length + 1 }, () =>
            Array(b.length + 1).fill(0)
        );

        for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
        for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

        for (let i = 1; i <= a.length; i++) {
            for (let j = 1; j <= b.length; j++) {
                const cost = a[i - 1] === b[j - 1] ? 0 : 1;
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + cost
                );
            }
        }
        return matrix[a.length][b.length];
    }

    //Separa os erros de digitação e as palavras erradas com base na distancia 2
    arrayPhrase.forEach((correctWord, index) => {
        const userWord = userWords[index] || '';
        const distance = levenshteinDistance(correctWord, userWord);

        if (userWord === correctWord) {
            return;
        } else if (distance <= 2) {
            errors.spellingErrors.push({ expected: correctWord, entered: userWord });
        } else {
            errors.wrongWords.push({ expected: correctWord, entered: userWord });
        }
    });

    return errors;
};

//Função assíncrona para realizar a conclusão do teste
async function handleTestConclusion() {
    testFinished = true;

    const result = handlePhraseValidation(phrase, words);
    const timeUsed = defaultTimeLeft - timeLeft;
    const minutesUsed = Math.floor(timeUsed / 60);
    const secondsUsed = timeUsed % 60;
    const wpmValue = calculateWPM();
    const validSpellingErrors = result.spellingErrors.filter(error => error.entered.trim() !== '');
    const spellingErrorsCount = validSpellingErrors.length;
    const validWrongWords = result.wrongWords.filter(error => error.entered.trim() !== '');
    const validWrongWordsCount = validWrongWords.length;

    //Função para renderizar as palavras erradas em vermelho, para melhor visualização
    function highlightDifferences(original, userInput) {
        const originalWords = original.split(' ');
        const userWords = userInput.split(' ');
        let result = '';

        //Separa as palavras certas e erradas e define estilos diferentes para cada uma
        originalWords.forEach((word, index) => {
            const userWord = userWords[index] || '';
            if (word === userWord) {
                result += `<span>${word}</span> `;
            } else {
                result += `<span style="color: #C50F1F">${userWord || '{}'}</span> `;
            }
        });

        return result;
    }
    await loadingScreen();
    const highlightedText = highlightDifferences(phrase, words.join(' '));
    const conclusionScreenHTML = 
                                `<div class="command-screens">
	                                <h4>${wpmValue} PPM - Tempo: ${minutesUsed}m ${secondsUsed}s</h4>
                                    <p>Erros ortográficos: ${spellingErrorsCount}</p>
                                    <p>Palavras erradas: ${validWrongWordsCount}</p><br>
                                    <p>${highlightedText}</p>
				    <p>Aperte Esc para reiniciar</p>
                                </div>`;
    phraseContainer.style.paddingTop = 0
    phraseContainer.innerHTML = conclusionScreenHTML;    
    
    //Espera a tecla 'Esc' ser pressionada para resetar o teste
    async function handleKeyDown(ev) {
        if (ev.key === 'Escape' || ev.code === 'Escape' || ev.keyCode === 27) {
            inputElement.value = '';
            phraseContainer.innerText = '';
            isCommandMode = false;
            testFinished = false;
            words = [];
            wordTimeStamps = [];
            currentWordIndex = 0;
            timeLeft = defaultTimeLeft;
    
            await loadingScreen();
    
            inputElement.disabled = false;
            renderPhraseWithHighlights();
    
            if (isRandomPhrase) {
                renderNewQuote();
                renderPhraseWithHighlights();
            }
    
            updateTimerDisplay();
            hasStarted = false;
            document.removeEventListener('keydown', handleKeyDown);
        }
    }
    document.addEventListener('keydown', handleKeyDown);

    
};
updateTimerDisplay();
