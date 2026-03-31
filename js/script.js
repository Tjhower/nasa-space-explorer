// Find our date picker inputs on the page
// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
const gallery = document.getElementById('gallery');
const button = document.querySelector('button');
const factBox = document.getElementById('spaceFact');

setupDateInputs(startInput, endInput);

// 🔑 NASA API KEY (use DEMO_KEY for testing)
const API_KEY = "DEMO_KEY";

// 🌌 Space facts
const spaceFacts = [
  "A day on Venus is longer than a year on Venus.",
  "Neutron stars can spin 600 times per second.",
  "There are more stars in the universe than grains of sand on Earth.",
  "One million Earths could fit inside the Sun.",
  "Space is completely silent because there is no atmosphere."
];

// 🎲 Random fact on load
function showRandomFact() {
  const random = Math.floor(Math.random() * spaceFacts.length);
  factBox.textContent = "💡 Did You Know? " + spaceFacts[random];
}

showRandomFact();

// 📡 Fetch APOD data
async function fetchImages(startDate, endDate) {
  try {
    gallery.innerHTML = `<p>🔄 Loading space photos…</p>`;

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );

    const data = await response.json();
    renderGallery(data.reverse()); // newest first
  } catch (error) {
    gallery.innerHTML = `<p>❌ Failed to load images.</p>`;
    console.error(error);
  }
}

// 🖼️ Render gallery
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('gallery-item');

    let mediaHTML = "";

    if (item.media_type === "image") {
      mediaHTML = `<img src="${item.url}" alt="${item.title}" />`;
    } else if (item.media_type === "video") {
      mediaHTML = `
        <iframe 
          src="${item.url}" 
          frameborder="0" 
          allowfullscreen>
        </iframe>
      `;
    }

    div.innerHTML = `
      ${mediaHTML}
      <p><strong>${item.title}</strong></p>
      <p>${item.date}</p>
    `;

    // 🧩 Modal on click
    div.addEventListener('click', () => openModal(item));

    gallery.appendChild(div);
  });
}

// 🪟 Modal
function openModal(item) {
  const modal = document.createElement('div');
  modal.classList.add('modal');

  let mediaHTML = "";

  if (item.media_type === "image") {
    mediaHTML = `<img src="${item.hdurl || item.url}" />`;
  } else {
    mediaHTML = `<iframe src="${item.url}" frameborder="0" allowfullscreen></iframe>`;
  }

  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      ${mediaHTML}
      <h2>${item.title}</h2>
      <p><strong>${item.date}</strong></p>
      <p>${item.explanation}</p>
    </div>
  `;

  modal.querySelector('.close-modal').onclick = () => modal.remove();
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  document.body.appendChild(modal);
}

// 🎯 Button click
button.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  if (!startDate || !endDate) {
    alert("Please select a date range.");
    return;
  }

  fetchImages(startDate, endDate);
});

