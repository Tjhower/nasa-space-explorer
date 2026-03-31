// DATE INPUT SETUP 
// Find date inputs
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');
// Initialize date pickers (from dateRange.js)
setupDateInputs(startInput, endInput);

// GLOBAL ELEMENTS
const gallery = document.getElementById('gallery');
const button = document.querySelector('button');
const factBox = document.getElementById('spaceFact');

// NASA API KEY
const API_KEY = "Kao0l5xjKQWZoEHJ5q0Pwbg7dc7VEeNXQemSqqbv";

// SPACE FACTS
async function loadSpaceFact() {
  try {
    const res = await fetch('data/spaceFacts.json');
    const data = await res.json();

    const facts = data.facts;
    const randomIndex = Math.floor(Math.random() * facts.length);

    factBox.textContent = "💡 Did You Know? " + facts[randomIndex];
  } catch (err) {
    factBox.textContent = "💡 Space is amazing—facts unavailable!";
    console.error("Fact load error:", err);
  }
}

// Load fact on page load
loadSpaceFact();

// SKELETON LOADERS
function showSkeletons(count = 6) {
  gallery.innerHTML = "";

  for (let i = 0; i < count; i++) {
    const skeleton = document.createElement('div');
    skeleton.classList.add('gallery-item', 'skeleton-card');

    skeleton.innerHTML = `
      <div class="skeleton" style="height: 150px; margin-bottom: 10px;"></div>
      <div class="skeleton" style="height: 15px; width: 80%; margin-bottom: 5px;"></div>
      <div class="skeleton" style="height: 12px; width: 50%;"></div>
    `;

    gallery.appendChild(skeleton);
  }
}

// Fetch APOD data
async function fetchImages(startDate, endDate) {
  try {
    // Show skeleton loading UI
    showSkeletons(6);

    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&start_date=${startDate}&end_date=${endDate}`
    );

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();

    // Ensure newest images appear first
    renderGallery(data.reverse());

  } catch (error) {
    gallery.innerHTML = `<p>❌ Failed to load images.</p>`;
    console.error("Fetch error:", error);
  }
}

// RENDER GALLERY
function renderGallery(items) {
  gallery.innerHTML = "";

  items.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('gallery-item');

    let mediaHTML = "";

    // Handle image vs video
    if (item.media_type === "image") {
      mediaHTML = `<img src="${item.url}" alt="${item.title}" />`;
    } 
    else if (item.media_type === "video") {
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

    // Open modal on click
    div.addEventListener('click', () => openModal(item));

    gallery.appendChild(div);
  });
}

// MODAL FUNCTIONALITY
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

  // Close button
  modal.querySelector('.close-modal').onclick = () => modal.remove();

  // Click outside to close
  modal.onclick = (e) => {
    if (e.target === modal) modal.remove();
  };

  document.body.appendChild(modal);
}
// Button click
button.addEventListener('click', () => {
  const startDate = startInput.value;
  const endDate = endInput.value;

  // Validate input
  if (!startDate || !endDate) {
    alert("Please select a date range.");
    return;
  }

  // Limit range (recommended: max ~30 days)
  const diffDays = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24);

  if (diffDays > 30) {
    alert("Please select a range of 30 days or less.");
    return;
  }
  fetchImages(startDate, endDate)
});

