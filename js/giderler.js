        // --- Global dizi: giderler burada tutulacak ---
        var giderlerListesi = [];

        // Çıkış yap
        function cikisYap(event) {
            event.preventDefault();
            var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
            if (cevap) {
                window.location = "index.html";
            }
        }

        // Gider tablosunu diziden tekrar oluştur
        function tabloyuYenidenCiz() {
            var govde = document.getElementById("gider-tablo-govde");
            govde.innerHTML = ""; // tabloyu temizle

            for (var i = 0; i < giderlerListesi.length; i++) {
                var item = giderlerListesi[i];

                var satir = document.createElement("tr");
                satir.setAttribute("data-index", i);

                var hucreAd = document.createElement("td");
                hucreAd.textContent = item.ad;

                var hucreTur = document.createElement("td");
                hucreTur.textContent = item.tur;

                var hucreTutar = document.createElement("td");
                hucreTutar.textContent = item.tutar;
                hucreTutar.className = "gider-hucre";

                var hucreNot = document.createElement("td");
                hucreNot.textContent = item.notBilgi;

                var hucreIslem = document.createElement("td");
                var silButonu = document.createElement("button");
                silButonu.textContent = "Sil";
                silButonu.className = "btn-delete";
                silButonu.setAttribute("onclick", "giderSil(this)");
                hucreIslem.appendChild(silButonu);

                satir.appendChild(hucreAd);
                satir.appendChild(hucreTur);
                satir.appendChild(hucreTutar);
                satir.appendChild(hucreNot);
                satir.appendChild(hucreIslem);

                govde.appendChild(satir);
            }
        }

        // Dizideki tutarlara göre toplam gideri hesapla
        function toplamGideriHesapla() {
            var toplam = 0;

            for (var i = 0; i < giderlerListesi.length; i++) {
                var deger = Number(giderlerListesi[i].tutar);
                if (!isNaN(deger)) {
                    toplam = toplam + deger;
                }
            }

            document.getElementById("toplam-gider").textContent = toplam + " TL";

            // Dashboard ve tahmini sayfası buradan okuyacak
            localStorage.setItem("aylikGider", toplam);
        }

        // Yeni gider ekle
        function giderEkle() {
            var ad    = document.getElementById("gider-adi").value;
            var tur   = document.getElementById("gider-kategori").value;
            var tutar = document.getElementById("gider-tutar").value;
            var not   = document.getElementById("gider-not").value;

            if (ad === "" || tur === "" || tutar === "") {
                alert("Lütfen tüm zorunlu alanları doldurun.");
                return;
            }

            var yeniGider = {
                ad: ad,
                tur: tur,
                tutar: Number(tutar),
                notBilgi: not
            };

            // diziye ekle
            giderlerListesi.push(yeniGider);

            // localStorage'a kaydet
            localStorage.setItem("giderlerListesi", JSON.stringify(giderlerListesi));

            // tabloyu yeniden çiz
            tabloyuYenidenCiz();

            // toplam güncelle
            toplamGideriHesapla();

            // formu temizle
            document.getElementById("gider-adi").value = "";
            document.getElementById("gider-kategori").value = "";
            document.getElementById("gider-tutar").value = "";
            document.getElementById("gider-not").value = "";
        }

        // Gider sil
        function giderSil(btn) {
            var onay = confirm("Bu gideri silmek istediğinize emin misiniz?");
            if (!onay) return;

            var satir = btn.parentNode.parentNode;
            var index = satir.getAttribute("data-index");

            if (index !== null) {
                index = parseInt(index);

                // diziden çıkar
                giderlerListesi.splice(index, 1);

                // storage güncelle
                localStorage.setItem("giderlerListesi", JSON.stringify(giderlerListesi));

                // tabloyu güncelle
                tabloyuYenidenCiz();

                // toplam hesapla
                toplamGideriHesapla();
            }
        }

        // Sayfa yüklenince storage'dan verileri oku
        window.onload = function () {
            var kayitliListe = localStorage.getItem("giderlerListesi");

            if (kayitliListe !== null) {
                giderlerListesi = JSON.parse(kayitliListe);
            } else {
                giderlerListesi = [];
            }

            tabloyuYenidenCiz();
            toplamGideriHesapla();
        };