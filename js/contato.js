// ---------------------------------------------------------------
// Fonte unica do telefone de contato.
// Altere SOMENTE a constante abaixo: ela define o numero exibido
// no rodape e o destino do botao flutuante do WhatsApp.
// Formato: DDI + DDD + numero, somente digitos.
// ---------------------------------------------------------------
var TELEFONE = "5551980512233";

document.addEventListener("DOMContentLoaded", function () {
  var digitos = TELEFONE.replace(/\D/g, "");
  var ddd = digitos.slice(2, 4);
  var numero = digitos.slice(4);
  var exibicao =
    "(" +
    ddd +
    ") " +
    numero.slice(0, numero.length - 4) +
    "-" +
    numero.slice(-4);
  var mensagem = encodeURIComponent(
    "Olá, preciso de informação ou de orçamento.",
  );

  var link = "https://wa.me/" + digitos + "?text=" + mensagem;
  document
    .querySelectorAll('.wa-float, [data-contato="whatsapp"]')
    .forEach(function (el) {
      el.href = link;
    });

  document.querySelectorAll('[data-contato="telefone"]').forEach(function (el) {
    el.textContent = exibicao;
    el.href = "tel:+" + digitos;
  });

  copiaAoClicar();

  // mantem o telefone dos dados estruturados alinhado com a constante acima
  var dados = document.querySelector('script[type="application/ld+json"]');
  if (dados) {
    try {
      var json = JSON.parse(dados.textContent);
      json.telephone = "+" + digitos;
      dados.textContent = JSON.stringify(json);
    } catch (e) {}
  }
});

// ---------------------------------------------------------------
// Copiar telefone e e-mail para a area de transferencia.
// navigator.clipboard cobre desktop e mobile atuais; o segundo
// caminho atende http/file:// e navegadores antigos, incluindo o
// tratamento de selecao exigido pelo Safari do iOS.
// ---------------------------------------------------------------
function copiarTexto(texto) {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(texto);
  }

  return new Promise(function (resolve, reject) {
    var campo = document.createElement("textarea");
    campo.value = texto;
    campo.contentEditable = "true";
    campo.readOnly = false;
    campo.style.position = "fixed";
    campo.style.top = "0";
    campo.style.opacity = "0";
    campo.style.fontSize = "16px"; // evita o zoom automatico no iOS
    document.body.appendChild(campo);

    var intervalo = document.createRange();
    intervalo.selectNodeContents(campo);
    var selecao = window.getSelection();
    selecao.removeAllRanges();
    selecao.addRange(intervalo);
    campo.setSelectionRange(0, 999999);

    var copiou = false;
    try {
      copiou = document.execCommand("copy");
    } catch (e) {}

    selecao.removeAllRanges();
    document.body.removeChild(campo);
    copiou ? resolve() : reject(new Error("copia nao suportada"));
  });
}

function copiaAoClicar() {
  var aviso = document.querySelector(".footer-contato [role=\"status\"]");
  var relogio;

  document.querySelectorAll("[data-copiavel]").forEach(function (el) {
    el.addEventListener("click", function (evento) {
      var valor = el.textContent.trim();
      if (!valor) return;

      evento.preventDefault();

      copiarTexto(valor)
        .then(function () {
          el.classList.add("copiado");
          if (aviso) aviso.textContent = "Copiado";
          clearTimeout(relogio);
          relogio = setTimeout(function () {
            el.classList.remove("copiado");
            if (aviso) aviso.textContent = "";
          }, 1800);
        })
        .catch(function () {
          // sem permissao de area de transferencia: segue o link normalmente
          window.location.href = el.href;
        });
    });
  });
}
