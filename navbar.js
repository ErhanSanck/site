document.addEventListener("DOMContentLoaded", () => {
    const navbarHTML = `
    <nav class="bg-white shadow-md sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between h-16">
                <div class="flex items-center">
                    <a href="index.html" class="flex-shrink-0 flex items-center gap-2 text-2xl font-bold text-indigo-600 mr-8">
                        <i class="fa-solid fa-calculator"></i> MatPortal
                    </a>
                    
                    <div class="hidden md:flex space-x-6 h-full items-center">
                        <a href="index.html" class="text-gray-500 hover:text-indigo-600 px-1 text-sm font-medium transition">Ana Sayfa</a>
                        
                        <div class="dropdown relative h-full flex items-center group">
                            <button class="text-gray-500 hover:text-indigo-600 px-1 text-sm font-medium flex items-center gap-1 transition">
                                Ortaokul (LGS) <i class="fa-solid fa-chevron-down text-[10px]"></i>
                            </button>
                            <div class="dropdown-menu hidden absolute left-0 top-16 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                                ${[5, 6, 7, 8].map(s => `
                                    <div class="submenu relative px-2">
                                        <div class="flex items-center justify-between text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg px-3 py-2 transition font-medium cursor-pointer">
                                            <a href="dokumanlar.html?sinif=${s}" class="flex-grow">${s}. Sınıf Matematik</a>
                                            <i class="fa-solid fa-chevron-right text-[9px] text-gray-400"></i>
                                        </div>
                                        <div class="submenu-menu hidden absolute left-full top-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                                            <a href="dokumanlar.html?sinif=${s}&tur=anlatim" class="block px-4 py-2 text-xs text-gray-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Konu Anlatımları</a>
                                            <a href="dokumanlar.html?sinif=${s}&tur=test" class="block px-4 py-2 text-xs text-gray-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Yaprak Testler</a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="dropdown relative h-full flex items-center group">
                            <button class="text-gray-500 hover:text-indigo-600 px-1 text-sm font-medium flex items-center gap-1 transition">
                                Lise (YKS) <i class="fa-solid fa-chevron-down text-[10px]"></i>
                            </button>
                            <div class="dropdown-menu hidden absolute left-0 top-16 w-52 bg-white border border-gray-100 rounded-xl shadow-xl py-2 z-50">
                                ${[9, 10, 11, 12].map(s => `
                                    <div class="submenu relative px-2">
                                        <div class="flex items-center justify-between text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg px-3 py-2 transition font-medium cursor-pointer">
                                            <a href="dokumanlar.html?sinif=${s}" class="flex-grow">${s === 12 ? '12. Sınıf / Mezun' : `${s}. Sınıf Matematik`}</a>
                                            <i class="fa-solid fa-chevron-right text-[9px] text-gray-400"></i>
                                        </div>
                                        <div class="submenu-menu hidden absolute left-full top-0 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2">
                                            <a href="dokumanlar.html?sinif=${s}&tur=anlatim" class="block px-4 py-2 text-xs text-gray-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Konu Anlatımları</a>
                                            <a href="dokumanlar.html?sinif=${s}&tur=test" class="block px-4 py-2 text-xs text-gray-600 hover:bg-slate-50 hover:text-indigo-600 font-medium">Yaprak Testler</a>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <a href="bulmaca.html" class="text-gray-500 hover:text-indigo-600 px-1 text-sm font-medium transition">Bulmaca</a>
                        <a href="oyun.html" class="text-gray-500 hover:text-indigo-600 px-1 text-sm font-medium transition">Oyun</a>
                        <a href="zeka-testleri.html" class="text-gray-500 hover:text-indigo-600 px-1 text-sm font-medium transition">Zeka Testleri</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>
    `;
    
    // Sayfada id'si 'globalNavbar' olan elemanın içine menüyü enjekte et
    const target = document.getElementById("globalNavbar");
    if (target) {
        target.innerHTML = navbarHTML;
    }
});