console.log("K-pop Tracker started!");

// -- ALBUMS --
const albums = [
    {
        id: 1,
        artist: "BLACKPINK",
        number: "3rd",
        type: "MINI ALBUM",
        name: "DEADLINE",
        version: "SILVER",
        member: "JISOO",
        price: 10.61,
        delivery: 29.89,
        url: "https://en.ygselect.com/product/blackpink-3rd-mini-album-deadline-silver-ver/12811/category/1345/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202602/9336c0659b9526e49e47e1cf2261f956.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 2,
        artist: "BLACKPINK",
        number: "3rd",
        type: "MINI ALBUM",
        name: "DEADLINE",
        version: "BLACK",
        member: "",
        price: 15.17,
        delivery: 32.68,
        url: "https://en.ygselect.com/product/blackpink-3rd-mini-album-deadline-black-ver/12808/category/43/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202601/99a947216871e0281e8a364710cfbd4b.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 3,
        artist: "BLACKPINK",
        number: "3rd",
        type: "MINI ALBUM",
        name: "DEADLINE",
        version: "PINK",
        member: "",
        price: 15.17,
        delivery: 32.68,
        url: "https://en.ygselect.com/product/blackpink-3rd-mini-album-deadline-pink-ver/12809/category/43/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202601/b1b8bf6d20cf275c8feb1a2eb6fa1047.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 4,
        artist: "BABYMONSTER",
        number: "1st",
        type: "FULL ALBUM",
        name: "DRIP",
        version: "ZIP LOCK",
        member: "",
        price: 13.13,
        delivery: 29.89,
        url: "https://en.ygselect.com/product/babymonster-1st-full-album-drip-zip-lock-ver/10334/category/1238/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202410/bf71cdccfca6b34aacd1c54ab3fcd9ad.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 5,
        artist: "BABYMONSTER",
        number: "3rd",
        type: "MINI ALBUM",
        name: "춤(CHOOM)",
        version: "Crimson / Metallic / Prism",
        member: "",
        price: 12.65,
        delivery: 29.89,
        url: "https://en.ygselect.com/product/babymonster-3rd-mini-album-춤-choom-crimson-metallic-prism-ver/12957/category/1384/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202604/29977c3d2598e426e192eb53ef007586.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 6,
        artist: "BABYMONSTER",
        number: "3rd",
        type: "MINI ALBUM",
        name: "춤(CHOOM)",
        version: "Jewel",
        member: "Rora",
        price: 8.57,
        delivery: 29.89,
        url: "https://en.ygselect.com/product/babymonster-3rd-mini-album-춤-choom-jewel-ver/12961/category/1384/display/1/#none",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202604/a1d7191e2b452a7bf0ddb407e9dddee1.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 7,
        artist: "aespa",
        number: "2nd",
        type: "Album",
        name: "LEMONADE",
        version: "SMini",
        member: "Random",
        price: 10.08,
        delivery: 34.99,
        url: "https://shop.weverse.io/en/shop/USD/artists/133/sales/61550",
        img: "https://cdn-contents.weverseshop.io/public/shop/0beeab1cfd2421268a0013013dcda63e.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 8,
        artist: "aespa",
        number: "2nd",
        type: "Album",
        name: "LEMONADE",
        version: "ADIC",
        member: "Random",
        price: 13.80,
        delivery: 34.99,
        url: "https://shop.weverse.io/en/shop/USD/artists/133/sales/61566",
        img: "https://cdn-contents.weverseshop.io/public/shop/791a7bfe9a128b678e28fd82e84bf23c.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 9,
        artist: "KATSEYE",
        number: "3rd",
        type: "EP",
        name: "WILD",
        version: "STUDIO CHOOM GIFT",
        member: "Random",
        price: 14.16,
        delivery: 34.99,
        url: "https://shop.weverse.io/en/shop/USD/artists/206/sales/58166",
        img: "https://cdn-contents.weverseshop.io/public/shop/512e93867cd704877b357c2eb91eb03f.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 10,
        artist: "KATSEYE",
        number: "3rd",
        type: "EP",
        name: "WILD",
        version: "International Retailer Exclusive",
        member: "",
        price: 15.59,
        delivery: 34.99,
        url: "https://shop.weverse.io/en/shop/USD/artists/206/sales/62758",
        img: "https://cdn-contents.weverseshop.io/public/shop/7c47265ae655a26d3a2d341def3795e9.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 11,
        artist: "MEOVV",
        number: "2nd",
        type: "EP Album",
        name: "BITE NOW",
        version: "MEOVV",
        member: "Random",
        price: 8.16,
        delivery: 29.89,
        url: "https://en.ygselect.com/product/meovv-the-2nd-ep-album-bite-now-meovv-ver-5%EC%A2%85-%EC%A4%91-%EB%9E%9C%EB%8D%A4-1%EC%A2%85/13040/category/51/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202605/3389b90baffe910cc00214c07f6f6a54.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 12,
        artist: "ALLDAY PROJECT",
        number: "1st",
        type: "EP Album",
        name: "ALLDAY PROJECT",
        version: "PHOTOBOOK",
        member: "",
        price: 13.47,
        delivery: 32.68,
        url: "https://en.ygselect.com/product/the-1st-ep-album-allday-project-photobook-ver-2%EC%A2%85-%EC%A4%91-%EB%9E%9C%EB%8D%A4-1%EC%A2%85/12628/category/1333/display/1/#none",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202512/721a15728cb46f284a3a7807e8448cfd.png",
        bought: false,
        favorite: false
    },
    {
        id: 13,
        artist: "ILLIT",
        number: "4th",
        type: "EP",
        name: "MAMIHLAPINATAPAI",
        version: "PAW PAW",
        member: "Random",
        price: 11.08,
        delivery: 34.08,
        url: "https://shop.weverse.io/en/shop/USD/artists/120/sales/58249",
        img: "https://cdn-contents.weverseshop.io/public/shop/45df81931c399c648d22846a8757eb06.png?w=720&q=95",
        bought: false,
        favorite: false
    },
];

