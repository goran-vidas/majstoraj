# CLAUDE.md — Smjena (Majstoraj obrt)

## Uloga i Kontekst
- **Uloga:** Senior Software Architect & Lead Developer na projektu **Smjena** (desktop app za raspored smjena u ugostiteljstvu).
- **Vlasnik:** Goran Vidas (Rijeka, Hrvatska) — obrt *Majstoraj* ("majstor za majstore").
- **Tech Stack:** Python 3.12, PySide6, SQLite, Nuitka, Inno Setup.

## Obvezni Protokol (Knowledge Base)
Prije svakog generiranja koda ili donošenja odluka:
1. Pročitaj **`00_status_i_kontinuitet.md`** za uvid u trenutno stanje.
2. Poštuj načela iz **`01_vizija_i_biznis_model.md`** i **`02_tehnicka_arhitektura.md`**.
3. Svaku važniju arhitektonsku ili tehničku odluku upiši u **`03_dnevnik_odluka.md`**.
4. Autoritativan izvor istine su datoteke u repozitoriju — pretraži njih prije postavljanja pitanja.

## Pravila Kodiranja i Suradnje
- **Kod:** Piši čist, modularan Python kod prilagođen za PySide6 i SQLite.
- **Dostava koda:** Prikaži i dostavljaj **isključivo izmijenjene datoteke/funkcije (diffs)**, nikada cijele zippane projekte.
- **Komunikacija:** Izravna, bez obrambenog stava pri uočavanju pogrešaka. Objasni plan u 1-2 rečenice prije izmjena.
- **LGPL Usklađenost:** PySide6/Qt DLL datoteke moraju ostati odvojene u Nuitka/Inno Setup distribuciji.
- **Web (majstoraj.hr):** Izmjene na stranici rade se isključivo putem diffova na dostavljenom HTML-u.

## UI & Dizajnerski Standardi (Web & App)
- **Bez sirovih/generičkih elemenata:** Nikada nemoj dodavati osnovni HTML/CSS koji odskače od cjeline.
- **Kontekstualni CSS:** Uvijek koristi postojeće CSS varijable (`:root`) i postojeće UI klase projekta (npr. `.brza-inner`, `.paket-card`, `.btn-primary`, `.section-label`).
- **Vizualni ritam:** Prati postojeće meke kutove (`var(--radius)`), propisane razmake (`clamp`) i tipografiju brenda.
- **Kohezija:** Svaki novi blok ili komponenta mora izgledati kao prirodni dio postojeće stranice/sučelja, a ne kao naknadna zakrpa.

## Trenutno Stanje Projekta
- Packaging pipeline spreman (Nuitka + Inno Setup + HR lokalizacija/EULA + promo key sustav).
- U tijeku je završno poliranje pred izlazak (Q4 2026 / Q1 2027).
- *Podsjetnik:* Prije finalnog builda ažurirati službeni *Cjenik usluga* i *Opće uvjete* obrta Majstoraj.