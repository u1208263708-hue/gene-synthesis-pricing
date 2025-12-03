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

        // Extract numeric price from columns 1–8 (Twist → Thermo)
        let prices = cells.slice(1, 9).map(cell => {
          const match = cell.match(/0?\.(\d+)/);   // captures 07, 09, 25, etc.
          return match ? parseFloat('0.' + match[1]) : Infinity;
        });
        let minPrice = Math.min(...prices);

        cells.forEach((cell, idx) => {
          const td = document.createElement('td');

          if (idx === 0) {
            td.textContent = cell.trim();                         // Length range
          }
          else if (idx >= 1 && idx <= 8) {
            // Keep original display text (e.g. "$0.07/bp")
            td.innerHTML = cell.trim();
            // Highlight cheapest in row
            const match = cell.match(/0?\.(\d+)/);
            const num = match ? parseFloat('0.' + match[1]) : Infinity;
            if (num === minPrice && num !== Infinity) {
              td.classList.add('cheapest');
            }
          }
          else if (idx === 9) {
            td.textContent = cell.trim();                         // Turnaround
          }
          else if (idx === 10) {
            // Action button column
            const companyNames = ["Twist", "IDT", "GenScript", "Eurofins", "Azenta", "Synbio Tech", "Biomatik", "Thermo GeneArt"];
            const company = companyNames[idx - 1];
            const links = {
              "Twist": "https://www.twistbioscience.com/order?ref=yourid",
              "IDT": "https://www.idtdna.com/pages/products/genes/fragments",
              "GenScript": "https://www.gens
