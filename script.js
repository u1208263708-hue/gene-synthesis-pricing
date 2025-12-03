document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(text => {
      const rows = text.trim().split('\n').map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      const tbody = document.querySelector('#priceTable tbody');

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        const tr = document.createElement('tr');

        // Find cheapest price in columns 1–8 (Twist to Thermo GeneArt)
        const priceValues = cells.slice(1, 9).map(cell => {
          const match = cell.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });
        const minPrice = Math.min(...priceValues);

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          if (idx >= 1 && idx <= 8) {
            // Price columns – highlight cheapest
            td.textContent = cell || '—';
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) {
              td.classList.add('cheapest');
            }
          }
          else if (idx === 13) {
            // Last column = Action button (individual per row)
            td.innerHTML = `<a href="https://www.twistbioscience.com/order?ref=yourid" target="_blank">
              <button class="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-medium py-2 px-3 rounded whitespace-nowrap">
                Get Quote →
              </button></a>`;
          }
          else {
            // All other columns (Length, Turnaround, Codon Opt, etc.)
            td.textContent = cell || '—';
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // Enable sorting on first 13 columns (everything except Action)
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
