'use strict';
const GAMES=[["🐶","Animals","Animales",[["🐶","Dog","Perro"],["🐱","Cat","Gato"],["🐮","Cow","Vaca"],["🐸","Frog","Rana"]]],["👋","Greetings","Saludos",[["👋","Hello","Hola"],["🙋","Bye","Adiós"],["👏","Clap","Aplaude"],["❤️","Love","Amor"]]],["🍎","Food","Comida",[["🍎","Apple","Manzana"],["🍌","Banana","Banana"],["🥛","Milk","Leche"],["🍞","Bread","Pan"]]],["🚗","Vehicles","Vehículos",[["🚗","Car","Auto"],["🚌","Bus","Autobús"],["🚂","Train","Tren"],["✈️","Plane","Avión"]]],["🎨","Colors","Colores",[["🔴","Red","Rojo"],["🔵","Blue","Azul"],["🟢","Green","Verde"],["🟡","Yellow","Amarillo"]]],["🧸","Toys","Juguetes",[["🧸","Teddy bear","Osito"],["⚽","Ball","Pelota"],["🪁","Kite","Cometa"],["🪀","Yo-yo","Yoyó"]]],["👀","Body","Cuerpo",[["👀","Eyes","Ojos"],["👃","Nose","Nariz"],["👂","Ear","Oreja"],["✋","Hand","Mano"]]],["🏠","Home","Casa",[["🛏️","Bed","Cama"],["🚪","Door","Puerta"],["🪑","Chair","Silla"],["💡","Light","Luz"]]],["👨‍👩‍👧","Family","Familia",[["👩","Mom","Mamá"],["👨","Dad","Papá"],["👶","Baby","Bebé"],["👵","Grandma","Abuela"]]],["🐥","Baby Animals","Crías",[["🐥","Chick","Pollito"],["🐈","Kitten","Gatito"],["🐑","Lamb","Cordero"],["🐣","Egg","Huevo"]]],["💧","Requests","Pedir",[["💧","Water","Agua"],["🥛","More milk","Más leche"],["🍪","Cookie","Galleta"],["🧸","My teddy","Mi osito"]]],["😊","Feelings","Emociones",[["😊","Happy","Feliz"],["😢","Sad","Triste"],["😴","Sleepy","Con sueño"],["😮","Surprised","Sorprendido"]]],["🐘","Sizes","Tamaños",[["🐘","Big","Grande"],["🐭","Small","Pequeño"],["🦒","Tall","Alto"],["🐜","Tiny","Diminuto"]]],["🌞","Nature","Naturaleza",[["☀️","Sun","Sol"],["🌳","Tree","Árbol"],["🌸","Flower","Flor"],["☁️","Cloud","Nube"]]],["🎵","Music","Música",[["👏","Clap","Aplaude"],["🥁","Drum","Tambor"],["🔔","Bell","Campana"],["🎶","Sing","Canta"]]],["👕","Clothes","Ropa",[["👕","Shirt","Camisa"],["🧦","Socks","Calcetines"],["👟","Shoes","Zapatos"],["🧢","Hat","Gorra"]]],["🫧","Bath Time","Baño",[["🫧","Bubbles","Burbujas"],["🦆","Duck","Pato"],["🧼","Soap","Jabón"],["🛁","Bath","Baño"]]],["🔢","Numbers","Números",[["1️⃣","One","Uno"],["2️⃣","Two","Dos"],["3️⃣","Three","Tres"],["⭐","Star","Estrella"]]],["🌙","Bedtime","Dormir",[["🌙","Moon","Luna"],["⭐","Star","Estrella"],["🛏️","Bed","Cama"],["📖","Book","Libro"]]],["💬","Little Phrases","Frases",[["🥛","More milk","Más leche"],["👋","Bye-bye","Adiós"],["🚗","Go car","Auto va"],["🧸","My bear","Mi osito"]]]];
const LANGUAGES={
  en:{name:'English',locale:'en-US'},es:{name:'Español',locale:'es-ES'},
  fr:{name:'Français',locale:'fr-FR'},pt:{name:'Português',locale:'pt-BR'},
  de:{name:'Deutsch',locale:'de-DE'},it:{name:'Italiano',locale:'it-IT'},
  ja:{name:'日本語',locale:'ja-JP'},ko:{name:'한국어',locale:'ko-KR'}
};
// One key per concept; repeated concepts use the same spelling.
const EXTRA_WORDS={
  Dog:['Chien','Cachorro','Hund','Cane','いぬ','강아지'],
  Cat:['Chat','Gato','Katze','Gatto','ねこ','고양이'],
  Cow:['Vache','Vaca','Kuh','Mucca','うし','소'],
  Frog:['Grenouille','Sapo','Frosch','Rana','かえる','개구리'],
  Hello:['Bonjour','Olá','Hallo','Ciao','こんにちは','안녕'],
  Bye:['Au revoir','Tchau','Tschüss','Ciao','バイバイ','잘 가'],
  Clap:['Tape des mains','Bata palmas','Klatsch in die Hände','Batti le mani','てをたたこう','손뼉 쳐요'],
  Love:['Amour','Amor','Liebe','Amore','あい','사랑'],
  Apple:['Pomme','Maçã','Apfel','Mela','りんご','사과'],
  Banana:['Banane','Banana','Banane','Banana','バナナ','바나나'],
  Milk:['Lait','Leite','Milch','Latte','ぎゅうにゅう','우유'],
  Bread:['Pain','Pão','Brot','Pane','パン','빵'],
  Car:['Voiture','Carro','Auto','Auto','くるま','자동차'],
  Bus:['Bus','Ônibus','Bus','Autobus','バス','버스'],
  Train:['Train','Trem','Zug','Treno','でんしゃ','기차'],
  Plane:['Avion','Avião','Flugzeug','Aereo','ひこうき','비행기'],
  Red:['Rouge','Vermelho','Rot','Rosso','あか','빨강'],
  Blue:['Bleu','Azul','Blau','Blu','あお','파랑'],
  Green:['Vert','Verde','Grün','Verde','みどり','초록'],
  Yellow:['Jaune','Amarelo','Gelb','Giallo','きいろ','노랑'],
  'Teddy bear':['Nounours','Ursinho','Teddybär','Orsacchiotto','くまのぬいぐるみ','곰 인형'],
  Ball:['Ballon','Bola','Ball','Palla','ボール','공'],
  Kite:['Cerf-volant','Pipa','Drachen','Aquilone','たこ','연'],
  'Yo-yo':['Yoyo','Ioiô','Jo-Jo','Yo-yo','ヨーヨー','요요'],
  Eyes:['Yeux','Olhos','Augen','Occhi','め','눈'],
  Nose:['Nez','Nariz','Nase','Naso','はな','코'],
  Ear:['Oreille','Orelha','Ohr','Orecchio','みみ','귀'],
  Hand:['Main','Mão','Hand','Mano','て','손'],
  Bed:['Lit','Cama','Bett','Letto','ベッド','침대'],
  Door:['Porte','Porta','Tür','Porta','ドア','문'],
  Chair:['Chaise','Cadeira','Stuhl','Sedia','いす','의자'],
  Light:['Lumière','Luz','Licht','Luce','あかり','불빛'],
  Mom:['Maman','Mamãe','Mama','Mamma','ママ','엄마'],
  Dad:['Papa','Papai','Papa','Papà','パパ','아빠'],
  Baby:['Bébé','Bebê','Baby','Bebè','あかちゃん','아기'],
  Grandma:['Mamie','Vovó','Oma','Nonna','おばあちゃん','할머니'],
  Chick:['Poussin','Pintinho','Küken','Pulcino','ひよこ','병아리'],
  Kitten:['Chaton','Gatinho','Kätzchen','Gattino','こねこ','아기 고양이'],
  Lamb:['Agneau','Cordeiro','Lamm','Agnellino','こひつじ','아기 양'],
  Egg:['Œuf','Ovo','Ei','Uovo','たまご','달걀'],
  Water:['Eau','Água','Wasser','Acqua','みず','물'],
  'More milk':['Encore du lait','Mais leite','Mehr Milch','Ancora latte','もっとぎゅうにゅう','우유 더 주세요'],
  Cookie:['Biscuit','Biscoito','Keks','Biscotto','クッキー','쿠키'],
  'My teddy':['Mon nounours','Meu ursinho','Mein Teddy','Il mio orsacchiotto','わたしのくまさん','내 곰 인형'],
  Happy:['Content','Feliz','Fröhlich','Felice','うれしい','기뻐요'],
  Sad:['Triste','Triste','Traurig','Triste','かなしい','슬퍼요'],
  Sleepy:['Envie de dormir','Com sono','Müde','Ho sonno','ねむい','졸려요'],
  Surprised:['Surpris','Surpreso','Überrascht','Sorpreso','びっくり','놀랐어요'],
  Big:['Grand','Grande','Groß','Grande','おおきい','커요'],
  Small:['Petit','Pequeno','Klein','Piccolo','ちいさい','작아요'],
  Tall:['Grand','Alto','Groß','Alto','せがたかい','키가 커요'],
  Tiny:['Tout petit','Bem pequeno','Winzig','Piccolissimo','とてもちいさい','아주 작아요'],
  Sun:['Soleil','Sol','Sonne','Sole','たいよう','해'],
  Tree:['Arbre','Árvore','Baum','Albero','き','나무'],
  Flower:['Fleur','Flor','Blume','Fiore','はな','꽃'],
  Cloud:['Nuage','Nuvem','Wolke','Nuvola','くも','구름'],
  Drum:['Tambour','Tambor','Trommel','Tamburo','たいこ','북'],
  Bell:['Cloche','Sino','Glocke','Campana','すず','종'],
  Sing:['Chante','Cante','Sing','Canta','うたおう','노래해요'],
  Shirt:['Chemise','Camisa','Hemd','Camicia','シャツ','셔츠'],
  Socks:['Chaussettes','Meias','Socken','Calzini','くつした','양말'],
  Shoes:['Chaussures','Sapatos','Schuhe','Scarpe','くつ','신발'],
  Hat:['Casquette','Boné','Kappe','Cappellino','ぼうし','모자'],
  Bubbles:['Bulles','Bolhas','Seifenblasen','Bolle','あわ','거품'],
  Duck:['Canard','Pato','Ente','Anatra','あひる','오리'],
  Soap:['Savon','Sabonete','Seife','Sapone','せっけん','비누'],
  Bath:['Bain','Banho','Bad','Bagno','おふろ','목욕'],
  One:['Un','Um','Eins','Uno','いち','하나'],
  Two:['Deux','Dois','Zwei','Due','に','둘'],
  Three:['Trois','Três','Drei','Tre','さん','셋'],
  Star:['Étoile','Estrela','Stern','Stella','ほし','별'],
  Moon:['Lune','Lua','Mond','Luna','つき','달'],
  Book:['Livre','Livro','Buch','Libro','ほん','책'],
  'Bye-bye':['Au revoir','Tchau, tchau','Tschüss','Ciao ciao','バイバイ','잘 가'],
  'Go car':['La voiture roule','O carro anda','Das Auto fährt','La macchina va','くるまがはしる','자동차가 가요'],
  'My bear':['Mon nounours','Meu ursinho','Mein Teddy','Il mio orsacchiotto','わたしのくまさん','내 곰 인형']
};
const EXTRA_CODES=['fr','pt','de','it','ja','ko'];
const CATEGORIES={
  fr:'Animaux|Salutations|Aliments|Véhicules|Couleurs|Jouets|Corps|Maison|Famille|Bébés animaux|Demandes|Émotions|Tailles|Nature|Musique|Vêtements|Le bain|Nombres|Le coucher|Petites phrases'.split('|'),
  pt:'Animais|Saudações|Comida|Veículos|Cores|Brinquedos|Corpo|Casa|Família|Filhotes|Pedidos|Emoções|Tamanhos|Natureza|Música|Roupas|Hora do banho|Números|Hora de dormir|Frases curtas'.split('|'),
  de:'Tiere|Begrüßungen|Essen|Fahrzeuge|Farben|Spielzeug|Körper|Zuhause|Familie|Tierbabys|Wünsche|Gefühle|Größen|Natur|Musik|Kleidung|Badezeit|Zahlen|Schlafenszeit|Kleine Sätze'.split('|'),
  it:'Animali|Saluti|Cibo|Veicoli|Colori|Giocattoli|Corpo|Casa|Famiglia|Cuccioli|Richieste|Emozioni|Dimensioni|Natura|Musica|Vestiti|Il bagnetto|Numeri|La nanna|Piccole frasi'.split('|'),
  ja:'どうぶつ|あいさつ|たべもの|のりもの|いろ|おもちゃ|からだ|おうち|かぞく|どうぶつのあかちゃん|おねがい|きもち|おおきさ|しぜん|おんがく|おようふく|おふろ|かず|ねんね|みじかいことば'.split('|'),
  ko:'동물|인사|음식|탈것|색깔|장난감|몸|우리 집|가족|아기 동물|부탁하기|감정|크기|자연|음악|옷|목욕 시간|숫자|잠잘 시간|짧은 말'.split('|')
};
const UI_KEYS='source|target|pairHelp|swap|play|allGames|listen|next|touch|instructions|parents|parentIntro|together|coach|voiceTitle|speed|voice|preview|voiceNote|auto|noVoice|noSpeech|test|age|young|middle|older|tagline|welcome|subtitle|pick|footer|good|try|game|picture|completed|progress|hearAnimal|funSound|parentCover|slow|clear|normal|languageSettings'.split('|');
const UI_ROWS={
  en:['I speak','I am learning','Hear each word in your language, then in the language you are learning.','Swap languages','Play','All games','Hear both languages','Next picture','Touch','Listen and touch. 👆','For parents','Stay and play with your child. Repeat words, make gestures and use real objects. For the youngest toddlers, prioritize off-screen interaction.','Play together','Stay together. Say one word, point at a real object and stop whenever your child loses interest.','Voice settings (grown-ups)','Speaking speed','Learning voice','Preview both voices','Voices depend on the device. Install voices for both languages for pronunciation. Offline speech requires downloaded voice packs.','Automatic','No voice available for: ','Speech is unavailable on this device.','Test sound','Age','Start with one familiar word and point to a real object.','Model short requests and celebrate gestures too.','Model short phrases and take conversational turns.','Listen • Learn • Play',"Let’s play together!",'20 games · 8 languages · both directions','Choose a game','No ads · No microphone · Adult supervision · Short, shared play sessions','Well done! 🌟','Look here! 💛','Game','Picture','You finished all 20 games! 🌟','Words explored','Hear animal','Fun sound','A joyful learning time with a grown-up 💛','Slow','Clear','Normal','Languages (grown-ups)'],
  es:['Hablo','Quiero aprender','Escucha cada palabra en tu idioma y después en el idioma que estás aprendiendo.','Invertir idiomas','Jugar','Todos los juegos','Oír ambos idiomas','Otra imagen','Toca','Escucha y toca. 👆','Para familias','Jueguen juntos. Repitan palabras, hagan gestos y usen objetos reales. Para los más pequeños, den prioridad a la interacción sin pantallas.','Jueguen juntos','Acompañen al niño. Digan una palabra, señalen objetos reales y terminen cuando pierda interés.','Configuración de voz (adultos)','Velocidad de voz','Voz de aprendizaje','Probar ambas voces','Las voces dependen del dispositivo. Instala voces para ambos idiomas. La voz sin conexión requiere paquetes de voz descargados.','Automática','No hay voz disponible para: ','La voz no está disponible en este dispositivo.','Probar sonido','Edad','Comiencen con una palabra familiar y señalen un objeto real.','Modelen peticiones breves y celebren también los gestos.','Modelen frases cortas y conversen por turnos.','Escucha • Aprende • Juega','¡Vamos a jugar!','20 juegos · 8 idiomas · ambos sentidos','Elige un juego','Sin anuncios · Sin micrófono · Supervisión adulta · Sesiones breves y compartidas','¡Muy bien! 🌟','¡Mira aquí! 💛','Juego','Imagen','¡Terminaste los 20 juegos! 🌟','Palabras exploradas','Escucha al animal','Sonido divertido','Aprendizaje acompañado de una persona adulta 💛','Lenta','Clara','Normal','Idiomas (adultos)'],
  fr:['Je parle','J’apprends','Écoutez chaque mot dans votre langue, puis dans la langue à apprendre.','Inverser les langues','Jouer','Tous les jeux','Écouter les deux langues','Image suivante','Touche','Écoute et touche. 👆','Pour les parents','Jouez ensemble. Répétez les mots, faites des gestes et utilisez de vrais objets. Pour les tout-petits, privilégiez les échanges sans écran.','Jouez ensemble','Restez ensemble. Dites un mot, montrez un objet réel et arrêtez quand l’enfant se désintéresse.','Réglages de voix (adultes)','Vitesse de parole','Voix à apprendre','Écouter les deux voix','Les voix dépendent de l’appareil. Installez les deux langues. Hors connexion, des voix téléchargées sont nécessaires.','Automatique','Aucune voix disponible pour : ','La voix n’est pas disponible sur cet appareil.','Tester le son','Âge','Commencez par un mot connu et montrez un objet réel.','Montrez de petites demandes et encouragez aussi les gestes.','Proposez de courtes phrases et parlez à tour de rôle.','Écouter • Apprendre • Jouer','Jouons ensemble !','20 jeux · 8 langues · dans les deux sens','Choisis un jeu','Sans publicité · Sans microphone · Avec un adulte · Séances courtes et partagées','Bravo ! 🌟','Regarde ici ! 💛','Jeu','Image','Tu as terminé les 20 jeux ! 🌟','Mots explorés','Écouter l’animal','Son amusant','Un moment joyeux avec un adulte 💛','Lente','Claire','Normale','Langues (adultes)'],
  pt:['Eu falo','Quero aprender','Ouça cada palavra no seu idioma e depois no idioma que está aprendendo.','Inverter idiomas','Jogar','Todos os jogos','Ouvir os dois idiomas','Próxima imagem','Toque','Ouça e toque. 👆','Para as famílias','Brinquem juntos. Repitam palavras, façam gestos e usem objetos reais. Para os menores, priorizem a interação sem telas.','Brinquem juntos','Fiquem juntos. Digam uma palavra, mostrem um objeto real e parem quando a criança perder o interesse.','Configurações de voz (adultos)','Velocidade da fala','Voz de aprendizagem','Ouvir as duas vozes','As vozes dependem do aparelho. Instale os dois idiomas. A fala sem internet requer vozes baixadas.','Automática','Nenhuma voz disponível para: ','A voz não está disponível neste aparelho.','Testar som','Idade','Comecem com uma palavra conhecida e mostrem um objeto real.','Demonstrem pedidos curtos e valorizem também os gestos.','Demonstrem frases curtas e conversem por turnos.','Ouvir • Aprender • Brincar','Vamos brincar juntos!','20 jogos · 8 idiomas · nos dois sentidos','Escolha um jogo','Sem anúncios · Sem microfone · Com um adulto · Sessões curtas e compartilhadas','Muito bem! 🌟','Olhe aqui! 💛','Jogo','Imagem','Você terminou os 20 jogos! 🌟','Palavras exploradas','Ouvir o animal','Som divertido','Uma aprendizagem alegre com um adulto 💛','Lenta','Clara','Normal','Idiomas (adultos)'],
  de:['Ich spreche','Ich lerne','Höre jedes Wort zuerst in deiner Sprache und dann in der Sprache, die du lernst.','Sprachen tauschen','Spielen','Alle Spiele','Beide Sprachen hören','Nächstes Bild','Tippe auf','Höre zu und tippe. 👆','Für Eltern','Spielen Sie gemeinsam. Wiederholen Sie Wörter, machen Sie Gesten und nutzen Sie echte Gegenstände. Bei den Kleinsten haben Begegnungen ohne Bildschirm Vorrang.','Spielt gemeinsam','Bleiben Sie dabei. Sagen Sie ein Wort, zeigen Sie einen echten Gegenstand und hören Sie auf, wenn das Kind das Interesse verliert.','Stimmeinstellungen (Erwachsene)','Sprechtempo','Lernstimme','Beide Stimmen anhören','Stimmen hängen vom Gerät ab. Installieren Sie beide Sprachen. Für Offline-Sprache sind heruntergeladene Stimmen nötig.','Automatisch','Keine Stimme verfügbar für: ','Sprachausgabe ist auf diesem Gerät nicht verfügbar.','Ton testen','Alter','Beginnen Sie mit einem vertrauten Wort und zeigen Sie einen echten Gegenstand.','Machen Sie kurze Bitten vor und bestärken Sie auch Gesten.','Sprechen Sie kurze Sätze vor und wechseln Sie sich ab.','Hören • Lernen • Spielen','Lasst uns zusammen spielen!','20 Spiele · 8 Sprachen · beide Richtungen','Wähle ein Spiel','Ohne Werbung · Ohne Mikrofon · Mit Erwachsenen · Kurze gemeinsame Spielzeiten','Gut gemacht! 🌟','Schau hier! 💛','Spiel','Bild','Du hast alle 20 Spiele geschafft! 🌟','Entdeckte Wörter','Tier anhören','Lustiger Ton','Fröhliches Lernen mit einem Erwachsenen 💛','Langsam','Deutlich','Normal','Sprachen (Erwachsene)'],
  it:['Parlo','Voglio imparare','Ascolta ogni parola nella tua lingua e poi nella lingua che stai imparando.','Inverti le lingue','Gioca','Tutti i giochi','Ascolta entrambe le lingue','Prossima immagine','Tocca','Ascolta e tocca. 👆','Per le famiglie','Giocate insieme. Ripetete le parole, fate gesti e usate oggetti veri. Per i più piccoli, date priorità alle interazioni senza schermi.','Giocate insieme','Restate insieme. Dite una parola, indicate un oggetto vero e fermatevi quando il bambino perde interesse.','Impostazioni vocali (adulti)','Velocità della voce','Voce da imparare','Ascolta le due voci','Le voci dipendono dal dispositivo. Installa entrambe le lingue. La voce offline richiede voci scaricate.','Automatica','Nessuna voce disponibile per: ','La voce non è disponibile su questo dispositivo.','Prova il suono','Età','Iniziate con una parola familiare e indicate un oggetto vero.','Mostrate richieste brevi e incoraggiate anche i gesti.','Mostrate frasi brevi e parlate a turno.','Ascolta • Impara • Gioca','Giochiamo insieme!','20 giochi · 8 lingue · entrambe le direzioni','Scegli un gioco','Senza pubblicità · Senza microfono · Con un adulto · Sessioni brevi e condivise','Bravissimo! 🌟','Guarda qui! 💛','Gioco','Immagine','Hai completato tutti i 20 giochi! 🌟','Parole esplorate','Ascolta l’animale','Suono divertente','Impariamo con gioia insieme a un adulto 💛','Lenta','Chiara','Normale','Lingue (adulti)'],
  ja:['はなせることば','まなびたいことば','はじめにいつものことばで、そのあとにまなびたいことばできいてみよう。','ことばをいれかえる','あそぶ','すべてのゲーム','ふたつのことばをきく','つぎのえ','タッチしてね','きいて、タッチしてね。👆','保護者の方へ','お子さまと一緒に遊び、言葉を繰り返し、身ぶりや実物を使ってください。小さなお子さまには画面を使わない交流を優先してください。','いっしょにあそぼう','そばで言葉を一つ伝え、実物を指さしましょう。お子さまが興味を失ったら終わりにしてください。','音声設定（保護者用）','はなすはやさ','まなぶことばのこえ','ふたつのこえをきく','音声は端末によって異なります。両方の言語の音声をインストールしてください。オフラインではダウンロード済み音声が必要です。','じどう','このことばのこえがありません：','この端末では音声を利用できません。','おとをためす','年齢','身近な言葉を一つ伝え、実物を指さしましょう。','短いお願いの言葉を伝え、身ぶりも喜んで受け止めましょう。','短い言葉の組み合わせを伝え、交互にやりとりしましょう。','きく • まなぶ • あそぶ','いっしょにあそぼう！','20ゲーム · 8言語 · どちらの方向でも','ゲームをえらぼう','広告なし · マイクなし · 大人と一緒に · 短い時間で遊びましょう','よくできたね！🌟','ここをみてね！💛','ゲーム','え','20のゲーム、ぜんぶできたね！🌟','あそんだことば','どうぶつのこえ','たのしいおと','おとなといっしょに、たのしくまなぼう 💛','ゆっくり','はっきり','ふつう','ことば（保護者用）'],
  ko:['사용하는 언어','배울 언어','익숙한 언어로 먼저 듣고, 배우는 언어로 다시 들어요.','언어 바꾸기','놀기','모든 놀이','두 언어로 듣기','다음 그림','눌러요','듣고 눌러요. 👆','보호자 안내','아이와 함께 놀아 주세요. 낱말을 반복하고 몸짓과 실제 물건을 활용해 주세요. 어린아이에게는 화면 없는 상호작용을 우선해 주세요.','함께 놀아요','곁에서 낱말 하나를 말하고 실제 물건을 가리켜 주세요. 아이가 흥미를 잃으면 멈춰 주세요.','음성 설정 (보호자용)','말하기 속도','배울 언어의 목소리','두 목소리 듣기','음성은 기기에 따라 달라요. 두 언어의 음성을 설치해 주세요. 오프라인에서는 다운로드한 음성이 필요해요.','자동','사용 가능한 음성이 없어요: ','이 기기에서는 음성을 사용할 수 없어요.','소리 확인','나이','익숙한 낱말 하나로 시작하고 실제 물건을 가리켜 주세요.','짧은 부탁을 말해 주고 몸짓도 칭찬해 주세요.','짧은 말을 들려주고 번갈아 이야기해 주세요.','듣기 • 배우기 • 놀기','함께 놀아요!','놀이 20개 · 언어 8개 · 양방향 학습','놀이를 골라요','광고 없음 · 마이크 없음 · 어른과 함께 · 짧게 함께 놀아요','잘했어요! 🌟','여기를 봐요! 💛','놀이','그림','놀이 20개를 모두 마쳤어요! 🌟','배운 낱말','동물 소리 듣기','재미있는 소리','어른과 함께 즐겁게 배워요 💛','느리게','또렷하게','보통','언어 (보호자용)']
};
const UI=Object.fromEntries(Object.entries(UI_ROWS).map(([code,row])=>{
  if(row.length!==UI_KEYS.length)throw new Error('Incomplete interface: '+code);
  return [code,Object.fromEntries(UI_KEYS.map((key,i)=>[key,row[i]]))];
}));
function wordIn(item,code){
  if(code==='en')return item[1];
  if(code==='es')return item[2];
  const value=EXTRA_WORDS[item[1]]?.[EXTRA_CODES.indexOf(code)];
  if(!value)throw new Error('Missing word: '+item[1]+' / '+code);
  return value;
}
function categoryIn(index,code){return code==='en'?GAMES[index][1]:code==='es'?GAMES[index][2]:CATEGORIES[code][index];}
const ANIMAL_SOUNDS={
  Dog:['Woof, woof!','¡Guau, guau!','Ouaf, ouaf !','Au, au!','Wau, wau!','Bau, bau!','ワンワン！','멍멍!'],
  Cat:['Meow!','¡Miau!','Miaou !','Miau!','Miau!','Miao!','ニャー！','야옹!'],
  Cow:['Moo!','¡Muu!','Meuh !','Muu!','Muh!','Muu!','モー！','음메!'],
  Frog:['Ribbit!','¡Croac!','Coâ !','Coax!','Quak!','Cra cra!','ケロケロ！','개굴개굴!'],
  Chick:['Peep, peep!','¡Pío, pío!','Piou, piou !','Piu, piu!','Piep, piep!','Pio, pio!','ピヨピヨ！','삐약삐약!'],
  Kitten:['Meow!','¡Miau!','Miaou !','Miau!','Miau!','Miao!','ニャー！','야옹!'],
  Lamb:['Baa!','¡Bee!','Bêê !','Béé!','Mäh!','Bee!','メー！','매애!'],
  Duck:['Quack!','¡Cuac!','Coin, coin !','Quá, quá!','Quak!','Qua qua!','ガーガー！','꽥꽥!']
};
