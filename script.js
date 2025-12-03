document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split('\n').map(line =>
        line.split(',').map(c => c.trim().replace(/^"|"$/g, ''))
      );

      // ---- Map exact column names from your CSV header (row 0) ----
      const header = rows[0];
      const companyCols = [
        header.indexOf("Twist"),
        header.indexOf("IDT"),
        header.indexOf("GenScript"),
        header.indexOf("Eurofins"),
        header.indexOf("Azenta"),
        header.indexOf("Synbio Tech"),
        header.indexOf("Biomatik"),
        header.indexOf("Thermo GeneArt")
      ];

      const companyNames = [
        "Twist", "IDT", "GenScript", "Eurofins",
        "Azenta", "Synbio Tech", "Biomatik", "Thermo GeneArt"
      ];

      const affiliateLinks = {
        "Twist":          "https://www.twistbioscience.com/order?ref=yourid",
        "IDT":            "https://www.idtdna.com/pages/products/genes",
        "GenScript":      "https://www.genscript.com/gene_synthesis.html",
        "Eurofins":       "https://eurofinsgenomics.com/en/products/gene-synthesis/",
        "Azenta":         "https://www.azenta.com/genewiz-multiomics-synthesis",
        "Synbio Tech":    "https://www.synbio-tech.com/gene-synthesis",
        "Biomatik":       "https://www.biomatik.com/gene-synthesis",
        "Thermo GeneArt": "https://www.thermofisher.com/geneart"
      };

      const tbody = document.querySelector('#priceTable tbody');

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        const tr = document.createElement('tr');

        // ---- Find the cheapest price in this row ----
        let prices = companyCols.map(colIdx => {
          const val = cells[colIdx] || '';
          const match = val.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });

        const minPrice = Math.min(...prices);
        const cheapestColIndex = prices.indexOf(minPrice);   // 0–7
        const cheapestCompany = companyNames[cheapestColIndex];
        const cheapestURL = affiliateLinks[cheapestCompany];

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          // Price columns – highlight cheapest
          if (companyCols.includes(idx)) {
            td.textContent = cell || '—';
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) {
              td.classList.add('cheapest');
            }
          }
          // Action column (index 13 = last column)
          else if (idx === 13) {
            td.innerHTML = `
              <a href="${cheapestURL}" target="_blank">
                <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow transition">
                  Get Quote from ${cheapestCompany} →
                </button>
              </a>`;
          }
          // Everything else
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
