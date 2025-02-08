import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";
import { fetchJSON, renderProjects } from '../global.js';

const projects = await fetchJSON('../lib/projects.json');
const projectsContainer = document.querySelector('.projects');
renderProjects(projects, projectsContainer, 'h2');

let selectedIndex = -1;

function renderPieChart(projectsGiven) {
  // Clear existing paths and legend items
  let svg = d3.select('svg');
  svg.selectAll('path').remove();
  let legend = d3.select('.legend');
  legend.selectAll('li').remove();

  // Re-calculate rolled data
  let newRolledData = d3.rollups(
    projectsGiven,
    (v) => v.length,
    (d) => d.year,
  );

  // Re-calculate data
  let newData = newRolledData.map(([year, count]) => {
    return { value: count, label: year };
  });

  // Re-calculate slice generator, arc data, arc, etc.
  let sliceGenerator = d3.pie().value((d) => d.value);
  let arcData = sliceGenerator(newData);
  let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  let arcs = arcData.map((d) => arcGenerator(d));

  // Define colors
  let colors = d3.scaleOrdinal(d3.schemeTableau10);

  // Update paths
  arcs.forEach((arc, idx) => {
    svg.append('path')
      .attr('d', arc)
      .attr('fill', colors(idx))
      .attr('class', 'clickable') // Add class to indicate clickable
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        
        svg.selectAll('path')
          .attr('class', (_, i) => (
            i === selectedIndex ? 'selected clickable' : 'clickable'
          ));
        
        legend.selectAll('li')
          .attr('class', (_, i) => (
            i === selectedIndex ? 'legend-item selected' : 'legend-item'
          ));

        // Filter projects by selected year
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
        } else {
          let selectedYear = newData[selectedIndex].label;
          let filteredProjects = projects.filter((project) => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });

  // Update legend
  newData.forEach((d, idx) => {
    legend.append('li')
      .attr('style', `--color:${colors(idx)}`)
      .attr('class', 'legend-item')
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
      .on('click', () => {
        selectedIndex = selectedIndex === idx ? -1 : idx;
        
        svg.selectAll('path')
          .attr('class', (_, i) => (
            i === selectedIndex ? 'selected clickable' : 'clickable'
          ));
        
        legend.selectAll('li')
          .attr('class', (_, i) => (
            i === selectedIndex ? 'legend-item selected' : 'legend-item'
          ));

        // Filter projects by selected year
        if (selectedIndex === -1) {
          renderProjects(projects, projectsContainer, 'h2');
        } else {
          let selectedYear = newData[selectedIndex].label;
          let filteredProjects = projects.filter((project) => project.year === selectedYear);
          renderProjects(filteredProjects, projectsContainer, 'h2');
        }
      });
  });
}

// Call this function on page load
renderPieChart(projects);

let query = '';
let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('change', (event) => {
  // Update query value
  query = event.target.value;
  // Filter projects
  let filteredProjects = projects.filter((project) => {
    let values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query.toLowerCase());
  });
  // Render filtered projects
  renderProjects(filteredProjects, projectsContainer, 'h2');
  // Re-render legends and pie chart when event triggers
  renderPieChart(filteredProjects);
});
