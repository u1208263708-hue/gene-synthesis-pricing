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

        // Find cheapest price in columns 1–8
        const priceValues = cells.slice(1, 9).map(cell => {
          const match = cell.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });
        const minPrice = Math.min(...priceValues);

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          if (idx >= 1 && idx <= 8) {
            td.textContent = cell || '—';
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) td.classList.add('cheapest');
          }
          else if (idx === 13) {  // Action column (index 13 = 14th column)
            td.innerHTML = `<a href="https://www.twistbioscience.com/order?ref=yourid" target="_blank">
              <button>Get Quote →</button></a>`;
          }
          else {
            td.textContent = cell || '—';
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // Sorting for first 13 columns
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
      const a = rows[i].cells[col].innerText;
      const b = rows[i + 1].cells[col].innerText;
      if (a.localeCompare(b, undefined, { numeric: true }) > 0) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}
