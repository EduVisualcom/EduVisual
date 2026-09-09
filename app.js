let items = [];

const cats = [
  ["Matematik", "∑", "Kesirler, geometri"],
  ["Fen Bilimleri", "⚗", "Deney, bilim"],
  ["Finans", "₺", "Bütçe, tasarruf"],
  ["İnfografik", "◈", "Şema, veri, süreç"],
  ["Etkinlik", "✦", "Çalışma ve oyun"],
  ["Arka Plan", "▧", "Sayfa dekorları"]
];

const grid = document.querySelector("#grid");
const count = document.querySelector("#count");
const empty = document.querySelector("#empty");

let activeFilter = "";


/* =========================================================
   GÖRSEL KARTI
   ========================================================= */

function card(x) {
  return `
    <article class="card" onclick="location.href='gorsel-${x.id}.html'">

      <div class="thumb">
        <img
          src="assets/previews/${x.file}"
          alt="${x.title}"
          loading="lazy"
        >
      </div>

      <div class="info">

        <span class="pill">
          ${x.category || ""}
        </span>

        <h3>
          ${x.title || ""}
        </h3>

        <p>
          ${x.grade || ""} • ${x.type || ""}
        </p>

      </div>

    </article>
  `;
}


/* =========================================================
   LİSTEYİ EKRANA BAS
   ========================================================= */

function render(list) {

  grid.innerHTML = list.map(card).join("");

  count.textContent = list.length + " görsel";

  empty.style.display = list.length ? "none" : "block";
}


/* =========================================================
   AKTİF KATEGORİYİ GÖSTER
   ========================================================= */

function setActive(label) {

  document
    .querySelectorAll(".cat")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.category === label
      );

    });
}


/* =========================================================
   ARAMA + KATEGORİ FİLTRELEME
   ========================================================= */

function search(q) {

  q = (q || "")
    .trim()
    .toLocaleLowerCase("tr-TR");

  activeFilter = q;


  /* ---------------------------------------------------------
     ARAMA BOŞSA TÜM GÖRSELLERİ GÖSTER
     --------------------------------------------------------- */

  if (!q) {

    setActive("");

    render(items);

    return;
  }


  /* ---------------------------------------------------------
     YAZILAN ŞEY BİR KATEGORİ Mİ?
     --------------------------------------------------------- */

  const category = cats.find(
    c =>
      c[0].toLocaleLowerCase("tr-TR") === q
  );


  /* ---------------------------------------------------------
     EVET → SADECE O KATEGORİYİ GÖSTER
     --------------------------------------------------------- */

  if (category) {

    const categoryName = category[0];

    setActive(categoryName);

    const filtered = items.filter(x =>

      (x.category || "")
        .toLocaleLowerCase("tr-TR") === q

    );

    render(filtered);

    scrollToGallery();

    return;
  }


  /* ---------------------------------------------------------
     NORMAL ARAMA
     --------------------------------------------------------- */

  setActive("");

  const filtered = items.filter(x => {

    const searchableText = [

      x.title || "",
      x.category || "",
      x.subcategory || "",
      Array.isArray(x.tags)
        ? x.tags.join(" ")
        : "",
      x.grade || "",
      x.type || "",
      x.desc || ""

    ]
      .join(" ")
      .toLocaleLowerCase("tr-TR");

    return searchableText.includes(q);

  });

  render(filtered);

  scrollToGallery();
}


/* =========================================================
   KATEGORİYE TIKLAMA
   ========================================================= */

function categoryClick(label) {

  const normalized =
    label.toLocaleLowerCase("tr-TR");


  /* ---------------------------------------------------------
     AYNI KATEGORİYE TEKRAR BASILIRSA
     FİLTREYİ KALDIR
     --------------------------------------------------------- */

  if (activeFilter === normalized) {

    clearFilter();

    return;
  }


  /* ---------------------------------------------------------
     ARAMA KUTUSUNA KATEGORİ ADINI YAZ
     --------------------------------------------------------- */

  const input = document.querySelector("#q");

  if (input) {
    input.value = label;
  }


  /* ---------------------------------------------------------
     KATEGORİ FİLTRESİNİ ÇALIŞTIR
     --------------------------------------------------------- */

  search(label);
}


/* =========================================================
   FİLTREYİ TEMİZLE
   ========================================================= */

function clearFilter() {

  const input = document.querySelector("#q");

  if (input) {
    input.value = "";
  }

  activeFilter = "";

  setActive("");

  render(items);
}


/* =========================================================
   GÖRSEL KOLEKSİYONUNA KAYDIR
   ========================================================= */

function scrollToGallery() {

  const gallery =
    document.querySelector("#yeniler");

  if (!gallery) {
    return;
  }

  setTimeout(() => {

    gallery.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

  }, 50);
}


/* =========================================================
   KATEGORİLERİ OLUŞTUR
   ========================================================= */

function buildCategories() {

  const catsContainer =
    document.querySelector("#cats");

  if (catsContainer) {

    catsContainer.innerHTML =
      cats.map(c => {

        return `
          <button
            class="cat"
            data-category="${c[0]}"
            onclick="categoryClick('${c[0]}')"
          >

            <b>${c[1]}</b>

            <strong>
              ${c[0]}
            </strong>

            <span>
              ${c[2]}
            </span>

          </button>
        `;

      }).join("");

  }


  /* ---------------------------------------------------------
     ÜST ARAMA ÇİPLERİ
     --------------------------------------------------------- */

  const chips =
    document.querySelector("#chips");

  if (chips) {

    chips.innerHTML =

      cats
        .slice(0, 4)
        .map(c => {

          return `
            <button
              onclick="categoryClick('${c[0]}')"
            >
              ${c[0]}
            </button>
          `;

        })
        .join("")

      +

      `
        <button onclick="clearFilter()">
          Tümünü göster
        </button>
      `;

  }
}


/* =========================================================
   VERİLERİ YÜKLE
   ========================================================= */

fetch("data.json")

  .then(response => {

    if (!response.ok) {
      throw new Error(
        "data.json yüklenemedi."
      );
    }

    return response.json();

  })

  .then(data => {

    items = Array.isArray(data)
      ? data
      : [];

    render(items);

    buildCategories();

  })

  .catch(error => {

    console.error(
      "EduVisual veri yükleme hatası:",
      error
    );

    items = [];

    render(items);

  });


/* =========================================================
   ARAMA BUTONU
   ========================================================= */

const goButton =
  document.querySelector("#go");

if (goButton) {

  goButton.onclick = () => {

    const input =
      document.querySelector("#q");

    search(
      input ? input.value : ""
    );

  };

}


/* =========================================================
   ENTER İLE ARAMA
   ========================================================= */

const searchInput =
  document.querySelector("#q");

if (searchInput) {

  searchInput.onkeydown = event => {

    if (event.key === "Enter") {

      search(
        event.target.value
      );

    }

  };

}
