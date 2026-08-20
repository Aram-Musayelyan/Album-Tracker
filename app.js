// ==================== LOCAL ACCOUNT SYSTEM ====================

const authPage = document.getElementById("auth-page");
const app = document.getElementById("app");
const nav = document.getElementById("nav");

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
    loginForm.classList.remove("hidden");
    registerForm.classList.add("hidden");

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}

function showRegisterForm() {
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");

    loginMessage.textContent = "";
    registerMessage.textContent = "";
}

// -------------------- CREATE ACCOUNT --------------------

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
        calendarEvents: []
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

// -------------------- LOG IN --------------------

function enterApp() {
    authPage.classList.add("hidden");
    nav.classList.remove("hidden");
    app.classList.remove("hidden");

    console.log(
        `Logged in as ${currentUser}`
    );
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

    enterApp();

    updateBalanceDisplay();
    updateBalanceUI();
    displayAlbums();
    displayFavorites();
    displayOwned();
    displayCalendarEvents();
    displayAffordables();
    updateDashboardAffordable();
});

// -------------------- LOG OUT --------------------

function logout() {

    localStorage.removeItem("currentUser");

    currentUser = null;

    nav.classList.add("hidden");
    app.classList.add("hidden");

    authPage.classList.remove("hidden");

    showLoginForm();

    console.log("Logged out.");
}

const logoutButton = document.getElementById("logout-button");

logoutButton.addEventListener("click", logout);

// Make logout available to HTML onclick=""
window.logout = logout;

// -------------------- SWITCH FORMS --------------------

showRegister.addEventListener(
    "click",
    showRegisterForm
);

