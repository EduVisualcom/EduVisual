document.addEventListener("DOMContentLoaded", () => {

  // =========================================================
  // EDUVISUAL V1.1
  // ANA UYGULAMA
  // =========================================================

  let items = [];
  let activeFilter = "";

  // =========================================================
  // KATEGORİLER
  // =========================================================

  const categories = [
    {
      name: "Matematik",
      icon: "∑",
      desc: "Kesirler, geometri"
    },
    {
      name: "Fen Bilimleri",
      icon: "⚗",
      desc: "Deney, bilim"
    },
    {
      name: "Finans",
      icon: "₺",
      desc: "Bütçe, tasarruf"
    },
    {
      name: "İnfografik",
      icon: "◈",
      desc: "Şema, veri, süreç"
    },
    {
      name: "Etkinlik",
      icon: "✦",
      desc: "Çalışma ve oyun"
    },
    {
      name: "Arka Plan",
      icon: "▧",
      desc: "Sayfa dekorları"
    }
  ];

  // =========================================================
  // HTML ELEMANLARI
  // =========================================================

  const grid = document.querySelector("#grid");
  const count = document.querySelector("#count");
  const empty = document.querySelector("#empty");
  const categoriesBox = document.querySelector("#cats");
  const chipsBox = document.querySelector("#chips");
  const searchInput = document.querySelector("#q");
  const searchButton = document.querySelector("#go");

  // =========================================================
  // KONTROL
  // =========================================================

  if (!grid) {
    console.error("EduVisual: #grid bulunamadı.");
    return;
  }

  // =========================================================
  // GÖRSEL KARTI
  // =========================================================

  function createCard(item) {

    const id = item.id || "";
    const title = item.title || "İsimsiz görsel";
    const category = item.category || "";
    const grade = item.grade || "";
    const type = item.type || "";
    const file = item.file || "";

    return `
      <article
        class="card"
        data-id="${id}"
        onclick="window.location.href='gorsel-${id}.html'"
      >

        <div class="thumb">
          <img
            src="assets/previews/${file}"
            alt="${title}"
            loading="lazy"
            onerror="this.style.display='none';"
          >
        </div>

        <div class="info">

          <span class="pill">
            ${category}
          </span>

          <h3>
            ${title}
          </h3>

          <p>
            ${grade} • ${type}
          </p>

        </div>

      </article>
    `;
  }

  // =========================================================
  // LİSTEYİ EKRANA BAS
  // =========================================================

  function render(list) {

    if (!Array.isArray(list)) {
      list = [];
    }

    grid.innerHTML = list.map(createCard).join("");

    if (count) {
      count.textContent = `${list.length} görsel`;
    }

    if (empty) {
      empty.style.display = list.length ? "none" : "block";
    }

    console.log("EduVisual:", list.length, "görsel gösterildi.");
  }

  // =========================================================
  // AKTİF KATEGORİ
  // =========================================================

  function setActiveCategory(label) {

    document.querySelectorAll(".cat").forEach(button => {

      const category =
        button.dataset.category || "";

      button.classList.toggle(
        "active",
        category.toLocaleLowerCase("tr-TR") ===
        label.toLocaleLowerCase("tr-TR")
      );

    });
  }

  // =========================================================
  // ARAMA
  // =========================================================

  function search(query) {

    const q = (query || "")
      .trim()
      .toLocaleLowerCase("tr-TR");

    activeFilter = q;

    if (!q) {

      setActiveCategory("");

      render(items);

      return;
    }

    const filtered = items.filter(item => {

      const text = [

        item.title || "",
        item.category || "",
        item.subcategory || "",
        Array.isArray(item.tags)
          ? item.tags.join(" ")
          : "",
        item.grade || "",
        item.type || "",
        item.desc || ""

      ]
        .join(" ")
        .toLocaleLowerCase("tr-TR");

      return text.includes(q);

    });

    setActiveCategory(q);

    render(filtered);

    // Sonuç alanına kaydır
    const target =
      document.querySelector("#yeniler") ||
      document.querySelector("#grid");

    if (target) {

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }
  }

  // =========================================================
  // KATEGORİ TIKLAMA
  // =========================================================

  function categoryClick(label) {

    const normalized =
      label.toLocaleLowerCase("tr-TR");

    // Aynı kategoriye tekrar basılırsa filtreyi kaldır
    const same =
      activeFilter === normalized;

    const query =
      same ? "" : label;

    if (searchInput) {
      searchInput.value = query;
    }

    search(query);
  }

  // =========================================================
  // TÜMÜNÜ GÖSTER
  // =========================================================

  function clearFilter() {

    activeFilter = "";

    if (searchInput) {
      searchInput.value = "";
    }

    setActiveCategory("");

    render(items);
  }

  // =========================================================
  // KATEGORİLERİ OLUŞTUR
  // =========================================================

  function renderCategories() {

    if (!categoriesBox) {
      console.warn("EduVisual: #cats bulunamadı.");
      return;
    }

    categoriesBox.innerHTML =
      categories.map(category => {

        return `
          <button
            class="cat"
            type="button"
            data-category="${category.name}"
          >

            <b>${category.icon}</b>

            <strong>
              ${category.name}
            </strong>

            <span>
              ${category.desc}
            </span>

          </button>
        `;

      }).join("");

    // Eventleri sonradan bağlıyoruz
    categoriesBox
      .querySelectorAll(".cat")
      .forEach(button => {

        button.addEventListener("click", () => {

          categoryClick(
            button.dataset.category
          );

        });

      });
  }

  // =========================================================
  // ÜST ARAMA CHIP'LERİ
  // =========================================================

  function renderChips() {

    if (!chipsBox) {
      return;
    }

    const mainCategories =
      categories.slice(0, 4);

    chipsBox.innerHTML =

      mainCategories.map(category => {

        return `
          <button
            type="button"
            class="chip"
            data-chip="${category.name}"
          >
            ${category.name}
          </button>
        `;

      }).join("") +

      `
        <button
          type="button"
          class="chip"
          id="showAll"
        >
          Tümünü göster
        </button>
      `;

    chipsBox
      .querySelectorAll("[data-chip]")
      .forEach(button => {

        button.addEventListener("click", () => {

          categoryClick(
            button.dataset.chip
          );

        });

      });

    const showAll =
      document.querySelector("#showAll");

    if (showAll) {

      showAll.addEventListener(
        "click",
        clearFilter
      );

    }
  }

  // =========================================================
  // ARAMA BUTONU
  // =========================================================

  if (searchButton && searchInput) {

    searchButton.addEventListener(
      "click",
      () => {

        search(searchInput.value);

      }
    );

    searchInput.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {

          search(searchInput.value);

        }

      }
    );
  }

  // =========================================================
  // DATA.JSON YÜKLE
  // =========================================================

  async function loadData() {

    try {

      console.log(
        "EduVisual: data.json yükleniyor..."
      );

      const response =
        await fetch(
          "./data.json?v=" +
          Date.now(),
          {
            cache: "no-store"
          }
        );

      if (!response.ok) {

        throw new Error(
          `data.json yüklenemedi. HTTP ${response.status}`
        );

      }

      const data =
        await response.json();

      if (!Array.isArray(data)) {

        throw new Error(
          "data.json bir dizi (array) olmalı."
        );

      }

      items = data;

      console.log(
        "EduVisual: data.json başarıyla okundu.",
        items.length,
        "görsel."
      );

      // Önce kategoriler
      renderCategories();

      // Sonra chipler
      renderChips();

      // Sonra tüm görseller
      render(items);

    } catch (error) {

      console.error(
        "EduVisual DATA HATASI:",
        error
      );

      // Kullanıcıya boş ekran bırakmayalım
      if (grid) {

        grid.innerHTML = `
          <div
            style="
              padding:30px;
              text-align:center;
              width:100%;
            "
          >

            <h3>
              Görseller yüklenemedi.
            </h3>

            <p>
              Veri dosyası okunurken bir sorun oluştu.
            </p>

          </div>
        `;

      }

      if (count) {
        count.textContent =
          "Veri yüklenemedi";
      }

    }

  }

  // =========================================================
  // BAŞLAT
  // =========================================================

  loadData();

});
