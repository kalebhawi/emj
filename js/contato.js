// ---------------------------------------------------------------
// Fonte unica do telefone de contato.
// Altere SOMENTE a constante abaixo: ela define o numero exibido
// no rodape e o destino do botao flutuante do WhatsApp.
// Formato: DDI + DDD + numero, somente digitos.
// ---------------------------------------------------------------
var TELEFONE = "5551995747331";

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
});
