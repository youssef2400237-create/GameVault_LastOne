const STORAGE_KEY = "neon_nexus_store_games";
const minAllowedGames = 10;
const maxAllowedGames = 20;

const defaultGames = [
  { id: 1, name: "Solar Rift", genre: "Action", price: 49.99, rating: 4.8 },
  { id: 2, name: "Cyber Run", genre: "Racing", price: 39.99, rating: 4.4 },
  {
    id: 3,
    name: "Midnight Siege",
    genre: "Shooter",
    price: 59.99,
    rating: 4.7,
  },
  { id: 4, name: "Neon Spires", genre: "Adventure", price: 34.99, rating: 4.2 },
  { id: 5, name: "Echoes of Eden", genre: "RPG", price: 69.99, rating: 4.9 },
  { id: 6, name: "Voidwalkers", genre: "Strategy", price: 29.99, rating: 4.1 },
  { id: 7, name: "Frostbound", genre: "Survival", price: 24.99, rating: 4.5 },
  { id: 8, name: "Titan Core", genre: "Simulation", price: 44.99, rating: 4.0 },
  {
    id: 9,
    name: "Quantum Breakers",
    genre: "Puzzle",
    price: 19.99,
    rating: 4.3,
  },
  {
    id: 10,
    name: "Phantom Galaxy",
    genre: "Sci-Fi",
    price: 54.99,
    rating: 4.6,
  },
  {
    id: 11,
    name: "Dynasty 2080",
    genre: "Strategy",
    price: 39.99,
    rating: 4.2,
  },
  {
    id: 12,
    name: "Pixel Crusade",
    genre: "Platformer",
    price: 14.99,
    rating: 4.4,
  },
  { id: 13, name: "Realm of Legends", genre: "MMO", price: 49.99, rating: 4.7 },
  { id: 14, name: "Neon Nights", genre: "Rhythm", price: 24.99, rating: 4.0 },
  { id: 15, name: "Stormfront", genre: "Action", price: 59.99, rating: 4.6 },
];

const gamesTableBody = document.querySelector("#gamesTable tbody");
const gameCountLabel = document.querySelector("#gameCountLabel");
const addGameBtn = document.querySelector("#addGameBtn");
const editModal = document.querySelector("#editModal");
const viewModal = document.querySelector("#viewModal");
const editModalTitle = document.querySelector("#editModalTitle");
const saveGameBtn = document.querySelector("#saveGameBtn");
const closeEditModal = document.querySelector("#closeEditModal");
const closeViewModal = document.querySelector("#closeViewModal");
const gameNameInput = document.querySelector("#gameNameInput");
const gameGenreInput = document.querySelector("#gameGenreInput");
const gamePriceInput = document.querySelector("#gamePriceInput");
const gameRatingInput = document.querySelector("#gameRatingInput");
const viewName = document.querySelector("#viewName");
const viewGenre = document.querySelector("#viewGenre");
const viewPrice = document.querySelector("#viewPrice");
const viewRating = document.querySelector("#viewRating");

let games = [];
let editingGameId = null;

function getGamesFromStorage() {
  const raw = localStorage.getItem(STORAGE_KEY);
  let store = [];
  if (raw) {
    try {
      store = JSON.parse(raw);
    } catch (err) {
      console.error("Failed parse games", err);
    }
  }
  if (!Array.isArray(store) || store.length < minAllowedGames) {
    store = defaultGames.slice(
      0,
      Math.max(minAllowedGames, defaultGames.length),
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }
  return store;
}

function saveGames() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games));
}

function refreshGameCount() {
  gameCountLabel.textContent = `Total games: ${games.length}`;
  addGameBtn.disabled = games.length >= maxAllowedGames;
  if (games.length >= maxAllowedGames) {
    gameCountLabel.textContent += " (Max reached)";
  }
  if (games.length < minAllowedGames) {
    gameCountLabel.textContent += " (Add at least 10 games)";
  }
}

