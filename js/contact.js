/* ZERONE STUDIO — contact.js
   問い合わせ先の設定はこのファイルの2行だけで管理します。

   - 値が空のあいだは、メール・フォームのリンクは一切表示されず
     「Contact channel opening soon.」の案内だけが出ます。
   - 値を入れると、トップと /business の問い合わせ導線が自動で表示されます。
   - JavaScriptが無効な環境でも、未設定のリンクが表に出ることはありません。 */

(function () {
  "use strict";

  var CONTACT = {
    email: "zeronestudio.office@gmail.com",
    formUrl: "https://forms.gle/uxtCk1KHb2TxDFdW8"
  };

  function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function isValidUrl(v) { return /^https:\/\/\S+$/.test(v); }

  function apply() {
    var hasEmail = isValidEmail(CONTACT.email);
    var hasForm = isValidUrl(CONTACT.formUrl);

    document.querySelectorAll('[data-contact="email"]').forEach(function (el) {
      if (!hasEmail) return;
      if (el.tagName === "A") el.href = "mailto:" + CONTACT.email;
      if (el.hasAttribute("data-contact-text")) el.textContent = CONTACT.email;
      el.hidden = false;
    });

    document.querySelectorAll('[data-contact="form"]').forEach(function (el) {
      if (!hasForm) return;
      el.href = CONTACT.formUrl;
      el.target = "_blank";
      el.rel = "noopener";
      el.hidden = false;
    });

    // 表示できる連絡手段が1つでもあれば、ブロックを出して「準備中」を隠す
    if (hasEmail || hasForm) {
      document.querySelectorAll("[data-contact-block]").forEach(function (el) { el.hidden = false; });
      document.querySelectorAll("[data-contact-pending]").forEach(function (el) { el.hidden = true; });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", apply);
  } else {
    apply();
  }
})();
