        var kullaniciListesi = [];

        function kullanicilariYukle() {
            var kayitli = localStorage.getItem("kullanicilar");
            if (kayitli !== null) {
                kullaniciListesi = JSON.parse(kayitli);
            } else {
                kullaniciListesi = [];
            }
        }

        function kullanicilariKaydet() {
            localStorage.setItem("kullanicilar", JSON.stringify(kullaniciListesi));
        }

        function kayitOl(event) {
            event.preventDefault();

            var adSoyad = document.getElementById("fullname").value.trim();
            var email = document.getElementById("email").value.trim();
            var kullaniciAdi = document.getElementById("username").value.trim();
            var sifre = document.getElementById("password").value;
            var sifre2 = document.getElementById("password2").value;

            if (adSoyad === "" || email === "" || kullaniciAdi === "" || sifre === "" || sifre2 === "") {
                alert("Lütfen tüm zorunlu alanları doldurun.");
                return;
            }

            if (sifre !== sifre2) {
                alert("Şifre ve şifre tekrarı aynı olmalıdır.");
                return;
            }

            // Aynı e-posta veya kullanıcı adına sahip kullanıcı var mı?
            for (var i = 0; i < kullaniciListesi.length; i++) {
                var u = kullaniciListesi[i];
                if (u.email === email) {
                    alert("Bu e-posta adresi ile zaten bir hesap var.");
                    return;
                }
                if (u.username === kullaniciAdi) {
                    alert("Bu kullanıcı adı zaten kullanılıyor.");
                    return;
                }
            }

            var yeniKullanici = {
                fullname: adSoyad,
                email: email,
                username: kullaniciAdi,
                password: sifre
            };

            kullaniciListesi.push(yeniKullanici);
            kullanicilariKaydet();

            alert("Kayıt başarılı! Şimdi giriş yapabilirsin.");
            window.location = "giris.html";
        }

        window.onload = function () {
            kullanicilariYukle();
        };