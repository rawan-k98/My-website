// communication and validation of the events from,event detaila,and filtering.
document.addEventListener("DOMContentLoaded", () => {
  // Night mode button inside the navigation bar,with saving the user's choice.
  const navCollapse = document.querySelector(".navbar-collapse");
  if (navCollapse) {
    const themeButton = document.createElement("button");
    themeButton.type = "button";
    themeButton.className = "theme-toggle btn rounded-pill";
    themeButton.setAttribute("aria-pressed", "false");
    themeButton.setAttribute("aria-label", "تبديل الوضع الليلي");
    themeButton.innerHTML = '<span class="theme-icon" aria-hidden="true">☾</span><span class="theme-label">الوضع الليلي</span>';
    navCollapse.appendChild(themeButton);
    const applyTheme = dark => {
      document.body.classList.toggle("dark-mode", dark);
      themeButton.setAttribute("aria-pressed", String(dark));
      themeButton.innerHTML = dark
        ? '<span class="theme-icon" aria-hidden="true">☀</span><span class="theme-label">الوضع النهاري</span>'
        : '<span class="theme-icon" aria-hidden="true">☾</span><span class="theme-label">الوضع الليلي</span>';
    };
    let savedTheme = false;
    try { savedTheme = localStorage.getItem("nabd-theme") === "dark"; } catch (e) {}
    applyTheme(savedTheme);
    themeButton.addEventListener("click", () => {
      const dark = !document.body.classList.contains("dark-mode");
      applyTheme(dark);
      try { localStorage.setItem("nabd-theme", dark ? "dark" : "light"); } catch (e) {}
    });
  }

  // Arrow button to go to the top of page,appears after scrolling.
  const topButton = document.createElement("button");
  topButton.type = "button";
  topButton.className = "back-to-top";
  topButton.innerHTML = "↑";
  topButton.setAttribute("aria-label", "العودة إلى أعلى الصفحة");
  topButton.title = "العودة إلى أعلى الصفحة";
  document.body.appendChild(topButton);
  const updateTopButton = () => topButton.classList.toggle("is-visible", window.scrollY > 300);
  window.addEventListener("scroll", updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Filtering the events page by keyword,category,and month.
  const grid = document.getElementById("eventsGrid");
  if (grid) {
    const search = document.getElementById("searchInput");
    const category = document.getElementById("categoryFilter");
    const date = document.getElementById("dateFilter");
    const items = [...grid.querySelectorAll(".event-item")];
    const count = document.getElementById("resultsCount");
    const empty = document.getElementById("noResults");
    const params = new URLSearchParams(location.search);
    if (params.get("category")) category.value = params.get("category");
    function filterEvents() {
      const q = (search.value || "").trim().toLowerCase();
      let visible = 0;
      items.forEach(item => {
        const matchesText = (item.dataset.title + " " + item.dataset.location).toLowerCase().includes(q);
        const matchesCategory = !category.value || item.dataset.category === category.value;
        const matchesDate = !date.value || item.dataset.date === date.value;
        const show = matchesText && matchesCategory && matchesDate;
        item.classList.toggle("d-none", !show);
        if (show) visible++;
      });
      count.textContent = `عدد الفعاليات المعروضة: ${visible}`;
      empty.classList.toggle("d-none", visible !== 0);
    }
    [search, category, date].forEach(el => el.addEventListener("input", filterEvents));
    document.getElementById("resetFilters").addEventListener("click", () => {
      search.value = ""; category.value = ""; date.value = ""; filterEvents();
    });
    filterEvents();
  }

  // mock data displaying different details when opening =event.html.
  const eventData = {
    ai: {title:"ورشة الذكاء الاصطناعي", category:"تقنية", date:"1 تشرين الثاني 2026", location:"عبر الإنترنت", image:"assets/img/Artificial intelligence.jpg", images:["assets/img/Ai_1.jpg","assets/img/Ai_2.jpg","assets/img/Ai_3.jpg","assets/img/Ai_4.jpg"], description:"تعرّف إلى أحدث تطبيقات الذكاء الاصطناعي وكيف يمكن الاستفادة منها في الدراسة وتنظيم المهام اليومية. تتضمن الورشة أمثلة عملية ونقاشاً مفتوحاً وأسئلة من المشاركين."},
    students: {title:"ملتقى طلاب الجامعة", category:"اجتماعي", date:"2 تشرين الثاني 2026", location:"لقاء افتراضي", image:"assets/img/freinds.avif", images:["assets/img/frind_1.jpg","assets/img/frind_2.jpg","assets/img/frind_3.jpg","assets/img/frind_4.jpg"], description:"لقاء مفتوح لطلاب الجامعة الافتراضية السورية للتعارف وتبادل التجارب والأفكار، وبناء علاقات تعاونية تساعد على النجاح والتطور."},
    art: {title:"مساحة الإبداع الطلابي", category:"فن", date:"5 تشرين الثاني 2026", location:"معرض افتراضي", image:"assets/img/book_2.jpg", images:["assets/img/Art.jpg","assets/img/Art_1.jpg","assets/img/Art_3.jpg","assets/img/Art_2.jpg"], description:"مساحة رقمية لعرض المواهب الفنية والأعمال الإبداعية للطلاب، مع فرصة للتعليق وتبادل الأفكار والإلهام."},
    reading: {title:"قراءة ونقاش", category:"ثقافة", date:"9 تشرين الثاني 2026", location:"عبر الإنترنت", image:"assets/img/books.jpg", images:["assets/img/book_2.jpg","assets/img/book_1.jpg","assets/img/book_3.jpg","assets/img/book_4.jpg"], description:"جلسة ثقافية تفاعلية نقرأ فيها كتاباً مختاراً ونناقش أبرز الأفكار والدروس التي يمكن تطبيقها في الحياة والدراسة."},
    sport: {title:"تحدي الحركة والنشاط", category:"رياضة", date:"11 تشرين الثاني 2026", location:"مشاركة عن بُعد", image:"assets/img/sport.jpg", images:["assets/img/sport_1.jpg","assets/img/sport_2.jpg","assets/img/sport_3.avif","assets/img/sport_4.jpg"], description:"تحدٍّ ودي لتشجيع الحركة اليومية والنشاط البدني، مع مشاركة الإنجازات وتحفيز الزملاء على اتباع عادات صحية."},
    presentation: {title:"مهارات العرض والتقديم", category:"ثقافة", date:"12 تشرين الثاني 2026", location:"عبر الإنترنت", image:"assets/img/maic.jpg", images:["assets/img/maic_1.jpg","assets/img/maic_2.jpg","assets/img/maic_3.jpg","assets/img/maic_4.jpg"], description:"ورشة تساعدالمشاركين على تنظيم الأفكار، وبناء عرض واضح، والتحدث بثقة أمام الجمهور، مع نصائح عملية للتقديم الفعال."}
  };
  const title = document.getElementById("eventTitle");
  if (title) {
    const key = new URLSearchParams(location.search).get("id") || "ai";
    const data = eventData[key] || eventData.ai;
    title.textContent = data.title;
    document.title = data.title + " | نبض الجامعة";
    document.getElementById("eventCategory").textContent = data.category;
    document.getElementById("eventDate").textContent = data.date;
    document.getElementById("eventLocation").textContent = data.location;
    document.getElementById("eventLocationShort").textContent = data.location;
    const galleryImages = data.images || [data.image, data.image, data.image, data.image];
    let galleryIndex = 0;
    const mainImage = document.getElementById("eventImage");
    const counter = document.getElementById("galleryCounter");
    const thumbs = document.getElementById("galleryThumbnails");
    function showGalleryImage(index) {
      galleryIndex = (index + galleryImages.length) % galleryImages.length;
      mainImage.src = galleryImages[galleryIndex];
      mainImage.alt = `${data.title} — الصورة ${galleryIndex + 1} من ${galleryImages.length}`;
      if (counter) counter.textContent = `${galleryIndex + 1} / ${galleryImages.length}`;
      if (thumbs) [...thumbs.querySelectorAll("button")].forEach((button, i) => {
        button.classList.toggle("active", i === galleryIndex);
        button.setAttribute("aria-pressed", String(i === galleryIndex));
      });
    }
    if (thumbs) {
      thumbs.innerHTML = galleryImages.map((src, i) => `<button type="button" class="gallery-thumb${i === 0 ? " active" : ""}" aria-label="عرض الصورة ${i + 1}" aria-pressed="${i === 0}" data-index="${i}"><img src="${src}" alt=""></button>`).join("");
      thumbs.addEventListener("click", e => {
        const button = e.target.closest("button[data-index]");
        if (button) showGalleryImage(Number(button.dataset.index));
      });
    }
    document.getElementById("galleryPrev")?.addEventListener("click", () => showGalleryImage(galleryIndex - 1));
    document.getElementById("galleryNext")?.addEventListener("click", () => showGalleryImage(galleryIndex + 1));
    showGalleryImage(0);
    document.getElementById("eventDescription").textContent = data.description;
    const alertBox = document.getElementById("detailAlert");
    document.getElementById("calendarBtn").addEventListener("click", () => {
      const start = new Date("2026-10-28T17:00:00");
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const fmt = d => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const ics = ["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Nabd University//AR","BEGIN:VEVENT",`DTSTART:${fmt(start)}`,`DTEND:${fmt(end)}`,`SUMMARY:${data.title}`,`DESCRIPTION:${data.description}`,`LOCATION:${data.location}`,"END:VEVENT","END:VCALENDAR"].join("\r\n");
      const blob = new Blob([ics], {type:"text/calendar;charset=utf-8"});
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = "university-event.ics"; a.click(); URL.revokeObjectURL(url);
      alertBox.textContent = "تم تجهيز ملف التقويم للتنزيل. راجع التاريخ والوقت قبل اعتماده.";
      alertBox.classList.remove("d-none");
    });
    document.getElementById("shareBtn").addEventListener("click", async () => {
      try {
        if (navigator.share) await navigator.share({title:data.title, text:data.description, url:location.href});
        else { await navigator.clipboard.writeText(location.href); alertBox.textContent = "تم نسخ رابط الفعالية."; alertBox.classList.remove("d-none"); }
      } catch (e) { /* the user closed the sharing window */ }
    });
  }

  // check the fields and display an explanatory message.
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", e => {
      e.preventDefault();
      form.classList.add("was-validated");
      const alertBox = document.getElementById("formAlert");
      if (!form.checkValidity()) {
        alertBox.className = "alert alert-danger";
        alertBox.textContent = "يرجى مراجعة الحقول المحددة وإدخال المعلومات المطلوبة بشكل صحيح.";
        return;
      }
      alertBox.className = "alert alert-success";
      alertBox.textContent = "شكراً لك! تم التحقق من النموذج بنجاح. (نسخة تجريبية: لم تُرسل البيانات إلى خادم)";
      form.reset();
      form.classList.remove("was-validated");
    });
  }

  // navigation buttons between featured cards on small screens.
  const featured = document.getElementById("featuredEvents");
  if (featured) {
    const slides = [...featured.querySelectorAll(".event-slide")];
    let current = 0;
    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      if (window.innerWidth < 768) slides.forEach((s, i) => s.classList.toggle("d-none", i !== current));
      else slides.forEach(s => s.classList.remove("d-none"));
    }
    document.getElementById("prevFeatured").addEventListener("click", () => showSlide(current - 1));
    document.getElementById("nextFeatured").addEventListener("click", () => showSlide(current + 1));
    showSlide(0);
    window.addEventListener("resize", () => showSlide(current));
  }
});