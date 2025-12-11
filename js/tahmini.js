        // Çıkış yap fonksiyonu
        function cikisYap(event) {
            event.preventDefault();
            let cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
            if (cevap) 
                window.location = "index.html";
            
        }

        // TL formatı
        function formatTL(value) {
            if (isNaN(value)) {
                return "0 TL";
            }
            return value.toLocaleString("tr-TR") + " TL";
        }

        // Sistemde kayıtlı aylık gelir/gider
        var baseGelir = 0;
        var baseGider = 0;

        // localStorage'tan verileri oku
        function verileriYukle() {
            var gelirText = localStorage.getItem("aylikGelir");
            var giderText = localStorage.getItem("aylikGider");

            baseGelir = Number(gelirText);
            baseGider = Number(giderText);
            var baseNet = baseGelir - baseGider;

            document.getElementById("mevcut-aylik-gelir").textContent = formatTL(baseGelir);
            document.getElementById("mevcut-aylik-gider").textContent = formatTL(baseGider);
            document.getElementById("mevcut-aylik-net").textContent   = formatTL(baseNet);
        }

        // Genel durum barını güncelle
        function guncelleGenelDurum(aylikGelir, netDeger) {
            var barInner = document.getElementById("durum-bar-inner");
            var barText  = document.getElementById("durum-bar-text");

            if (isNaN(aylikGelir) || aylikGelir <= 0) {
                barInner.style.width = "0%";
                barInner.style.backgroundColor = "#b0bec5";
                barText.textContent = "Genel durum hesabı için yeterli veri yok.";
                return;
            }

            var oran = netDeger / aylikGelir; // net / gelir

            if (oran < -1) oran = -1;
            if (oran >  1) oran =  1;

            // 0 = çok kötü, 50 = başa baş, 100 = çok iyi
            var yuzde = 50 + (oran * 50);
            if (yuzde < 5) yuzde = 5;
            if (yuzde > 100) yuzde = 100;

            barInner.style.width = yuzde + "%";

            if (oran < 0) {
                barInner.style.backgroundColor = "#e53935"; // kırmızı
            } else if (oran < 0.2) {
                barInner.style.backgroundColor = "#fb8c00"; // turuncu
            } else {
                barInner.style.backgroundColor = "#43a047"; // yeşil
            }

            var metin = "Tahmini genel durum: Net değerin, gelirine göre ";

            if (oran < 0) {
                metin += "negatif veya zayıf seviyede görünüyor.";
            } else if (oran < 0.2) {
                metin += "pozitif fakat sınırlı seviyede.";
            } else {
                metin += "güçlü ve sağlıklı seviyede.";
            }

            barText.textContent = metin + " (Net: " + formatTL(netDeger) +
                ", Gelir: " + formatTL(aylikGelir) + ")";
        }

        // Senaryo hesapla (tamamen bu ayki veriye göre)
        function senaryoHesapla(skipAlert) {
            if (baseGelir === 0 && baseGider === 0) {
                if (!skipAlert) {
                    alert("Önce Gelirlerim ve Giderlerim sayfalarına veri eklemelisin.");
                }
                return;
            }

            var gelirDegisim = Number(document.getElementById("gelir-degisim").value);
            var giderDegisim = Number(document.getElementById("gider-degisim").value);

            // Boş bırakılırsa 0 alınır → aynı ay tekrarı
            if (isNaN(gelirDegisim)) gelirDegisim = 0;
            if (isNaN(giderDegisim)) giderDegisim = 0;

            var tahminiGelir = baseGelir * (1 + gelirDegisim / 100);
            var tahminiGider = baseGider * (1 + giderDegisim / 100);
            var tahminiNet   = tahminiGelir - tahminiGider;

            var metin =
                "Bu senaryoda gelecek ay için tahmini gelir: " + formatTL(tahminiGelir) +
                ", tahmini gider: " + formatTL(tahminiGider) +
                " ve tahmini net durum: " + formatTL(tahminiNet) + " olur.";

            if (tahminiNet < 0) {
                metin += " Bu senaryoda aylık bazda açık veriyorsun. " +
                         "Giderleri azaltman veya gelirini artırman gerekebilir.";
            } else if (tahminiNet < tahminiGelir * 0.2) {
                metin += " Pozitif bir netin var ancak marjın düşük. " +
                         "Birikim için biraz daha dikkatli harcama yapman iyi olabilir.";
            } else {
                metin += " Oldukça sağlıklı bir netin var. " +
                         "Düzenli tasarruf ve yatırımla bu pozisyonu güçlendirebilirsin.";
            }

            document.getElementById("senaryo-sonuc-text").textContent = metin;

            guncelleGenelDurum(tahminiGelir, tahminiNet);
        }

        // Sayfa açıldığında: verileri yükle + %0 değişimle otomatik tahmin yap
        window.onload = function () {
            verileriYukle();

            if (baseGelir !== 0 || baseGider !== 0) {
                document.getElementById("gelir-degisim").value = 0;
                document.getElementById("gider-degisim").value = 0;
                senaryoHesapla(true); // alert göstermeden çalışsın
            }
        };