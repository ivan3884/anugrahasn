document.getElementById("form").addEventListener("submit", function (e) {
  e.preventDefault();

  const nomor = document.getElementById("nomor").value;
  const nama = document.getElementById("nama").value;
  const nilai = document.getElementById("nilai").value;
  const kategori = document.getElementById("kategori").value;

  if (!nomor || !nama || !nilai || !kategori) {
    alert("Harap isi semua kolom sebelum mengirim.");
    return;
  }

  fetch("https://script.google.com/macros/s/AKfycbxrjbNuHxbYfpOH8toCIPKpc3C-1NoeW1BQCjROG4mcHWUpGzKhoQUh5C_dm7ZRopfacA/exec", {
    method: "POST",
    body: JSON.stringify({
      nomor: nomor,
      nama: nama,
      nilai: nilai,
      kategori: kategori
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(data => {
      alert("Data berhasil dikirim!");
      console.log(data);
      document.getElementById("form").reset();
    })
    .catch(err => {
      alert("Gagal mengirim data!");
      console.error(err);
    });
});
