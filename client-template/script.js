document.addEventListener("DOMContentLoaded", () => {
  const p = window.profile;

  if (!p) {
    console.error("profile data was not found.");
    return;
  }

  const $ = (id) => document.getElementById(id);

  const setText = (id, value) => {
    const el = $(id);
    if (el) el.textContent = value || "";
  };

  const setHref = (id, href) => {
    const el = $(id);
    if (!el) return;

    if (href) {
      el.href = href;
      el.classList.remove("is-hidden");
    } else {
      el.classList.add("is-hidden");
    }
  };

  const hideSectionIfEmpty = (sectionId, hasContent) => {
    const section = $(sectionId);
    if (section) section.classList.toggle("is-hidden", !hasContent);
  };

  // -----------------------------------------------------
  // THEME
  // -----------------------------------------------------

  document.body.dataset.theme = p.theme || "executive-light";

  if (p.accentColor) {
    document.documentElement.style.setProperty("--accent", p.accentColor);
  }

  // -----------------------------------------------------
  // PAGE META
  // -----------------------------------------------------

  document.title = `${p.ownerName || "Digital Profile"} | ${p.businessName || ""}`;

  const description = document.querySelector('meta[name="description"]');
  if (description) {
    description.content = p.about || `${p.ownerName} — ${p.businessName}`;
  }

  // -----------------------------------------------------
  // IMAGES
  // -----------------------------------------------------

  const logo = $("businessLogo");
  if (p.businessLogo) {
    logo.src = p.businessLogo;
  } else {
    logo.classList.add("is-hidden");
  }

  logo.addEventListener("error", () => logo.classList.add("is-hidden"));

  const photo = $("ownerPhoto");
  if (p.ownerPhoto) {
    photo.src = p.ownerPhoto;
  } else {
    photo.classList.add("is-hidden");
  }

  photo.addEventListener("error", () => photo.classList.add("is-hidden"));

  // -----------------------------------------------------
  // IDENTITY
  // -----------------------------------------------------

  setText("ownerName", p.ownerName);
  setText("designation", p.designation);
  setText("businessName", p.businessName);
  setText("categoryBadge", p.category);
  setText("footerBusiness", p.businessName);

  // -----------------------------------------------------
  // QUICK ACTIONS
  // -----------------------------------------------------

  setHref("callBtn", p.phone ? `tel:${p.phone}` : "");
  setHref("whatsappBtn", p.whatsapp ? `https://wa.me/${p.whatsapp}` : "");
  setHref("emailBtn", p.email ? `mailto:${p.email}` : "");
  setHref("websiteBtn", p.website);

  // -----------------------------------------------------
  // ABOUT
  // -----------------------------------------------------

  const hasAbout = Boolean(p.about);
  setText("about", p.about);
  hideSectionIfEmpty("aboutSection", hasAbout);

  // -----------------------------------------------------
  // SERVICES
  // -----------------------------------------------------

  const services = Array.isArray(p.services) ? p.services.filter(Boolean) : [];
  const serviceContainer = $("services");

  services.forEach((service) => {
    const item = document.createElement("div");
    item.className = "service-item";

    const marker = document.createElement("span");
    marker.className = "service-marker";
    marker.textContent = "—";

    const text = document.createElement("span");
    text.textContent = service;

    item.append(marker, text);
    serviceContainer.appendChild(item);
  });

  hideSectionIfEmpty("servicesSection", services.length > 0);

  // -----------------------------------------------------
  // CONTACT
  // -----------------------------------------------------

  setText("phoneText", p.phone);
  setText("emailText", p.email);
  setText("addressText", p.address);

  setHref("phoneRow", p.phone ? `tel:${p.phone}` : "");
  setHref("emailRow", p.email ? `mailto:${p.email}` : "");
  setHref("mapsRow", p.googleMaps);

  const contactHasContent = Boolean(p.phone || p.email || p.address);
  hideSectionIfEmpty("contactSection", contactHasContent);

  // -----------------------------------------------------
  // SOCIALS
  // -----------------------------------------------------

  setHref("instagramBtn", p.instagram);
  setHref("linkedinBtn", p.linkedin);
  setHref("facebookBtn", p.facebook);
  setHref("mapsBtn", p.googleMaps);

  const socialHasContent = Boolean(
    p.instagram || p.linkedin || p.facebook || p.googleMaps
  );

  hideSectionIfEmpty("socialSection", socialHasContent);

  // -----------------------------------------------------
  // SAVE CONTACT / VCARD
  // -----------------------------------------------------

  $("saveContact").addEventListener("click", () => {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${escapeVCard(p.ownerName)}`,
      `ORG:${escapeVCard(p.businessName)}`,
      `TITLE:${escapeVCard(p.designation)}`,
      p.phone ? `TEL;TYPE=CELL:${escapeVCard(p.phone)}` : "",
      p.email ? `EMAIL:${escapeVCard(p.email)}` : "",
      p.website ? `URL:${escapeVCard(p.website)}` : "",
      p.address ? `ADR;TYPE=WORK:;;${escapeVCard(p.address)}` : "",
      "END:VCARD"
    ].filter(Boolean);

    const blob = new Blob([lines.join("\r\n")], {
      type: "text/vcard;charset=utf-8"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download =
      `${(p.ownerName || "contact")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase()}-contact.vcf`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast("Contact card created");
  });

  // -----------------------------------------------------
  // SHARE
  // -----------------------------------------------------

  $("shareProfile").addEventListener("click", async () => {
    const shareData = {
      title: `${p.ownerName} | ${p.businessName}`,
      text: `Digital profile for ${p.ownerName}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled share; no action needed.
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Profile link copied");
      } catch {
        showToast("Copy the URL from your browser");
      }
    }
  });

  // -----------------------------------------------------
  // HELPERS
  // -----------------------------------------------------

  function escapeVCard(value) {
    return String(value || "")
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/;/g, "\\;")
      .replace(/,/g, "\\,");
  }

  let toastTimer;

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2200);
  }
});
