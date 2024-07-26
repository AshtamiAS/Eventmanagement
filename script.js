function showWarningModal(message, callback) {
  const modal = document.getElementById('warningModal');
  const messageElement = document.getElementById('warningMessage');
  const closeButton = document.getElementById('modalCloseButton');
  
  messageElement.textContent = message;
  modal.style.display = 'block';

  closeButton.onclick = function() {
    modal.style.display = 'none';
    if (callback) callback(); 
  }

  window.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
      if (callback) callback(); 
    }
  }
}

function parseCSVToJSON(csvRows, csvHeaders) {
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
}

function isUnique(data, key) {
  const seen = new Set();
  for (const item of data) {
    if (seen.has(item[key])) {
      return false; 
    }
    seen.add(item[key]);
  }
  return true; 
}

function checkDateOverlap(events) {
  for (let i = 0; i < events.length; i++) {
    const eventA = events[i];
    for (let j = i + 1; j < events.length; j++) {
      const eventB = events[j];
      if (eventA.eventid !== eventB.eventid) {
        const startA = new Date(eventA['start date']);
        const endA = new Date(eventA['end date']);
        const startB = new Date(eventB['start date']);
        const endB = new Date(eventB['end date']);
        
        if (startA <= endB && startB <= endA) {
          return true; 
        }
      }
    }
  }
  return false; 
}

function handleSubmit() {
  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];
  const type = document.getElementById("select-file-type").value;

  if (!file) {
    showWarningModal("Please select a file.");
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
          return false;
        }
        seen.add(item[key]);
      }
      return true; 
    };

    const checkDateOverlap = (events) => {
      for (let i = 0; i < events.length; i++) {
        const eventA = events[i];
        for (let j = i + 1; j < events.length; j++) {
          const eventB = events[j];
          if (eventA.eventid !== eventB.eventid) {
            const startA = new Date(eventA['start date']);
            const endA = new Date(eventA['end date']);
            const startB = new Date(eventB['start date']);
            const endB = new Date(eventB['end date']);
            
            if (startA <= endB && startB <= endA) {
              return true; 
            }
          }
        }
      }
      return false;
    };

    if (type === "task") {
      const requiredHeaders = ['eventid', 'taskname'];
      const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header.toLowerCase()));

      if (hasRequiredHeaders) {
        const taskData = parseCSVToJSON(rows, headers);
        localStorage.setItem("taskFileContent", JSON.stringify(taskData));
        showWarningModal("The task file has been stored successfully");
        console.log("The task file content:", JSON.parse(localStorage.getItem("taskFileContent")));
      } else {
        showWarningModal("The task CSV file must contain the following headers: eventid, taskname");
      }
    } else if (type === "event") {
      const taskFileContent = localStorage.getItem("taskFileContent");

      if (!taskFileContent) {
        showWarningModal("Please upload the task CSV file first.");
        return;
      }

      const requiredHeaders = ['eventid', 'eventname', 'start date', 'end date'];
      const hasRequiredHeaders = requiredHeaders.every(header => headers.includes(header.toLowerCase()));

      if (hasRequiredHeaders) {
        const eventData = parseCSVToJSON(rows, headers);

        const isEventIdUnique = isUnique(eventData, 'eventid');
        if (!isEventIdUnique) {
          showWarningModal("The event CSV file contains duplicate event IDs.");
          return;
        }

        const isDateOverlap = checkDateOverlap(eventData);
        if (isDateOverlap) {
          showWarningModal("The event CSV file contains overlapping date ranges.");
          return;
        }

        localStorage.setItem("eventFileContent", JSON.stringify(eventData));


        const taskData = JSON.parse(taskFileContent);
        const eventIdsInEvents = new Set(eventData.map(event => event.eventid));
        const invalidEventIds = taskData
          .map(task => task.eventid)
          .filter(eventId => !eventIdsInEvents.has(eventId));
        
        if (invalidEventIds.length > 0) {
          showWarningModal(`Warning: The following event IDs in the task file do not exist in the event file: ${invalidEventIds.join(', ')}`, () => {
         
            window.location.href = "display.html";
          });
          return;
        }

        window.location.href = "display.html";
      } else {
        showWarningModal("The event CSV file must contain the following headers: eventid, eventname, start date, end date");
      }
    }
  };
  reader.readAsText(file);
}