const savedFavorites =
    JSON.parse(localStorage.getItem("favorites")) || [];

albums.forEach(album => {
    album.favorite = savedFavorites.includes(album.id);
});

const favoritesGrid = document.getElementById("favorites-grid");


// -- Wishlist Count --
// -- Dashboard Counts --

const dashboardWishlist = document.getElementById("dashboard-wishlist");
const dashboardFavorites = document.getElementById("dashboard-favorites");
const dashboardAffordable = document.getElementById("dashboard-affordable");

if (dashboardWishlist) {
    const wishlistCount = albums.filter(album => !album.bought).length;
    dashboardWishlist.textContent = `${wishlistCount} albums`;
}

if (dashboardFavorites) {
    const favoritesCount = albums.filter(album => album.favorite).length;
    dashboardFavorites.textContent = `${favoritesCount} albums`;
}

async function updateDashboardAffordable() {
    const exchangeRate = await getExchangeRate();

    const affordableCount = albums.filter(album => {
        const totalAMD = (album.price + album.delivery) * exchangeRate;
        return balance >= totalAMD;
    }).length;

    if (dashboardAffordable) {
        dashboardAffordable.textContent = `${affordableCount} albums`;
    }
}


// -- Favorites --
function displayFavorites() {

    favoritesGrid.innerHTML = "";

    const favoriteAlbums = albums.filter(album => album.favorite);

    if (favoriteAlbums.length === 0) {

        favoritesGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-5xl mb-4">☆</p>
                <p class="text-xl font-bold text-white">
                    No favorites yet
                </p>
                <p class="text-gray-400 mt-2">
                    Click the ☆ on an album to add it here!
                </p>
            </div>
        `;

        return;
    }

    favoriteAlbums.forEach(album => {

        const card = document.createElement("div");

        card.className = `
            bg-gray-900
            border border-gray-700
            rounded-2xl
            p-5
            shadow-lg
            hover:scale-[1.02]
            transition
        `;

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">

                <h2 class="text-xl font-bold text-white">
                    ${album.artist}
                    ${album.number}
                    ${album.type}
                    [${album.name}]
                    (${album.version} ver.)
                    ${album.member ? `(${album.member})` : ""}
                </h2>

                <button
    type="button"
    onclick="toggleFavorite(${album.id})"
    class="text-2xl hover:scale-110 transition shrink-0"
>
    ⭐
</button>

            </div>

            <img
                src="${album.img}"
                alt="${album.artist} ${album.name} ${album.version}"
                class="w-full rounded-xl mt-3 mb-4"
            >

            <p class="text-white font-bold">
                💿 Price: $${album.price.toFixed(2)}
            </p>

            <p class="text-white font-bold">
                📦 Delivery: $${album.delivery.toFixed(2)}
            </p>

            <p class="text-white font-bold">
                💰 Total: $${(album.price + album.delivery).toFixed(2)}
            </p>

            <a
                href="${album.url}"
                target="_blank"
                class="inline-block mt-4 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
            >
                🛒 Buy Album
            </a>
        `;

        favoritesGrid.appendChild(card);
    });
}
function toggleFavorite(id) {
    const album = albums.find(album => album.id === id);

    if (!album) {
        console.log("Album not found:", id);
        return;
    }

    album.favorite = !album.favorite;

    // Save favorites
    localStorage.setItem(
        "favorites",
        JSON.stringify(
            albums
                .filter(album => album.favorite)
                .map(album => album.id)
        )
    );

    console.log(album.name, "favorite:", album.favorite);

    displayAlbums();
    displayFavorites();

    if (dashboardFavorites) {
        const favoritesCount = albums.filter(album => album.favorite).length;
        dashboardFavorites.textContent = `${favoritesCount} albums`;
    }
}

