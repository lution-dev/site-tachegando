/*
 * Camada de dados do PROTÓTIPO.
 * Hoje tudo fica no localStorage do navegador (sem servidor, sem segurança real).
 * Para ligar ao BD do app real, troque só a implementação destas funções
 * (ex.: Supabase Auth + tabelas de perfil). O resto do site não muda.
 */
window.TC = (function () {
  var K_USERS = "tc_users", K_SESSION = "tc_session";
  function read(k, d) { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } }
  function write(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function hash(t) {
    return crypto.subtle.digest("SHA-256", new TextEncoder().encode(t)).then(function (b) {
      return Array.from(new Uint8Array(b)).map(function (x) { return x.toString(16).padStart(2, "0"); }).join("");
    });
  }
  function publico(u) { return u && { email: u.email, tipo: u.tipo, perfil: u.perfil || null }; }

  return {
    prototipo: true,
    usuarioAtual: function () {
      var email = read(K_SESSION, null);
      var u = email && read(K_USERS, {})[email];
      return publico(u);
    },
    criarConta: function (email, senha, tipo) {
      email = email.trim().toLowerCase();
      var users = read(K_USERS, {});
      if (users[email]) return Promise.reject(new Error("Já existe uma conta com esse e-mail."));
      return hash(senha).then(function (h) {
        users[email] = { email: email, senha: h, tipo: tipo, perfil: null };
        write(K_USERS, users); write(K_SESSION, email);
        return publico(users[email]);
      });
    },
    entrar: function (email, senha) {
      email = email.trim().toLowerCase();
      var u = read(K_USERS, {})[email];
      return hash(senha).then(function (h) {
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
    }
  };
})();
