/* ============================================================
   NICOLE RODRIGUES STUDIO — Extensão de Cílios
   JS: progresso de leitura, header, menu mobile, navegação ativa,
   reveal, FAQ, formulário → WhatsApp e feedback de clique
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("header");
  const navToggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");
  const progress = document.getElementById("scrollProgress");
  const navLinks = [...nav.querySelectorAll("a")];

  /* ---------- Scroll: header, progresso e link ativo ---------- */
  const sectionIds = navLinks.map((link) => link.getAttribute("href").slice(1));
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const setActiveLink = () => {
    const marker = window.scrollY + 120;
    let current = null;
    sections.forEach((section) => {
      if (section.offsetTop <= marker && (!current || section.offsetTop >= current.offsetTop)) {
        current = section;
      }
    });
    const currentId = current ? current.id : "inicio";
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === "#" + currentId;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  let ticking = false;
  const updateOnScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const pct = max > 0 ? Math.min(100, Math.max(0, (window.scrollY / max) * 100)) : 0;
      progress.style.width = pct + "%";
    }

    setActiveLink();
    ticking = false;
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateOnScroll);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", updateOnScroll);
  updateOnScroll();

  /* ---------- Menu mobile ---------- */
  const closeNav = () => {
    header.classList.remove("nav-open");
    navToggle.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menu");
    document.body.classList.remove("nav-open");
  };

  navToggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.classList.toggle("nav-open", open);
  });

  header.addEventListener("click", (e) => {
    if (e.target.closest("a") && header.classList.contains("nav-open")) closeNav();
  });

  document.addEventListener("click", (e) => {
    if (!header.classList.contains("nav-open")) return;
    if (e.target.closest("#mainNav") || e.target.closest("#navToggle")) return;
    closeNav();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("nav-open")) closeNav();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 860 && header.classList.contains("nav-open")) closeNav();
  });

  /* ---------- Reveal on scroll ---------- */
  const revealEls = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
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
  } else {
    revealEls.forEach((el) => el.classList.add("visible"));
  }

  /* ---------- FAQ: abre uma pergunta por vez ---------- */
  const faqItems = [...document.querySelectorAll(".faq-item")];
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    });
  });

  /* ---------- Ano ---------- */
  const year = document.getElementById("ano");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Feedback visual: ripple ---------- */
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

  document.querySelectorAll(".btn, .service-go, .dock-btn").forEach((btn) => {
    btn.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      addRipple(event);
    });
  });

  /* ---------- Feedback visual: link tocado ---------- */
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.forEach((item) => item.classList.remove("is-tapped"));
      link.classList.add("is-tapped");
      window.setTimeout(() => link.classList.remove("is-tapped"), 450);
    });
  });

  /* ---------- Toast de confirmação ---------- */
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

  /* ---------- Formulário → WhatsApp ---------- */
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector('button[type="submit"]');
  const submitLabel = submitBtn.textContent;
  let submitTimer;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const dados = new FormData(form);
    const nome = (dados.get("nome") || "").trim();
    const tel = (dados.get("telefone") || "").trim();
    const servico = (dados.get("servico") || "").trim();
    const msg = (dados.get("mensagem") || "").trim();

    const texto = [
      "Olá, sou " + (nome || "visitante") + ".",
      "Gostaria de agendar: " + (servico || "extensão de cílios") + ".",
      "Telefone/WhatsApp: " + (tel || "-"),
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