// Make it available to onclick=""
window.toggleFavorite = toggleFavorite;

// -- BALANCE --
let balance = Number(localStorage.getItem("balance")) || 0;

const balanceInput = document.getElementById("balance-input");
const saveBalanceButton = document.getElementById("save-balance");
const balanceDisplay = document.getElementById("balance-display");

function updateBalanceDisplay() {
    balanceDisplay.textContent = `Balance: ֏${balance.toLocaleString()}`;
}

function updateBalanceUI() {
    document.getElementById("balance-display").textContent =
        `֏${balance.toLocaleString()}`;

    document.getElementById("dashboard-balance").textContent =
        `֏${balance.toLocaleString()}`;
}

saveBalanceButton.addEventListener("click", () => {
    balance = Number(balanceInput.value) || 0;

    localStorage.setItem("balance", balance);

    updateBalanceDisplay();
    updateBalanceUI();
    displayAlbums();
    updateDashboardAffordable();
});


// -- EXCHANGE --
const API_KEY = "103fb4bf8fe46c1a0fcd0370";

async function getExchangeRate() {
    const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USD`
    );

    const data = await response.json();

    if (data.result !== "success") {
        throw new Error("Failed to get exchange rate");
    }

    return data.conversion_rates.AMD;
}


updateDashboardAffordable();

// -- ALBUM GRID --
const albumGrid = document.getElementById("album-grid");
const sortAlbums = document.getElementById("sort-albums");
const albumSearch = document.getElementById("album-search");

async function displayAlbums() {
    const exchangeRate = await getExchangeRate();

    albumGrid.innerHTML = "";

    let sortedAlbums = [...albums];

    const searchTerm = albumSearch.value.toLowerCase().trim();

    sortedAlbums = sortedAlbums.filter((album) =>
        `${album.artist} ${album.name} ${album.version} ${album.member}`
            .toLowerCase()
            .includes(searchTerm)
    );

    // SORTING
    if (sortAlbums.value === "price-low") {
        sortedAlbums.sort((a, b) =>
            (a.price + a.delivery) - (b.price + b.delivery)
        );
    }

    if (sortAlbums.value === "price-high") {
        sortedAlbums.sort((a, b) =>
            (b.price + b.delivery) - (a.price + a.delivery)
        );
    }

    if (sortAlbums.value === "artist") {
        sortedAlbums.sort((a, b) =>
            a.artist.localeCompare(b.artist)
        );
    }
    if (sortAlbums.value === "artist-reverse") {
    sortedAlbums.sort((a, b) =>
        b.artist.localeCompare(a.artist)
    );
}

    if (sortAlbums.value === "affordable") {
        sortedAlbums.sort((a, b) => {
            const aTotal = (a.price + a.delivery) * exchangeRate;
            const bTotal = (b.price + b.delivery) * exchangeRate;

            return (balance >= bTotal) - (balance >= aTotal);
        });
    }

    if (sortAlbums.value === "favorites") {
    sortedAlbums.sort((a, b) =>
        Number(b.favorite) - Number(a.favorite)
    );
}

    // DISPLAY ALBUMS
    sortedAlbums.forEach((album) => {

        const totalUSD = album.price + album.delivery;

        const priceAMD = album.price * exchangeRate;
        const deliveryAMD = album.delivery * exchangeRate;
        const totalAMD = totalUSD * exchangeRate;

        const card = document.createElement("div");

        const canAfford = balance >= totalAMD;

        const progress = Math.min(
            Math.round((balance / totalAMD) * 100),
            100
        );

        card.className = `
            bg-gray-900
            border border-gray-700
            rounded-2xl
            p-5
            shadow-lg
            hover:scale-[1.02]
            transition
        `;

        card.innerHTML = `
            <h2 class="text-xl font-bold text-white mb-3">
                ${album.artist} ${album.number} ${album.type}
                [${album.name}]
                (${album.version} ver.)
                ${album.member ? `(${album.member})` : ""}
            </h2>

            <img
                src="${album.img}"
                alt="${album.artist} ${album.name} ${album.version}"
                class="w-full rounded-xl mb-4"
            >

            <div class="mt-4 space-y-1">

                <p class="text-white font-bold">
                    💿 Price: $${album.price.toFixed(2)} / ֏${priceAMD.toFixed(0)}
                </p>

                <p class="text-white font-bold">
                    📦 Delivery: $${album.delivery.toFixed(2)} / ֏${deliveryAMD.toFixed(0)}
                </p>

                <p class="text-white font-bold">
                    💰 Total: $${totalUSD.toFixed(2)} / ֏${totalAMD.toFixed(0)}
                </p>

                ${
                    canAfford
                    ? ``
                    : `
                        <p class="mt-3 text-gray-400">
                            🔒 You need ֏${Math.ceil(totalAMD - balance).toLocaleString()} more
                        </p>

                        <div class="flex justify-between text-sm text-gray-400 mb-1">
                            <span>Progress</span>
                            <span>${progress}%</span>
                        </div>

                        <div class="w-full bg-gray-700 rounded-full h-3">
                            <div
                                class="bg-pink-500 h-3 rounded-full transition-all duration-500"
                                style="width: ${progress}%"
                            ></div>
                        </div>
                    `
                }
                <button
    type="button"
    onclick="toggleFavorite(${album.id})"
    class="text-2xl hover:scale-110 transition"
>
    ${album.favorite ? "⭐" : "☆"}
</button>
            </div>

            ${
                canAfford
                ? `
                    <a
                        href="${album.url}"
                        target="_blank"
                        class="inline-block mt-4 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
                    >
                        🛒 Buy Album
                    </a>
                `
                : `
                    <button
                        disabled
                        class="mt-4 px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed"
                    >
                        🔒 Not enough money
                    </button>
                `
            }
        `;

        albumGrid.appendChild(card);
    });
}

sortAlbums.addEventListener("change", displayAlbums);
albumSearch.addEventListener("input", displayAlbums);

updateDashboardAffordable();
displayAlbums();


// -- NAVIGATION --
const navButtons = document.querySelectorAll(".nav-button");
const pages = document.querySelectorAll(".page");

navButtons.forEach((button) => {
    button.addEventListener("click", () => {

        const pageName = button.dataset.page;

        pages.forEach((page) => {
            page.classList.add("hidden");
        });

        document
            .getElementById(`page-${pageName}`)
            .classList.remove("hidden");
    });
});

displayAlbums();
displayFavorites();


// -- Calendar --
let calendarEvents =
    JSON.parse(localStorage.getItem("calendarEvents")) || [];

function displayCalendarEvents() {

    const eventsContainer =
        document.getElementById("calendar-events");

    eventsContainer.innerHTML = "";

    if (calendarEvents.length === 0) {

        eventsContainer.innerHTML = `
            <p class="text-gray-500">
                No events yet.
            </p>
        `;

        return;
    }

    calendarEvents.sort((a, b) =>
        new Date(a.date) - new Date(b.date)
    );

    calendarEvents.forEach((event, index) => {

        const eventCard = document.createElement("div");

        eventCard.className = `
            bg-gray-900
            border border-gray-700
            rounded-2xl
            p-5
            flex
            items-center
            justify-between
            gap-4
        `;

        eventCard.innerHTML = `
            <div>
                <h3 class="text-xl font-bold">
                    ${event.name}
                </h3>

                <p class="text-gray-400 mt-1">
                    📅 ${event.date}
                </p>

                ${
                    event.amount
                    ? `<p class="text-gray-400">
                        💰 ֏${Number(event.amount).toLocaleString()}
                       </p>`
                    : ""
                }
            </div>

            <button
                class="delete-event text-red-400 hover:text-red-300"
                data-index="${index}"
            >
                🗑️
            </button>
        `;

        eventsContainer.appendChild(eventCard);
    });

    document.querySelectorAll(".delete-event").forEach(button => {

        button.addEventListener("click", () => {

            const index = Number(button.dataset.index);

            calendarEvents.splice(index, 1);

            localStorage.setItem(
                "calendarEvents",
                JSON.stringify(calendarEvents)
            );

            displayCalendarEvents();
        });

    });
}

document.getElementById("add-event").addEventListener("click", () => {

    const name =
        document.getElementById("event-name").value.trim();

    const date =
        document.getElementById("event-date").value;

    const amount =
        document.getElementById("event-amount").value.trim();

    if (!name || !date) {
        alert("Please enter an event name and date.");
        return;
    }

    calendarEvents.push({
        name: name,
        date: date,
        amount: amount
    });

    localStorage.setItem(
        "calendarEvents",
        JSON.stringify(calendarEvents)
    );

    document.getElementById("event-name").value = "";
    document.getElementById("event-date").value = "";
    document.getElementById("event-amount").value = "";

    displayCalendarEvents();
});

displayCalendarEvents();