const form = document.getElementById('assetForm');
const tableBody = document.querySelector('#assetTable tbody');
const cancelEditBtn = document.getElementById('cancelEdit');

const API_URL = 'https://opulent-barnacle-q76gw546vqvpfj59-8080.app.github.dev/';

console.log("Script loaded");

function loadAssets() {
  fetch(API_URL + 'assets')
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = '';
      data.forEach(asset => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${asset['Asset-ID']}</td>
          <td>${asset['Asset-Type']}</td>
          <td>${asset.Brand}</td>
          <td>${asset.Model}</td>
          <td>${asset['Serial-Number']}</td>
          <td>${asset.Purchase_Date}</td>
          <td>${asset.Status}</td>
          <td>
            <button onclick="editAsset(${asset['Asset-ID']})">Edit</button>
            <button onclick="deleteAsset(${asset['Asset-ID']})">Delete</button>
          </td>`;
        tableBody.appendChild(row);
      });
    });
}

form.addEventListener('submit', function (e) {
  e.preventDefault();
  console.log("Form submitted");

  const formData = new FormData(form);
  const formDataObj = Object.fromEntries(formData.entries());

  const asset = {
  "Asset-ID": formDataObj["Asset-ID"] ? parseInt(formDataObj["Asset-ID"]) : undefined,
  "Asset-Type": formDataObj["Asset-Type"],
  "Brand": formDataObj["Brand"],
  "Model": formDataObj["Model"],
  "Serial-Number": formDataObj["Serial-Number"] ? parseInt(formDataObj["Serial-Number"]) : undefined,
  "Purchase_Date": formDataObj["Purchase_Date"],
  "Status": formDataObj["Status"]
};

  console.log("Data being sent:", asset);

  const method = asset["Asset-ID"] ? 'PUT' : 'POST';
  const url = asset["Asset-ID"] ? `${API_URL}assets/${asset["Asset-ID"]}` : `${API_URL}assets`;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset)
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to save");
      return res.json();
    })
    .then(() => {
      form.reset();
      loadAssets();
    })
    .catch(err => {
      console.error("Save error:", err);
      alert("Failed to save asset.");
    });
});

function editAsset(id) {
  fetch(`${API_URL}assets/${id}`)
    .then(res => res.json())
    .then(asset => {
      if (asset) {
        form.elements["Asset-ID"].value = asset["Asset-ID"];
        form.elements["Asset-Type"].value = asset["Asset-Type"];
        form.elements["Brand"].value = asset["Brand"];
        form.elements["Model"].value = asset["Model"];
        form.elements["Serial-Number"].value = asset["Serial-Number"];
        form.elements["Purchase_Date"].value = asset["Purchase_Date"];
        form.elements["Status"].value = asset["Status"];
      }
    });
}


function deleteAsset(id) {
  if (confirm("Are you sure you want to delete this asset?")) {
    fetch(`${API_URL}assets/${id}`, { method: 'DELETE' })
      .then(() => loadAssets());
  }
}

cancelEditBtn.addEventListener('click', () => form.reset());

loadAssets();
