// ==================== LOCAL ACCOUNT SYSTEM ====================

const authPage = document.getElementById("auth-page");
const app = document.getElementById("app");
const nav = document.getElementById("nav");
const pageFile = window.location.pathname.split("/").pop() || "index.html";
const currentPage = document.body.dataset.page || pageFile.replace(".html", "");
const isAuthPage = currentPage === "login" || currentPage === "signup";

const loginForm = document.getElementById("login-form");
const registerForm = document.getElementById("register-form");

const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");

const registerUsername = document.getElementById("register-username");
const registerPassword = document.getElementById("register-password");
const registerPasswordConfirm =
    document.getElementById("register-password-confirm");

const loginButton = document.getElementById("login-button");
const registerButton = document.getElementById("register-button");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

const showRegister = document.getElementById("show-register");
const showLogin = document.getElementById("show-login");

// Get saved accounts
let accounts = [];

try {
    accounts = JSON.parse(localStorage.getItem("accounts")) || [];
} catch (error) {
    console.error("Could not load accounts:", error);
    accounts = [];
}

// Current logged-in username
let currentUser = localStorage.getItem("currentUser");
let renderUser = null;

// Current balance
let balance = 0;

// -------------------- AUTH UI --------------------

function showLoginForm() {
    if (loginForm) loginForm.classList.remove("hidden");
    if (registerForm) registerForm.classList.add("hidden");

    if (loginMessage) loginMessage.textContent = "";
    if (registerMessage) registerMessage.textContent = "";
}

function showRegisterForm() {
    if (loginForm) loginForm.classList.add("hidden");
    if (registerForm) registerForm.classList.remove("hidden");

    if (loginMessage) loginMessage.textContent = "";
    if (registerMessage) registerMessage.textContent = "";
}

// -------------------- CREATE ACCOUNT --------------------

if (registerButton) {
    registerButton.addEventListener("click", () => {

        const username = registerUsername.value.trim();
        const password = registerPassword.value;
        const confirmPassword = registerPasswordConfirm.value;

        registerMessage.className =
            "text-red-400 text-center mt-3";

        if (!username || !password || !confirmPassword) {
            registerMessage.textContent =
                "Please fill in all fields.";
            return;
        }

        if (username.length < 3) {
            registerMessage.textContent =
                "Username must be at least 3 characters.";
            return;
        }

        if (password.length < 4) {
            registerMessage.textContent =
                "Password must be at least 4 characters.";
            return;
        }

        if (password !== confirmPassword) {
            registerMessage.textContent =
                "Passwords do not match.";
            return;
        }

        const usernameExists = accounts.some(
            account =>
                account.username.toLowerCase() === username.toLowerCase()
        );

        if (usernameExists) {
            registerMessage.textContent =
                "That username is already taken.";
            return;
        }

        const newAccount = {
            username: username,
            password: password,

            balance: 0,
            favorites: [],
            owned: [],
            calendarEvents: [],
            customAlbums: []
        };

        accounts.push(newAccount);
        saveAccounts();
        console.log("Saved accounts:", accounts);
        console.log("LocalStorage:", localStorage.getItem("accounts"));

        registerMessage.className =
            "text-green-400 text-center mt-3";

        registerMessage.textContent =
            "Account created! You can now log in.";

        registerUsername.value = "";
        registerPassword.value = "";
        registerPasswordConfirm.value = "";
    });
}

// -------------------- LOG IN --------------------
function enterApp() {
    if (authPage) {
        authPage.classList.add("hidden");
    }

    if (nav) {
        nav.classList.remove("hidden");
    }

    if (app) {
        app.classList.remove("hidden");
    }

    console.log(`Logged in as ${currentUser}`);
}

function getCurrentAccount() {
    if (!currentUser) return null;

    return accounts.find(account =>
        account.username.toLowerCase() === currentUser.toLowerCase()
    );
}

function getCurrentFavorites() {
    const account = getCurrentAccount();
    return account ? account.favorites : [];
}

function getCurrentBalance() {
    const account = getCurrentAccount();
    return account ? Number(account.balance) || 0 : 0;
}

function getCurrentCalendarEvents() {
    const account = getCurrentAccount();
    return account ? account.calendarEvents : [];
}

function saveAccounts() {
    localStorage.setItem("accounts", JSON.stringify(accounts));
}

function loadCurrentUserData() {
    const account = getCurrentAccount();

    if (!account) {
        console.log("No current account found.");
        return;
    }

    restoreAlbumsForAccount(account);

    // Load this account's favorites ONLY
    const savedFavorites = Array.isArray(account.favorites)
        ? account.favorites
        : [];

    const savedOwned = Array.isArray(account.owned)
        ? account.owned
        : [];

    albums.forEach(album => {
        album.favorite = savedFavorites.includes(album.id);
        album.bought = savedOwned.includes(album.id);
    });

    updateDashboardCounts();

    // Load this account's balance ONLY
    balance = Number(account.balance) || 0;

    // Load this account's calendar ONLY
    calendarEvents = Array.isArray(account.calendarEvents)
        ? [...account.calendarEvents]
        : [];

    console.log("Loaded account:", account.username);
    console.log("Favorites:", savedFavorites);
    console.log("Balance:", balance);
}

