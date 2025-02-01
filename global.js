console.log('IT’S ALIVE!');

// function $$(selector, context = document) {
//   return Array.from(context.querySelectorAll(selector));
// }

let pages = [
  { url: 'index.html', title: 'Home' },
  { url: 'Projects/index.html', title: 'Projects' },
  { url: 'Contact/index.html', title: 'Contact' },
  { url: 'Cover/index.html', title: 'Cover' },
  { url: 'https://github.com/Lbangayan', title: 'GitHub' },
];

let nav = document.createElement('nav');
document.body.prepend(nav);

const ARE_WE_HOME = document.documentElement.classList.contains('home');

const BASE_URL = window.location.pathname.includes('/portfolio/') ? '/portfolio/' : '';


for (let p of pages) {
  let url = p.url;
  let title = p.title;
  
  url = !ARE_WE_HOME && !url.startsWith('http') ? '../' + url : url;


  let a = document.createElement('a');
  a.href = url;
  a.textContent = title;
  if (url==='https://github.com/Lbangayan') {
    a.target = '_blank'; // Open external links in a new tab
  }
  nav.append(a);
  a.classList.toggle(
    'current',
    a.host === location.host && a.pathname === location.pathname
  );
}

document.body.insertAdjacentHTML(
  'afterbegin',
  `
	<label class="color-scheme">
		Theme:
		<select id="color-scheme-selector">
			<option value="light dark">Automatic</option>
			<option value="light">Light</option>
			<option value="dark">Dark</option>
		</select>
	</label>`
);

const colorSchemeSelector = document.getElementById('color-scheme-selector');

colorSchemeSelector.addEventListener('input', function (event) {
  console.log('color scheme changed to', event.target.value);
  localStorage.colorScheme = event.target.value;
  document.documentElement.style.setProperty('color-scheme', event.target.value);
});

if (localStorage.colorScheme) {
  document.documentElement.style.setProperty('color-scheme', localStorage.colorScheme);
  colorSchemeSelector.value = localStorage.colorScheme;
}


export async function fetchJSON(url) {
  try {
      // Fetch the JSON file from the given URL
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch projects: ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      return data; 


  } catch (error) {
      console.error('Error fetching or parsing JSON data:', error);
  }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
  containerElement.innerHTML = '';
  for (let project of projects) {
    let article = document.createElement('article');
    article.innerHTML = `
      <${headingLevel}>${project.title}</${headingLevel}>
      <img src="${project.image}" alt="${project.title}">
      <p>${project.description}</p>
    `;
    containerElement.appendChild(article);
  }
  // Update the project count if the element exists
  const projectCountElement = document.getElementById('project-count');
  if (projectCountElement) {
    projectCountElement.textContent = projects.length;
  }
}

export async function fetchGitHubData(username) {
  // return statement here
  return fetchJSON(`https://api.github.com/users/${username}`);

}