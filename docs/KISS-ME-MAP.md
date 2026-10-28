# Kiss Me — główna wersja AER

Źródło odtwarzania: **Sixpence None the Richer – Kiss Me**, oficjalne nagranie udostępnione przez Curb Records, YouTube [`K2tbQ_g2VbQ`](https://www.youtube.com/watch?v=K2tbQ_g2VbQ), wersja albumowa około 3:28. Nie używać tej mapy do teledysku lub karaoke. Audio nie jest dołączone do aplikacji.

## Podstawa mapy

- [Transkrypcja Chordify dla dokładnie tego identyfikatora filmu](https://chordify.net/chords/sixpence-none-the-richer-songs/kiss-me-11-chords?version=youtube:K2tbQ_g2VbQ): kolejność akordów, indeksy uderzeń, punkty sekcji. W przeglądarce potwierdzono tożsamość filmu i długość 208,701 s. Pierwszy takt 1,340 s; początek końcowego B♭ przed łącznikiem 58,940 s. Siatka 100 BPM daje pozostałe czasy w pliku `src/kiss-me.mjs`.
- [Spy Tunes — opracowanie gitarowe, capo 3](https://spytunes.com/kiss-me-chords/): uzupełnienie charakterystycznego E♭7 w trzecim takcie motywu i na końcu drugiego taktu refrenu. Sam detektor w wybranej transkrypcji pomija część septym.
- To **aranżacja chóralna harmonii**, nie transkrypcja wszystkich partii nagrania. Akordy i barwy wymagają muzycznej oceny odsłuchowej; nie wykonano analizy widma całego oryginału ani niezależnego odsłuchu każdego przejścia. Nie deklarować dokładności co do próbki ani potwierdzenia każdego przewrotu.

## Punkty orientacyjne

| Czas | Część |
| --- | --- |
| 0:01,34 | Wstęp |
| 0:20,54 | Zwrotka 1 |
| 0:39,74 | Refren 1 |
| 1:01,34 | Łącznik |
| 1:10,94 | Zwrotka 2 |
| 1:30,14 | Refren 2 |
| 1:51,74 | Instrumental |
| 2:10,94 | Łącznik chóru |
| 2:20,54 | Refren 3 |
| 2:42,14 | Powtórzenia „So kiss me” |
| 3:01,34 | Outro |
| 3:20,54 | Końcowy E♭, bez zapętlenia |

## Mechanizm

Każda zmiana ma osobny czas w sekundach. W każdej klatce pobierany jest rzeczywisty `getCurrentTime()` YouTube. Wyszukiwanie na osi przywraca właściwy akord po przewinięciu w obie strony. Pauza lub buforowanie nie uruchamiają osobnego zegara. Nie ma ręcznego przełączania sekcji ani wyboru akordów gestami. Cisza początkowa i końcowa nie uruchamia chóru.

Menu Podkład pozwala skorygować całą mapę o ±0,1 s (maksymalnie ±1 s) z powodu opóźnienia toru odsłuchowego. Przywrócenie synchronizacji zeruje tę korektę. Restart utworu zachowuje ustawienie opóźnienia.

Testy jednostkowe sprawdzają granice wszystkich zmian, całą formę, cofanie czasu, koniec bez zapętlenia i zgodność nut chóru z akordami. Test przeglądarkowy symuluje transport YouTube, sekcje całego utworu i niezależne dłonie. To oddzielne dowody od jakości muzycznego dopasowania.
