        // --- Global dizi: Varlıklar burada tutulacak ---
        var varliklarListesi = [];

        // Çıkış yap fonksiyonu
        function cikisYap(event) {
            event.preventDefault();
            var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
            if (cevap) {
                window.location = "index.html";
            }
        }

        // Varlıklar tablosunu diziden tekrar oluştur
        function tabloyuYenidenCiz() {
            var tabloGovde = document.getElementById("varlik-tablo-govde");
            tabloGovde.innerHTML = ""; // önce tabloyu temizle

            for (var i = 0; i < varliklarListesi.length; i++) {
                var item = varliklarListesi[i];

                var yeniSatir = document.createElement("tr");
                // silme işlemi için satıra index bilgisini koy
                yeniSatir.setAttribute("data-index", i);

                var hucreAd = document.createElement("td");
                hucreAd.textContent = item.ad;

                var hucreTur = document.createElement("td");
                hucreTur.textContent = item.tur;

                var hucreTutar = document.createElement("td");
                hucreTutar.textContent = item.tutar;
                hucreTutar.className = "tutar-hucre";

                var hucreNot = document.createElement("td");
                hucreNot.textContent = item.notBilgi;

                var hucreIslem = document.createElement("td");
                var silButonu = document.createElement("button");
                silButonu.textContent = "Sil";
                silButonu.className = "btn-delete";
                silButonu.setAttribute("onclick", "varlikSil(this)");
                hucreIslem.appendChild(silButonu);

                yeniSatir.appendChild(hucreAd);
                yeniSatir.appendChild(hucreTur);
                yeniSatir.appendChild(hucreTutar);
                yeniSatir.appendChild(hucreNot);
                yeniSatir.appendChild(hucreIslem);

                tabloGovde.appendChild(yeniSatir);
            }
        }

        // Dizideki tutarlara göre toplam varlığı hesapla
        function toplamVarligiHesapla() {
            var toplam = 0;

            for (var i = 0; i < varliklarListesi.length; i++) {
                var deger = Number(varliklarListesi[i].tutar);
                if (!isNaN(deger)) {
                    toplam = toplam + deger;
                }
            }

            document.getElementById("toplam-varlik").textContent = toplam + " TL";
            // Dashboard bu anahtarı okuyacak
            localStorage.setItem("toplamVarlik", toplam);
        }

        // Yeni varlık ekle
        function varlikEkle() {
            var ad = document.getElementById("varlik-adi").value;
            var tur = document.getElementById("varlik-turu").value;
            var tutar = document.getElementById("varlik-tutar").value;
            var not = document.getElementById("varlik-not").value;

            if (ad === "" || tur === "" || tutar === "") {
                alert("Lütfen varlık adı, türü ve tutar alanlarını doldur.");
                return;
            }

            // Yeni varlık objesini diziye ekle
            var yeniVarlik = {
                ad: ad,
                tur: tur,
                tutar: Number(tutar),
                notBilgi: not
            };

            varliklarListesi.push(yeniVarlik);

            // Diziyi localStorage'a kaydet
            localStorage.setItem("varliklarListesi", JSON.stringify(varliklarListesi));

            // Tabloyu güncelle
            tabloyuYenidenCiz();

            // Toplam varlık değerini güncelle
            toplamVarligiHesapla();

            // Formu temizle
            document.getElementById("varlik-adi").value = "";
            document.getElementById("varlik-turu").value = "";
            document.getElementById("varlik-tutar").value = "";
            document.getElementById("varlik-not").value = "";
        }

        // Varlık sil
        function varlikSil(buton) {
            var cevap = confirm("Bu varlığı silmek istediğine emin misin?");
            if (!cevap) {
                return;
            }

            // Butonun bulunduğu satırı bul
            var satir = buton.parentNode.parentNode;
            var index = satir.getAttribute("data-index");

            if (index !== null) {
                index = parseInt(index, 10);

                // Diziden elemanı sil
                varliklarListesi.splice(index, 1);

                // Güncellenmiş diziyi kaydet
                localStorage.setItem("varliklarListesi", JSON.stringify(varliklarListesi));

                // Tabloyu baştan çiz
                tabloyuYenidenCiz();

                // Toplamı güncelle
                toplamVarligiHesapla();
            }
        }

        // Sayfa ilk yüklendiğinde localStorage'tan dizi + toplamı yükle
        window.onload = function () {
            var kayitliListe = localStorage.getItem("varliklarListesi");

            if (kayitliListe !== null) {
                // Kayıtlı liste varsa diziye ata
                varliklarListesi = JSON.parse(kayitliListe);
            } else {
                varliklarListesi = [];
            }

            // Diziye göre tabloyu çiz
            tabloyuYenidenCiz();

            // Toplam varlığı hesapla
            toplamVarligiHesapla();
        };