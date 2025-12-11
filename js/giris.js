        var kullaniciListesi = [];

        function kullanicilariYukle() {
            var kayitli = localStorage.getItem("kullanicilar");
            if (kayitli !== null) {
                kullaniciListesi = JSON.parse(kayitli);
            } else {
                kullaniciListesi = [];
            }
        }

        function aktifKullaniciKaydet(kullanici) {
            // Şifreyi profile gerek olmadığı için burada saklamıyoruz
            var aktif = {
                fullname: kullanici.fullname,
                email: kullanici.email,
                username: kullanici.username
            };
            localStorage.setItem("aktifKullanici", JSON.stringify(aktif));
        }

        window.onload = function () {
            kullanicilariYukle();

            var form = document.getElementById("login-form");
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                var loginId = document.getElementById("login-id").value.trim();
                var sifre = document.getElementById("login-password").value;

                if (loginId === "" || sifre === "") {
                    alert("Lütfen kullanıcı adı/e-posta ve şifreyi girin.");
                    return;
                }

                var bulunan = null;

                for (var i = 0; i < kullaniciListesi.length; i++) {
                    var u = kullaniciListesi[i];

                    var idUyusuyor = (u.username === loginId || u.email === loginId);
                    var sifreUyusuyor = (u.password === sifre);

                    if (idUyusuyor && sifreUyusuyor) {
                        bulunan = u;
                        break;
                    }
                }

                if (bulunan === null) {
                    alert("Hatalı kullanıcı adı/e-posta veya şifre.");
                    return;
                }

                aktifKullaniciKaydet(bulunan);
                window.location = "dashboard.html";
            });
        };