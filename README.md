# THEREMIN / AER — instrument gestowy

Przeglądarkowy theremin, syntetyczny chór i harmonia sterowana dłońmi. Lokalny prototyp zbudowany z pomocą Codex. Ruch rozpoznaje MediaPipe, dźwięk generuje Web Audio. Model językowy nie uczestniczy w pętli audio.

## Uruchomienie

Na macOS otwórz `Start AER.command` albo w tym katalogu uruchom:

```sh
npm ci
npm run dev
```

Otwórz http://127.0.0.1:5173/ . Node.js 22.12+ lub 20.19+, współczesna przeglądarka, kamera. Pierwszą próbę najlepiej wykonać w Chrome. Raz kliknij „Włącz kamerę i instrument” i udziel przeglądarce dostępu do kamery. Późniejsza gra i całe menu działają gestami. Mikrofon nie jest używany. Serwer nasłuchuje na 127.0.0.1. Zamknięcie terminala zatrzymuje serwer.

Model, WASM, fonty i cztery bity są serwowane razem z aplikacją. „Kiss Me” i jego odtwarzacz wymagają dostępu do YouTube.

## Gra

- Ustaw kamerę na wysokości klatki piersiowej, około metra od grającego, w równym świetle. Obie całe dłonie muszą być widoczne.
- Najpierw pokaż dłonie po ich stronach lustrzanego obrazu. Instrument przypisuje im role i zachowuje tożsamość przy sięganiu do menu.
- **Lewa dłoń:** wysokość jej środka reguluje głośność. Otwarcie lewej dłoni reguluje liczbę partii chóru. W trybie piosenki jej palce nie wybierają akordów ani menu.
- **Prawa dłoń:** wysokość jej środka prowadzi melodię. Przechylenie w lewo przyciemnia barwę, w prawo rozjaśnia i dodaje vibrato. Wskaźnik MOD pokazuje efekt. Pomiar używa kierunku nadgarstek → środkowy staw dłoni, proporcji obrazu, martwej strefy ±8° i wygładzania. Jest to przechylenie w płaszczyźnie obrazu, a nie pełna rekonstrukcja obrotu w 3D.
- **Otwarcie lewej dłoni:** płynnie dodaje partie chóru, od jednej do ośmiu. Każda partia ma trzy lekko różniące się warstwy wokalne, łącznie do 24. Zaciśnięta lewa dłoń zostawia jedną partię; otwarcie prawej nie zmienia ich liczby.
- Zniknięcie dowolnej dłoni wycisza głos. Bit może grać dalej. Zatrzymanie danych modelu wycisza po 300 ms.

Startowy tryb to Choir z pełną mapą wersji albumowej „Kiss Me” w E♭-dur. Classic Theremin jest osobnym instrumentem. W menu „Instrument” dostępne są:

1. **Theremin:** klasyczna synteza z harmonicznymi i płynną wysokością.
2. **Choir · Aaa:** autorska synteza formantowa samogłoski, wielogłosowa harmonia, odstrojenia, niezależne vibrato i rozmieszczenie stereo.
3. **Vocoder · Aaa:** jaśniejszy nośnik i węższe formanty, dające robotyczną barwę. To syntezator o charakterze vocodera, bez analizy mowy z mikrofonu.

Chór jest syntetyczny; nie wykorzystuje nagrania ani klonu głosu Jacoba Colliera. Inspiracją jest sterowanie bogatą wielogłosową harmonią.

## Całe menu rękami

1. Nakieruj palec wskazujący prawej dłoni (w trybie piosenki) lub lewej (w pozostałych trybach) na **Menu** w prawym górnym rogu pola gry. Kursor i wypełniający się pierścień pokazują postęp. Przytrzymanie przez około 0,65 s otwiera menu zajmujące całe pole gry.
2. Wskaż dział: **Bity, Instrument, Piosenka, Tonacja, Skala, Ustawienia**. Przytrzymaj kursor nad działem, następnie nad opcją.
3. Pojawia się duże potwierdzenie. Wskaż „Potwierdź” przez 0,65 s albo złącz kciuk z palcem wskazującym dłoni sterującej kursorem. Potwierdzenie wymaga nowego złączenia palców po pokazaniu wyboru. Po zatwierdzeniu menu się zamyka.
4. „Wybierz ponownie” wraca do listy, a „Wróć do gry” zamyka menu bez wyboru. Oba działają kursorem dłoni.
5. W menu można także wyciszyć/wznowić instrument. Nawet po wyciszeniu kamera i kursor pozwalają ponownie otworzyć menu i wznowić dźwięk.

