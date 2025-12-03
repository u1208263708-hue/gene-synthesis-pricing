document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split('\n').map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );

      // Use exact header names from your CSV row 0
      const header = rows[0];
      const twistCol     = header.indexOf("Twist");
      const idtCol       = header.indexOf("IDT");
      const genscriptCol = header.indexOf("GenScript");
      const eurofinsCol  = header.indexOf("Eurofins");
      const azentaCol    = header.indexOf("Azenta");
      const synbioCol    = header.indexOf("Synbio Tech");
      const biomatikCol  = header.indexOf("Biomatik");
      const thermoCol    = header.indexOf("Thermo GeneArt");

      const companyIndices = [twistCol, idtCol, genscriptCol, eurofinsCol, azentaCol, synbioCol, biomatikCol, thermoCol];
      const companyNames =   ["Twist", "IDT", "GenScript", "Eurofins", "Azenta", "Synbio Tech", "Biomatik", "Thermo GeneArt"];

      const links = {
        "Twist":          "https://www.twistbioscience.com/order?ref=yourid",
        "IDT":            "https://www.idtdna.com/pages/products/genes",
        "GenScript":      "https://www.genscript.com/gene_synthesis.html",
        "Eurofins":       "https://eurofinsgenomics.com/en/products/gene-synthesis/",
        "Azenta":         "https://www.azenta.com/gene-synthesis",
        "Synbio Tech":    "https://www.synbio-tech.com/gene-synthesis",
        "Biomatik":       "https://www.biomatik.com/gene-synthesis",
        "Thermo GeneArt": "https://www.thermofisher.com/geneart"
      };

      const tbody = document.querySelector('#priceTable tbody');

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        const tr = document.createElement('tr');

        // Extract the 8 price values using the correct column indices
        const priceValues = companyIndices.map(idx => {
          const cell = cells[idx] || '';
          const match = cell.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });

        const minPrice = Math.min(...priceValues);
        const cheapestIdx = priceValues.indexOf(minPrice);
        const cheapestCompany = companyNames[cheapestIdx];
        const cheapestLink = links[cheapestCompany];

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          // Highlight cheapest price cell
          if (companyIndices.includes(idx)) {
            td.textContent = cell || '—';
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) td.classList.add('cheapest');
          }
          // Action column – dynamic button to cheapest provider
          else if (idx === 13) {
            td.innerHTML = `
              <a href="${cheapestLink}" target="_blank">
                <button class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-5 rounded-lg shadow-md transition whitespace-nowrap">
                  Get Quote from ${cheapestCompany} →
                </button>
              </a>`;
          }
          // All other columns
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
