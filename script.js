document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split('\n').map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      const tbody = document.querySelector('#priceTable tbody');

      // Affiliate links for each company
      const links = {
        "Twist": "https://www.twistbioscience.com/order?ref=yourid",
        "IDT": "https://www.idtdna.com/pages/products/genes",
        "GenScript": "https://www.genscript.com/gene_synthesis.html",
        "Eurofins": "https://eurofinsgenomics.com/en/products/gene-synthesis/",
        "Azenta": "https://www.azenta.com/gene-synthesis",
        "Synbio Tech": "https://www.synbio-tech.com/gene-synthesis",
        "Biomatik": "https://www.biomatik.com/gene-synthesis",
        "Thermo GeneArt": "https://www.thermofisher.com/geneart"
      };

      // Company names in correct order (columns 1–8)
      const companies = ["Twist", "IDT", "GenScript", "Eurofins", "Azenta", "Synbio Tech", "Biomatik", "Thermo GeneArt"];

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        const tr = document.createElement('tr');

        // Extract prices from columns 1–8
        const priceValues = cells.slice(1, 9).map(cell => {
          const match = cell.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });

        const minPrice = Math.min(...priceValues);
        const cheapestIndex = priceValues.indexOf(minPrice); // 0 = Twist, 1 = IDT, etc.
        const cheapestCompany = companies[cheapestIndex];
        const cheapest-Link = links[cheapestCompany];

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          if (idx >= 1 && idx <= 8) {
            td.textContent = cell || '—';
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) {
              td.classList.add('cheapest');
            }
          }
          else if (idx === 13) { // Action column
            td.innerHTML = `
              <a href="${cheapestLink}" target="_blank">
                <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded whitespace-nowrap">
                  Get Quote from ${cheapestCompany} →
                </button>
              </a>`;
          }
          else {
            td.textContent = cell || '—';
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // Sorting (all columns except Action)
      document.querySelectorAll('th').forEach((th, col) => {
        if (col < 13) th.addEventListener('click', () => sortTable(col));
      });
    });
});

function sortTable(col) {
  const table = document.getElementById('priceTable');
  let switching = true;
  while (switching) {
    switching = false;
    const rows = Array.from(table.rows).slice(1);
    for (let i = 0; i < rows.length - 1; i++) {
      const a = rows[i].cells[col].innerText.trim();
      const b = rows[i + 1].cells[col].innerText.trim();
      if (a.localeCompare(b, undefined, { numeric: true }) > 0) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}
