document.addEventListener('DOMContentLoaded', () => {
  fetch('gene-pricing.csv')
    .then(r => r.text())
    .then(text => {
      const rows = text.trim().split('\n').map(l => l.split(',').map(c => c.trim().replace(/^"|"$/g, '')));
      const header = rows[0];
      const companies = ["Twist Bioscience","IDT","GenScript","Eurofins","Azenta","Synbio Tech","Biomatik","Thermo GeneArt"];
      const colIdx = companies.map(n => header.indexOf(n));

      const links = {
        "Twist Bioscience":"https://www.twistbioscience.com/order?ref=yourid",
        "IDT":"https://www.idtdna.com/pages/products/genes",
        "GenScript":"https://www.genscript.com/gene_synthesis.html",
        "Eurofins":"https://eurofinsgenomics.com/en/products/gene-synthesis/",
        "Azenta":"https://www.azenta.com/gene-synthesis",
        "Synbio Tech":"https://www.synbio-tech.com/gene-synthesis",
        "Biomatik":"https://www.biomatik.com/gene-synthesis",
        "Thermo GeneArt":"https://www.thermofisher.com/geneart"
      };

      const tbody = document.querySelector('#priceTable tbody');

      for (let i = 1; i < rows.length; i++) {
        const cells = rows[i];
        const tr = document.createElement('tr');

        // Calculate prices and find the cheapest
        const prices = colIdx.map(idx => {
          const m = (cells[idx] || '').match(/0?\.(\d+)/);
          return m ? parseFloat('0.' + m[1]) : Infinity;
        });
        const minP = Math.min(...prices);
        const winner = companies[prices.indexOf(minP)];
        const url = links[winner];

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');
          // Price columns
          if (colIdx.includes(idx)) {
            td.textContent = cell || '—';
            // Check for cheapest price
            if (parseFloat('0.' + (cell.match(/0?\.(\d+)/)||[])[1]) === minP) td.classList.add('cheapest');
          }
          // Action column (Last column: cells.length - 1)
          else if (idx === cells.length - 1) {
            td.innerHTML = `<a href="${url}" target="_blank"><button>Get Quote from ${winner}</button></a>`;
          }
          // All other columns (Notes included)
          else {
            td.textContent = cell || '—';
          }
          tr.appendChild(td);
        });
        tbody.appendChild(tr);
      }

      document.querySelectorAll('th').forEach((th, col) => {
        if (col < header.length - 1) th.addEventListener('click', () => sortTable(col));
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
      if (a.localeCompare(b, undefined, {numeric:true}) > 0) {
        rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
        switching = true;
      }
    }
  }
}
