const form = document.getElementById('assetForm');
const tableBody = document.querySelector('#assetTable tbody');
const cancelEditBtn = document.getElementById('cancelEdit');

const API_URL = 'http://localhost:3000/assets';
console.log("Script loaded");


function loadAssets() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      tableBody.innerHTML = '';
      data.forEach(asset => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${asset.id}</td>
          <td>${asset.type}</td>
          <td>${asset.brand}</td>
          <td>${asset.model}</td>
          <td>${asset.serial_number}</td>
          <td>${asset.purchase_date}</td>
          <td>${asset.status}</td>
          <td>
            <button onclick="editAsset(${asset.id})">Edit</button>
            <button onclick="deleteAsset(${asset.id})">Delete</button>
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
  const url = asset.id ? `${API_URL}/${asset.id}` : API_URL;

  fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(asset)
  })
    .then(() => {
      form.reset();
      loadAssets();
    });
});

function editAsset(id) {
  fetch(`${API_URL}/${id}`)
    .then(res => res.json())
    .then(asset => {
      if (asset) {
        form.id.value = asset.id;
        form.type.value = asset.type;
        form.brand.value = asset.brand;
        form.model.value = asset.model;
        form.serial_number.value = asset.serial_number;
        form.purchase_date.value = asset.purchase_date;
        form.status.value = asset.status;
      }
    });
}

function deleteAsset(id) {
  if (confirm("Are you sure you want to delete this asset?")) {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => loadAssets());
  }
}

cancelEditBtn.addEventListener('click', () => form.reset());

loadAssets();
