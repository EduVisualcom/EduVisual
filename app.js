document.addEventListener("DOMContentLoaded", function () {

    // =========================================================
    // EDUVISUAL - ANA UYGULAMA
    // =========================================================

    let items = [];
    let activeCategory = "";

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
    // METİN NORMALİZASYONU
    // =========================================================

    function normalize(text) {

        return String(text || "")
            .toLocaleLowerCase("tr-TR")
            .trim();

    }

    // =========================================================
    // GÖRSEL KARTI
    // =========================================================

    function createCard(item) {

        return `
            <article
                class="card"
                data-id="${item.id}"
            >

                <div class="thumb">

                    <img
                        src="assets/previews/${item.file}"
                        alt="${item.title || ""}"
                        loading="lazy"
                    >

                </div>

                <div class="info">

                    <span class="pill">
                        ${item.category || ""}
                    </span>

                    <h3>
                        ${item.title || ""}
                    </h3>

                    <p>
                        ${item.grade || ""} • ${item.type || ""}
                    </p>

                </div>

            </article>
        `;

    }

    // =========================================================
    // LİSTEYİ GÖSTER
    // =========================================================

    function render(list) {

        if (!list || list.length === 0) {

            grid.innerHTML = "";

            if (count) {
                count.textContent = "0 görsel";
            }

            if (empty) {
                empty.style.display = "block";
            }

            return;
        }

        grid.innerHTML =
            list.map(createCard).join("");

        if (count) {
            count.textContent =
                list.length + " görsel";
        }

        if (empty) {
            empty.style.display = "none";
        }

    }

    // =========================================================
    // AKTİF KATEGORİ
    // =========================================================

    function setActiveCategory(categoryName) {

        if (!categoriesBox) {
            return;
        }

        const buttons =
            categoriesBox.querySelectorAll(".cat");

        buttons.forEach(function (button) {

            const buttonCategory =
                button.getAttribute("data-category") || "";

            button.classList.toggle(
                "active",
                normalize(buttonCategory) ===
                normalize(categoryName)
            );

        });

    }

    // =========================================================
    // KATEGORİLERİ OLUŞTUR
    // =========================================================

    function renderCategories() {

        if (!categoriesBox) {
            return;
        }

        categoriesBox.innerHTML =
            categories
                .map(function (category) {

                    return `
                        <button
                            type="button"
                            class="cat"
                            data-category="${category.name}"
                        >

                            <b>
                                ${category.icon}
                            </b>

                            <strong>
                                ${category.name}
                            </strong>

                            <span>
                                ${category.desc}
                            </span>

                        </button>
                    `;

                })
                .join("");

    }

    // =========================================================
    // HIZLI FİLTRE BUTONLARI
    // =========================================================

    function renderChips() {

        if (!chipsBox) {
            return;
        }

        let html = "";

        categories
            .slice(0, 4)
            .forEach(function (category) {

                html += `
                    <button
                        type="button"
                        class="chip"
                        data-chip-category="${category.name}"
                    >
                        ${category.name}
                    </button>
                `;

            });

        html += `
            <button
                type="button"
                class="chip"
                data-clear-filter
            >
                Tümünü göster
            </button>
        `;

        chipsBox.innerHTML = html;

    }

    // =========================================================
    // KATEGORİ TIKLAMA
    // =========================================================
    //
    // ARTIK AYNI SAYFADA FİLTRELEME YOK.
    //
    // Kategoriye basınca:
    //
    // kategori.html?cat=Matematik
    //
    // şeklinde yeni sayfaya gider.
    //
    // =========================================================

    function selectCategory(categoryName) {

        if (!categoryName) {
            return;
        }

        window.location.href =
            "kategori.html?cat=" +
            encodeURIComponent(categoryName);

    }

    // =========================================================
    // KATEGORİ BUTONLARI
    // =========================================================

    if (categoriesBox) {

        categoriesBox.addEventListener(
            "click",
            function (event) {

                const button =
                    event.target.closest(".cat");

                if (!button) {
                    return;
                }

                const categoryName =
                    button.getAttribute(
                        "data-category"
                    );

                if (!categoryName) {
                    return;
                }

                selectCategory(categoryName);

            }
        );

    }

    // =========================================================
    // CHIP BUTONLARI
    // =========================================================

    if (chipsBox) {

        chipsBox.addEventListener(
            "click",
            function (event) {

                const categoryButton =
                    event.target.closest(
                        "[data-chip-category]"
                    );

                if (categoryButton) {

                    const categoryName =
                        categoryButton.getAttribute(
                            "data-chip-category"
                        );

                    selectCategory(categoryName);

                    return;
                }

                const clearButton =
                    event.target.closest(
                        "[data-clear-filter]"
                    );

                if (clearButton) {

                    activeCategory = "";

                    if (searchInput) {
                        searchInput.value = "";
                    }

                    setActiveCategory("");

                    render(items);

                }

            }
        );

    }

    // =========================================================
    // ARAMA
    // =========================================================

    function search(query) {

        const q = normalize(query);

        if (searchInput) {
            searchInput.value =
                query || "";
        }

        // -----------------------------------------------------
        // BOŞ ARAMA
        // -----------------------------------------------------

        if (!q) {

            activeCategory = "";

            setActiveCategory("");

            render(items);

            return;
        }

        // -----------------------------------------------------
        // KATEGORİ ARAMASI
        // -----------------------------------------------------

        const matchedCategory =
            categories.find(function (category) {

                return normalize(category.name) === q;

            });

        if (matchedCategory) {

            activeCategory =
                matchedCategory.name;

            setActiveCategory(
                matchedCategory.name
            );

            const filtered =
                items.filter(function (item) {

                    return normalize(item.category) ===
                        normalize(
                            matchedCategory.name
                        );

                });

            render(filtered);

            return;
        }

        // -----------------------------------------------------
        // NORMAL METİN ARAMASI
        // -----------------------------------------------------

        activeCategory = "";

        setActiveCategory("");

        const filtered =
            items.filter(function (item) {

                const searchableText = [

                    item.title,
                    item.category,
                    item.subcategory,
                    item.grade,
                    item.type,
                    item.desc,

                    ...(Array.isArray(item.tags)
                        ? item.tags
                        : [])

                ]
                    .join(" ")
                    .toLocaleLowerCase("tr-TR");

                return searchableText.includes(q);

            });

        render(filtered);

    }

    // =========================================================
    // ARAMA BUTONU
    // =========================================================

    if (searchButton) {

        searchButton.addEventListener(
            "click",
            function () {

                if (!searchInput) {
                    return;
                }

                search(searchInput.value);

            }
        );

    }

    // =========================================================
    // ENTER İLE ARAMA
    // =========================================================

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            function (event) {

                if (event.key === "Enter") {

                    event.preventDefault();

                    search(searchInput.value);

                }

            }
        );

    }

    // =========================================================
    // GÖRSEL KARTINA TIKLAMA
    // =========================================================

    grid.addEventListener(
        "click",
        function (event) {

            const card =
                event.target.closest(".card");

            if (!card) {
                return;
            }

            const id =
                card.getAttribute("data-id");

            if (!id) {
                return;
            }

            window.location.href =
                "gorsel-" +
                id +
                ".html";

        }
    );

    // =========================================================
    // DATA.JSON YÜKLE
    // =========================================================

    fetch("data.json")

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "data.json yüklenemedi. HTTP " +
                    response.status
                );

            }

            return response.json();

        })

        .then(function (data) {

            if (!Array.isArray(data)) {

                throw new Error(
                    "data.json bir JSON dizisi olmalı."
                );

            }

            items = data;

            renderCategories();

            renderChips();

            render(items);

            console.log(
                "EduVisual hazır:",
                items.length,
                "görsel yüklendi."
            );

        })

        .catch(function (error) {

            console.error(
                "EduVisual veri hatası:",
                error
            );

            grid.innerHTML = `
                <div
                    style="
                        padding:30px;
                        text-align:center;
                        color:#777;
                    "
                >

                    Görseller yüklenemedi.

                    <br>

                    <small>
                        ${error.message}
                    </small>

                </div>
            `;

            if (count) {
                count.textContent =
                    "Veri yüklenemedi";
            }

        });

});
