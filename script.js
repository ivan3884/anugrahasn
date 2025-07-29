document.addEventListener('DOMContentLoaded', () => {
    const mockLogoUrl = 'https://upload.wikimedia.org/wikipedia/commons/a/a6/Lambang_Provinsi_Kalimantan_Selatan.svg';

    const images = document.querySelectorAll('img[alt="Logo Pemprov Kalsel"]');
    images.forEach(img => {
        img.src = mockLogoUrl;
        img.onerror = () => {
            // If the official logo fails, use a generic placeholder
            img.src = 'https://via.placeholder.com/150/FFD700/1D4F2B?text=KALSEL'; 
            img.style.border = '1px solid #ccc';
        };
    });

    // Initialize data
    const initialData = [
        { id: 1, nomor: '001', nama: 'Ahmad Yani', nilai: 95, kategori: 'ASN' },
        { id: 2, nomor: '002', nama: 'Budi Santoso', nilai: 92, kategori: 'Pelaksana' },
        { id: 3, nomor: '003', nama: 'Citra Lestari', nilai: 98, kategori: 'ASN' },
    ];

    if (!localStorage.getItem('peserta')) {
        localStorage.setItem('peserta', JSON.stringify(initialData));
    }

    const getPeserta = () => JSON.parse(localStorage.getItem('peserta')) || [];
    const savePeserta = (data) => localStorage.setItem('peserta', JSON.stringify(data));

    // Page-specific logic
    if (document.getElementById('ringkasan-data')) {
        renderDashboard();
    }

    if (document.getElementById('data-peserta')) {
        renderEntriPage();
    }

    function renderDashboard() {
        const data = getPeserta();
        const asnTerbaikCount = document.getElementById('asn-terbaik-count');
        const pelaksanaTerbaikCount = document.getElementById('pelaksana-terbaik-count');
        const ringkasanData = document.getElementById('ringkasan-data');

        asnTerbaikCount.textContent = `${data.filter(p => p.kategori === 'ASN').length} Peserta`;
        pelaksanaTerbaikCount.textContent = `${data.filter(p => p.kategori === 'Pelaksana').length} Peserta`;

        ringkasanData.innerHTML = '';
        data.forEach(p => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="border px-4 py-2">${p.nomor}</td>
                <td class="border px-4 py-2">${p.nama}</td>
                <td class="border px-4 py-2">${p.nilai}</td>
                <td class="border px-4 py-2">${p.kategori === 'ASN' ? 'ASN Terbaik' : 'Pelaksana Terbaik'}</td>
            `;
            ringkasanData.appendChild(row);
        });
    }

    function renderEntriPage() {
        const dataPeserta = document.getElementById('data-peserta');
        const form = document.getElementById('form-entri');
        const btnBatal = document.getElementById('btn-batal');

        renderTable();

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const id = document.getElementById('edit-id').value;
            const newPeserta = {
                nomor: document.getElementById('nomor').value,
                nama: document.getElementById('nama').value,
                nilai: parseInt(document.getElementById('nilai').value),
                kategori: document.getElementById('kategori').value,
            };

            let data = getPeserta();
            if (id) {
                // Update
                const index = data.findIndex(p => p.id == id);
                data[index] = { ...data[index], ...newPeserta };
            } else {
                // Create
                newPeserta.id = data.length > 0 ? Math.max(...data.map(p => p.id)) + 1 : 1;
                data.push(newPeserta);
            }

            savePeserta(data);
            resetForm();
            renderTable();
        });

        btnBatal.addEventListener('click', () => {
            resetForm();
        });

        function renderTable() {
            const data = getPeserta();
            dataPeserta.innerHTML = '';
            data.forEach(p => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="border px-4 py-2">${p.nomor}</td>
                    <td class="border px-4 py-2">${p.nama}</td>
                    <td class="border px-4 py-2">${p.nilai}</td>
                    <td class="border px-4 py-2">${p.kategori === 'ASN' ? 'ASN Terbaik' : 'Pelaksana Terbaik'}</td>
                    <td class="border px-4 py-2">
                        <button class="bg-yellow-500 text-white py-1 px-2 rounded-lg mr-2 btn-edit" data-id="${p.id}">Edit</button>
                        <button class="bg-red-500 text-white py-1 px-2 rounded-lg btn-delete" data-id="${p.id}">Hapus</button>
                    </td>
                `;
                dataPeserta.appendChild(row);
            });

            // Add event listeners for edit and delete buttons
            document.querySelectorAll('.btn-edit').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    editPeserta(id);
                });
            });

            document.querySelectorAll('.btn-delete').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
                        deletePeserta(id);
                    }
                });
            });
        }

        function editPeserta(id) {
            const data = getPeserta();
            const peserta = data.find(p => p.id == id);

            document.getElementById('edit-id').value = peserta.id;
            document.getElementById('nomor').value = peserta.nomor;
            document.getElementById('nama').value = peserta.nama;
            document.getElementById('nilai').value = peserta.nilai;
            document.getElementById('kategori').value = peserta.kategori;

            btnBatal.classList.remove('hidden');
            window.scrollTo(0, 0);
        }

        function deletePeserta(id) {
            let data = getPeserta();
            data = data.filter(p => p.id != id);
            savePeserta(data);
            renderTable();
        }

        function resetForm() {
            form.reset();
            document.getElementById('edit-id').value = '';
            btnBatal.classList.add('hidden');
        }
    }
});