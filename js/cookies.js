// ---------------------------------------------------------------
// Consentimento de cookies (LGPD - Lei 13.709/2018).
// O registro fica no navegador do visitante, em localStorage.
// ---------------------------------------------------------------
(function () {
  var CHAVE = "emj-consentimento-cookies";
  var VERSAO = 1;

  var CATEGORIAS = [
    {
      id: "necessarios",
      titulo: "Necessários",
      descricao:
        "Guardam a sua escolha sobre cookies para que este aviso não reapareça. Sem eles o site não consegue respeitar a sua decisão.",
      obrigatorio: true,
    },
    {
      id: "analiticos",
      titulo: "Analíticos",
      descricao:
        "Mediriam de forma agregada como as páginas são utilizadas, para melhorar o site. Não estão em uso atualmente.",
      obrigatorio: false,
    },
    {
      id: "marketing",
      titulo: "Marketing",
      descricao:
        "Serviriam para medir campanhas e exibir anúncios direcionados. Não estão em uso atualmente.",
      obrigatorio: false,
    },
  ];

  function ler() {
    try {
      var bruto = localStorage.getItem(CHAVE);
      if (!bruto) return null;
      var dados = JSON.parse(bruto);
      return dados && dados.versao === VERSAO ? dados : null;
    } catch (e) {
      return null;
    }
  }

  function gravar(escolhas) {
    var registro = {
      versao: VERSAO,
      data: new Date().toISOString(),
      escolhas: escolhas,
    };
    try {
      localStorage.setItem(CHAVE, JSON.stringify(registro));
    } catch (e) {}
    aplicar(registro);
  }

  // Ponto de extensão: ative aqui os scripts de cada categoria
  // (analytics, pixels etc.) somente quando a escolha for true.
  function aplicar(registro) {
    document.dispatchEvent(
      new CustomEvent("emj:consentimento", { detail: registro.escolhas })
    );
  }

  function todas(valor) {
    var escolhas = {};
    CATEGORIAS.forEach(function (cat) {
      escolhas[cat.id] = cat.obrigatorio ? true : valor;
    });
    return escolhas;
  }

  function montar() {
    var banner = document.createElement("section");
    banner.className = "cookie-banner";
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-live", "polite");
    banner.setAttribute("aria-label", "Aviso de cookies");

    var opcoes = CATEGORIAS.map(function (cat) {
      return (
        '<label class="cookie-opcao">' +
        '<input type="checkbox" value="' +
        cat.id +
        '"' +
        (cat.obrigatorio ? " checked disabled" : "") +
        " />" +
        "<span><strong>" +
        cat.titulo +
        (cat.obrigatorio ? " (sempre ativos)" : "") +
        "</strong>" +
        cat.descricao +
        "</span>" +
        "</label>"
      );
    }).join("");

    banner.innerHTML =
      '<div class="cookie-inner">' +
      '<div class="cookie-texto">' +
      "<h2>Este site usa cookies</h2>" +
      "<p>Usamos cookies necessários ao funcionamento do site. Categorias que dependem do seu aceite só são ativadas se você autorizar. " +
      'Você pode recusar sem prejuízo da navegação e mudar de ideia quando quiser. Saiba mais na <a href="politica-de-cookies.html">Política de Cookies</a> ' +
      'e na <a href="politica-de-privacidade.html">Política de Privacidade</a>.</p>' +
      "</div>" +
      '<div class="cookie-opcoes" hidden>' +
      opcoes +
      "</div>" +
      '<div class="cookie-acoes">' +
      '<button type="button" class="cookie-btn cookie-btn-secundario" data-acao="rejeitar">Rejeitar todos</button>' +
      '<button type="button" class="cookie-btn cookie-btn-secundario" data-acao="personalizar">Personalizar</button>' +
      '<button type="button" class="cookie-btn cookie-btn-principal" data-acao="aceitar">Aceitar todos</button>' +
      '<button type="button" class="cookie-btn cookie-btn-principal" data-acao="salvar" hidden>Salvar escolhas</button>' +
      "</div>" +
      "</div>";

    document.body.appendChild(banner);

    var painel = banner.querySelector(".cookie-opcoes");
    var btnPersonalizar = banner.querySelector('[data-acao="personalizar"]');
    var btnSalvar = banner.querySelector('[data-acao="salvar"]');
    var btnAceitar = banner.querySelector('[data-acao="aceitar"]');

    banner.addEventListener("click", function (evento) {
      var acao = evento.target.getAttribute("data-acao");
      if (!acao) return;

      if (acao === "personalizar") {
        painel.hidden = false;
        btnPersonalizar.hidden = true;
        btnAceitar.hidden = true;
        btnSalvar.hidden = false;
        return;
      }

      if (acao === "aceitar") gravar(todas(true));
      if (acao === "rejeitar") gravar(todas(false));

      if (acao === "salvar") {
        var escolhas = {};
        CATEGORIAS.forEach(function (cat) {
          var campo = painel.querySelector('input[value="' + cat.id + '"]');
          escolhas[cat.id] = cat.obrigatorio ? true : !!(campo && campo.checked);
        });
        gravar(escolhas);
      }

      banner.remove();
    });

    return banner;
  }

  function abrir() {
    if (!document.querySelector(".cookie-banner")) montar();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var registro = ler();
    if (registro) {
      aplicar(registro);
    } else {
      montar();
    }

    document
      .querySelectorAll('[data-cookies="abrir-preferencias"]')
      .forEach(function (el) {
        el.addEventListener("click", function (evento) {
          evento.preventDefault();
          abrir();
        });
      });
  });

  window.emjCookies = { abrir: abrir, ler: ler };
})();