Przy otwartym menu głos jest wyciszony, aby sięganie rękami nie tworzyło przypadkowych nut. Kursor mapuje pozycję palca na całe pole gry, niezależnie od marginesów obrazu kamery. Utrata śledzenia zeruje rozpoczęty wybór. Mysz, dotyk i klawiatura pozostają dodatkowym sposobem obsługi.

## Piosenka, tonacja i skala

**Piosenka:** pełne „Kiss Me” z oryginalnym nagraniem, pop I–V–vi–IV, klasyczne I–IV–V–I oraz stała tonika. Akord i część utworu są widoczne w polu gry. Własne progresje można zatrzymać i uruchomić od początku w menu.

„Kiss Me” jest główną wersją: oryginalne audio z YouTube i chóralna aranżacja harmonii całego utworu. Tonacja E♭-dur, 100 BPM. Sekcje i akordy wynikają z czasu konkretnego nagrania. Źródła, punkty orientacyjne i zakres weryfikacji opisuje [mapa utworu](docs/KISS-ME-MAP.md).

**Tonacja:** 12 tonik, w tym G-dur i D-dur. Zmiana transponuje całą harmonię. **Skala:** dźwięki aktualnego akordu, gama durowa, pentatonika durowa, gama molowa. W trybie „Dźwięki akordu” także melodia wybiera wyłącznie składniki bieżącego akordu. Pozostałe tryby dopuszczają nuty przejściowe, które mogą tworzyć napięcia nad akordem. Wybranie gamy molowej przy „Kiss Me” przełącza na własną progresję pop w wariancie molowym.

W czasie odtwarzania bitu tempo harmonii podąża za jego BPM. Zmiana bitu rozpoczyna harmonię od początku na nowym rytmie. Bez bitu zegar presetu pracuje przy 100 BPM. Zatrzymanie i wznowienie progresji nie zatrzymuje bitu.

