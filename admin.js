import { db, ref, push, set, update, onValue, remove, get } from "./firebase-config.js";
        let aktifDuzenlenenId = null; 
        let mevcutYukluDosyaVerisi = "";
        let mevcutYukluDosyaAdi = "";

        // DÜZELTİLDİ: Boş dosya geldiğinde fonksiyonu tamamen durduran "return" eklendi.
        const dosyaYukleAsenkron = (file) => {
            return new Promise((resolve, reject) => {
                if (!file) {
                    resolve({ verisi: "", adi: "" });
                    return; // HAYATİ DÜZELTME BURADA
                }
                const reader = new FileReader();
                reader.onload = () => resolve({ verisi: reader.result, adi: file.name });
                reader.onerror = error => reject(error);
                reader.readAsDataURL(file);
            });
        };

        const formSifirla = () => {
            aktifDuzenlenenId = null;
            mevcutYukluDosyaVerisi = "";
            mevcutYukluDosyaAdi = "";
            document.getElementById('baslik').value = "";
            document.getElementById('detay').value = "";
            document.getElementById('dosyaYukle').value = "";
            document.getElementById('formButon').innerText = "Buluta Ekle";
            document.getElementById('formButon').className = "w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm";
            document.getElementById('duzenlemePaneliRozeti').classList.add('hidden');
        };

        // --- İÇERİK KAYDET / GÜNCELLE ---
        window.sistemeIcerikKaydet = async function() {
            const formButonu = document.getElementById('formButon');
            const baslik = document.getElementById('baslik').value.trim();
            if(!baslik) return alert('Lütfen geçerli bir başlık girin.');

            formButonu.innerText = "Yükleniyor..."; // Kullanıcıya işlem hissi ver

            const fileInput = document.getElementById('dosyaYukle').files[0];
            let dosyaVerisi = mevcutYukluDosyaVerisi;
            let dosyaAdi = mevcutYukluDosyaAdi;

            if (fileInput) {
                // Eğer dosya çok büyükse (Örn: 5MB üstü) uyarı ver
                if(fileInput.size > 5 * 1024 * 1024) {
                    alert("Uyarı: Dosya boyutu çok büyük. Firebase Realtime Database büyük dosyalar için uygun değildir, işlem başarısız olabilir.");
                }
                const yeniDosya = await dosyaYukleAsenkron(fileInput);
                dosyaVerisi = yeniDosya.verisi;
                dosyaAdi = yeniDosya.adi;
            }

            const veriPaketi = {
                kademe: document.getElementById('kademe').value,
                sinif: document.getElementById('sinif').value,
                tur: document.getElementById('tur').value,
                baslik: baslik,
                detay: document.getElementById('detay').value.trim(),
                dosya: dosyaVerisi,
                dosyaAdi: dosyaAdi,
                sonGuncellemeTarihi: Date.now()
            };

            if (aktifDuzenlenenId) {
                update(ref(db, `icerikler/${aktifDuzenlenenId}`), veriPaketi)
                    .then(() => {
                        alert('İçerik başarıyla güncellendi!');
                        formSifirla();
                    })
                    .catch((err) => { // HATA YAKALAYICI EKLENDİ
                        alert("Güncelleme Hatası: " + err.message);
                        formButonu.innerText = "Değişiklikleri Güncelle";
                    });
            } else {
                veriPaketi.eklenmeTarihi = Date.now();
                push(ref(db, 'icerikler'), veriPaketi)
                    .then(() => {
                        alert('Yeni içerik başarıyla eklendi!');
                        formSifirla();
                    })
                    .catch((err) => { // HATA YAKALAYICI EKLENDİ
                        alert("Ekleme Hatası: Veritabanı kurallarınızı veya dosya boyutunu kontrol edin. Detay: " + err.message);
                        formButonu.innerText = "Buluta Ekle";
                    });
            }
        };

        window.duzenleModunaGec = function(id) {
            get(ref(db, `icerikler/${id}`)).then((snapshot) => {
                const item = snapshot.val();
                if(!item) return;
                aktifDuzenlenenId = id;
                mevcutYukluDosyaVerisi = item.dosya || "";
                mevcutYukluDosyaAdi = item.dosyaAdi || "";
                document.getElementById('kademe').value = item.kademe;
                document.getElementById('sinif').value = item.sinif;
                document.getElementById('tur').value = item.tur;
                document.getElementById('baslik').value = item.baslik;
                document.getElementById('detay').value = item.detay || "";
                document.getElementById('formButon').innerText = "Değişiklikleri Güncelle";
                document.getElementById('formButon').className = "w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm";
                document.getElementById('duzenlemePaneliRozeti').innerText = `Şu an "${item.baslik}" düzenleniyor.`;
                document.getElementById('duzenlemePaneliRozeti').classList.remove('hidden');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        };

        window.duzenlemeIptalEt = () => formSifirla();

        // --- DUYURU EKLE ---
        window.duyuruEkle = async function() {
            const dBaslik = document.getElementById('duyuruBaslik').value.trim();
            const dAciklama = document.getElementById('duyuruAciklama').value.trim();
            if(!dBaslik || !dAciklama) return alert('Duyuru alanları zorunludur.');
            
            const resimInput = document.getElementById('duyuruResim').files[0];
            const { verisi } = await dosyaYukleAsenkron(resimInput);

            push(ref(db, 'duyurular'), {
                baslik: dBaslik,
                aciklama: dAciklama,
                resim: verisi,
                eklenmeTarihi: Date.now()
            }).then(() => {
                alert('Duyuru başarıyla panoya asıldı!');
                document.getElementById('duyuruBaslik').value = "";
                document.getElementById('duyuruAciklama').value = "";
                document.getElementById('duyuruResim').value = "";
            }).catch((err) => { // HATA YAKALAYICI EKLENDİ
                alert("Duyuru Eklenemedi: " + err.message);
            });
        };

        // --- SLIDER ENGINE ---
        // (Bu kısım senin kodunla aynı, ekstra .catch ekledim)
        window.sliderVerisiYukle = function() {
            const secilenSlide = document.getElementById('slideSecici').value;
            get(ref(db, `slider/${secilenSlide}`)).then((snapshot) => {
                const veri = snapshot.val();
                if(veri) {
                    document.getElementById('slideResimYolu').value = veri.resimYolu || "";
                    document.getElementById('slideDetayBaslik').value = veri.detayBaslik || "";
                    document.getElementById('slideDetayMetni').value = veri.detayMetni || "";
                    if(veri.detayResim) {
                        document.getElementById('slideMevcutResimOnizleme').src = veri.detayResim;
                        document.getElementById('slideMevcutResimOnizleme').classList.remove('hidden');
                    } else {
                        document.getElementById('slideMevcutResimOnizleme').classList.add('hidden');
                    }
                } else {
                    document.getElementById('slideResimYolu').value = "";
                    document.getElementById('slideDetayBaslik').value = "";
                    document.getElementById('slideDetayMetni').value = "";
                    document.getElementById('slideMevcutResimOnizleme').classList.add('hidden');
                }
            });
        };

        window.sliderKaydet = async function() {
            const secilenSlide = document.getElementById('slideSecici').value;
            const resimYolu = document.getElementById('slideResimYolu').value.trim();
            const detayBaslik = document.getElementById('slideDetayBaslik').value.trim();
            const detayMetni = document.getElementById('slideDetayMetni').value.trim();

            if(!resimYolu || !detayBaslik) return alert("Slayt resim yolu ve detay başlığı zorunludur.");

            const detayResimInput = document.getElementById('slideDetayResim').files[0];
            
            if (detayResimInput) {
                if (detayResimInput.type !== "image/jpeg" && detayResimInput.type !== "image/jpg") {
                    alert("Lütfen detay görseli için sadece JPG/JPEG formatında bir dosya seçiniz!");
                    return;
                }
            }
            
            const snapshot = await get(ref(db, `slider/${secilenSlide}`));
            const eskiVeri = snapshot.val();
            
            let finalDetayResim = "";
            if(eskiVeri && eskiVeri.resimYolu === resimYolu) {
                finalDetayResim = eskiVeri.detayResim || "";
            }

            if(detayResimInput) {
                const { verisi } = await dosyaYukleAsenkron(detayResimInput);
                finalDetayResim = verisi;
            }

            const sliderPaketi = {
                resimYolu: resimYolu,
                detayBaslik: detayBaslik,
                detayMetni: detayMetni,
                detayResim: finalDetayResim,
                guncellemeTarihi: Date.now()
            };

            set(ref(db, `slider/${secilenSlide}`), sliderPaketi)
                .then(() => {
                    alert(`${secilenSlide.toUpperCase()} başarıyla güncellendi ve kaydedildi!`);
                    window.sliderVerisiYukle();
                })
                .catch(err => alert("Slider hatası: " + err.message));
        };

        window.sekmeDegistir = function(sekmeAdi) {
            if(sekmeAdi === 'slider') {
                document.getElementById('mainIcerikAlani').classList.add('hidden');
                document.getElementById('mainSliderAlani').classList.remove('hidden');
                window.sliderVerisiYukle();
            } else {
                document.getElementById('mainSliderAlani').classList.add('hidden');
                document.getElementById('mainIcerikAlani').classList.remove('hidden');
            }
        };

        const listeOlustur = (dbYolu, containerId, etiketTipi) => {
            onValue(ref(db, dbYolu), (snapshot) => {
                const container = document.getElementById(containerId);
                if(!container) return;
                container.innerHTML = "";
                const data = snapshot.val();
                if(!data) {
                    container.innerHTML = `<p class="text-gray-400 text-center py-2">Kayıt bulunamadı.</p>`;
                    return;
                }
                Object.keys(data).forEach(key => {
                    const item = data[key];
                    const etiket = etiketTipi === 'icerik' ? `${item.sinif === 'ogretmen' ? 'Öğretmen' : item.sinif + '. Sınıf'}` : 'Duyuru';
                    const duzenleButonuHTML = etiketTipi === 'icerik' ? `<button onclick="duzenleModunaGec('${key}')" class="text-amber-500 hover:text-amber-700 p-1 mr-1"><i class="fa-regular fa-pen-to-square text-sm"></i></button>` : '';
                    container.innerHTML += `
                        <div class="flex justify-between items-center p-2 bg-gray-50 border rounded-lg text-xs">
                            <div class="truncate mr-2">
                                <span class="font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-800 mr-2">${etiket}</span>
                                <span class="text-gray-700 font-medium">${item.baslik}</span>
                            </div>
                            <div class="flex items-center flex-shrink-0">
                                ${duzenleButonuHTML}
                                <button onclick="veriSil('${dbYolu}/${key}')" class="text-red-500 hover:text-red-700 p-1"><i class="fa-regular fa-trash-can text-sm"></i></button>
                            </div>
                        </div>`;
                });
            }, (hata) => {
                console.error("Listeleme Hatası (İzin sorunu olabilir):", hata);
            });
        };

        window.veriSil = function(path) {
            if(confirm('Kalıcı olarak silinsin mi?')) {
                remove(ref(db, path))
                    .then(() => { if(aktifDuzenlenenId && path.includes(aktifDuzenlenenId)) formSifirla(); })
                    .catch(err => alert("Silme Hatası: " + err.message));
            }
        };

        listeOlustur('icerikler', 'adminListe', 'icerik');
        listeOlustur('duyurular', 'adminDuyuruListe', 'duyuru');
