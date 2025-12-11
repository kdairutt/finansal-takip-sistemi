        // Çıkış yap fonksiyonu
        function cikisYap(event) {
        event.preventDefault();
        var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
        if (cevap) window.location = "index.html";
    }

        // Örnek döviz kurları (1 birim para = ? TL)
        // Not: Tamamen örnek değerlerdir.
        var kurOranlari = {
            "TRY": 1,       // 1 TL
            "USD": 42,      // 1 USD = 42 TL
            "EUR": 44,      // 1 EUR = 44 TL
            "GBP": 50,      // 1 GBP = 50 TL
            "CNY": 4.5      // 1 CNY = 4.5 TL
        };

        // Örnek kıymetli maden fiyatları (TL cinsinden)
        // Altın / Gümüş: gram fiyatı, Elmas: karat fiyatı gibi düşünülebilir.
        var madenFiyatlariTL = {
            "ALTIN": 5000,      // 1 gram altın ≈ 5000 TL (örnek)
            "GUMUS": 30,        // 1 gram gümüş ≈ 30 TL (örnek)
            "ELMAS": 150000     // 1 karat elmas ≈ 150.000 TL (örnek)
        };

        // Basit formatlama (virgül ile ayır, sonuna para birimi veya birim ekleyebilmek için opsiyonel)
        function formatNumber(value) {
            if (isNaN(value)) {
                return "0";
            }
            return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 });
        }

        // ----- 1) Döviz → Döviz çevirici -----
        function dovizCevir() {
            var tutar = Number(document.getElementById("dv-tutar").value);
            var kaynak = document.getElementById("dv-kaynak").value;
            var hedef  = document.getElementById("dv-hedef").value;
            var sonucKutusu = document.getElementById("dv-sonuc");

            if (isNaN(tutar) || tutar <= 0) {
                sonucKutusu.textContent = "Lütfen geçerli bir tutar gir.";
                return;
            }

            if (kaynak === hedef) {
                sonucKutusu.textContent = "Kaynak ve hedef para birimi aynı: " +
                    formatNumber(tutar) + " " + kaynak;
                return;
            }

            // 1) Kaynak para birimini TL'ye çevir
            var kaynakKur = kurOranlari[kaynak];
            var hedefKur  = kurOranlari[hedef];

            if (!kaynakKur || !hedefKur) {
                sonucKutusu.textContent = "Seçilen para birimleri için kur bilgisi bulunamadı.";
                return;
            }

            var tutarTL = tutar * kaynakKur;
            // 2) TL'den hedef para birimine çevir
            var sonuc = tutarTL / hedefKur;

            sonucKutusu.textContent =
                formatNumber(tutar) + " " + kaynak +
                " ≈ " + formatNumber(sonuc) + " " + hedef;
        }

        // ----- 2) Para Birimi → Kıymetli Maden -----
        function paraBirimiMadenCevir() {
            var tutar = Number(document.getElementById("pm-tutar").value);
            var para  = document.getElementById("pm-para").value;
            var maden = document.getElementById("pm-maden").value;
            var sonucKutusu = document.getElementById("pm-sonuc");

            if (isNaN(tutar) || tutar <= 0) {
                sonucKutusu.textContent = "Lütfen geçerli bir tutar gir.";
                return;
            }

            var kur = kurOranlari[para];
            var madenFiyat = madenFiyatlariTL[maden];

            if (!kur || !madenFiyat) {
                sonucKutusu.textContent = "Seçilen para birimi veya kıymetli maden için veri bulunamadı.";
                return;
            }

            // 1) Para birimini TL'ye çevir
            var tutarTL = tutar * kur;
            // 2) TL'yi madene çevir (gram/karat)
            var miktar = tutarTL / madenFiyat;

            var birim = "gram";
            if (maden === "ELMAS") {
                birim = "karat";
            }

            var madenAdi = (maden === "ALTIN") ? "altın" :
                           (maden === "GUMUS") ? "gümüş" : "elmas";

            sonucKutusu.textContent =
                formatNumber(tutar) + " " + para +
                " ≈ " + formatNumber(miktar) + " " + birim + " " + madenAdi;
        }

        // ----- 3) Kıymetli Maden → Para Birimi -----
        function madenParaBirimiCevir() {
            var miktar = Number(document.getElementById("mp-miktar").value);
            var maden  = document.getElementById("mp-maden").value;
            var para   = document.getElementById("mp-para").value;
            var sonucKutusu = document.getElementById("mp-sonuc");

            if (isNaN(miktar) || miktar <= 0) {
                sonucKutusu.textContent = "Lütfen geçerli bir miktar gir.";
                return;
            }

            var kur = kurOranlari[para];
            var madenFiyat = madenFiyatlariTL[maden];

            if (!kur || !madenFiyat) {
                sonucKutusu.textContent = "Seçilen para birimi veya kıymetli maden için veri bulunamadı.";
                return;
            }

            // 1) Madenin TL karşılığı
            var toplamTL = miktar * madenFiyat;
            // 2) TL'den seçilen para birimine çevir
            var sonuc = toplamTL / kur;

            var birim = "gram";
            if (maden === "ELMAS") {
                birim = "karat";
            }

            var madenAdi = (maden === "ALTIN") ? "altın" :
                           (maden === "GUMUS") ? "gümüş" : "elmas";

            sonucKutusu.textContent =
                formatNumber(miktar) + " " + birim + " " + madenAdi +
                " ≈ " + formatNumber(sonuc) + " " + para;
        }