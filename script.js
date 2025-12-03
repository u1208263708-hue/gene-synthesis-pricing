document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(response => response.text())
    .then(text => {
      // Clean CSV: handle quotes and trim
      const rows = text.trim().split('\n').map(line =>
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      const tbody = document.querySelector('#priceTable tbody');

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        if (cells.length < 10) continue;

        const tr = document.createElement('tr');

        // Extract numeric prices from columns 1–8 (Twist to Thermo)
        const priceValues = cells.slice(1, 9).map(cell => {
          const match = cell.match(/0?\.(\d+)/);
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });
        const minPrice = Math.min(...priceValues);

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          if (idx === 0) {
            td.textContent = cell;                                      // Length range
          }
          else if (idx >= 1 && idx <= 8) {
            td.textContent = cell || '—';                               // Price columns
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) {
              td.classList.add('cheapest');
            }
          }
          else if (idx === 9) {  // Last column = Turnaround + ALL "Get Quote" buttons
            td.innerHTML = `
              <div class="text-xs text-gray-600 mb-2">${cell || '—'}</div>
              <div class="flex flex-wrap gap-1 justify-center text-xs">
                <a href="https://www.twistbioscience.com/order?ref=yourid" target="_blank"><button>Twist</button></a>
                <a href="https://www.idtdna.com/pages/products/genes" target="_blank"><button>IDT</button></a>
                <a href="https://www.genscript.com/gene_synthesis.html" target="_blank"><button>GenScript</button></a>
                <a href="https://eurofinsgenomics.com/en/products/gene-synthesis/" target="_blank"><button>Eurofins</button></a>
                <a href="https://www.azenta.com/gene-synthesis" target="_blank"><button>Azenta</button></a>
                <a href="https://www.synbio-tech.com/gene-synthesis" target="_blank"><button>Synbio</button></a>
                <a href="https://www.biomatik.com/gene-synthesis" target="_blank"><button>Biomatik</button></a>
                <a href="https://www.thermofisher.com/geneart" target="_blank"><button>Thermo</button></a>
              </div>
            `;
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      // Sorting for first 9 columns only
      document.querySelectorAll('th').forEach((th, col) => {
        if (col < 9) th.addEventListener('click', () => sortTable(col));
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
