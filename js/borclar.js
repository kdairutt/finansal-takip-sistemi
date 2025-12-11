// js/borclar.js

// --- Global dizi: borçlar burada tutulacak ---
var borclarListesi = [];

// Çıkış yap
function cikisYap(event) {
    event.preventDefault();
    var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
    if (cevap) {
        window.location = "index.html";
    }
}

// Borçlar tablosunu diziden tekrar oluştur
function tabloyuYenidenCiz() {
    var govde = document.getElementById("borc-tablo-govde");
    govde.innerHTML = ""; // tabloyu temizle

    for (var i = 0; i < borclarListesi.length; i++) {
        var item = borclarListesi[i];

        var satir = document.createElement("tr");
        satir.setAttribute("data-index", i);

        var hucreAd = document.createElement("td");
        hucreAd.textContent = item.ad;

        var hucreTur = document.createElement("td");
        hucreTur.textContent = item.tur;

        var hucreTutar = document.createElement("td");
        hucreTutar.textContent = item.tutar;
        hucreTutar.className = "borc-hucre";

        var hucreVade = document.createElement("td");
        hucreVade.textContent = item.vade;

        var hucreNot = document.createElement("td");
        hucreNot.textContent = item.notBilgi;

        var hucreIslem = document.createElement("td");
        var silButonu = document.createElement("button");
        silButonu.textContent = "Sil";
        silButonu.className = "btn-delete";
        silButonu.setAttribute("onclick", "borcSil(this)");
        hucreIslem.appendChild(silButonu);

        satir.appendChild(hucreAd);
        satir.appendChild(hucreTur);
        satir.appendChild(hucreTutar);
        satir.appendChild(hucreVade);   // *** Vade sütunu burada ekleniyor ***
        satir.appendChild(hucreNot);
        satir.appendChild(hucreIslem);

        govde.appendChild(satir);
    }
}

// Dizideki tutarlara göre toplam borcu hesapla
function toplamBorcuHesapla() {
    var toplam = 0;

    for (var i = 0; i < borclarListesi.length; i++) {
        var deger = Number(borclarListesi[i].tutar);
        if (!isNaN(deger)) {
            toplam = toplam + deger;
        }
    }

    document.getElementById("toplam-borc").textContent = toplam + " TL";

    // Dashboard buradan okuyacak
    localStorage.setItem("toplamBorc", toplam);
}

// Yeni borç ekle
function borcEkle() {
    var ad   = document.getElementById("borc-adi").value;
    var tur  = document.getElementById("borc-turu").value;
    var tutar= document.getElementById("borc-tutar").value;
    var vade = document.getElementById("borc-vade").value;
    var not  = document.getElementById("borc-not").value;

    if (ad === "" || tur === "" || tutar === "") {
        alert("Lütfen borç adı, türü ve tutar alanlarını doldurun.");
        return;
    }

    var yeniBorc = {
        ad: ad,
        tur: tur,
        tutar: Number(tutar),
        vade: vade,
        notBilgi: not
    };

    // diziye ekle
    borclarListesi.push(yeniBorc);

    // localStorage'a kaydet
    localStorage.setItem("borclarListesi", JSON.stringify(borclarListesi));

    // tabloyu yeniden çiz
    tabloyuYenidenCiz();

    // toplam borcu güncelle
    toplamBorcuHesapla();

    // formu temizle
    document.getElementById("borc-adi").value = "";
    document.getElementById("borc-turu").value = "";
    document.getElementById("borc-tutar").value = "";
    document.getElementById("borc-vade").value = "";
    document.getElementById("borc-not").value = "";
}

// Borç sil
function borcSil(btn) {
    var onay = confirm("Bu borcu silmek istediğinize emin misiniz?");
    if (!onay) return;

    var satir = btn.parentNode.parentNode;
    var index = satir.getAttribute("data-index");

    if (index !== null) {
        index = parseInt(index, 10);

        // diziden çıkar
        borclarListesi.splice(index, 1);

        // storage güncelle
        localStorage.setItem("borclarListesi", JSON.stringify(borclarListesi));

        // tabloyu güncelle
        tabloyuYenidenCiz();

        // toplam hesapla
        toplamBorcuHesapla();
    }
}

// Sayfa yüklenince storage'dan verileri oku
window.onload = function () {
    var kayitliListe = localStorage.getItem("borclarListesi");

    if (kayitliListe !== null) {
        borclarListesi = JSON.parse(kayitliListe);
    } else {
        borclarListesi = [];
    }

    tabloyuYenidenCiz();
    toplamBorcuHesapla();
};