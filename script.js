const PRIMEIRA_SENHA =
    "1234";

const SEGUNDA_SENHA =
    "5678";

const PALAVRA_CHAVE =
    "henrique";


const etapa1 =
    document.getElementById(
        "etapa1"
    );

const etapa2 =
    document.getElementById(
        "etapa2"
    );

const areaLiberada =
    document.getElementById(
        "areaLiberada"
    );


const formPrimeiraSenha =
    document.getElementById(
        "formPrimeiraSenha"
    );

const primeiraSenha =
    document.getElementById(
        "primeiraSenha"
    );

const erroPrimeiraSenha =
    document.getElementById(
        "erroPrimeiraSenha"
    );


const formSegundaSenha =
    document.getElementById(
        "formSegundaSenha"
    );

const segundaSenha =
    document.getElementById(
        "segundaSenha"
    );

const erroSegundaSenha =
    document.getElementById(
        "erroSegundaSenha"
    );


const botaoMicrofone =
    document.getElementById(
        "botaoMicrofone"
    );

const statusVoz =
    document.getElementById(
        "statusVoz"
    );

const palavraDetectada =
    document.getElementById(
        "palavraDetectada"
    );

const erroMicrofone =
    document.getElementById(
        "erroMicrofone"
    );


const metodoEntrada =
    document.getElementById(
        "metodoEntrada"
    );


let reconhecimento = null;

let ouvindo = false;


function mostrarEtapa2() {

    etapa1.classList.add(
        "escondido"
    );

    etapa2.classList.remove(
        "escondido"
    );

    primeiraSenha.value =
        "";

    segundaSenha.focus();

}


function liberarAcesso(
    metodo
) {

    etapa1.classList.add(
        "escondido"
    );

    etapa2.classList.add(
        "escondido"
    );

    areaLiberada.classList.remove(
        "escondido"
    );


    metodoEntrada.textContent =
        metodo;


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

}


function normalizarTexto(
    texto
) {

    return texto
        .toLowerCase()
        .normalize(
            "NFD"
        )
        .replace(
            /[\u0300-\u036f]/g,
            ""
        )
        .trim();

}


formPrimeiraSenha.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const valor =
            primeiraSenha.value;


        if (
            valor ===
            PRIMEIRA_SENHA
        ) {

            erroPrimeiraSenha.classList.add(
                "escondido"
            );


            mostrarEtapa2();

        } else {

            erroPrimeiraSenha.classList.remove(
                "escondido"
            );


            primeiraSenha.value =
                "";

            primeiraSenha.focus();

        }

    }
);


formSegundaSenha.addEventListener(
    "submit",
    function (evento) {

        evento.preventDefault();


        const valor =
            segundaSenha.value;


        if (
            valor ===
            SEGUNDA_SENHA
        ) {

            erroSegundaSenha.classList.add(
                "escondido"
            );


            liberarAcesso(
                "Senha 2"
            );

        } else {

            erroSegundaSenha.classList.remove(
                "escondido"
            );


            segundaSenha.value =
                "";

            segundaSenha.focus();

        }

    }
);


function criarReconhecimento() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (
        !SpeechRecognition
    ) {

        return null;

    }


    const instancia =
        new SpeechRecognition();


    instancia.lang =
        "pt-BR";


    instancia.continuous =
        false;


    instancia.interimResults =
        false;


    instancia.maxAlternatives =
        5;


    return instancia;

}


function iniciarReconhecimento() {

    if (
        ouvindo
    ) {

        return;

    }


    erroMicrofone.classList.add(
        "escondido"
    );


    palavraDetectada.textContent =
        "—";


    reconhecimento =
        criarReconhecimento();


    if (
        !reconhecimento
    ) {

        erroMicrofone.textContent =
            "❌ Este navegador não disponibiliza reconhecimento de voz.";


        erroMicrofone.classList.remove(
            "escondido"
        );


        return;

    }


    ouvindo =
        true;


    botaoMicrofone.classList.add(
        "ouvindo"
    );


    botaoMicrofone.textContent =
        "🎤 OUVINDO...";


    statusVoz.textContent =
        "Fale agora a palavra-chave...";


    reconhecimento.onstart =
        function () {

            statusVoz.textContent =
                "🎤 Microfone ativo. Fale agora.";

        };


    reconhecimento.onresult =
        function (evento) {

            let melhorResultado =
                "";


            for (
                let i = 0;
                i < evento.results.length;
                i++
            ) {

                if (
                    evento.results[i] &&
                    evento.results[i][0]
                ) {

                    melhorResultado =
                        evento.results[i][0].transcript;

                    break;

                }

            }


            const textoOriginal =
                melhorResultado.trim();


            const textoNormalizado =
                normalizarTexto(
                    textoOriginal
                );


            palavraDetectada.textContent =
                '"' +
                textoOriginal +
                '"';


            if (
                textoNormalizado ===
                PALAVRA_CHAVE
            ) {

                statusVoz.textContent =
                    "✅ Palavra-chave correta!";


                setTimeout(
                    function () {

                        liberarAcesso(
                            "Palavra-chave"
                        );

                    },
                    400
                );

            } else {

                statusVoz.textContent =
                    "❌ Palavra-chave incorreta.";


                erroMicrofone.textContent =
                    "❌ A palavra reconhecida não corresponde à palavra-chave.";


                erroMicrofone.classList.remove(
                    "escondido"
                );

            }

        };


    reconhecimento.onerror =
        function (evento) {

            let mensagem =
                "❌ Não foi possível reconhecer a fala.";


            if (
                evento.error ===
                "not-allowed"
            ) {

                mensagem =
                    "❌ Permissão do microfone recusada.";

            }


            if (
                evento.error ===
                "no-speech"
            ) {

                mensagem =
                    "❌ Nenhuma fala foi detectada.";

            }


            if (
                evento.error ===
                "audio-capture"
            ) {

                mensagem =
                    "❌ O microfone não está disponível.";

            }


            erroMicrofone.textContent =
                mensagem;


            erroMicrofone.classList.remove(
                "escondido"
            );


            statusVoz.textContent =
                "Aguardando...";

        };


    reconhecimento.onend =
        function () {

            ouvindo =
                false;


            botaoMicrofone.classList.remove(
                "ouvindo"
            );


            botaoMicrofone.textContent =
                "🎤 FALAR PALAVRA-CHAVE";


            if (
                statusVoz.textContent ===
                "🎤 Microfone ativo. Fale agora."
            ) {

                statusVoz.textContent =
                    "Aguardando...";

            }

        };


    try {

        reconhecimento.start();

    } catch (erro) {

        ouvindo =
            false;


        botaoMicrofone.classList.remove(
            "ouvindo"
        );


        botaoMicrofone.textContent =
            "🎤 FALAR PALAVRA-CHAVE";


        erroMicrofone.textContent =
            "❌ Não foi possível iniciar o microfone.";


        erroMicrofone.classList.remove(
            "escondido"
        );

    }

}


botaoMicrofone.addEventListener(
    "click",
    function () {

        iniciarReconhecimento();

    }
);
