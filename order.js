const fileInput = document.getElementById('excel-file');
        const table = document.getElementById('excel-data');

        fileInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          const reader = new FileReader();
          reader.onload = (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // 清空表格
            table.innerHTML = '';

            jsonData.forEach((row) => {
              const tr = document.createElement('tr');
              row.forEach((cell) => {
                const td = document.createElement('td');
                td.textContent = cell;
                tr.appendChild(td);
              });
              table.appendChild(tr);
            });
          };
          reader.readAsArrayBuffer(file);
        });