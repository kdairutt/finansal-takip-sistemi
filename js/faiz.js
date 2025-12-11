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
            return value.toLocaleString("tr-TR", { maximumFractionDigits: 2 }) + " TL";
        }

        // Yüzde formatı
        function formatYuzde(value) {
            if (isNaN(value)) {
                return "%0";
            }
            return "%" + value.toFixed(2);
        }

        // 1) Faiz Getirisi (Gelecek Değer)
        function faizGetirisiHesapla() {
            var p = Number(document.getElementById("fg-anapara").value);
            var oranYillik = Number(document.getElementById("fg-oran").value);
            var vadeYil = Number(document.getElementById("fg-vade").value);
            var donemSayisi = Number(document.getElementById("fg-donem").value);

            var sonucKutusu = document.getElementById("fg-sonuc");

            if (isNaN(p) || p <= 0 || isNaN(oranYillik) || isNaN(vadeYil) || vadeYil <= 0 || isNaN(donemSayisi) || donemSayisi <= 0) {
                alert("Lütfen anapara, oran, vade ve dönem sayısını geçerli değerlerle gir.");
                return;
            }

            var i = (oranYillik / 100) / donemSayisi; // dönemsel faiz
            var n = vadeYil * donemSayisi;           // toplam dönem

            var fv = p * Math.pow(1 + i, n);
            var faizGetirisi = fv - p;

            sonucKutusu.textContent =
                "Vade Sonu Değeri: " + formatTL(fv) +
                " | Toplam Faiz Getirisi: " + formatTL(faizGetirisi);
        }

        // 2) Bugünkü Değer Hesabı
        function bugunkuDegerHesapla() {
            var fv = Number(document.getElementById("pv-fv").value);
            var oranYillik = Number(document.getElementById("pv-oran").value);
            var vadeYil = Number(document.getElementById("pv-vade").value);
            var donemSayisi = Number(document.getElementById("pv-donem").value);

            var sonucKutusu = document.getElementById("pv-sonuc");

            if (isNaN(fv) || fv <= 0 || isNaN(oranYillik) || isNaN(vadeYil) || vadeYil <= 0 || isNaN(donemSayisi) || donemSayisi <= 0) {
                alert("Lütfen gelecek değer, oran, vade ve dönem sayısını geçerli değerlerle gir.");
                return;
            }

            var i = (oranYillik / 100) / donemSayisi;
            var n = vadeYil * donemSayisi;

            var pv = fv / Math.pow(1 + i, n);

            sonucKutusu.textContent =
                "Bugünkü Değer: " + formatTL(pv);
        }

        // 3) Eşit Taksitli Kredi Hesabı
        function krediHesapla() {
            var p = Number(document.getElementById("kr-tutar").value);
            var oranYillik = Number(document.getElementById("kr-oran").value);
            var taksitSayisi = Number(document.getElementById("kr-donem").value);

            var sonucKutusu = document.getElementById("kr-sonuc");

            if (isNaN(p) || p <= 0 || isNaN(oranYillik) || isNaN(taksitSayisi) || taksitSayisi <= 0) {
                alert("Lütfen kredi tutarı, oran ve taksit sayısını geçerli değerlerle gir.");
                return;
            }

            var i = (oranYillik / 100) / 12; // aylık faiz oranı (nominal / 12)
            var n = taksitSayisi;

            var taksit;
            if (i === 0) {
                taksit = p / n;
            } else {
                taksit = p * (i / (1 - Math.pow(1 + i, -n)));
            }

            var toplamOdeme = taksit * n;
            var toplamFaiz = toplamOdeme - p;

            sonucKutusu.textContent =
                "Aylık Taksit: " + formatTL(taksit) +
                " | Toplam Ödeme: " + formatTL(toplamOdeme) +
                " | Toplam Faiz: " + formatTL(toplamFaiz);
        }

        // 4) Efektif Yıllık Faiz Oranı
        function efektifOranHesapla() {
            var nominal = Number(document.getElementById("ef-nominal").value);
            var donemSayisi = Number(document.getElementById("ef-donem").value);

            var sonucKutusu = document.getElementById("ef-sonuc");

            if (isNaN(nominal) || isNaN(donemSayisi) || donemSayisi <= 0) {
                alert("Lütfen nominal oranı ve dönem sayısını geçerli değerlerle gir.");
                return;
            }

            var i_nom = nominal / 100;
            var m = donemSayisi;

            var i_eff = Math.pow(1 + i_nom / m, m) - 1; // efektif oran

            sonucKutusu.textContent =
                "Efektif Yıllık Faiz Oranı: " + formatYuzde(i_eff * 100);
        }