if (loginButton) {
    loginButton.addEventListener("click", () => {
        const username = loginUsername.value.trim();
        const password = loginPassword.value;

        loginMessage.className = "text-red-400 text-center mt-3";

        if (!username || !password) {
            loginMessage.textContent =
                "Please enter your username and password.";
            return;
        }

        console.log("Attempting login:", username);
        console.log("Stored accounts:", accounts);

        const account = accounts.find(account => {
            return (
                String(account.username).trim().toLowerCase() ===
                username.toLowerCase() &&
                String(account.password) === password
            );
        });

        console.log("Matching account:", account);

        if (!account) {
            loginMessage.textContent =
                "Incorrect username or password.";
            return;
        }

        currentUser = account.username;

        localStorage.setItem("currentUser", currentUser);

        loadCurrentUserData();

        loginUsername.value = "";
        loginPassword.value = "";
        loginMessage.textContent = "";

        window.location.assign("index.html");
    });
}

// -------------------- LOG OUT --------------------

function logout() {

    localStorage.removeItem("currentUser");

    currentUser = null;

    window.location.assign("login.html");
}

const logoutButton = document.getElementById("logout-button");

if (logoutButton) {
    logoutButton.addEventListener("click", logout);
}

// Make logout available to HTML onclick=""
window.logout = logout;

// -------------------- SWITCH FORMS --------------------

if (showRegister) {
    showRegister.addEventListener(
        "click",
        () => window.location.assign("signup.html")
    );
}

if (showLogin) {
    showLogin.addEventListener(
        "click",
        () => window.location.assign("login.html")
    );
}

// -- SUPABASE --
const SUPABASE_URL = "https://qktnjlmigjbpshfnghfl.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdG5qbG1pZ2picHNoZm5naGZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc1Nzc3NzksImV4cCI6MjEwMzE1Mzc3OX0.ihBW35BkBp08Ky_ZrzAUwUTtuwtZ_ZXct1f6OreehTc";

const supabaseClient = window.supabase
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// -- ALBUMS --
const albums = [];

const builtInAlbums = albums.map(album => ({ ...album }));

function restoreAlbumsForAccount(account) {
    const customAlbums = Array.isArray(account.customAlbums)
        ? account.customAlbums
        : [];

    albums.splice(
        0,
        albums.length,
        ...builtInAlbums.map(album => ({ ...album })),
        ...customAlbums.map(album => ({ ...album }))
    );
}

// -- Grids --
const albumGrid =
    document.getElementById("albums-grid");
const favoritesGrid =
    document.getElementById("favorites-grid");
const affordablesGrid =
    document.getElementById("affordables-grid");


// -- Controls --
const favoritesControls =
    document.getElementById("favorites-controls");
const affordablesControls =
    document.getElementById("affordables-controls");


// -- Dashboard Counts --
const dashboardWishlist = document.getElementById("dashboard-wishlist");
const dashboardFavorites = document.getElementById("dashboard-favorites");
const dashboardOwned = document.getElementById("dashboard-owned");
const dashboardAffordable = document.getElementById("dashboard-affordable");

function updateDashboardCounts() {
    if (dashboardWishlist) {
        const wishlistCount = albums.filter(album => !album.bought).length;
        dashboardWishlist.textContent = `${wishlistCount} albums`;
    }

    if (dashboardFavorites) {
        const favoritesCount = albums.filter(album => album.favorite).length;
        dashboardFavorites.textContent = `${favoritesCount} albums`;
    }

    if (dashboardOwned) {
        const ownedCount = albums.filter(album => album.bought).length;
        dashboardOwned.textContent = `${ownedCount} albums`;
    }
}

updateDashboardCounts();

async function updateDashboardAffordable() {
    const exchangeRate = await getExchangeRate();

    const affordableCount = albums.filter(album => {
        const totalAMD = (album.price + album.delivery) * exchangeRate;
        return !album.bought && balance >= totalAMD;
    }).length;

    if (dashboardAffordable) {
        dashboardAffordable.textContent = `${affordableCount} albums`;
    }
}


// -- Sort --
const sortAlbums = document.getElementById("sort-albums");
const favoriteSort = document.getElementById("favorite-sort");
const affordableSort = document.getElementById("affordables-sort");


// FAVORITES
let favoritesRenderVersion = 0;

