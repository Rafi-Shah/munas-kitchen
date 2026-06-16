const MENU_ITEMS = [
  {
    id: 1, name: "Layered Mango Cake", cat: "cakes",
    desc: "Soft vanilla sponge layered with fresh mango cream and tropical coulis.",
    price: "৳850", emoji: "🎂", badge: "Bestseller", badgeClass: ""
  },
  {
    id: 2, name: "Chocolate Ganache Tart", cat: "desserts",
    desc: "Buttery pastry shell filled with dark chocolate ganache and sea salt.",
    price: "৳420", emoji: "🍫", badge: "Vegan option", badgeClass: ""
  },
  {
    id: 3, name: "Almond Croissants", cat: "pastries",
    desc: "Flaky, buttery croissants filled with rich almond frangipane cream.",
    price: "৳180", emoji: "🥐", badge: "Fresh daily", badgeClass: ""
  },
  {
    id: 4, name: "Strawberry Cheesecake", cat: "cakes",
    desc: "New York-style baked cheesecake topped with fresh strawberry compote.",
    price: "৳780", emoji: "🍓", badge: "Seasonal", badgeClass: "badge--seasonal"
  },
  {
    id: 5, name: "Crème Brûlée", cat: "desserts",
    desc: "Classic French custard with a perfectly caramelised sugar crust.",
    price: "৳350", emoji: "🍮", badge: "Chef's pick", badgeClass: ""
  },
  {
    id: 6, name: "Pain au Chocolat", cat: "pastries",
    desc: "Laminated dough wrapped around two batons of dark Belgian chocolate.",
    price: "৳220", emoji: "🫓", badge: "Fresh daily", badgeClass: ""
  },
  {
    id: 7, name: "Rose Cardamom Cake", cat: "seasonal",
    desc: "Fragrant cake infused with Persian rose water and green cardamom.",
    price: "৳920", emoji: "🌹", badge: "Seasonal", badgeClass: "badge--seasonal"
  },
  {
    id: 8, name: "Fruit Tarts", cat: "pastries",
    desc: "Crisp pastry shells filled with vanilla pastry cream and seasonal fruits.",
    price: "৳280", emoji: "🍋", badge: "Seasonal", badgeClass: "badge--seasonal"
  }
];

function renderMenu(cat = 'all') {
  const grid = document.getElementById('menu-grid');
  const items = cat === 'all' ? MENU_ITEMS : MENU_ITEMS.filter(i => i.cat === cat);
  grid.innerHTML = items.map(item => `
    <div class="menu-card" data-cat="${item.cat}">
      <div class="menu-card-img">${item.emoji}</div>
      <div class="menu-card-body">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
        <div class="menu-card-footer">
          <span class="price">${item.price}</span>
          <span class="badge ${item.badgeClass}">${item.badge}</span>
        </div>
      </div>
    </div>
  `).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderMenu(btn.dataset.cat);
    });
  });
});
