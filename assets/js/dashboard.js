// dashboard.js

function initDashboard() {
  updateDashboard();
  updateSummaryKirimSisa();
  loadRanking();
  loadFilterOptions();
  document.getElementById("today").textContent = new Date().toLocaleDateString('id-ID');
}

function updateDashboard() {
  google.script.run.withSuccessHandler(data => {
    document.getElementById("transaksi").textContent = data.total_transaksi || 0;
    document.getElementById("omset").textContent = toRupiah(data.total_omset || 0);
    document.getElementById("profit").textContent = toRupiah(data.total_profit || 0);
  }).getDashboardSummary();
}

function updateSummaryKirimSisa() {
  google.script.run.withSuccessHandler(data => {
    document.getElementById("kirimMochi").textContent = data.kirimMochi;
    document.getElementById("kirimSando").textContent = data.kirimSando;
    document.getElementById("kirimStuf").textContent = data.kirimStuf;
    document.getElementById("sisaMochi").textContent = data.sisaMochi;
    document.getElementById("sisaSando").textContent = data.sisaSando;
    document.getElementById("sisaStuf").textContent = data.sisaStuf;
  }).getSummaryKirimSisa();
}

function loadRanking() {
  google.script.run.withSuccessHandler(data => {
    const list = document.getElementById("ranking");
    list.innerHTML = "";
    data.forEach((item, index) => {
      const li = document.createElement("li");
      li.textContent = `${item.lapak} - ${toRupiah(item.omset)}`;
      list.appendChild(li);
    });
  }).getRankingByLapak();
}

function loadFilterOptions() {
  google.script.run.withSuccessHandler(data => {
    const select = document.getElementById("filterLapak");
    data.forEach(lapak => {
      const option = document.createElement("option");
      option.value = lapak;
      option.textContent = lapak;
      select.appendChild(option);
    });
  }).getNameLapak();
}

function filterDashboard() {
  const tanggal = document.getElementById("filterTanggal").value;
  const lapak = document.getElementById("filterLapak").value;

  google.script.run.withSuccessHandler(data => {
    const chartCanvas = document.getElementById("chartLapak");
    if (window.chartInstance) window.chartInstance.destroy();

    const labels = data.map(d => d.lapak);
    const values = data.map(d => d.omset);

    window.chartInstance = new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Omset',
          data: values,
          backgroundColor: '#0d6efd'
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }).getFilteredOmset({ tanggal, lapak });
}

function toggleTheme() {
  const body = document.body;
  body.classList.toggle("dark-mode");
  body.classList.toggle("light-mode");
}

function toRupiah(num) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
  }).format(num);
}

window.addEventListener("DOMContentLoaded", initDashboard);
