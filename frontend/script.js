const form = document.getElementById('assetForm');
const tableBody = document.querySelector('#assetTable tbody');
const cancelEditBtn = document.getElementById('cancelEdit');

const API_URL = 'https://opulent-barnacle-q76gw546vqvpfj59-8080.app.github.dev/';

console.log("Script loaded");

function loadAssets() {
  fetch(API_URL)
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

form.addEventListener('submit', function(e) {
  e.preventDefault();
  console.log("Form submitted");

  const formData = new FormData(form);
  const asset = Object.fromEntries(formData.entries());
  console.log("Data being sent:", asset);

  const method = asset.id ? 'PUT' : 'POST';
  const url = asset["Asset-ID"] ? `${API_URL}${asset["Asset-ID"]}` : API_URL;

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
  fetch(`${API_URL}${id}`)
    .then(res => res.json())
    .then(asset => {
      if (asset) {
        form.id.value = asset["Asset-ID"];
        form.type.value = asset["Asset-Type"];
        form.brand.value = asset["Brand"];
        form.model.value = asset["Model"];
        form.serial_number.value = asset["Serial-Number"];
        form.purchase_date.value = asset["Purchase_Date"];
        form.status.value = asset["Status"];
      }
    });
}

function deleteAsset(id) {
  if (confirm("Are you sure you want to delete this asset?")) {
    fetch(`${API_URL}${id}`, { method: 'DELETE' })
      .then(() => loadAssets());
  }
}

cancelEditBtn.addEventListener('click', () => form.reset());

loadAssets();