Źródła do opracowania presetu: [Spy Tunes, analiza harmonii](https://spytunes.com/kiss-me-chords/), [Bell & Co Music, oryginalna tonacja i tempo](https://www.bellandcomusic.com/kiss-me.html). Nie dołączono chronionego nagrania utworu.

## Bity i nagrywanie

Lokalne pętle: **Jazz Hop 119 BPM, Pocket Funk 100 BPM, Slow Electro 120 BPM, Classic House 117 BPM**. Nagrania CC0 autorstwa SergeyIonov i lezaarth z Freesound. Źródła i obróbka w `public/beats/credits.json` oraz `public/licenses/BEATS.md`. Pętle obejmują pełne takty, mają wyrównane poziomy i niewielkie korekty tempa. Zmiana grającego bitu następuje na granicy taktu. Głośność i wyłączenie bitu dostępne są w menu gestów.

„Nagraj audio” zapisuje miks głosu, pogłosu i bitu. Bez obrazu i mikrofonu. Po zakończeniu pobierz WebM/Opus, MP4/AAC albo Ogg/Opus, zależnie od przeglądarki. Nagranie pozostaje w pamięci karty; odświeżenie je usuwa. „Wyjście” reguluje cały miks.

## Obsługa dodatkowa

Mysz / dotyk: przytrzymaj pole, ruch w prawo podwyższa dźwięk, w górę zwiększa głośność. W polu gry Enter podtrzymuje nutę; strzałki zmieniają wysokość i głośność, Shift zmniejsza krok. Klawisze `[` i `]` zmieniają otwarcie wirtualnych dłoni w trybie myszy. Spacja wycisza/wznawia, gdy fokus jest poza kontrolkami. Escape wycisza również przy aktywnej kontrolce. Przycisk „Zatrzymaj” kończy audio i kamerę. Zmiana karty wycisza instrument.

## Technika i weryfikacja

TypeScript + Vite, MediaPipe Hand Landmarker 0.10.32 w klasycznym Web Workerze. Web Audio: theremin, formantowa synteza 8 partii × 3 warstwy, niezależne LFO i panorama, wygładzane parametry, pogłos splotowy, kompresor, analizator i MediaRecorder. Wskaźnik VISION pokazuje czas obliczenia klatki, nie całą latencję gest → dźwięk.

```sh
npm test
npm run build
```

Przy serwerze deweloperskim:

- `/tests/diagnostics.html`: rzeczywisty model na pustym obrazie i lokalnym zdjęciu referencyjnym dwóch dłoni (fixture nie jest publikowany w repozytorium); theremin i cisza.
- `/tests/beats-runtime.html`: sygnał i długość czterech bitów, modulacja, wyciszenie, anulowanie wyboru.
- `/tests/choir-runtime.html`: sygnał jednej i ośmiu partii, strojenie, barwa vocodera i wyciszenie.
- `/tests/gesture-flow.html`: wybór menu, działu, opcji i potwierdzenia, w tym gest złączenia palców, oraz otwieranie dłoni na symulowanym śledzeniu.

Testy symulacyjne nie zastępują próby muzycznej z prawdziwą kamerą. Oświetlenie, zasłonięcie i odwrócenie dłoni wpływają na detekcję. Aplikacja nie zawiera kodu wysyłania obrazu ani nagrań do serwera; dołączona biblioteka MediaPipe podlega własnym warunkom.

`npm run build` tworzy statyczne `dist/`, gotowe do późniejszego hostingu HTTPS. Publikacja GitHub Pages: https://jakiesluchawki.github.io/THEREMIN/. Kolejne zmiany na gałęzi `main` uruchamiają testy, budowę i wdrożenie przez GitHub Actions. Kamera na innym urządzeniu wymaga HTTPS; wyjątek localhost dotyczy urządzenia grającego.

Licencje: MediaPipe Apache 2.0; DM Sans i IBM Plex Mono SIL OFL; bity CC0. Kopie w `licenses/` i `public/licenses/`. [Dokumentacja Hand Landmarker](https://ai.google.dev/edge/mediapipe/solutions/vision/hand_landmarker/web_js).

## Podkład i automatyczne prowadzenie harmonii

Tryb „Kiss Me” ładuje oryginalne nagranie Curb Records (`K2tbQ_g2VbQ`). To domyślne i jedyne źródło piosenki w tej wersji. Włączenie piosenki zatrzymuje bit; wybranie bitu zatrzymuje YouTube. Podkład pozostaje w E♭-dur. Zmiana tonacji zatrzymuje nagranie, ponieważ audio YouTube nie jest transponowane.

**Nie ma ręcznego wyboru akordów ani sekcji.** Pełna mapa obejmuje wstęp, obie zwrotki, trzy refreny, łączniki, dłuższy instrumental wersji albumowej i zakończenie. Każda zmiana ma osobny znacznik sekundowy. Odczyt `getCurrentTime()` przywraca właściwe miejsce także po przewinięciu; pauza i buforowanie nie przesuwają osobnego zegara. Menu Podkład daje korektę całej mapy o ±0,1 s oraz jej wyzerowanie. Nie trzeba ustawiać początku zwrotki ani refrenu.

Mapa opiera się na transkrypcji przypisanej do dokładnie tego filmu, z uzupełnionymi septymami z opracowania gitarowego. To mapowanie z transkrypcji, bez analizy widma i niezależnego odsłuchu każdego przejścia. Szczegóły w [docs/KISS-ME-MAP.md](docs/KISS-ME-MAP.md).

## Rozdzielone dłonie w piosence

- **Lewa:** wysokość reguluje głośność chóru, otwarcie palców liczbę partii 1–8. Nie wybiera akordów.
- **Prawa góra–dół:** zmienia układ automatycznie prowadzonego akordu na niski, środkowy lub wysoki. Składniki akordu pozostają zgodne, a rejestr ma martwe strefy ograniczające przeskakiwanie.
- **Prawy skręt:** barwa i vibrato. Ruch lewo–prawo oraz złączenie palców poza interfejsem nie zmieniają akordu.
- **Prawy wskazujący:** kursor menu i transportu w trybie piosenki. Złączenie palców nadal służy do potwierdzania opcji menu i przycisków odtwarzania.

Nagranie AER obejmuje chór i jego efekty; audio YouTube gra oddzielnie i nie trafia do pliku.

## Logarytmiczna głośność podkładu

Przy odtwarzaczu YouTube jest osobny suwak **Głośność podkładu**, opisany w dB. Startuje na **−18 dB**, a menu „Podkład” daje kroki **−3 / +3 dB**. Przeliczenie: `gain = 10^(dB / 20)`; 0 dB odpowiada pełnej skali, −20 dB jednej dziesiątej, a dolny koniec −48 dB jest odcięciem do ciszy (−∞). Wartość jest przekazywana do głośności odtwarzacza YouTube, a nie do głosu chóru. To skala sterowania poziomem, nie pomiar głośności akustycznej.

Test `/tests/song-hands-flow.html` sprawdza niezależność obu dłoni, brak ręcznego wyboru akordu, przewijanie całej mapy piosenki, prawy kursor menu oraz kroki i suwak dB na kontrolowanym odtwarzaczu.

## GitHub Pages

`npm run build:pages` tworzy `dist-pages/` ze ścieżką bazową `/THEREMIN/`. Workflow `.github/workflows/pages.yml` uruchamia testy i publikuje ten katalog. Zwykłe `npm run build` zachowuje ścieżkę `/` dla localhost. Model i WASM są rozwiązywane względem adresu workera, a bity względem ścieżki Vite. HTTPS pozwala przeglądarce poprosić o kamerę.