async function displayFavorites() {

    if (!favoritesGrid) return;

    const renderingUser = currentUser;
    const thisRender = ++favoritesRenderVersion;

    if (!renderingUser) return;

    const exchangeRate = await getExchangeRate();

    // Ignore old renders
    if (currentUser !== renderingUser) return;
    if (thisRender !== favoritesRenderVersion) return;

    favoritesGrid.innerHTML = "";

    // ONLY favorites
    let favoriteAlbums = albums.filter(album => album.favorite);

    // Show/hide controls based on whether favorites EXIST
    if (favoritesControls) {
        if (favoriteAlbums.length === 0) {
            favoritesControls.classList.add("hidden");
        } else {
            favoritesControls.classList.remove("hidden");
        }
    }

    // Copy favorites for search + sorting
    let sortedAlbums = [...favoriteAlbums];

    // SEARCH
    const searchTerm =
        favoriteSearch.value.toLowerCase().trim();

    sortedAlbums = sortedAlbums.filter(album =>
        `${album.artist} ${album.name} ${album.version} ${album.member}`
            .toLowerCase()
            .includes(searchTerm)
    );

    // SORTING
    if (favoriteSort.value === "price-low") {
        sortedAlbums.sort((a, b) =>
            (a.price + a.delivery) - (b.price + b.delivery)
        );
    }

    if (favoriteSort.value === "price-high") {
        sortedAlbums.sort((a, b) =>
            (b.price + b.delivery) - (a.price + a.delivery)
        );
    }

    if (favoriteSort.value === "artist") {
        sortedAlbums.sort((a, b) =>
            a.artist.localeCompare(b.artist) ||
            a.number.localeCompare(b.number) ||
            a.name.localeCompare(b.name) ||
            a.version.localeCompare(b.version) ||
            a.member.localeCompare(b.member)
        );
    }

    if (favoriteSort.value === "artist-reverse") {
        sortedAlbums.sort((a, b) =>
            b.artist.localeCompare(a.artist) ||
            b.number.localeCompare(a.number) ||
            b.name.localeCompare(a.name) ||
            b.version.localeCompare(a.version) ||
            b.member.localeCompare(a.member)
        );
    }

    if (favoriteSort.value === "affordable") {
        sortedAlbums.sort((a, b) => {

            const aTotal =
                (a.price + a.delivery) * exchangeRate;

            const bTotal =
                (b.price + b.delivery) * exchangeRate;

            return (balance >= bTotal) - (balance >= aTotal);
        });
    }

    // NO FAVORITES
    if (sortedAlbums.length === 0) {

        favoritesGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <p class="text-5xl mb-4">☆</p>

            <p class="text-xl font-bold text-white">
                ${searchTerm
                ? "No favorite albums found"
                : "No favorite albums yet"
            }
            </p>

            <p class="text-gray-400 mt-2">
                ${searchTerm
                ? "Try changing your search"
                : "Go to Albums and tap ☆ to add one!"
            }
            </p>
        </div>
    `;

        return;
    }

    // DISPLAY SORTED FAVORITES
    if (thisRender !== favoritesRenderVersion) return;

    sortedAlbums.forEach(album => {

        const totalUSD = album.price + album.delivery;
        const totalAMD = totalUSD * exchangeRate;

        const canAfford = balance >= totalAMD;

        const card = document.createElement("div");

        function titleCase(text) {
            return text
                .toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase())
                .replace(/\bCd\b/g, "CD")
                .replace(/\bNfc\b/g, "NFC")
        }

        card.className = `
            bg-gray-900
            border border-gray-700
            rounded-2xl
            p-5
            shadow-lg
            hover:scale-[1.02]
            transition
            flex
            flex-col
        `;

        card.innerHTML = `
    <div class="flex items-start justify-between gap-3">

        <h2 class="text-xl font-bold text-white">
            ${album.artist ? `${album.artist}` : ""}
            ${album.number ? `${album.number}` : ""}
            ${album.type ? `${album.type}` : ""}
            ${album.name ? `${album.name}` : ""}
            ${album.version ? `(${album.version} ver.)` : ""}
            ${album.member ? `(${album.member})` : ""}
        </h2>

        <button
            type="button"
            onclick="toggleFavorite(${album.id})"
            class="text-2xl hover:scale-110 transition shrink-0"
        >
            ${album.favorite ? "⭐" : "☆"}
        </button>

    </div>

    <img
        src="${album.img}"
        alt="${album.artist} ${album.name} ${album.version}"
        class="w-full rounded-xl mt-3 mb-4"
    >

    <p class="text-white mb-1 font-bold">
        <span class="font-bold">Content:</span>
        ${titleCase(album.content)}
    </p>

    <div class="mt-4 flex-1 flex flex-col">

    <p class="text-white font-bold">
        💿 Price: $${album.price.toFixed(2)}
    </p>

    <p class="text-white font-bold mt-2">
        📦 Delivery: $${album.delivery.toFixed(2)}
    </p>

    <p class="text-white font-bold mt-2">
        💰 Total: $${totalUSD.toFixed(2)}
    </p>

    <div class="mt-auto pt-4">

        ${album.bought
                ? `
                <p class="font-bold text-green-400">✅ Owned</p>
            <button
                type="button"
                onclick="markAsNotOwned(${album.id})"
                class="mt-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition"
            >
                Mark as not owned
            </button>
            `
                : canAfford
                    ? `
                <button
                    type="button"
                    onclick="markAsOwned(${album.id})"
                    class="block px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition"
                >
                    ✅ Mark as owned
                </button>

                <a
                    href="${album.url}"
                    target="_blank"
                    class="inline-block mt-2 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
                >
                    🛒 Buy Album
                </a>
            `
                    : `
                <div class="flex justify-between text-sm text-gray-400">
                    <span>Progress</span>

                    <span>
                        ${Math.min(
                        Math.round((balance / totalAMD) * 100),
                        100
                    )}%
                    </span>
                </div>

                <div class="w-full bg-gray-700 rounded-full h-3 mt-2">
                    <div
                        class="bg-pink-500 h-3 rounded-full transition-all duration-500"
                        style="width: ${Math.min(
                        (balance / totalAMD) * 100,
                        100
                    )
                    }%"
                    ></div>
                </div>

                ${!canAfford
                        ? `
            <p class="text-gray-400 mt-2">
                You need ֏${Math.ceil(
                            totalAMD - balance
                        ).toLocaleString()} more
            </p>
        `
                        : ""
                    }

                <button
                    disabled
                    class="mt-4 px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed"
                >
                    Not enough money
                </button>
            `
            }

    </div>

</div>
`;

        favoritesGrid.appendChild(card);
    });
}

function toggleFavorite(id) {

    const account = getCurrentAccount();

    if (!account) {
        console.log("No logged-in account.");
        return;
    }

    const album = albums.find(album => album.id === id);

    if (!album) {
        console.log("Album not found:", id);
        return;
    }

    // Make sure favorites is always an array
    if (!Array.isArray(account.favorites)) {
        account.favorites = [];
    }

    const isFavorite = account.favorites.includes(id);

    if (isFavorite) {
        // Remove from THIS account
        account.favorites = account.favorites.filter(
            favoriteId => favoriteId !== id
        );

        album.favorite = false;

    } else {
        // Add to THIS account
        account.favorites.push(id);

        album.favorite = true;
    }

    saveAccounts();

    console.log(
        "Account:",
        account.username,
        "| Favorites:",
        account.favorites
    );

    displayAlbums();
    displayFavorites();
    displayAffordables();

    if (dashboardFavorites) {
        dashboardFavorites.textContent =
            `${account.favorites.length} albums`;
    }
}

// Make it available to onclick=""
window.toggleFavorite = toggleFavorite;


// -- AFFORDABLE --
async function displayAffordables() {

    if (!affordablesGrid) return;

    const renderingUser = currentUser;

    if (!renderingUser) return;

    const exchangeRate = await getExchangeRate();

    // Don't render if the user changed while waiting
    if (currentUser !== renderingUser) return;

    affordablesGrid.innerHTML = "";


    // GET AFFORDABLE ALBUMS
    let affordableAlbums = albums.filter(album => {
        const totalAMD =
            (album.price + album.delivery) * exchangeRate;

        return !album.bought && balance >= totalAMD;
    });

    // Show/hide controls based on whether affordable albums EXIST
    if (affordablesControls) {
        if (affordableAlbums.length === 0) {
            affordablesControls.classList.add("hidden");
        } else {
            affordablesControls.classList.remove("hidden");
        }
    }

    // Copy affordable albums for search + sorting
    let sortedAlbums = [...affordableAlbums];

    // SEARCH
    const searchTerm =
        affordableSearch.value.toLowerCase().trim();

    sortedAlbums = sortedAlbums.filter(album =>
        `${album.artist} ${album.number} ${album.name} ${album.version} ${album.member}`
            .toLowerCase()
            .includes(searchTerm)
    );


    // SORTING
    if (affordableSort.value === "price-low") {
        sortedAlbums.sort((a, b) =>
            (a.price + a.delivery) -
            (b.price + b.delivery)
        );
    }

    if (affordableSort.value === "price-high") {
        sortedAlbums.sort((a, b) =>
            (b.price + b.delivery) -
            (a.price + a.delivery)
        );
    }

    if (affordableSort.value === "artist") {
        sortedAlbums.sort((a, b) =>
            a.artist.localeCompare(b.artist) ||
            a.number.localeCompare(b.number) ||
            a.name.localeCompare(b.name) ||
            a.version.localeCompare(b.version) ||
            a.member.localeCompare(b.member)
        );
    }

    if (affordableSort.value === "artist-reverse") {
        sortedAlbums.sort((a, b) =>
            b.artist.localeCompare(a.artist) ||
            b.number.localeCompare(a.number) ||
            b.name.localeCompare(a.name) ||
            b.version.localeCompare(a.version) ||
            b.member.localeCompare(a.member)
        );
    }

    if (affordableSort.value === "favorites") {
        sortedAlbums.sort((a, b) =>
            Number(b.favorite) - Number(a.favorite)
        );
    }

    // --------------------
    // NO AFFORDABLE ALBUMS
    // --------------------

    if (sortedAlbums.length === 0) {

        affordablesGrid.innerHTML = `
            <div class="col-span-full text-center py-12 mt-6">
                <p class="text-5xl mb-4">💸</p>

                <p class="text-xl font-bold text-white">
                    No affordable albums found
                </p>

                <p class="text-gray-400 mt-2">
                    ${searchTerm
                ? "Try changing your search"
                : "You're still broke"
            }
                </p>
            </div>
        `;

        return;
    }

    // --------------------
    // DISPLAY CARDS
    // --------------------

    sortedAlbums.forEach(album => {

        const totalUSD =
            album.price + album.delivery;

        const totalAMD =
            totalUSD * exchangeRate;

        function titleCase(text) {
            return text
                .toLowerCase()
                .replace(/\b\w/g, char => char.toUpperCase())
                .replace(/\bCd\b/g, "CD")
                .replace(/\bNfc\b/g, "NFC");
        }

        const card = document.createElement("div");

        card.className = `
            bg-gray-900
            border border-gray-700
            rounded-2xl
            p-5
            shadow-lg
            hover:scale-[1.02]
            transition
            flex
            flex-col
        `;

        card.innerHTML = `
            <div class="flex items-start justify-between gap-3">

                <h2 class="text-xl font-bold text-white">
                ${album.artist ? `${album.artist}` : ""}
                ${album.number ? `${album.number}` : ""}
                ${album.type ? `${album.type}` : ""}
                ${album.name ? `${album.name}` : ""}
                ${album.version ? `(${album.version} ver.)` : ""}
                ${album.member ? `(${album.member})` : ""}
                </h2>

                <button
                    type="button"
                    onclick="toggleFavorite(${album.id})"
                    class="text-2xl hover:scale-110 transition shrink-0"
                >
                    ${album.favorite ? "⭐" : "☆"}
                </button>

            </div>

            <img
                src="${album.img}"
                alt="${album.artist} ${album.name} ${album.version}"
                class="w-full rounded-xl mt-3 mb-4"
            >

            <p class="text-white mb-1 font-bold">
                <span class="font-bold">Content:</span>
                ${titleCase(album.content)}
            </p>

            <div class="mt-4 flex-1 flex flex-col">

                <p class="text-white font-bold">
                    💿 Price: $${album.price.toFixed(2)}
                </p>

                <p class="text-white font-bold mt-2">
                    📦 Delivery: $${album.delivery.toFixed(2)}
                </p>

                <p class="text-white font-bold mt-2">
                    💰 Total: $${totalUSD.toFixed(2)}
                </p>

                <div class="mt-auto pt-4">

                    <button
                        type="button"
                        onclick="markAsOwned(${album.id})"
                        class="block px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition"
                    >
                        ✅ Mark as owned
                    </button>

                    <a
                        href="${album.url}"
                        target="_blank"
                        class="inline-block mt-2 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
                    >
                        🛒 Buy Album
                    </a>

                </div>

            </div>
        `;

        affordablesGrid.appendChild(card);
    });
}

// -- OWNED ALBUMS --
const ownedGrid = document.getElementById("owned-grid");

async function markAsOwned(id) {
    const account = getCurrentAccount();
    const album = albums.find(album => album.id === id);

    if (!account || !album || album.bought) return;

    const exchangeRate = await getExchangeRate();

    const totalAMD =
        (album.price + album.delivery) * exchangeRate;

    // Don't allow buying if there's not enough money
    if (balance < totalAMD) return;

    if (!Array.isArray(account.owned)) {
        account.owned = [];
    }

    account.owned.push(id);

    // Mark as owned
    album.bought = true;

    // Subtract album cost
    balance -= totalAMD;

    // Save new balance
    account.balance = balance;

    saveAccounts();

    // Update everything
    updateDashboardCounts();
    updateBalanceDisplay();
    updateBalanceUI();
    displayAlbums();
    displayOwned();
    displayFavorites();
    displayAffordables();
    updateDashboardAffordable();
}

async function markAsNotOwned(id) {
    const account = getCurrentAccount();
    const album = albums.find(album => album.id === id);

    if (!account || !album) return;

    const exchangeRate = await getExchangeRate();

    const totalAMD =
        (album.price + album.delivery) * exchangeRate;

    if (!Array.isArray(account.owned)) {
        account.owned = [];
    }

    // Remove this album from the account's owned list
    account.owned = account.owned.filter(
        albumId => albumId !== id
    );

    // Mark as not owned
    album.bought = false;

    // Return album cost to balance
    balance += totalAMD;

    // Save new balance
    account.balance = balance;

    // Refresh everything
    saveAccounts();

    // Update everything
    updateDashboardCounts();
    updateBalanceDisplay();
    updateBalanceUI();
    displayAlbums();
    displayOwned();
    displayFavorites();
    displayAffordables();
    updateDashboardAffordable();
}

window.markAsNotOwned = markAsNotOwned;

function displayOwned() {
    if (!currentUser) return;
    if (!ownedGrid) return;

    const ownedAlbums = albums.filter(album => album.bought);
    ownedGrid.innerHTML = "";

    if (ownedAlbums.length === 0) {
        ownedGrid.innerHTML = `
            <div class="col-span-full text-center py-12">
                <p class="text-5xl mb-4">📦</p>
                <p class="text-xl font-bold text-white">You still don't own albums</p>
                <p class="text-gray-400 mt-2">Save up and buy an album</p>
            </div>
        `;
        return;
    }

    ownedAlbums.forEach(album => {
        const card = document.createElement("div");
        card.className = "bg-gray-900 border border-gray-700 rounded-2xl p-5 shadow-lg";
        card.innerHTML = `
            <h2 class="text-xl font-bold text-white">
            ${album.artist ? `${album.artist}` : ""}
            ${album.number ? `${album.number}` : ""}
            ${album.type ? `${album.type}` : ""}
            ${album.name ? `${album.name} ` : ""}
            ${album.version ? `(${album.version} ver.)` : ""}
            ${album.member ? `(${album.member})` : ""}
        </h2>

            <img
                src="${album.img}"
                alt="${album.artist} ${album.name} ${album.version}"
                class="w-full rounded-xl mt-3 mb-4"
            >
            <p class="font-bold text-green-400">✅ Owned</p>
            <button
                type="button"
                onclick="markAsNotOwned(${album.id})"
                class="mt-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition"
            >
                Mark as not owned
            </button>
        `;
        ownedGrid.appendChild(card);
    });
}

window.markAsOwned = markAsOwned;

// -- BALANCE --
const moneyReceivedInput =
    document.getElementById("money-received");

const moneySpentInput =
    document.getElementById("money-spent");

const addMoneyButton =
    document.getElementById("add-money");

const spendMoneyButton =
    document.getElementById("spend-money");

const balanceDisplay =
    document.getElementById("balance-display");

function updateBalanceDisplay() {
    if (balanceDisplay) {
        balanceDisplay.textContent =
            `Balance: ֏${balance.toLocaleString()}`;
    }
}

function updateBalanceUI() {
    const balanceDisplay = document.getElementById("balance-display");
    const dashboardBalance = document.getElementById("dashboard-balance");

    if (balanceDisplay) {
        balanceDisplay.textContent =
            `֏${balance.toLocaleString()}`;
    }

    if (dashboardBalance) {
        dashboardBalance.textContent =
            `֏${balance.toLocaleString()}`;
    }
}

// -------------------- MONEY RECEIVED --------------------

if (addMoneyButton) {
    addMoneyButton.addEventListener("click", () => {

        const account = getCurrentAccount();

        if (!account) return;

        const amount = Number(moneyReceivedInput.value);

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        balance += amount;

        account.balance = balance;

        saveAccounts();

        moneyReceivedInput.value = "";

        updateBalanceDisplay();
        updateBalanceUI();

        displayFavorites();
        displayAlbums();
        displayAffordables();
        updateDashboardAffordable();
    });
}


// -------------------- MONEY SPENT --------------------

if (spendMoneyButton) {
    spendMoneyButton.addEventListener("click", () => {

        const account = getCurrentAccount();

        if (!account) return;

        const amount = Number(moneySpentInput.value);

        if (!Number.isFinite(amount) || amount <= 0) {
            alert("Please enter a valid amount.");
            return;
        }

        if (amount > balance) {
            alert("You don't have enough money.");
            return;
        }

        balance -= amount;

        account.balance = balance;

        saveAccounts();

        moneySpentInput.value = "";

        updateBalanceDisplay();
        updateBalanceUI();

        displayFavorites();
        displayAlbums();
        displayAffordables();
        updateDashboardAffordable();
    });
}


// -- EXCHANGE --
const API_KEY = "13d3e914c5bd48469381b073abaaca35";
const Drams = "AMD";
const Dollars = "USD";

async function getExchangeRate() {
    try {
        const response = await fetch(
            `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}&symbols=${Drams},${Dollars}`
        );

        const data = await response.json();

        if (data.result !== "success") {
            throw new Error("Failed to get exchange rate");
        }

        return data.conversion_rates.AMD;

    } catch (error) {
        console.error("Exchange rate error:", error);

        // Fallback rate
        return 380;
    }
}


updateDashboardAffordable();

// -- Search --
const albumSearch = document.getElementById("album-search");
const favoriteSearch = document.getElementById("favorite-search");
const affordableSearch = document.getElementById("affordable-search");

// -- ALBUM INPUT --
const albumImportUrl = document.getElementById("album-url-input");
const importAlbumButton = document.getElementById("import-album-btn");
const albumImportMessage = document.getElementById("album-import-message");
const albumImportModal = document.getElementById("album-import-modal");
const albumImportPreview = document.getElementById("album-import-preview");
const albumImportEditor = document.getElementById("album-import-editor");
const albumImportActions = document.getElementById("album-import-actions");
const albumImportSaveActions = document.getElementById("album-import-save-actions");
const importedAlbumName = document.getElementById("imported-album-name");
const importedAlbumContent = document.getElementById("imported-album-content");
const importedAlbumDelivery = document.getElementById("imported-album-delivery");
let importedAlbumDraft = null;

function renderImportedAlbumPreview() {
    if (!albumImportPreview || !importedAlbumDraft) return;

    albumImportPreview.innerHTML = `
        <div class="flex flex-col sm:flex-row gap-5">
            <img src="${importedAlbumDraft.img}" alt="${importedAlbumDraft.name}" class="w-full sm:w-48 h-48 object-cover rounded-xl bg-gray-800">
            <div>
                <p class="text-sm text-pink-400 font-bold">Ready to add</p>
                <h2 class="text-2xl font-bold mt-1">${cleanImportedAlbumName(importedAlbumDraft.artist, importedAlbumDraft.name)}</h2>
                <p class="mt-3 text-gray-300">💰 Price: $${importedAlbumDraft.price.toFixed(2)}</p>
                <p class="mt-1 text-gray-300">📦 Delivery: $${importedAlbumDraft.delivery.toFixed(2)}</p>
                <p class="mt-4 text-gray-300 whitespace-pre-line">${importedAlbumDraft.content || "No contents listed."}</p>
            </div>
        </div>`;
}

function closeAlbumImportModal() {
    importedAlbumDraft = null;
    if (albumImportModal) albumImportModal.classList.add("hidden");
}

function showAlbumImportEditor(showEditor) {
    albumImportEditor?.classList.toggle("hidden", !showEditor);
    albumImportActions?.classList.toggle("hidden", showEditor);
    albumImportSaveActions?.classList.toggle("hidden", !showEditor);
}

if (importAlbumButton) {
    importAlbumButton.addEventListener("click", async () => {
        const url = albumImportUrl.value.trim();

        const account = getCurrentAccount();

        if (account?.customAlbums?.some(album =>
            album.url?.trim().toLowerCase() === url.toLowerCase()
        )) {
            albumImportMessage.textContent = "⚠️ You got dementia or smth? IT'S ALREADY HERE";
            return;
        }

        albumImportMessage.textContent = "";

        if (!url) {
            albumImportMessage.textContent = "Paste an album URL";
            return;
        }

        importAlbumButton.disabled = true;
        importAlbumButton.textContent = "Importing…";

        try {
            const response = await fetch(`${SUPABASE_URL}/functions/v1/import-album`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: SUPABASE_ANON_KEY
                },
                body: JSON.stringify({ url })
            });
            const result = await response.json();

            if (!response.ok) throw new Error(result.error || "Could not import this album.");

            importedAlbumDraft = {
                ...result.album,
                id: Date.now(),
                url: url,
                name: cleanImportedAlbumName(
                    result.album.artist,
                    result.album.name
                ),
                content: formatImportedContent(result.album.content || "")
            };

            renderImportedAlbumPreview();
            showAlbumImportEditor(false);
            albumImportModal.classList.remove("hidden");
        } catch (error) {
            albumImportMessage.textContent = error.message === "Failed to fetch"
                ? "The album importer is not available right now. Please try again shortly."
                : error.message;
        } finally {
            importAlbumButton.disabled = false;
            importAlbumButton.textContent = "Import album";
        }
    });
}

function decodeHtmlEntities(text) {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = text;
    return textarea.value;
}

function cleanImportedAlbumName(artist, name) {
    const cleanArtist = decodeHtmlEntities(artist || "").trim();
    let cleanName = decodeHtmlEntities(name || "").trim();

    if (cleanArtist) {
        const artistRegex = new RegExp(
            `^${cleanArtist.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`,
            "i"
        );

        cleanName = cleanName.replace(artistRegex, "");
    }

    return `${cleanArtist} ${cleanName}`.trim();
}

function formatImportedContent(content) {
    if (!content) return "";

    const preserved = [
        "CD",
        "NFC",
        "DVD",
        "QR",
        "USB",
        "LP",
        "AR",
        "VR"
    ];

    return content
        .split(/\n+/)
        .map(line => line.trim())
        .filter(Boolean)
        .map(line => {
            let formatted = line.toLowerCase();

            formatted = formatted.replace(/\b\w+/g, word =>
                word.charAt(0).toUpperCase() + word.slice(1)
            );

            for (const word of preserved) {
                const regex = new RegExp(`\\b${word}\\b`, "gi");
                formatted = formatted.replace(regex, word);
            }

            return formatted;
        })
        .join("\n");
}

document.getElementById("edit-imported-album")?.addEventListener("click", () => {
    importedAlbumName.value = cleanImportedAlbumName(
        importedAlbumDraft.artist,
        importedAlbumDraft.name
    );

    importedAlbumContent.value = decodeHtmlEntities(
        importedAlbumDraft.content || ""
    );

    importedAlbumDelivery.value = importedAlbumDraft.delivery || 0;

    showAlbumImportEditor(true);
});

document.getElementById("save-imported-album")?.addEventListener("click", () => {
    const delivery = Number(importedAlbumDelivery.value);

    if (
        !importedAlbumName.value.trim() ||
        !Number.isFinite(delivery) ||
        delivery < 0 ||
        !importedAlbumDraft
    ) return;

    const fullName = decodeHtmlEntities(importedAlbumName.value.trim());

    importedAlbumDraft.name = cleanImportedAlbumName(
        importedAlbumDraft.artist,
        fullName
    ).replace(
        new RegExp(
            `^${importedAlbumDraft.artist.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*`,
            "i"
        ),
        ""
    ).trim();

    importedAlbumDraft.content = formatImportedContent(
        importedAlbumContent.value.trim()
    );

    importedAlbumDraft.delivery = delivery;

    renderImportedAlbumPreview();
    showAlbumImportEditor(false);
});

document.getElementById("cancel-import-edit")?.addEventListener("click", () => showAlbumImportEditor(false));
document.getElementById("cancel-import-album")?.addEventListener("click", closeAlbumImportModal);

document.getElementById("confirm-import-album")?.addEventListener("click", () => {
    const account = getCurrentAccount();
    albumImportMessage.textContent = "";

    if (!account || !importedAlbumDraft) return;

    account.customAlbums = Array.isArray(account.customAlbums)
        ? account.customAlbums
        : [];

    const alreadyExists = account.customAlbums.some(album => {
        const sameUrl =
            album.url &&
            importedAlbumDraft.url &&
            album.url.trim().toLowerCase() === importedAlbumDraft.url.trim().toLowerCase();

        const sameAlbum =
            album.name?.trim().toLowerCase() === importedAlbumDraft.name?.trim().toLowerCase() &&
            album.artist?.trim().toLowerCase() === importedAlbumDraft.artist?.trim().toLowerCase();

        return sameUrl || sameAlbum;
    });

    if (alreadyExists) {
        albumImportMessage.textContent = "⚠️ You got dementia or smth? IT'S ALREADY HERE";
        return;
    }

    account.customAlbums.push({ ...importedAlbumDraft });
    albums.push({ ...importedAlbumDraft });

    saveAccounts();

    closeAlbumImportModal();

    albumImportUrl.value = "";
    albumImportMessage.textContent = "";

    displayAlbums();
    updateDashboardCounts();
    updateDashboardAffordable();
});


// -- DISPLAY ALBMUS IN albums.html
let albumsRenderVersion = 0;

async function displayAlbums() {

    if (!albumGrid) return;

    const renderingUser = currentUser;
    const thisRender = ++albumsRenderVersion;

    if (!renderingUser) return;

    const exchangeRate = await getExchangeRate();

    if (currentUser !== renderingUser) return;
    if (thisRender !== albumsRenderVersion) return;

    albumGrid.innerHTML = "";

    let sortedAlbums = albums.filter(album => !album.bought);

    const searchTerm =
        albumSearch.value.toLowerCase().trim();

    function titleCase(text) {
        return text
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase())
            .replace(/\bCd\b/g, "CD")
            .replace(/\bNfc\b/g, "NFC")
    }

    sortedAlbums = sortedAlbums.filter((album) =>
        `${album.artist} ${album.name} ${album.version} ${album.member}`
            .toLowerCase()
            .includes(searchTerm)
    );

    if (sortedAlbums.length === 0) {

        albumGrid.innerHTML = `
        <div class="col-span-full text-center py-12">
            <p class="text-5xl mb-4">🍃</p>

            <p class="text-xl font-bold text-white">
                ${searchTerm
                ? "No albums found"
                : "No albums yet"
            }
            </p>

            <p class="text-gray-400 mt-2">
                ${searchTerm
                ? "Try changing your search"
                : "Add an album"
            }
            </p>
        </div>
    `;

        return;
    }

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
            a.artist.localeCompare(b.artist) ||
            a.number.localeCompare(b.number) ||
            a.name.localeCompare(b.name) ||
            a.version.localeCompare(b.version) ||
            a.member.localeCompare(b.member)
        );
    }

    if (sortAlbums.value === "artist-reverse") {
        sortedAlbums.sort((a, b) =>
            b.artist.localeCompare(a.artist) ||
            b.number.localeCompare(a.number) ||
            b.name.localeCompare(a.name) ||
            b.version.localeCompare(a.version) ||
            b.member.localeCompare(a.member)
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

    if (thisRender !== albumsRenderVersion) return;

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
            flex
            flex-col
        `;

        card.innerHTML = `
    <div class="flex items-start justify-between gap-3">

        <h2 class="text-xl font-bold text-white">
            ${album.artist ? `${album.artist}` : ""}
            ${album.number ? `${album.number}` : ""}
            ${album.type ? `${album.type}` : ""}
            ${album.name ? `${album.name}` : ""}
            ${album.version ? `(${album.version} ver.)` : ""}
            ${album.member ? `(${album.member})` : ""}
        </h2>

        <button
            type="button"
            onclick="toggleFavorite(${album.id})"
            class="text-2xl hover:scale-110 transition shrink-0"
        >
            ${album.favorite ? "⭐" : "☆"}
        </button>

    </div>

    <img
        src="${album.img}"
        alt="${album.artist} ${album.name} ${album.version}"
        class="w-full rounded-xl mt-3 mb-4"
    >

    <p class="text-white mb-1 font-bold">
        <span class="font-bold">Content:</span>
        ${titleCase(album.content)}
    </p>

    <div class="mt-2 flex-1 flex flex-col">

        <p class="text-white font-bold">
            💿 Price: $${album.price.toFixed(2)}
        </p>

        <p class="text-white font-bold mt-2">
            📦 Delivery: $${album.delivery.toFixed(2)}
        </p>

        <p class="text-white font-bold mt-2">
            💰 Total: $${totalUSD.toFixed(2)}
        </p>

        <div class="mt-auto pt-4">

            ${canAfford
                ? `
                    <button
                        type="button"
                        onclick="markAsOwned(${album.id})"
                        class="block px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition"
                    >
                        ✅ Mark as owned
                    </button>

                    <a
                        href="${album.url}"
                        target="_blank"
                        class="inline-block mt-2 px-4 py-2 rounded-lg bg-pink-500 hover:bg-pink-600 text-white font-bold transition"
                    >
                        🛒 Buy Album
                    </a>
                `
                : `
                    <div class="flex justify-between text-sm text-gray-400 mt-4">
                        <span>Progress</span>

                        <span>
                            ${progress}%
                        </span>
                    </div>

                    <div class="w-full bg-gray-700 rounded-full h-3 mt-2">
                        <div
                            class="bg-pink-500 h-3 rounded-full transition-all duration-500"
                            style="width: ${progress}%"
                        ></div>
                    </div>

                    ${!canAfford
                    ? `
            <p class="text-gray-400 mt-2">
                You need ֏${Math.ceil(
                        totalAMD - balance
                    ).toLocaleString()} more
            </p>
        `
                    : ""
                }

                    <button
                        disabled
                        class="mt-4 px-4 py-2 rounded-lg bg-gray-700 text-gray-500 cursor-not-allowed"
                    >
                        Not enough money
                    </button>
                `
            }

        </div>

    </div>
`;

        albumGrid.appendChild(card);
    });
}

