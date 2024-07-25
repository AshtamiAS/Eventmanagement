function handleSubmit() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const type = document.getElementById("select-file-type").value;

  if (!file) {
    alert("Please select a file.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const fileContent = event.target.result;
    const rows = fileContent.split('\n').filter(row => row.trim() !== '');
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());

    const parseCSVToJSON = (csvRows, csvHeaders) => {
      const data = [];
      for (let i = 1; i < csvRows.length; i++) {
        const row = csvRows[i].split(',').map(cell => cell.trim());
        if (row.length === csvHeaders.length) {
          const obj = {};
          for (let j = 0; j < csvHeaders.length; j++) {
            obj[csvHeaders[j]] = row[j];
          }
          data.push(obj);
        }
      }
      return data;
    };

    const isUnique = (data, key) => {
      const seen = new Set();
      for (const item of data) {
        if (seen.has(item[key])) {
          return false; // Duplicate found
        }
        seen.add(item[key]);
      }
      return true; // All unique
    };

    if (type === "task") {
      const requiredHeaders = ['eventid', 'taskname']; 
      const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header.toLowerCase()));

      if (hasRequiredHeaders) {
        const taskData = parseCSVToJSON(rows, headers);
        localStorage.setItem("taskFileContent", JSON.stringify(taskData));
        alert("The task file has been stored successfully");
        console.log("The task file content:", JSON.parse(localStorage.getItem("taskFileContent")));
      } else {
        alert("The task CSV file must contain the following headers: eventid, taskname");
      }
    } else if (type === "event") {
      const taskFileContent = localStorage.getItem("taskFileContent");

      if (!taskFileContent) {
        alert("Please upload the task CSV file first.");
        return;
      }

      const requiredHeaders = ['eventid', 'eventname', 'start date', 'end date'];
      const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header.toLowerCase()));

      if (hasRequiredHeaders) {
        const eventData = parseCSVToJSON(rows, headers);

        // Check if eventid is unique
        const isEventIdUnique = isUnique(eventData, 'eventid');
        if (!isEventIdUnique) {
          alert("The event CSV file contains duplicate event IDs.");
          return;
        }

        localStorage.setItem("eventFileContent", JSON.stringify(eventData));
        window.location.href = "display.html";
      } else {
        alert("The event CSV file must contain the following headers: eventid, eventname, start date, end date");
      }
    }
  };
  reader.readAsText(file);
}
