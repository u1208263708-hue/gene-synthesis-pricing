document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split('\n').map(line => line.split(',').map(cell => cell.trim().replace(/^"|"$/g, '')));
      const tbody = document.querySelector('#priceTable tbody');

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        if (cells.length < 10) continue; // safety

        const tr = document.createElement('tr');

        // Extract numeric prices from columns 1–8 (Twist → Thermo GeneArt)
        const priceValues = cells.slice(1, 9).map(cell => {
          const match = cell.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });
        const minPrice = Math.min(...priceValues);

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          if (idx === 0) {
            td.textContent = cell;                              // Length range
          }
          else if (idx >= 1 && idx <= 8) {
            td.textContent = cell || '—';                       // Show original text
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) {
              td.classList.add('cheapest');
            }
          }
          else if (idx === 9) {
            td.textContent = cell || '—';                       // Turnaround
          }
          else if (idx === 10) {
            // Action button
            const companyNames = ["Twist Bioscience", "IDT", "GenScript", "Eurofins", "Azenta", "Synbio Tech", "Biomatik", "Thermo GeneArt"];
            const company = companyNames[idx - 1];
            const links = {
              "Twist Bioscience": "https://www.twistbioscience.com/order?ref=yourid",
              "IDT": "https://www.idtdna.com/pages/products/genes",
              "GenScript": "https://www.genscript.com/gene_synthesis.html",
              "Eurofins": "https://eurofinsgenomics.com/en/products/gene-synthesis/",
              "Azenta": "https://www.azenta.com/gene-synthesis",
              "Synbio Tech": "https://www.synbio-tech.com/gene-synthesis",
              "Biomatik": "https://www.biomatik.com/gene-synthesis",
              "Thermo GeneArt": "https://www.thermofisher.com/geneart"
            };
            const url = links[company] || "#";
            td.innerHTML = `<a href="${url}" target="_blank" class="inline-block"><button class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">Get Quote →</button></a>`;
          }
          else {
            td.textContent = cell || '—';
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // Sorting (numeric + text safe)
      document.querySelectorAll('th').forEach((th, col) => {
        if (col < 10) th.addEventListener('click', () => sortTable(col));
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
      const a = rows[i].cells[col].innerText;
      const b = rows[i + 1].cells[col].innerText;
      if (a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }) > 0) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}
