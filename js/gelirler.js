    // --- Global dizi: Gelirler burada tutulacak ---
    var gelirlerListesi = [];

    // Çıkış yap
    function cikisYap(event) {
        event.preventDefault();
        var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
        if (cevap) {
            window.location = "index.html";
        }
    }

    // Gelirler tablosunu diziden tekrar oluştur
    function tabloyuYenidenCiz() {
        var govde = document.getElementById("gelir-tablo-govde");
        govde.innerHTML = ""; // önce tabloyu temizle

        for (var i = 0; i < gelirlerListesi.length; i++) {
            var item = gelirlerListesi[i];

            var satir = document.createElement("tr");
            satir.setAttribute("data-index", i);

            var hucreAd = document.createElement("td");
            hucreAd.textContent = item.ad;

            var hucreTur = document.createElement("td");
            hucreTur.textContent = item.tur;

            var hucreTutar = document.createElement("td");
            hucreTutar.textContent = item.tutar;
            hucreTutar.className = "gelir-hucre";

            var hucreNot = document.createElement("td");
            hucreNot.textContent = item.notBilgi;

            var hucreIslem = document.createElement("td");
            var silButonu = document.createElement("button");
            silButonu.textContent = "Sil";
            silButonu.className = "btn-delete";
            silButonu.setAttribute("onclick", "gelirSil(this)");
            hucreIslem.appendChild(silButonu);

            satir.appendChild(hucreAd);
            satir.appendChild(hucreTur);
            satir.appendChild(hucreTutar);
            satir.appendChild(hucreNot);
            satir.appendChild(hucreIslem);

            govde.appendChild(satir);
        }
    }

    // Dizideki tutarlara göre toplam geliri hesapla
    function toplamGeliriHesapla() {
        var toplam = 0;

        for (var i = 0; i < gelirlerListesi.length; i++) {
            var deger = Number(gelirlerListesi[i].tutar);
            if (!isNaN(deger)) {
                toplam = toplam + deger;
            }
        }

        document.getElementById("toplam-gelir").textContent = toplam + " TL";

        // Dashboard ve tahmini sayfası buradan okuyacak
        localStorage.setItem("aylikGelir", toplam);
    }

    // Yeni gelir ekle
    function gelirEkle() {
        var ad    = document.getElementById("gelir-adi").value;
        var tur   = document.getElementById("gelir-kategori").value;
        var tutar = document.getElementById("gelir-tutar").value;
        var not   = document.getElementById("gelir-not").value;

        if (ad === "" || tur === "" || tutar === "") {
            alert("Lütfen tüm zorunlu alanları doldurun.");
            return;
        }

        var yeniGelir = {
            ad: ad,
            tur: tur,
            tutar: Number(tutar),
            notBilgi: not
        };

        // 🔴 BURASI ÖNEMLİ: gelirListesi DEĞİL, gelirlerListesi
        gelirlerListesi.push(yeniGelir);
        localStorage.setItem("gelirlerListesi", JSON.stringify(gelirlerListesi));

        tabloyuYenidenCiz();
        toplamGeliriHesapla();

        document.getElementById("gelir-adi").value = "";
        document.getElementById("gelir-kategori").value = "";
        document.getElementById("gelir-tutar").value = "";
        document.getElementById("gelir-not").value = "";
    }

    // Gelir sil
    function gelirSil(btn) {
        var onay = confirm("Bu geliri silmek istediğine emin misin?");
        if (!onay) {
            return;
        }

        var satir = btn.parentNode.parentNode;
        var index = satir.getAttribute("data-index");

        if (index !== null) {
            index = parseInt(index, 10);

            gelirlerListesi.splice(index, 1);
            localStorage.setItem("gelirlerListesi", JSON.stringify(gelirlerListesi));

            tabloyuYenidenCiz();
            toplamGeliriHesapla();
        }
    }

    // Sayfa yüklendiğinde: localStorage'tan listeyi ve toplamı yükle
    window.onload = function () {
        var kayitliListe = localStorage.getItem("gelirlerListesi");

        if (kayitliListe !== null) {
            gelirlerListesi = JSON.parse(kayitliListe);
        } else {
            gelirlerListesi = [];
        }

        tabloyuYenidenCiz();
        toplamGeliriHesapla();
    };