showLogin.addEventListener(
    "click",
    showLoginForm
);

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
        content: "PHOTOBOOK, CD, FOLDED POSTER, PHOTO FILM TICKET, SELFIE PHOTOCARDS",
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
        content: "PHOTOBOOK, CD, SELFIE PHOTOCARDS, PHOTO STICKERS, GRAPHIC STICKER, GROUP FOLDED POSTER",
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
        content: "PHOTOBOOK, CD, SELFIE PHOTOCARDS, PHOTO STICKERS, GRAPHIC STICKER, GROUP FOLDED POSTER",
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
        content: "ZIP LOCK, PHOTOBOOK, CD, SELFIE PHOTOCARDS, HANG TAG",
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
        content: "COVER + PHOTOBOOK, CD, LOGO TAG, SELFIE PHOTOCARDS, STICKERS, MINI POSTER",
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
        member: "RORA",
        price: 8.57,
        delivery: 29.89,
        content: "SLEEVE, JEWEL CASE, PHOTOBOOK, CD, SELFIE PHOTOCARDS, STICKERS",
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
        content: "Cover, Keyring Ball Chain, Music NFC CD, Photocard",
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
        content: "Cover, Photobook, CD-R, Sticker, Postcard, Folded Poster, Photocard",
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
        version: "Wild Heart / Wild World",
        member: "Random",
        price: 14.16,
        delivery: 34.99,
        content: "Photobook, CD-R, Group Photocard, Photocard, Sticker, Photo Strip Frame / Profile Report, Plastic Keyring / Badge",
        url: "https://shop.weverse.io/en/shop/USD/artists/206/sales/65509",
        img: "https://cdn-contents.weverseshop.io/public/shop/35454d5b5f9e5892ed1458e67ceff84d.png?w=720&q=95",
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
        content: "Photobook, CD-R, Group Photocard, Photocard, Sticker, Photo Strip Frame, Plastic Keyring, International Special Bonus Photocard, Die-Cut Card, Bonus Track 'UNLOVEU' Lyric Card",
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
        content: "OUTER CASE, MINI-CD, STICKER, SELFIE PHOTOCARD, PROFILE PHOTOCARD",
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
        member: "DAY / ONE",
        price: 13.47,
        delivery: 32.68,
        content: "OUTER SLEEVE, PHOTOBOOK, COMPONENTS BOX, CD-R + CASE, SELFIE PHOTOCARD, GROUP PHOTOCARD, PAPER AIR FRESHENER, STICKER, FOLDED POSTERs",
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
        content: "Outbox, Photobook, Lyric Book, Postcard, Accordion Mini Book, Mini CD-R / CD Envelope, Envelope, 2 Sticker, Sticker Book, Poster, 2 Photocards",
        url: "https://shop.weverse.io/en/shop/USD/artists/120/sales/58249",
        img: "https://cdn-contents.weverseshop.io/public/shop/45df81931c399c648d22846a8757eb06.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 14,
        artist: "JISOO",
        number: "1st",
        type: "Mini Album",
        name: "AMORTAGE",
        version: "EXCLUSIVE EDITION PURPLE",
        member: "",
        price: 14.69,
        delivery: 29.89,
        content: "OUTBOX, SCREENPLAY BOOK, CD, FLIPBOOK, POSTCARDS, PHOTOCARD, POLAROID",
        url: "https://en.ygselect.com/product/jisoo-mini-album-amortage-exclusive-edition-purple-ver/10999/category/1307/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202502/ca45d5fa01f03fdf4e8fb20782097917.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 15,
        artist: "JISOO",
        number: "1st",
        type: "Mini Album",
        name: "AMORTAGE",
        version: "EXCLUSIVE EDITION BLACK",
        member: "",
        price: 14.69,
        delivery: 29.89,
        content: "OUTBOX, SCREENPLAY BOOK, CD, FLIPBOOK, POSTCARDS, PHOTOCARD, POLAROID, KEY TAG",
        url: "https://en.ygselect.com/product/jisoo-mini-album-amortage-exclusive-edition-black-ver/11000/category/1307/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202502/bae8e62bc1cc9c2928699798276f26b7.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 16,
        artist: "JISOO",
        number: "FIRST",
        type: "SINGLE ALBUM",
        name: "ME",
        version: "BLACK",
        member: "",
        price: 11.09,
        delivery: 34.67,
        content: "PACKAGING BOX, CD, PHOTOBOOK, SELFIE PHOTOCARD, INSTANT PHOTO, LYRICS PAPER, BOOKMARK",
        url: "https://en.ygselect.com/product/jisoo-first-single-album-me/8519/category/1021/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000MPR.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 17,
        artist: "JISOO",
        number: "FIRST",
        type: "SINGLE ALBUM",
        name: "ME",
        version: "KiT",
        member: "",
        price: 15.37,
        delivery: 32.68,
        content: "PACKAGING BOX, KiT, DOUBLE-SIDED PHOTOCARD SET, LYRICS PAPER, CREDIT PAPER, CALENDAR, WOOD STAND, SELFIE PHOTOCARD",
        url: "https://en.ygselect.com/product/%ED%95%B4%EC%99%B8%EB%AA%B0-jisoo-first-single-album-me-kit-album/8523/category/1021/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000MPV.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 18,
        artist: "BLACKPINK",
        number: "2nd",
        type: "ALBUM",
        name: "BORN PINK",
        version: "DIGIPACK",
        member: "JISOO",
        price: 8.98,
        delivery: 29.89,
        content: "DIGIPACK, CD, BOOKLET, RANDOM SELFIE PHOTOCARD, ACCORDION LYRIC SHEET, FOLDED POSTER",
        url: "https://en.ygselect.com/product/blackpink-2nd-album-born-pink-digipack-ver/7751/category/964/display/1/#none",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000LMD.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 19,
        artist: "LISA",
        number: "FIRST",
        type: "SINGLE ALBUM",
        name: "LALISA",
        version: "BLACK / GOLD",
        member: "",
        price: 11.09,
        delivery: 34.67,
        content: "PACKAGING, CD, PHOTOBOOK, LYRICS, PHOTOCARD, INSTANT PHOTO, DOUBLE-SIDED POSTER, RARE GOLD PHOTO CARD, RARE GOLDEN TICKET",
        url: "https://en.ygselect.com/product/lisa-first-single-album-lalisa/6379/category/744/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000JLJ.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 20,
        artist: "BLACKPINK",
        number: "1st",
        type: "FULL ALBUM",
        name: "THE ALBUM",
        version: "BLACK / GOLD",
        member: "VER. 3 / VER. 4",
        price: 11.09,
        delivery: 34.67,
        content: "PACKAGING, CD, HARDCOVER PHOTOBOOK, POSTCARD SET, CREDIT SHEET, LYRIC BOOK, PHOTOCARD, POSTCARD, STICKER, MOUNTED PHOTOCARD",
        url: "https://en.ygselect.com/product/blackpink-1st-full-album-the-album/5625/category/610/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000IIJ.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 21,
        artist: "BLACKPINK",
        number: "",
        type: "SPECIAL EDITION",
        name: "How You Like That",
        version: "",
        member: "",
        price: 12.24,
        delivery: 36.66,
        content: "CD, PHOTOBOOK, INSTANT PHOTO, POSTCARD, FOLDED POSTER, VIBE GIFT CARD, DOUBLE-SIDED POSTER",
        url: "https://en.ygselect.com/product/blackpink-special-edition-how-you-like-that/5523/category/605/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000IEL.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 22,
        artist: "BLACKPINK",
        number: "2nd",
        type: "MINI ALBUM",
        name: "KILL THIS LOVE",
        version: "BLACK / PINK",
        member: "",
        price: 11.09,
        delivery: 34.67,
        content: "CD, PACKAGIBG BOX, PHOTOBOOK, ACCORDION LYRIC BOOK, INSTANT PHOTOCARD, PHOTO ZINE, STICKER SET, LARGE PHOTOCARD SET",
        url: "https://en.ygselect.com/product/blackpink-2nd-mini-album-kill-this-love/4874/category/552/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202402/P0000HFM.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 23,
        artist: "KATSEYE",
        number: "3rd",
        type: "EP",
        name: "WILD",
        version: "Member",
        member: "Random",
        price: 9.23,
        delivery: 34.99,
        content: "Photobook, CD-R, Disguise Mask, Mini Poster, 2 Stickers, 2 Photocards",
        url: "https://shop.weverse.io/en/shop/USD/artists/206/sales/57396",
        img: "https://cdn-contents.weverseshop.io/public/shop/260a90df9b60b501fe1e20ad125c8fd1.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 24,
        artist: "KATSEYE",
        number: "2nd",
        type: "EP",
        name: "BEAUTIFUL CHAOS",
        version: "RED / YELLOW",
        member: "Random",
        price: 12.73,
        delivery: 34.99,
        content: "Photobook, Envelope, Photocard, Photocard Holder, Polaroid, Folded Poster, Postcard, Sticker Pack, CD, Mini Zine",
        url: "https://shop.weverse.io/en/shop/USD/artists/206/sales/41596",
        img: "https://cdn-contents.weverseshop.io/public/shop/7d708c5e8726a7762545d6ee6c06dc7f.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 25,
        artist: "aespa",
        number: "6th",
        type: "Mini Album",
        name: "Rich Man",
        version: "BURST",
        member: "Random",
        price: 9.51,
        delivery: 34.99,
        content: "Cover, Photobook, CD-R, Folded Poster, Photocard",
        url: "https://shop.weverse.io/en/shop/USD/artists/133/sales/44949",
        img: "https://cdn-contents.weverseshop.io/public/shop/4a71b2b9ebd0f8f32364b939f8be5979.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 26,
        artist: "aespa",
        number: "6th",
        type: "Mini Album",
        name: "Rich Man",
        version: "ENERGY",
        member: "Random",
        price: 10.58,
        delivery: 34.99,
        content: "Cover, Photobook, CD-R, Postcard, Folded Poster, Photocard",
        url: "https://shop.weverse.io/en/shop/USD/artists/133/sales/44947",
        img: "https://cdn-contents.weverseshop.io/public/shop/9fc7df8ff97abcae72218a7cd07a567e.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 27,
        artist: "aespa",
        number: "2nd",
        type: "Album",
        name: "LEMONADE",
        version: "WDA",
        member: "",
        price: 19.10,
        delivery: 34.99,
        content: "Cover, Photobook, CD-R, Bookmark, Postcard, Folded Poster, Photocard",
        url: "https://shop.weverse.io/en/shop/USD/artists/133/sales/61569",
        img: "https://cdn-contents.weverseshop.io/public/shop/a0f2efdf1886336457e8b23bcb467a9d.png?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 28,
        artist: "aespa",
        number: "",
        type: "Single",
        name: "Dirty Work",
        version: "Dirty Worker",
        member: "",
        price: 13.80,
        delivery: 34.99,
        content: "Photobook, CD-R, CD-R Evnelope, Tattoo Sticker, Photocard",
        url: "https://shop.weverse.io/en/shop/USD/artists/133/sales/41409",
        img: "https://cdn-contents.weverseshop.io/public/shop/233f57d9df66b160f7b36e6d615f9359.jpg?w=720&q=95",
        bought: false,
        favorite: false
    },
    {
        id: 29,
        artist: "ROSÉ",
        number: "1st",
        type: "Studio Album",
        name: "rosie",
        version: "Jewel Case",
        member: "Band Cover",
        price: 14.98,
        delivery: 15.99,
        content: "Jewel Case, CD, Lyric Book",
        url: "https://shop.rosesarerosie.com/products/rosie-jewel-case-version-band-cover?variant=46260118814939",
        img: "https://shop.rosesarerosie.com/cdn/shop/files/CD_COMPACT_ALT.png?v=1731533251&width=1024",
        bought: false,
        favorite: false
    },
    {
        id: 30,
        artist: "MEOVV",
        number: "2nd",
        type: "EP ALBUM",
        name: "BITE NOW",
        version: "PHOTOBOOK",
        member: "BEAST / ANGEL",
        price: 13.54,
        delivery: 32.68,
        content: "PHOTOBOOK + SLEEVE, CD-R + CD HOLDER, PAPER CLIP, PHOTOCARD, CARD SKIN, FOLDED POSTER, STICKER PACK, SCRATCHED CARD",
        url: "https://en.ygselect.com/product/meovv-the-2nd-ep-album-bite-now-photobook-ver-2%EC%A2%85-%EC%A4%91-%EB%9E%9C%EB%8D%A4-1%EC%A2%85/13038/category/51/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202605/63a40d074d0ef697be9c32ae21c2e0fa.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 31,
        artist: "BABYMONSTER",
        number: "2nd",
        type: "MINI ALBUM",
        name: "WE GO UP",
        version: "UP",
        member: "",
        price: 9.00,
        delivery: 29.89,
        content: "OUTBOX, PHOTOBOOK, CD, FOLDED POSTER, SELFIE PHOTOCARDS, POSTCARD, LOGO STICKERS",
        url: "https://en.ygselect.com/product/babymonster-2nd-mini-album-we-go-up-up-ver/12211/category/1355/display/1/",
        img: "https://cafe24img.poxo.com/ygnext/web/product/big/202509/e889a218cefc28d63690cbb45de306c2.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 32,
        artist: "Billie Eilish",
        number: "3rd",
        type: "Studio Album",
        name: "HIT ME HARD AND SOFT",
        version: "Standard CD",
        member: "",
        price: 33.27,
        delivery: 28.26,
        content: "CD",
        url: "https://www.ubuy.co.am/hy/product/J453DOOJU-billie-eilish-hit-me-hard-and-soft-alternative-cd/",
        img: "https://i5.walmartimages.com/seo/Billie-Eilish-Hit-Me-Hard-And-Soft-Music-Performance-CD_fe2a2f91-ca73-412e-b435-bec6cf059dd3.fc537f42d67984014ad592a36525fb6a.jpeg",
        bought: false,
        favorite: false
    },
    {
        id: 33,
        artist: "Olivia Rodrigo",
        number: "3rd",
        type: "Studio Album",
        name: "you seem pretty sad for a girl so in love",
        version: "CD",
        member: "",
        price: 7.04,
        delivery: 0,
        content: "Jewel case, CD",
        url: "https://am.ozon.com/t/V2DhZYx",
        img: "https://m.media-amazon.com/images/I/61qo2D1SkRL._SX355_.jpg",
        bought: false,
        favorite: false
    },
    {
        id: 34,
        artist: "CD Player",
        number: "",
        type: "",
        name: "",
        version: "Dark Brown",
        member: "",
        price: 63.65,
        delivery: 0,
        content: "CD Player, Remote",
        url: "https://am.ozon.com/t/wE0K24u",
        img: "https://ir.ozone.ru/s3/multimedia-1-q/c400/13372092386.jpg",
        bought: false,
        favorite: false
    },
];

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
    if (favoriteAlbums.length === 0) {
        favoritesControls.classList.add("hidden");
    } else {
        favoritesControls.classList.remove("hidden");
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
            ${album.name ? `[${album.name} ver.]` : ""}
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
    if (affordableAlbums.length === 0) {
        affordablesControls.classList.add("hidden");
    } else {
        affordablesControls.classList.remove("hidden");
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
                ${album.name ? `[${album.name} ver.]` : ""}
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
            ${album.name ? `[${album.name} ver.]` : ""}
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
    balanceDisplay.textContent = `Balance: ֏${balance.toLocaleString()}`;
}

function updateBalanceUI() {
    document.getElementById("balance-display").textContent =
        `֏${balance.toLocaleString()}`;

    document.getElementById("dashboard-balance").textContent =
        `֏${balance.toLocaleString()}`;
}

// -------------------- MONEY RECEIVED --------------------

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


// -------------------- MONEY SPENT --------------------

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

// -- ALBUM GRID --
const albumSearch = document.getElementById("album-search");
const favoriteSearch = document.getElementById("favorite-search");
const affordableSearch = document.getElementById("affordable-search");
let albumsRenderVersion = 0;

async function displayAlbums() {

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
                    No albums found in that name
                </p>

                <p class="text-gray-400 mt-2">
                    ${
                        searchTerm
                        ? "Try changing your search"
                        : ""
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
            ${album.name ? `[${album.name} ver.]` : ""}
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

sortAlbums.addEventListener("change", displayAlbums);
favoriteSort.addEventListener("change", displayFavorites);
affordableSort.addEventListener("change", displayAffordables);

albumSearch.addEventListener("input", displayAlbums);
favoriteSearch.addEventListener("input", displayFavorites);
affordableSearch.addEventListener("input", displayAffordables);


// -- NAVIGATION --
const navButtons = document.querySelectorAll(".nav-button");
const dashboardCards = document.querySelectorAll(".dashboard-card");
const pages = document.querySelectorAll(".page");

function showPage(pageName) {
    pages.forEach((page) => {
        page.classList.add("hidden");
    });

    document
        .getElementById(`page-${pageName}`)
        .classList.remove("hidden");

    if (pageName === "affordables" && currentUser) {
        displayAffordables();
    }
}

document.addEventListener("visibilitychange", () => {
    if (!document.hidden && currentUser) {
        showPage("home");
    }
});

navButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showPage(button.dataset.page);
    });
});

dashboardCards.forEach((card) => {
    card.addEventListener("click", () => {
        showPage(card.dataset.page);
    });
});


// -- Calendar --

let calendarEvents = [];

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

    const account = getCurrentAccount();

    if (!account) return;

    account.calendarEvents = calendarEvents;

    saveAccounts();

    document.getElementById("event-name").value = "";
    document.getElementById("event-date").value = "";
    document.getElementById("event-amount").value = "";

    displayCalendarEvents();
});

displayCalendarEvents();

// ==================== START APP ====================

if (currentUser) {
    loadCurrentUserData();

    enterApp();

    updateBalanceDisplay();
    updateBalanceUI();
    displayAlbums();
    displayFavorites();
    displayOwned();
    displayAffordables(); // ← ADD THIS
    displayCalendarEvents();
    updateDashboardAffordable();
} else {
    app.classList.add("hidden");
    authPage.classList.remove("hidden");
    showLoginForm();
}

console.log("K-pop Tracker started!");
