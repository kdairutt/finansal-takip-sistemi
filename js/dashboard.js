        // Çıkış Yap
        function cikisYap(event) {
            event.preventDefault();
            var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
            if (cevap) window.location = "index.html";
        }

        // Sayıyı "X.XXX TL" formatında göstermek için yardımcı fonksiyon
        function formatTL(value) {
            if (isNaN(value)) {
                return "0 TL";
            }
            return value.toLocaleString("tr-TR") + " TL";
        }

        // Dashboard verilerini localStorage'tan yükle
        function dashboardVerileriniYukle() {
            // Varlık / borç özetleri
            var assetsText = localStorage.getItem("toplamVarlik");
            var debtsText  = localStorage.getItem("toplamBorc");

            var assets = Number(assetsText);
            var debts  = Number(debtsText);

            var assetsElement = document.getElementById("card-total-assets");
            var debtsElement  = document.getElementById("card-total-debts");
            var netElement    = document.getElementById("card-net-worth");

            if (!isNaN(assets)) {
                assetsElement.textContent = formatTL(assets);
            }
            if (!isNaN(debts)) {
                debtsElement.textContent = formatTL(debts);
            }

            if (!isNaN(assets) && !isNaN(debts)) {
                var net = assets - debts;
                netElement.textContent = formatTL(net);

                if (net < 0) {
                    netElement.classList.add("card-negative");
                    netElement.classList.remove("card-highlight");
                } else {
                    netElement.classList.add("card-highlight");
                    netElement.classList.remove("card-negative");
                }
            }

            // Aylık gelir / gider özetleri (Gelirlerim / Giderlerim sayfasından set edilecek)
            var aylikGelirText = localStorage.getItem("aylikGelir");
            var aylikGiderText = localStorage.getItem("aylikGider");

            var aylikGelir = Number(aylikGelirText);
            var aylikGider = Number(aylikGiderText);
            var aylikNet   = aylikGelir - aylikGider;

            var incomeElement  = document.getElementById("card-monthly-income");
            var expenseElement = document.getElementById("card-monthly-expense");
            var netMonthlyEl   = document.getElementById("card-monthly-net");
            
            if (!isNaN(aylikGelir)) {
                incomeElement.textContent = formatTL(aylikGelir);
            }
            if (!isNaN(aylikGider)) {
                expenseElement.textContent = formatTL(aylikGider);
            }
            if (!isNaN(aylikGelir) && !isNaN(aylikGider)) {
                netMonthlyEl.textContent = formatTL(aylikNet);

                if (aylikNet < 0) {
                    netMonthlyEl.classList.add("card-negative");
                    netMonthlyEl.classList.remove("card-highlight");
                } else {
                    netMonthlyEl.classList.add("card-highlight");
                    netMonthlyEl.classList.remove("card-negative");
                }
            }
        }

    // Genel finansal durum çubuğunu güncelle
    function finansalDurumBariniGuncelle() {
        // Varlık / borç
        var assets = Number(localStorage.getItem("toplamVarlik") || 0);
        var debts  = Number(localStorage.getItem("toplamBorc") || 0);

        // Aylık gelir / gider
        var aylikGelir = Number(localStorage.getItem("aylikGelir") || 0);
        var aylikGider = Number(localStorage.getItem("aylikGider") || 0);

        var netVarlik = assets - debts;           // uzun vadeli güç
        var aylikNet  = aylikGelir - aylikGider;  // o ayın performansı

        // Toplam finansal "puan"
        var toplamDurum = netVarlik + aylikNet;

        // --- NORMALİZE ETME MANTIĞI ---
        // Burada bir aralık belirliyoruz:
        // -200.000 TL  -> %0 (bar kısacık, kıpkırmızı)
        //  200.000 TL  -> %100 (bar full, yemyeşil)
        var minDeger = -200000;
        var maxDeger =  200000;
        var oran = (toplamDurum - minDeger) / (maxDeger - minDeger);

        if (oran < 0) oran = 0;
        if (oran > 1) oran = 1;

        var yuzde = Math.round(oran * 100);

        var bar   = document.getElementById("fin-bar-inner");
        var text  = document.getElementById("fin-bar-text");
        var note  = document.getElementById("fin-bar-note");

        // Çubuğun genişliği: borç/gider arttıkça toplamDurum düşer, oran küçülür, width azalır
        bar.style.width = yuzde + "%";

        // Renk: sola yaklaştıkça kırmızı, ortalarda turuncu, sağa yaklaştıkça yeşil
        var renk;
        var seviyeMetni;

        if (yuzde <= 30) {
            renk = "#e53935";          // kırmızı
            seviyeMetni = "Riskli";
        } else if (yuzde <= 60) {
            renk = "#fb8c00";          // turuncu
            seviyeMetni = "Dikkatli";
        } else {
            renk = "#43a047";          // yeşil
            seviyeMetni = "Güvende";
        }

        bar.style.backgroundColor = renk;

        text.textContent = "Genel finansal durum: " + seviyeMetni + " (" + yuzde + "%)";
        note.textContent = 
            "Net varlık: " + netVarlik + " TL, aylık net: " + aylikNet + 
            " TL → Toplam: " + toplamDurum + " TL";
    }

    function harcamaKategoriAnalizi() {
            var govde = document.getElementById("harcama-kategori-tablo");
            var yorumEl = document.getElementById("harcama-yorum");

            if (!govde) {
                // HTML eklenmediyse sessizce çık
                return;
            }

            var kayitliGiderler = localStorage.getItem("giderlerListesi");

            if (!kayitliGiderler) {
                govde.innerHTML = "<tr><td colspan='3'>Kayıtlı gider verisi bulunamadı.</td></tr>";
                if (yorumEl) {
                    yorumEl.textContent = "Harcama analizi için Giderlerim sayfasına en az bir gider kaydı eklemelisin.";
                }
                return;
            }

            var giderlerListesi = JSON.parse(kayitliGiderler);
            if (!giderlerListesi || giderlerListesi.length === 0) {
                govde.innerHTML = "<tr><td colspan='3'>Henüz gider kaydı eklenmemiş.</td></tr>";
                if (yorumEl) {
                    yorumEl.textContent = "Harcama analizi için Giderlerim sayfasına en az bir gider kaydı eklemelisin.";
                }
                return;
            }

            // Kategori -> toplam tutar
            var kategoriToplamlari = {};
            var toplamGider = 0;

            for (var i = 0; i < giderlerListesi.length; i++) {
                var item = giderlerListesi[i];
                var tur = item.tur || "Belirtilmemiş";
                var tutar = Number(item.tutar);

                if (isNaN(tutar)) {
                    continue;
                }

                toplamGider = toplamGider + tutar;

                if (!kategoriToplamlari[tur]) {
                    kategoriToplamlari[tur] = 0;
                }

                kategoriToplamlari[tur] = kategoriToplamlari[tur] + tutar;
            }

            if (toplamGider === 0) {
                govde.innerHTML = "<tr><td colspan='3'>Toplam gider 0 TL olarak görünüyor.</td></tr>";
                if (yorumEl) {
                    yorumEl.textContent = "Gider tutarlarını kontrol et; hepsi 0 ise analiz yapılamaz.";
                }
                return;
            }

            // Tabloyu temizle ve yeniden doldur
            govde.innerHTML = "";

            var enYuksekKategori = "";
            var enYuksekTutar = 0;

            for (var kategori in kategoriToplamlari) {
                if (kategoriToplamlari.hasOwnProperty(kategori)) {
                    var kategoriTutar = kategoriToplamlari[kategori];
                    var yuzde = (kategoriTutar * 100) / toplamGider;

                    // Satır oluştur
                    var satir = document.createElement("tr");

                    var tdKategori = document.createElement("td");
                    tdKategori.textContent = kategori;

                    var tdTutar = document.createElement("td");
                    // Dashboard'da zaten formatTL fonksiyonun var, onu kullanıyoruz
                    if (typeof formatTL === "function") {
                        tdTutar.textContent = formatTL(kategoriTutar);
                    } else {
                        tdTutar.textContent = kategoriTutar + " TL";
                    }

                    var tdYuzde = document.createElement("td");
                    tdYuzde.textContent = yuzde.toFixed(1) + " %";

                    satir.appendChild(tdKategori);
                    satir.appendChild(tdTutar);
                    satir.appendChild(tdYuzde);

                    govde.appendChild(satir);

                    // En çok harcama yapılan kategori
                    if (kategoriTutar > enYuksekTutar) {
                        enYuksekTutar = kategoriTutar;
                        enYuksekKategori = kategori;
                    }
                }
            }

            // Yorum metni
            if (yorumEl) {
                var pay = (enYuksekTutar * 100) / toplamGider;
                var oranMetni = "";

                if (pay >= 50) {
                    oranMetni = "Giderlerinin yarısından fazlası bu kalemde toplanmış. Bu kalemi küçültmeyi düşünmek mantıklı olabilir.";
                } else if (pay >= 30) {
                    oranMetni = "Giderlerinin önemli bir kısmı bu kalemde yoğunlaşıyor. Biraz dikkatle iyi bir tasarruf alanı olabilir.";
                } else if (pay >= 15) {
                    oranMetni = "Bu kalem belirgin ama harcamaların genel olarak dağılmış görünüyor.";
                } else {
                    oranMetni = "Harcama dağılımın oldukça dengeli duruyor, tek bir kategori öne çıkmıyor.";
                }

                var tutarMetni = enYuksekTutar + " TL";
                if (typeof formatTL === "function") {
                    tutarMetni = formatTL(enYuksekTutar);
                }

                yorumEl.textContent =
                    "En çok harcama yaptığın kategori: " + enYuksekKategori +
                    " (" + tutarMetni + ", toplam giderlerinin yaklaşık " +
                    pay.toFixed(1) + "%'i). " + oranMetni;
            }
        }

        function gelirKategoriAnalizi() {
            var govde = document.getElementById("gelir-kategori-tablo");
            var yorumEl = document.getElementById("gelir-yorum");

            if (!govde) {
                // HTML eklenmediyse sessizce çık
                return;
            }

            var kayitliGelirler = localStorage.getItem("gelirlerListesi");

            if (!kayitliGelirler) {
                govde.innerHTML = "<tr><td colspan='3'>Kayıtlı gelir verisi bulunamadı.</td></tr>";
                if (yorumEl) {
                    yorumEl.textContent = "Gelir analizi için Gelirlerim sayfasına en az bir gelir kaydı eklemelisin.";
                }
                return;
            }

            var gelirlerListesi = JSON.parse(kayitliGelirler);
            if (!gelirlerListesi || gelirlerListesi.length === 0) {
                govde.innerHTML = "<tr><td colspan='3'>Henüz gelir kaydı eklenmemiş.</td></tr>";
                if (yorumEl) {
                    yorumEl.textContent = "Gelir analizi için Gelirlerim sayfasına en az bir gelir kaydı eklemelisin.";
                }
                return;
            }

            // Tür -> toplam tutar
            var turToplamlari = {};
            var toplamGelir = 0;

            for (var i = 0; i < gelirlerListesi.length; i++) {
                var item = gelirlerListesi[i];
                var tur = item.tur || "Belirtilmemiş";
                var tutar = Number(item.tutar);

                if (isNaN(tutar)) {
                    continue;
                }

                toplamGelir = toplamGelir + tutar;

                if (!turToplamlari[tur]) {
                    turToplamlari[tur] = 0;
                }

                turToplamlari[tur] = turToplamlari[tur] + tutar;
            }

            if (toplamGelir === 0) {
                govde.innerHTML = "<tr><td colspan='3'>Toplam gelir 0 TL olarak görünüyor.</td></tr>";
                if (yorumEl) {
                    yorumEl.textContent = "Gelir tutarlarını kontrol et; hepsi 0 ise analiz yapılamaz.";
                }
                return;
            }

            // Tabloyu temizle ve doldur
            govde.innerHTML = "";

            var enYuksekTur = "";
            var enYuksekTutar = 0;

            for (var turAdi in turToplamlari) {
                if (turToplamlari.hasOwnProperty(turAdi)) {
                    var turTutar = turToplamlari[turAdi];
                    var yuzde = (turTutar * 100) / toplamGelir;

                    var satir = document.createElement("tr");

                    var tdTur = document.createElement("td");
                    tdTur.textContent = turAdi;

                    var tdTutar = document.createElement("td");
                    if (typeof formatTL === "function") {
                        tdTutar.textContent = formatTL(turTutar);
                    } else {
                        tdTutar.textContent = turTutar + " TL";
                    }

                    var tdYuzde = document.createElement("td");
                    tdYuzde.textContent = yuzde.toFixed(1) + " %";

                    satir.appendChild(tdTur);
                    satir.appendChild(tdTutar);
                    satir.appendChild(tdYuzde);

                    govde.appendChild(satir);

                    if (turTutar > enYuksekTutar) {
                        enYuksekTutar = turTutar;
                        enYuksekTur = turAdi;
                    }
                }
            }

            // Yorum metni
            if (yorumEl) {
                var pay = (enYuksekTutar * 100) / toplamGelir;
                var oranMetni = "";

                if (pay >= 70) {
                    oranMetni = "Gelirlerinin büyük kısmı bu tek kaynaktan geliyor. Kaynak çeşitliliğini artırmak riskini azaltabilir.";
                } else if (pay >= 40) {
                    oranMetni = "Bu gelir türü baskın ama diğer kaynaklar da anlamlı. Yine de çeşitliliği artırmak iyi olabilir.";
                } else if (pay >= 20) {
                    oranMetni = "Gelir dağılımın görece dengeli görünüyor. Farklı kaynaklardan gelir almak avantajlı.";
                } else {
                    oranMetni = "Gelirin oldukça dengeli dağılmış, tek bir kaynağa aşırı bağımlı değilsin.";
                }

                var tutarMetni = enYuksekTutar + " TL";
                if (typeof formatTL === "function") {
                    tutarMetni = formatTL(enYuksekTutar);
                }

                yorumEl.textContent =
                    "En çok gelir elde ettiğin tür: " + enYuksekTur +
                    " (" + tutarMetni + ", toplam gelirinin yaklaşık " +
                    pay.toFixed(1) + "%'i). " + oranMetni;
            }
        }

        // Sayfa açıldığında verileri yükle
        window.onload = function () {
        dashboardVerileriniYukle();      // zaten vardı
        finansalDurumBariniGuncelle();   // senin eklemen gereken satır
        var aktifStr = localStorage.getItem("aktifKullanici");
        if (aktifStr !== null) {
            var aktif = JSON.parse(aktifStr);
            var baslik = document.querySelector(".dashboard-header h1");
            baslik.textContent = "Hoş Geldin, " + aktif.fullname + "!";
        }
        harcamaKategoriAnalizi();
        gelirKategoriAnalizi();
    };