const { ipcRenderer} = require('electron');

const searchBar = document.getElementById('searchBar');
const searchResults = document.getElementById('searchResults');

// Handle input event in the search bar
searchBar.addEventListener('input', (event) => {
  const searchTerm = searchBar.value.trim();

  // Proceed website search when "Enter" is pressed
  if (event.key === 'Enter') {
    if (searchTerm.length > 0) {
      performWebSearch(searchTerm);
    } else {
      searchResults.innerHTML = ''; // Clear search results if search bar is empty
    }
  }
});

// Function to perform web search using Google Custom Search API
function performWebSearch(searchTerm) {

  // Replace 'YOUR_API_KEY' and 'YOUR_CX' with your actual Google API key and Custom Search Engine ID
  const apiKey = 'YOUR_API_KEY';
  const cx = 'YOUR_CX';

  const url = `https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(
    searchTerm
  )}&key=${apiKey}&cx=${cx}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      displaySearchResults(data.items);
    })
    .catch((error) => {
      console.error('Error performing web search:', error);
      searchResults.innerHTML = 'Error performing web search';
    });
}

// Function to display search results
function displaySearchResults(results) {
  searchResults.innerHTML = '';

  results.forEach((result) => {
    const resultItem = document.createElement('div');
    const url = result.link;
    const faviconSize = 24;
    const faviconUrl = `https://www.google.com/s2/favicons?domain=${url}&sz=${faviconSize}`;

    // Applying the specified CSS styles
    resultItem.style.background = 'linear-gradient(92.88deg, rgb(69, 94, 181) 9.16%, rgb(86, 67, 204) 43.89%, rgb(103, 63, 215) 64.72%)';
    resultItem.style.color = 'inherit';
    resultItem.style.border = 'none';
    resultItem.style.padding = '10px 20px';
    resultItem.style.margin = '5px';
    resultItem.style.marginTop = '15px';
    resultItem.style.borderRadius = '30px';
    resultItem.style.fontSize = '16px';
    resultItem.style.boxSizing = 'border-box';
    resultItem.style.cursor = 'pointer';
    resultItem.style.width = '50%';
    resultItem.style.marginLeft = 'auto';
    resultItem.style.marginRight = 'auto';
    resultItem.style.display = 'flex';
    resultItem.style.flexDirection = 'column';
    resultItem.style.alignItems = 'center';
    resultItem.style.transition = 'box-shadow 0.3s, transform 0.3s';

    // Setting up the content of the resultItem
    resultItem.innerHTML = `
      <img src="${faviconUrl}" alt="Favicon" width="${faviconSize}" height="${faviconSize}" style="margin-right: 10px;">
      <a href="${result.link}" style="color: #ffffff; text-decoration: none;">${result.title}</a>
    `;

    // Adding hover effect
    resultItem.addEventListener('mouseover', () => {
      resultItem.style.boxShadow = '0 0 20px rgba(69, 94, 181, 0.7), 0 0 30px rgba(69, 94, 181, 0.5)';
      resultItem.style.transform = 'scale(1.05)';
    });

    // Removing hover effect
    resultItem.addEventListener('mouseout', () => {
      resultItem.style.boxShadow = '';
      resultItem.style.transform = '';
    });

    // Open website when clicked
    resultItem.addEventListener('click', (event) => {
      event.preventDefault();                           // Prevent the default behavior
      console.log('Result clicked')
      openWebsiteInNewWindow(result.link);              // Open the selected website
    });

    searchResults.appendChild(resultItem);
  });
}

// Open the website in a new window
function openWebsiteInNewWindow(url) {
  console.log(url)
  ipcRenderer.send('open-website-new-window', url);
}

// Add this event listener to handle "Enter" key press in the search bar
searchBar.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    const searchTerm = searchBar.value.trim();

    // Check if the entered text starts with "https://" to skip search and try directly to open the URL
    if (searchTerm.toLowerCase().startsWith('https://')) {
      openWebsiteInNewWindow(searchTerm);
    } else {
      // If it doesn't start with "https://", perform a web search
      performWebSearch(searchTerm);
    }
  }
});
