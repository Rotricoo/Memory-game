let grupoDeCartas = [
  "Assets/Photos/Andreia.jpg",
  "Assets/Photos/Andressa.jpg",
  "Assets/Photos/Ju.jpg",
  "Assets/Photos/Lara.jpg",
  "Assets/Photos/Maria-Eduarda.jpg",
  "Assets/Photos/Matt.jpg",
  "Assets/Photos/Rod.jpg",
];

let totalDeCartas = grupoDeCartas.concat(grupoDeCartas);
let primeiraCarta = null;
let segundaCarta = null;
let mesaTravada = true;
let tempoInicio = null;
let tentativas = 0;
let acertos = 0;

function distribuirCartas() {
  const mesa = document.getElementById("mesa");

  function embaralhar(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));

      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  totalDeCartas = embaralhar(totalDeCartas);

  totalDeCartas.forEach(function (cartaFoto) {
    const carta = document.createElement("div");
    const cartaVerso = document.createElement("div");
    const cartaFrente = document.createElement("div");
    const cartaFrenteImg = document.createElement("img");

    carta.classList.add("carta");
    cartaVerso.classList.add("cartaVerso");
    cartaFrente.classList.add("cartaFrente");

    carta.dataset.foto = cartaFoto;

    cartaFrenteImg.src = cartaFoto;

    carta.appendChild(cartaVerso);
    carta.appendChild(cartaFrente);
    cartaFrente.appendChild(cartaFrenteImg);

    mesa.appendChild(carta);

    carta.addEventListener("click", function () {
      if (mesaTravada) return;
      if (this === primeiraCarta) return;
      if (this.classList.contains("virada")) return;
      if (this.classList.contains("acertadas")) return;

      if (primeiraCarta === null) {
        primeiraCarta = this;
        this.classList.add("virada");
        return;
      } else if (segundaCarta === null) {
        segundaCarta = this;
        this.classList.add("virada");
        tentativas++;
        document.getElementById("tentativas").textContent = tentativas;

        if (primeiraCarta.dataset.foto === segundaCarta.dataset.foto) {
          console.log("Acertou");
          acertos++;
          document.getElementById("acertos").textContent = acertos;
          primeiraCarta.classList.add("acertadas");
          segundaCarta.classList.add("acertadas");
          primeiraCarta = null;
          segundaCarta = null;

          if (acertos === grupoDeCartas.length) {
            mesaTravada = true;
            let tempoFinal = Math.floor((Date.now() - tempoInicio) / 1000);
            let minutos = Math.floor(tempoFinal / 60);
            let segundos = tempoFinal % 60;

            setTimeout(function () {
              mostrarModalVitoria(tentativas, minutos, segundos);
            }, 800);

            return;
          }
        } else {
          console.log("Errou");
          mesaTravada = true;

          setTimeout(function () {
            primeiraCarta.classList.remove("virada");
            segundaCarta.classList.remove("virada");

            primeiraCarta = null;
            segundaCarta = null;
            mesaTravada = false;
          }, 1000);
        }
      }
    });
  });
}

function iniciarJogo() {
  tempoInicio = Date.now();
  mesaTravada = false;
  document.getElementById("inicio").classList.remove("ativo");
}

function resetJogo() {
  primeiraCarta = null;
  segundaCarta = null;
  mesaTravada = true;
  tentativas = 0;
  acertos = 0;
  tempoInicio = null;

  document.getElementById("tentativas").textContent = 0;
  document.getElementById("acertos").textContent = 0;

  document.getElementById("mesa").innerHTML = "";

  totalDeCartas = grupoDeCartas.concat(grupoDeCartas);
  distribuirCartas();

  document.getElementById("inicio").classList.add("ativo");
}

function mostrarModalVitoria(numTentativas, minutos, segundos) {
  document.getElementById("modalTempo").textContent = `${minutos}m ${segundos}s`;
  document.getElementById("modalTentativas").textContent = numTentativas;

  document.getElementById("modalVitoria").classList.add("ativo");

  confetti({
    particleCount: 1000,
    spread: 100,
    origin: {
      y: 0.9,
    },
  });
}

const btnIniciar = document.getElementById("btnIniciar");
if (btnIniciar) btnIniciar.addEventListener("click", iniciarJogo);

const btnJogarNovamente = document.getElementById("btnJogarNovamente");
if (btnJogarNovamente) {
  btnJogarNovamente.addEventListener("click", function () {
    document.getElementById("modalVitoria").classList.remove("ativo");
    resetJogo();
  });
}

distribuirCartas();
