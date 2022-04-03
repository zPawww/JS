const form = document.querySelector("form");
const indexed = indexedDB;

if (indexed) {
  let db;
  const request = indexed.open("Pawww", 1);

  request.onupgradeneeded = () => {
    db = request.result;
    console.log("Creando base de datos...", db);
    const objectStore = db.createObjectStore("Task", {
      autoIncrement: true,
    });
  };

  request.onsuccess = () => {
    db = request.result;
    console.log("Abriendo base de datos...", db);
    readData();
  };

  request.onerror = (error) => {
    console.log("Ha ocurrido un error", error);
  };

  const writeData = (data) => {
    let transaction = db.transaction(["Task"], "readwrite");
    let objectStore = transaction.objectStore("Task");
    let request = objectStore.add(data);
    console.log(data);
  };

  function deletedData(key) {
    let transaction = db.transaction(["Task"], "readwrite");
    let objectStore = transaction.objectStore("Task");
    let request = objectStore.delete(key);
    request.onsuccess = () => {
      readData()
    }
    location.reload()
  }



  const readData = () => {
    let transaction = db.transaction(["Task"], "readonly");
    let objectStore = transaction.objectStore("Task");
    let request = objectStore.openCursor();

    
    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        let div = document.querySelector(".task-area-grid");
        let taskTitle = JSON.stringify(cursor.value.taskTitle);
        let title = taskTitle.replace(/['"]+/g, "");
        div.innerHTML += `
        <div class="task-item">
        <p class="text-item" id="color-${cursor.key}">
          ${title}
        </p>
      </div>
      <div class="task-icon">
        <button class="check-button task-delete" data-key="${cursor.key}" onclick="deletedData(${cursor.key})"><img src="./svg/trash.svg" class="icon trash" /> </button>
        <button class="check-button task-verified data-key="${cursor.key}" onclick="verifiedData(${cursor.key})"><img src="./svg/check.svg" class="icon verified" /> </button>

      </div>
    </div>
        `;
        cursor.continue();
      }
    };
  };

  function verifiedData(e) {
    try {
      let transaction = db.transaction(["Task"], "readonly");
      let objectStore = transaction.objectStore("Task");
      let request = objectStore.openCursor();
      const cursor = e;
      let pColor = document.getElementById(`color-${cursor}`)
      pColor.style = "text-decoration: line-through; color: rgb(180, 180, 180)"
    } catch(error) {
      console.log("Error")
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      taskTitle: e.target.task.value,
    };
    writeData(data);
    verifiedData(e)
    location.reload();
  });

}



