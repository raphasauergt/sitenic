/* ============================================================
   NICOLE RODRIGUES STUDIO — Extensão de Cílios
   JS: header scroll, menu mobile, reveal on scroll, formulário
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  /* Header shadow on scroll */
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 30);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  navToggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      header.classList.remove("nav-open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });

  /* Reveal on scroll */
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  /* Year */
  document.getElementById("ano").textContent = new Date().getFullYear();

  /* Feedback visual: ripple nos botões */
  const addRipple = (event) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.9;
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
    target.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
  };
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      addRipple(event);
    });
  });

  /* Feedback visual: destaque do link tocado */
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("is-tapped"));
      link.classList.add("is-tapped");
      window.setTimeout(() => link.classList.remove("is-tapped"), 450);
    });
  });

  /* Toast de confirmação */
  let toastTimer;
  const showToast = (message) => {
    let toast = document.getElementById("siteToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "siteToast";
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("show"), 3200);
  };

  /* Form → WhatsApp */
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.textContent;
  let submitTimer;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    const nome = (dados.get("nome") || "").trim();
    const email = (dados.get("email") || "").trim();
    const tel = (dados.get("telefone") || "").trim();
    const servico = (dados.get("servico") || "").trim();
    const msg = (dados.get("mensagem") || "").trim();

    const texto = [
      "Olá, sou " + (nome || "visitante") + ".",
      "Gostaria de agendar: " + (servico || "extensão de cílios") + ".",
      "E-mail: " + (email || "-") + " | Telefone: " + (tel || "-"),
      msg ? "Mensagem: " + msg : "",
    ].filter(Boolean).join("\n");

    const wa = "https://wa.me/5543996003682?text=" + encodeURIComponent(texto);

    submitBtn.textContent = "Abrindo WhatsApp...";
    showToast("Mensagem pronta! Abrindo o WhatsApp...");
    window.clearTimeout(submitTimer);
    submitTimer = window.setTimeout(() => {
      submitBtn.textContent = submitLabel;
    }, 2600);

    window.open(wa, "_blank");
    form.reset();
  });
});
