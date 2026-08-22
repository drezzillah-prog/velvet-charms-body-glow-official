(()=>{
  const ro={
    'Home':'Acasă',
    'Catalogue':'Catalog',
    'About':'Despre noi',
    'FAQ':'Întrebări frecvente',
    'Contact':'Contact',
    'Velvet Universe':'Universul Velvet',
    'Art & Gifts':'Artă & Cadouri',
    'Care that becomes ritual. Objects that remain.':'Grijă care devine ritual. Obiecte care rămân.',
    'The Velvet Universe — Body Glow':'Universul Velvet — Body Glow',
    'Body Glow brings scent, texture and handmade care together in small rituals designed to make everyday moments feel more personal. The experience can continue beyond the product itself through reusable vessels, refills and thoughtful details chosen around you.':'Body Glow aduce împreună parfumul, textura și îngrijirea artizanală în ritualuri mici, gândite să facă momentele de zi cu zi mai personale. Experiența poate continua dincolo de produs prin recipiente reutilizabile, refill-uri și detalii alese în jurul preferințelor tale.',
    'Explore the collection':'Descoperă colecția',
    'Ritual & senses':'Ritual și simțuri',
    'Care designed around the moment':'Îngrijire creată în jurul momentului',
    'Scent with a story':'Parfum cu poveste',
    'Fragrance can set a mood, evoke a place or turn a familiar routine into something you look forward to.':'Parfumul poate crea o stare, poate evoca un loc sau poate transforma o rutină familiară într-un moment pe care îl aștepți cu plăcere.',
    'A ritual that feels yours':'Un ritual care se simte al tău',
    'Selected products can be paired with scent choices, ritual cards, messages and other personal details.':'Anumite produse pot fi completate cu alegeri de parfum, carduri ritual, mesaje și alte detalii personale.',
    'Beauty beyond first use':'Frumusețe dincolo de prima utilizare',
    'Reusable vessels and refill options help selected creations remain useful long after the first product is finished.':'Recipientele reutilizabile și opțiunile de refill ajută anumite creații să rămână utile mult timp după terminarea primului produs.',
    'Available now':'Disponibil acum',
    'Second Life':'Second Life',
    'Beautiful enough to keep':'Frumos suficient încât să merite păstrat',
    'Selected Velvet vessels are designed to stay with you: refill them where the collection allows, or give them a second purpose at home.':'Anumite recipiente Velvet sunt gândite să rămână cu tine: le poți reumple acolo unde colecția permite sau le poți oferi un al doilea rol acasă.',
    'Second Life Collection':'Colecția Second Life',
    'Selected ceramic, glass, metal, wood, concrete and coconut vessels can become a cup, planter, candle holder, jewellery pot, brush cup or another useful little object once the original product is finished.':'Anumite recipiente din ceramică, sticlă, metal, lemn, beton sau cocos pot deveni cană, ghiveci, suport pentru lumânare, recipient pentru bijuterii, suport pentru pensule sau un alt obiect util după terminarea produsului inițial.',
    'Refill Collection':'Colecția Refill',
    'Available refill choices let you keep a compatible vessel you already love while replacing only the product inside.':'Opțiunile de refill disponibile îți permit să păstrezi un recipient compatibil pe care îl îndrăgești și să înlocuiești doar produsul din interior.',
    'Hidden Messages':'Mesaje ascunse',
    'A gentle phrase can be hidden within selected vessels, leaving one final detail to discover as the ritual comes to an end.':'Un gând cald poate fi ascuns în anumite recipiente, lăsând un ultim detaliu de descoperit la finalul ritualului.',
    'Choose Your Vessel':'Alege-ți recipientul',
    'Where available, you can choose among compatible vessel preferences alongside the scent and other product options.':'Acolo unde opțiunea este disponibilă, poți alege dintre recipiente compatibile, împreună cu parfumul și celelalte variante ale produsului.',
    'Scent becomes atmosphere':'Parfumul devine atmosferă',
    'Velvet Stories & Rituals':'Povești și ritualuri Velvet',
    'Velvet scent stories turn fragrance into a mood or memory — from the warmth of Midnight Library to the freshness of Secret Garden, Sunday Morning or First Snow. Selected orders can also include a ritual card to shape a quiet morning, evening, spa, travel or self-care moment.':'Poveștile olfactive Velvet transformă parfumul într-o stare sau o amintire — de la căldura Midnight Library la prospețimea Secret Garden, Sunday Morning sau First Snow. Anumite comenzi pot include și un card ritual pentru un moment liniștit de dimineață, seară, spa, călătorie sau grijă de sine.',
    'Morning Ritual':'Ritual de dimineață',
    'Night Ritual':'Ritual de seară',
    'Spa Ritual':'Ritual spa',
    'Travel Ritual':'Ritual de călătorie',
    'Self-Love Ritual':'Ritual de grijă de sine',
    'Make it yours':'Fă-l al tău',
    'Collect, combine and personalize':'Colecționează, combină și personalizează',
    'The Velvet experience can continue across orders through personal choices and collectible details already built into the catalogue.':'Experiența Velvet poate continua de la o comandă la alta prin alegeri personale și detalii de colecție deja integrate în catalog.',
    'Velvet Passport':'Pașaportul Velvet',
    'Your completed Velvet orders can build a personal record across the categories and rituals you explore.':'Comenzile Velvet finalizate pot construi un parcurs personal prin categoriile și ritualurile pe care le descoperi.',
    'Collectible Charms':'Charmuri de colecție',
    'Moon, star, butterfly, key, flower, heart and other available symbols can accompany selected orders as small collectible details.':'Luna, steaua, fluturele, cheia, floarea, inima și alte simboluri disponibile pot însoți anumite comenzi ca mici detalii de colecționat.',
    'Velvet Box':'Cutia Velvet',
    'Build a box from creations already available in the catalogue and choose the compatible scent, ritual and presentation details for the products inside.':'Construiește o cutie din creațiile deja disponibile în catalog și alege parfumul compatibil, ritualul și detaliile de prezentare pentru produsele din interior.',
    'Made for your everyday rituals':'Creat pentru ritualurile tale de zi cu zi',
    'A little care, made more personal.':'Puțină grijă, făcută mai personală.',
    'Choose the scent, vessel and details that suit the moment, then let each creation become part of a routine you genuinely enjoy returning to.':'Alege parfumul, recipientul și detaliile potrivite momentului, apoi lasă fiecare creație să devină parte dintr-o rutină la care revii cu plăcere.',
    'Create your Velvet ritual':'Creează-ți ritualul Velvet'
  };

  const originals=new WeakMap();
  function translate(language){
    document.querySelectorAll('body *:not(script):not(style)').forEach(el=>{
      for(const node of el.childNodes){
        if(node.nodeType!==3||!node.nodeValue.trim())continue;
        if(!originals.has(node))originals.set(node,node.nodeValue);
        const original=originals.get(node);
        const clean=original.trim();
        node.nodeValue=original.replace(clean,language==='ro'?(ro[clean]||clean):clean);
      }
    });
    document.title=language==='ro'?'Universul Velvet — Velvet Charms':'Velvet Universe — Velvet Charms';
  }

  document.addEventListener('velvet:language-change',e=>translate(e.detail.language));
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>translate(document.documentElement.lang),350));
})();