if (sortAlbums) {
    sortAlbums.addEventListener("change", displayAlbums);
}

if (favoriteSort) {
    favoriteSort.addEventListener("change", displayFavorites);
}

if (affordableSort) {
    affordableSort.addEventListener("change", displayAffordables);
}

if (albumSearch) {
    albumSearch.addEventListener("input", displayAlbums);
}

if (favoriteSearch) {
    favoriteSearch.addEventListener("input", displayFavorites);
}

if (affordableSearch) {
    affordableSearch.addEventListener("input", displayAffordables);
}


// -- Calendar --
let calendarEvents = [];

function displayCalendarEvents() {

    const eventsContainer =
        document.getElementById("calendar-events");

    if (!eventsContainer) return;

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

                ${event.amount
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

            const account = getCurrentAccount();

            if (!account) return;

            account.calendarEvents = calendarEvents;

            saveAccounts();

            displayCalendarEvents();
        });

    });
}


const addEventButton = document.getElementById("add-event");

if (addEventButton) {
    addEventButton.addEventListener("click", () => {

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

        const account = getCurrentAccount();

        if (!account) return;

        account.calendarEvents = calendarEvents;

        saveAccounts();

        document.getElementById("event-name").value = "";
        document.getElementById("event-date").value = "";
        document.getElementById("event-amount").value = "";

        displayCalendarEvents();
    });
}

