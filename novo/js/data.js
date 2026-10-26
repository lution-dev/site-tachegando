/*
 * Camada de dados do PROTÓTIPO.
 * Tudo fica no localStorage do navegador (sem servidor, sem segurança real).
 * Contas de demonstração são criadas automaticamente para entrar direto.
 * Para ligar a um banco real, troque só a implementação destas funções
 * e REMOVA as contas de demonstração (DEMO) e os atalhos da tela Entrar.
 */
window.TC = (function () {
  var K_USERS = "tc_users", K_SESSION = "tc_session";

  var DEMO = {
    vendedor: {
      email: "vendedor@tachegando.demo", senha: "demo123", tipo: "vendedor",
      perfil: { nome: "Maria Souza", telefone: "(13) 99876-5432", vende: ["Ovos", "Pão", "Queijo"], meio: "Bicicleta", cidade: "Santos", bairros: "Gonzaga, Boqueirão, Embaré", dias: ["Seg", "Qua", "Sex", "Sáb"] }
    },
    apoio: {
      email: "apoio@tachegando.demo", senha: "demo123", tipo: "apoio",
      perfil: { tipoApoio: "Profissional autônomo", nome: "Ana Lima Contabilidade", responsavel: "Ana Lima", documento: "", areas: ["Contabilidade", "Orientação financeira"], apoio: "Posso ajudar vendedores a organizar as contas do mês e a entender as obrigações do dia a dia.", cidade: "Recife", telefone: "(81) 98888-7777" }
    }
  };
  var EXEMPLO = { // pré-preenchimento do cadastro de contas novas
    vendedor: DEMO.vendedor.perfil,
    apoio: DEMO.apoio.perfil
  };

  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function hash(t) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function publico(u) { return u && { email: u.email, tipo: u.tipo, perfil: u.perfil || null }; }
  function copia(o) { return JSON.parse(JSON.stringify(o)); }

  var pronto = Promise.all(Object.keys(DEMO).map(function (k) {
    var d = DEMO[k];
    if (read(K_USERS, {})[d.email]) return null;
    return hash(d.senha).then(function (h) {
      var users = read(K_USERS, {});
      users[d.email] = { email: d.email, senha: h, tipo: d.tipo, perfil: copia(d.perfil) };
      write(K_USERS, users);
    });
  }));

  return {
    prototipo: true,
    demo: { vendedor: { email: DEMO.vendedor.email, senha: DEMO.vendedor.senha }, apoio: { email: DEMO.apoio.email, senha: DEMO.apoio.senha } },
    perfilExemplo: function (tipo) { return copia(EXEMPLO[tipo] || {}); },
    emailNovo: function () { return "novo" + String(Date.now()).slice(-5) + "@tachegando.demo"; },
    usuarioAtual: function () {
      var email = read(K_SESSION, null);
      return publico(email && read(K_USERS, {})[email]);
    },
    criarConta: function (email, senha, tipo) {
      email = email.trim().toLowerCase();
      return pronto.then(function () { return hash(senha); }).then(function (h) {
        var users = read(K_USERS, {});
        if (users[email]) throw new Error("Já existe uma conta com esse e-mail.");
        users[email] = { email: email, senha: h, tipo: tipo, perfil: null };
        write(K_USERS, users); write(K_SESSION, email);
        return publico(users[email]);
      });
    },
    entrar: function (email, senha) {
      email = email.trim().toLowerCase();
      return pronto.then(function () { return hash(senha); }).then(function (h) {
        var u = read(K_USERS, {})[email];
        if (!u || u.senha !== h) throw new Error("E-mail ou senha incorretos.");
        write(K_SESSION, email);
        return publico(u);
      });
    },
    sair: function () { try { localStorage.removeItem(K_SESSION); } catch (e) {} },
    salvarPerfil: function (perfil) {
      var email = read(K_SESSION, null), users = read(K_USERS, {});
      if (!email || !users[email]) return Promise.reject(new Error("Sessão expirada."));
      users[email].perfil = perfil; write(K_USERS, users);
      return Promise.resolve(publico(users[email]));
    },
    registrarInteresse: function (dados) {
      var l = read("tc_interesses", []); l.push(Object.assign({ em: new Date().toISOString() }, dados));
      write("tc_interesses", l); return Promise.resolve();
    }
  };
})();
