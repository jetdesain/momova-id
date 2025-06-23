function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    document.body.classList.toggle("light-mode");
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("today").textContent = new Date().toLocaleDateString("id-ID", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
    });

    isiNamaLapak();
    muatDashboard();
});

function isiNamaLapak() {
    google.script.run.withSuccessHandler(data => {
        const select = document.getElementById("filterLapak");
        data.forEach(nama => {
            const opt = document.createElement("option");
            opt.value = nama;
            opt.textContent = nama;
            select.appendChild(opt);
        });
    }).getNameLapak();
}

function muatDashboard() {
    google.script.run.withSuccessHandler(data => {
        document.getElementById("transaksi").textContent = data.total_transaksi;
        document.getElementById("omset").textContent = formatRupiah(data.total_omset);
        document.getElementById("profit").textContent = formatRupiah(data.total_profit);
        document.getElementById("kirimMochi").textContent = data.total_mochi;
        document.getElementById("kirimSando").textContent = data.total_sando;
        document.getElementById("kirimStuf").textContent = data.total_stuf;
        document.getElementById("sisaMochi").textContent = data.sisa_mochi;
        document.getElementById("sisaSando").textContent = data.sisa_sando;
        document.getElementById("sisaStuf").textContent = data.sisa_stuf;

        renderChart(data.chart);
        renderRanking(data.rank);
    }).getDashboardData();
}

function formatRupiah(angka) {
    return "Rp " + angka.toLocaleString("id-ID");
}

function renderChart(chartData) {
    const ctx = document.getElementById("chartLapak").getContext("2d");
    new Chart(ctx, {
        type: "bar",
        data: {
            labels: chartData.labels,
            datasets: [{
                label: "Omset",
                data: chartData.omsets,
                backgroundColor: "#0d6efd"
            }]
        }
    });
}

function renderRanking(ranks) {
    const ul = document.getElementById("ranking");
    ul.innerHTML = "";
    ranks.forEach(r => {
        const li = document.createElement("li");
        li.textContent = `${r.lapak} - ${formatRupiah(r.total)}`;
        ul.appendChild(li);
    });
}

function filterDashboard() {
    const tanggal = document.getElementById("filterTanggal").value;
    const lapak = document.getElementById("filterLapak").value;

    google.script.run.withSuccessHandler(data => {
        document.getElementById("transaksi").textContent = data.total_transaksi;
        document.getElementById("omset").textContent = formatRupiah(data.total_omset);
        document.getElementById("profit").textContent = formatRupiah(data.total_profit);
        document.getElementById("kirimMochi").textContent = data.total_mochi;
        document.getElementById("kirimSando").textContent = data.total_sando;
        document.getElementById("kirimStuf").textContent = data.total_stuf;
        document.getElementById("sisaMochi").textContent = data.sisa_mochi;
        document.getElementById("sisaSando").textContent = data.sisa_sando;
        document.getElementById("sisaStuf").textContent = data.sisa_stuf;

        renderChart(data.chart);
        renderRanking(data.rank);
    }).filterDashboard({
        tanggal,
        lapak
    });
}

function updateSummaryKirimSisa() {
  google.script.run.withSuccessHandler(function(data) {
    document.getElementById("kirimMochi").textContent = data.kirimMochi;
    document.getElementById("kirimSando").textContent = data.kirimSando;
    document.getElementById("kirimStuf").textContent = data.kirimStuf;
    document.getElementById("sisaMochi").textContent = data.sisaMochi;
    document.getElementById("sisaSando").textContent = data.sisaSando;
    document.getElementById("sisaStuf").textContent = data.sisaStuf;
  }).getSummaryKirimSisa();
}
