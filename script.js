document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(csvText => {
      const rows = csvText.trim().split('\n').map(row => row.split(','));
      const tbody = document.querySelector('#priceTable tbody');

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const tr = document.createElement('tr');
        const cells = rows[i];

        // Find cheapest price in this row (columns 1–8 are prices)
        let prices = cells.slice(1, 9).map(p => parseFloat(p.replace(/[^0-9.]/g, '')) || Infinity);
        let minPrice = Math.min(...prices);

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');
          if (idx === 0) td.textContent = cell.trim(); // Length
          else if (idx >= 1 && idx <= 8) { // Price columns
            td.innerHTML = cell.trim().replace(/\$(0\.\d+)/g, '<span class="text-green-600 font-bold">$$1</span>');
            const num = parseFloat(cell.replace(/[^0-9.]/g, ''));
            if (num === minPrice) td.classList.add('cheapest');
          }
          else if (idx === 9) td.textContent = cell.trim(); // Turnaround
          else if (idx === 10) { // Action column → turn into button
            const company = rows[0][cells.indexOf(cell)]; // crude but works
            const links = {
              "Twist": "https://www.twistbioscience.com/order?ref=yourid",
              "IDT": "https://www.idtdna.com/pages/products/genes/fragments",
              "GenScript": "https://www.genscript.com/order.html",
              "Eurofins": "https://eurofinsgenomics.com/en/products/gene-synthesis/",
              "Azenta": "https://www.azenta.com/gene-synthesis",
              "Synbio Tech": "https://www.synbio-tech.com/order",
              "Biomatik": "https://www.biomatik.com/order",
              "Thermo GeneArt": "https://www.thermofisher.com/geneart"
            };
            const url = links[rows[0][idx]] || "https://google.com";
            td.innerHTML = `<a href="${url}" target="_blank"><button>Get Quote →</button></a>`;
          }
          else td.textContent = cell.trim();
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // Make headers sortable
      document.querySelectorAll('th').forEach((th, i) => {
        if (i < 10) th.addEventListener('click', () => sortTable(i));
      });
    });
});

function sortTable(col) {
  const table = document.getElementById('priceTable');
  let switching = true;
  while (switching) {
    switching = false;
    const rows = table.rows;
    for (let i = 1; i < (rows.length - 1); i++) {
      let shouldSwitch = false;
      const a = rows[i].getElementsByTagName('TD')[col].innerText;
      const b = rows[i + 1].getElementsByTagName('TD')[col].innerText;
      if (a > b) { shouldSwitch = true; break; }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}
