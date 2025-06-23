document.addEventListener("DOMContentLoaded", () => {
  toggleTheme();
  isiNamaLapak();
  document.getElementById("lapak").addEventListener("change", isiPajak);
  document.getElementById("notaForm").addEventListener("submit", simpanNota);
  updateDashboard();
  updateTableProduct();
  loadRanking();
});

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
}

function isiNamaLapak() {
  google.script.run.withSuccessHandler(function(data) {
    const select = document.getElementById("lapak");
    select.innerHTML = '<option value="">Pilih Lapak</option>';
    data.forEach(nama => {
      const option = document.createElement("option");
      option.value = nama;
      option.textContent = nama;
      select.appendChild(option);
    });
  }).getNameLapak();
}

function isiPajak() {
  const lapak = document.getElementById("lapak").value;
  const pajakInput = document.getElementById("pajak");
  pajakInput.value = "Memuat...";

  google.script.run.withSuccessHandler(function(pajak) {
    pajakInput.value = pajak;
  }).getPajakByLapak(lapak);
}

function simpanNota(e) {
  e.preventDefault();

  const data = {
    tanggal: document.getElementById("tanggal").value,
    lapak: document.getElementById("lapak").value,
    pajak: parseFloat(document.getElementById("pajak").value) || 0,
    mochi: parseInt(document.getElementById("mochi").value) || 0,
    sando: parseInt(document.getElementById("sando").value) || 0,
    stuf: parseInt(document.getElementById("stuf").value) || 0
  };

  google.script.run.withSuccessHandler(() => {
    alert("Nota berhasil disimpan!");
    document.getElementById("notaForm").reset();
    const modal = bootstrap.Modal.getInstance(document.getElementById("notaModal"));
    modal.hide();
    updateDashboard();
    updateTableProduct();
    loadRanking();
  }).addSendNota(data);
}

function updateDashboard() {
  google.script.run.withSuccessHandler(function(data) {
    document.getElementById("transaksi").textContent = data.total_transaksi;
    document.getElementById("omset").textContent = formatRupiah(data.total_omset);
    document.getElementById("profit").textContent = formatRupiah(data.total_profit);

    const ctx = document.getElementById("chartLapak").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.chartLabels,
        datasets: [{
          label: "Penjualan",
          data: data.chartValues,
          backgroundColor: "#007bff"
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false }
        }
      }
    });
  }).getDashboardData();
}

function updateTableProduct() {
  google.script.run.withSuccessHandler(function(data) {
    document.getElementById("kirimMochi").textContent = data.kirimMochi;
    document.getElementById("kirimSando").textContent = data.kirimSando;
    document.getElementById("kirimStuf").textContent = data.kirimStuf;
    document.getElementById("sisaMochi").textContent = data.sisaMochi;
    document.getElementById("sisaSando").textContent = data.sisaSando;
    document.getElementById("sisaStuf").textContent = data.sisaStuf;
  }).getKirimSisaSummary();
}

function loadRanking() {
  google.script.run.withSuccessHandler(function(ranking) {
    const list = document.getElementById("ranking");
    list.innerHTML = "";
    ranking.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.lapak} - ${formatRupiah(item.total)}`;
      list.appendChild(li);
    });
  }).getLapakRanking();
}

function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(number);
}