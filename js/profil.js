        var kullaniciListesi = [];
        var aktifKullanici = null;

        function cikisYap(event) {
            event.preventDefault();
            var cevap = confirm("Çıkış yapmak istediğinize emin misiniz?");
            if (cevap) {
                localStorage.removeItem("aktifKullanici");
                window.location = "index.html";
            }
        }

        function verileriYukle() {
            var listeStr = localStorage.getItem("kullanicilar");
            if (listeStr !== null) {
                kullaniciListesi = JSON.parse(listeStr);
            } else {
                kullaniciListesi = [];
            }

            var aktifStr = localStorage.getItem("aktifKullanici");
            if (aktifStr !== null) {
                aktifKullanici = JSON.parse(aktifStr);
            } else {
                aktifKullanici = null;
            }

            if (aktifKullanici !== null) {
                document.getElementById("p-name").textContent = aktifKullanici.fullname;
                document.getElementById("p-email").textContent = aktifKullanici.email;
                document.getElementById("p-username").textContent = aktifKullanici.username;
            } else {
                document.getElementById("p-name").textContent = "Giriş yapılmamış";
                document.getElementById("p-email").textContent = "-";
                document.getElementById("p-username").textContent = "-";
            }
        }

        function profilGuncelle() {
            if (aktifKullanici === null) {
                alert("Önce giriş yapman gerekiyor.");
                return;
            }

            var yeniAd = document.getElementById("input-name").value.trim();
            var yeniEmail = document.getElementById("input-email").value.trim();
            var yeniKullanici = document.getElementById("input-username").value.trim();

            // Eski değerleri yedekle (liste içinde kullanıcıyı bulmak için)
            var eskiEmail = aktifKullanici.email;
            var eskiUsername = aktifKullanici.username;

            // Boş olmayanları güncelle
            if (yeniAd !== "") {
                aktifKullanici.fullname = yeniAd;
            }
            if (yeniEmail !== "") {
                aktifKullanici.email = yeniEmail;
            }
            if (yeniKullanici !== "") {
                aktifKullanici.username = yeniKullanici;
            }

            // DOM'u güncelle
            document.getElementById("p-name").textContent = aktifKullanici.fullname;
            document.getElementById("p-email").textContent = aktifKullanici.email;
            document.getElementById("p-username").textContent = aktifKullanici.username;

            // Kullanıcı listesindeki kaydı da güncelle
            for (var i = 0; i < kullaniciListesi.length; i++) {
                var u = kullaniciListesi[i];
                if (u.email === eskiEmail && u.username === eskiUsername) {
                    u.fullname = aktifKullanici.fullname;
                    u.email = aktifKullanici.email;
                    u.username = aktifKullanici.username;
                    break;
                }
            }

            // LocalStorage'a geri yaz
            localStorage.setItem("kullanicilar", JSON.stringify(kullaniciListesi));
            localStorage.setItem("aktifKullanici", JSON.stringify(aktifKullanici));

            // Formu temizle
            document.getElementById("input-name").value = "";
            document.getElementById("input-email").value = "";
            document.getElementById("input-username").value = "";

            alert("Profil başarıyla güncellendi!");
        }

        window.onload = function () {
            verileriYukle();
        };