function renderGames() {
  gamesTableBody.innerHTML = "";
  if (games.length === 0) {
    gamesTableBody.innerHTML = "<tr><td colspan='6'>No games found.</td></tr>";
    return;
  }
  const visibleGames = games.slice(0, maxAllowedGames); 
  for (let i = 0; i < visibleGames.length; i++) {
    const game = visibleGames[i];
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${game.id}</td>
      <td>${escapeHtml(game.name)}</td>
      <td>${escapeHtml(game.genre)}</td>
      <td>$${Number(game.price).toFixed(2)}</td>
      <td>${Number(game.rating).toFixed(1)}</td>
      <td>
        <button class="btn btn-small btn-secondary" data-action="view" data-id="${game.id}">View</button>
        <button class="btn btn-small btn-primary" data-action="edit" data-id="${game.id}">Edit</button>
        <button class="btn btn-small btn-danger" data-action="delete" data-id="${game.id}">Delete</button>
      </td>";
    `;
    gamesTableBody.appendChild(tr);
  }
  refreshGameCount();
}

function escapeHtml(str = "") {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function openEditModal(forEdit = false) {
  editModalTitle.textContent = forEdit ? "Edit Game" : "Add Game";
  editModal.style.display = "flex";
  gameNameInput.focus();
}

function closeEdit() {
  editModal.style.display = "none";
  editingGameId = null;
  gameNameInput.value = "";
  gameGenreInput.value = "";
  gamePriceInput.value = "";
  gameRatingInput.value = "";
}

function openViewModal(game) {
  if (!game) return;
  viewName.textContent = game.name;
  viewGenre.textContent = game.genre;
  viewPrice.textContent = Number(game.price).toFixed(2);
  viewRating.textContent = Number(game.rating).toFixed(1);
  viewModal.style.display = "flex";
}

function closeView() {
  viewModal.style.display = "none";
}

function addOrUpdateGame() {
  const name = gameNameInput.value.trim();
  const genre = gameGenreInput.value.trim();
  const price = Number(gamePriceInput.value);
  const rating = Number(gameRatingInput.value);

  if (!name || !genre || isNaN(price) || isNaN(rating)) {
    alert("Please enter valid values for all fields.");
    return;
  }

  if (rating < 0 || rating > 5) {
    alert("Rating must be between 0 and 5.");
    return;
  }

  if (editingGameId) {
    const idx = games.findIndex((g) => g.id === editingGameId);
    if (idx >= 0) {
      games[idx] = { ...games[idx], name, genre, price, rating };
    }
  } else {
    if (games.length >= maxAllowedGames) {
      alert(`Cannot add more than ${maxAllowedGames} games.`);
      return;
    }
    const nextId = games.reduce((max, g) => Math.max(max, g.id), 0) + 1;
    games.push({ id: nextId, name, genre, price, rating });
  }

  saveGames();
  renderGames();
  closeEdit();
}

function deleteGame(id) {
  if (games.length <= minAllowedGames) {
    alert(`At least ${minAllowedGames} games must remain.`);
    return;
  }
  games = games.filter((g) => g.id !== id);
  saveGames();
  renderGames();
}

function startEditing(id) {
  const game = games.find((g) => g.id === id);
  if (!game) return;
  editingGameId = id;
  gameNameInput.value = game.name;
  gameGenreInput.value = game.genre;
  gamePriceInput.value = Number(game.price).toFixed(2);
  gameRatingInput.value = Number(game.rating).toFixed(1);
  openEditModal(true);
}

function bindEvents() {
  addGameBtn?.addEventListener("click", () => openEditModal(false));
  closeEditModal?.addEventListener("click", closeEdit);
  closeViewModal?.addEventListener("click", closeView);
  saveGameBtn?.addEventListener("click", addOrUpdateGame);

  gamesTableBody?.addEventListener("click", (e) => {
    const button = e.target.closest("button");
    if (!button) return;
    const action = button.dataset.action;
    const id = Number(button.dataset.id);

    if (action === "view") {
      const game = games.find((g) => g.id === id);
      openViewModal(game);
    } else if (action === "edit") {
      startEditing(id);
    } else if (action === "delete") {
      deleteGame(id);
    }
  });

  window.addEventListener("click", (e) => {
    if (e.target === editModal) closeEdit();
    if (e.target === viewModal) closeView();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeEdit();
      closeView();
    }
  });
}

function initializeStoreAll() {
  games = getGamesFromStorage();
  renderGames();
  bindEvents();
}

initializeStoreAll();

