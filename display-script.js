function createTableFromCSV(csv) {
    const rows = csv.split('\n');
    const table = document.getElementById('fileTable');
    const headers = rows[0].split(',');
    headers.push('Action');
    const thead = table.createTHead();
    const headerRow = thead.insertRow();
    headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
    });
    
    const tbody = table.createTBody();
    for (let i = 1; i < rows.length-1; i++) {
        const cells = rows[i].split(',');
        const row = tbody.insertRow();
        cells.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell;
            row.appendChild(td);
        });
        const actionCell = row.insertCell();
        const actionButton = document.createElement('button');
        actionButton.textContent = 'Action';
        actionButton.className ='actionButton';
        actionCell.appendChild(actionButton);
    }
}
const fileContent = localStorage.getItem('fileContent');
if (fileContent) {
    createTableFromCSV(fileContent);
}