// -- Navigation --
document.querySelectorAll(".nav-button").forEach(link => {
    const linkPage = new URL(link.href).pathname.split("/").pop();

    if (linkPage === pageFile) {
        link.classList.add("active");
    }
});

const dashboardPages = {
    balance: "balance.html",
    wishlist: "albums.html",
    favorites: "favorites.html",
    affordables: "affordables.html",
    owned: "owned.html"
};

document.querySelectorAll(".dashboard-card").forEach(card => {
    card.addEventListener("click", () => {
        const destination = dashboardPages[card.dataset.page];
        if (destination) window.location.assign(destination);
    });
});

// ==================== START APP ====================

if (isAuthPage) {
    if (currentUser) {
        window.location.replace("index.html");
    }
} else if (currentUser) {
    loadCurrentUserData();

    enterApp();

    updateBalanceDisplay();
    updateBalanceUI();

    if (currentPage === "index" || currentPage === "home") {
        updateDashboardCounts();
        updateDashboardAffordable();
    }

    if (currentPage === "albums") {
        displayAlbums();
    }

    if (currentPage === "favorites") {
        displayFavorites();
    }

    if (currentPage === "owned") {
        displayOwned();
    }

    if (currentPage === "affordables") {
        displayAffordables();
        updateDashboardAffordable();
    }

    if (currentPage === "calendar") {
        displayCalendarEvents();
    }

} else {
    window.location.replace("login.html");
}

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("../service-worker.js")
            .then(() => {
                console.log("Service Worker registered!");
            })
            .catch(error => {
                console.error("Service Worker registration failed:", error);
            });
    });
}

// -- SUPABASE CONNECTION --
async function testSupabaseConnection() {
    const { data, error } = await supabaseClient
        .from("albums")
        .select("*")
        .limit(1);

    if (error) {
        console.error("❌ Supabase connection failed:", error);
    } else {
        console.log("✅ Supabase connection works!", data);
    }
}

if (supabaseClient) {
    testSupabaseConnection();
}

console.log("K-pop Tracker started!");
