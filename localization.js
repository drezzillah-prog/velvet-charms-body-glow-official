/* localization.js — curated English/Romanian presentation */
(function () {
  "use strict";

  const LANGUAGE_KEY = "velvet_language";
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  let currentLanguage = "en";
  let observer;
  const originalTitle = document.title;

  const ro = {
    "Home":"Acasă","Catalogue":"Catalog","About":"Despre noi","Contact":"Contact","Visit Art & Gifts":"Vizitează Art & Gifts",
    "Art & Gifts":"Artă & Cadouri","Browse the Catalogue":"Descoperă catalogul",
    "Ritual beauty, soft radiance, handcrafted self-care.":"Frumusețe ritualică, strălucire delicată și îngrijire creată manual.",
    "Created around you":"Creat în jurul tău","Why Choose Velvet Charms?":"De ce să alegi Velvet Charms?",
    "One-of-a-kind creations shaped around your story, preferences or reference photos":"Creații unicat, construite în jurul poveștii, preferințelor sau fotografiilor tale",
    "A collective of 14 artists bringing together skincare, candles, textiles and meaningful handmade art":"Un colectiv de 14 artiști care reunește îngrijirea corporală, lumânările, arta textilă și creațiile lucrate manual cu semnificație",
    "Thoughtful gifts and keepsakes made especially for the person receiving them":"Cadouri și amintiri atent concepute, create special pentru persoana care le primește",
    "Personal guidance from your first idea to the finished creation — never a mass-produced experience":"Îndrumare personală de la prima idee până la creația finală — niciodată o experiență de serie",
    "Simple & secure":"Simplu și sigur","Payments & Ordering":"Plată și comandă",
    "Every creation is handmade to order and carefully scheduled for production. Checkout is securely processed by":"Fiecare creație este realizată manual la comandă și programată cu grijă pentru producție. Plata este procesată în siguranță prin",
    "using either your":"folosind fie","PayPal account or an eligible debit or credit card — no PayPal account is required.":"contul PayPal, fie un card de debit sau de credit eligibil — nu este necesar un cont PayPal.",
    "The catalogue price remains the product price. Production scheduling and any preferred delivery date will be confirmed with you before your creation begins. Standard delivery is complimentary within Romania on orders of $100 or more; shipping is added to smaller orders and calculated separately for international destinations.":"Prețul afișat în catalog rămâne prețul produsului. Programarea producției și orice dată preferată vor fi confirmate înainte de începerea creației. Costul livrării se calculează separat, în funcție de destinație, dimensiunea și greutatea coletului.",
    "Fourteen artists, one creative home":"Paisprezece artiști, un singur atelier creativ","About Velvet Charms":"Despre Velvet Charms",
    "Velvet Charms is a collective of":"Velvet Charms este un colectiv format din","14 artists":"14 artiști",
    "who work together across different crafts, combining individual skills, imagination and attention to detail in one thoughtful creative studio.":"care lucrează împreună în discipline diferite, reunind talentul individual, imaginația și atenția pentru detalii într-un atelier creativ atent construit.",
    "Our collections bring together ritual candles, artisanal soaps, body care, perfumes, knitted and felted creations, decorative art and personalized commissions. This shared range of skills allows us to create more than a product: we can shape meaningful pieces around a person, a memory, an occasion or an idea.":"Colecțiile noastre reunesc lumânări ritualice, săpunuri artizanale, îngrijire corporală, parfumuri, creații tricotate și împâslite, artă decorativă și comenzi personalizate. Diversitatea acestor meșteșuguri ne permite să creăm mai mult decât un produs: dăm formă unor piese cu semnificație, inspirate de o persoană, o amintire, o ocazie sau o idee.",
    "Meet the collective":"Cunoaște colectivul","Fourteen Makers, Many Creative Worlds":"Paisprezece creatori, numeroase universuri artistice",
    "Our studio is shaped by fourteen individual perspectives and a shared commitment to thoughtful, high-quality work. Each portrait captures one moment in the studio, while the specialties below reflect the wider creative practice each artist brings to Velvet Charms. Together, we combine materials, techniques and ideas across every collection.":"Atelierul nostru prinde contur prin paisprezece perspective individuale și un angajament comun față de lucrul atent și calitatea autentică. Fiecare portret surprinde un moment din atelier, iar specializările prezentate reflectă universul creativ pe care fiecare artist îl aduce la Velvet Charms. Împreună, îmbinăm materiale, tehnici și idei în fiecare colecție.",
    "Fine Art & Custom Painting":"Artă plastică și pictură la comandă","Candle Making & Wax Craft":"Lumânări și artă în ceară",
    "Needle-Felted Animals & Keepsakes":"Animale împâslite și obiecte-amintire","Botanical Skincare & Body Care":"Îngrijire botanică pentru ten și corp",
    "Knitted & Braided Textile Art":"Artă textilă tricotată și împletită","Perfumery & Scent Design":"Parfumerie și creație olfactivă",
    "Bespoke Gifting & Creative Styling":"Cadouri la comandă și styling creativ","Spiritual & Sculptural Candles":"Lumânări spirituale și sculpturale",
    "Artisan Soapmaking & Botanical Forms":"Săpun artizanal și forme botanice","Knitwear & Winter Accessories":"Tricotaje și accesorii de iarnă",
    "Resin Art & Botanical Décor":"Artă în rășină și decor botanic","Clay Sculpture & Figurative Art":"Sculptură în lut și artă figurativă",
    "Custom Petwear & Textile Finishing":"Hăinuțe pentru animale și finisaje textile","Pet Portraits & Miniature Sculpture":"Portrete de animale și sculptură în miniatură",
    "Artistic portraits representing the people, specialist crafts and creative spirit of our fourteen-person collective.":"Portrete artistice care reprezintă oamenii, meșteșugurile și spiritul creativ al colectivului nostru de paisprezece artiști.",
    "Made with purpose":"Creat cu rost","Created around your story":"Creat în jurul poveștii tale",
    "Every creation is made to order or produced in a small batch. We take the time to consider the materials, finishing details and character of each piece rather than treating it as something mass-produced.":"Fiecare creație este realizată la comandă sau într-o serie restrânsă. Acordăm timp materialelor, finisajelor și personalității fiecărei piese, fără a o trata vreodată ca pe un obiect produs în masă.",
    "Many pieces can be personalized through color, fragrance, form, message or reference photographs. From subtle adjustments to completely bespoke work, we guide you through the details before production begins.":"Numeroase piese pot fi personalizate prin culoare, parfum, formă, mesaj sau fotografii de referință. De la ajustări subtile până la creații realizate integral la comandă, te ghidăm în alegerea detaliilor înainte de începerea producției.",
    "Beyond the catalogue":"Dincolo de catalog","Have Something Different in Mind?":"Ai în minte ceva diferit?",
    "If the creation you are looking for is not currently displayed on our website, tell us about your idea. When it falls within the skills of our artist collective, we will carefully review the request and prepare a separate quotation, together with a realistic production timeframe, before any work begins.":"Dacă nu găsești pe site creația pe care ți-o imaginezi, povestește-ne ideea ta. Dacă se încadrează în abilitățile colectivului nostru, vom analiza atent cererea și îți vom pregăti o ofertă separată, împreună cu un termen realist de realizare, înainte de începerea lucrului.",
    "Share your idea":"Povestește-ne ideea ta","Ordering with care":"O comandă tratată cu grijă",
    "Payment reserves your place in our production schedule. Within 1–2 business days, we confirm your production window and estimated dispatch date. Intricate or fully personalized commissions receive an individual price and timeframe so that every detail is clear before the creation begins.":"Plata îți rezervă locul în programul nostru de producție. În 1–2 zile lucrătoare confirmăm intervalul de realizare și data estimată a expedierii. Pentru proiectele complexe sau complet personalizate, toate detaliile și termenul sunt clarificate înainte de începerea creației.",
    "A little clarity before we begin":"Câteva răspunsuri înainte să începem","Frequently Asked Questions":"Întrebări frecvente",
    "Everything you need to know about made-to-order creations, personalization, production and delivery.":"Tot ce trebuie să știi despre creațiile realizate la comandă, personalizare, producție și livrare.",
    "Is every Velvet Charms piece made to order?":"Fiecare creație Velvet Charms este realizată la comandă?",
    "Yes. We begin creating after your order is placed rather than keeping finished products in long-term stock. This helps body creams feel freshly prepared, allows candles to retain a rich and beautiful fragrance, and gives textiles, gifts and decorative pieces the careful finishing they deserve. Payment reserves your place in our production schedule, and within 1–2 business days we confirm your production window and estimated dispatch date.":"Da. Începem realizarea după plasarea comenzii, fără să păstrăm produsele finite mult timp în stoc. Astfel, cremele ajung proaspăt pregătite, lumânările își păstrează parfumul bogat și plăcut, iar textilele, cadourile și piesele decorative primesc finisajele atente pe care le merită. Plata îți rezervă locul în programul de producție, iar în 1–2 zile lucrătoare confirmăm intervalul de realizare și data estimată a expedierii.",
    "When does my production time begin?":"Când începe timpul de producție?",
    "The making time shown beside a product begins from the production start date confirmed by our team, rather than automatically from the day of payment. As each artist may already be completing other orders, this allows us to offer a realistic timeframe without rushing the quality of your creation.":"Timpul de realizare afișat lângă produs începe de la data de start confirmată de echipa noastră, nu automat din ziua plății. Pentru că fiecare artist poate avea deja alte comenzi în lucru, această regulă ne permite să oferim un termen realist fără să grăbim calitatea creației tale.",
    "What if I need my order for a special date?":"Ce fac dacă am nevoie de comandă pentru o dată specială?",
    "You can share your preferred date through the optional “Do you need it by a specific date?” field in your cart. We will always try to accommodate birthdays, celebrations and meaningful occasions; however, the date becomes confirmed only after we have reviewed the creation and our current production schedule.":"Poți indica data preferată în câmpul opțional „Ai nevoie de comandă până la o anumită dată?” din coș. Vom încerca întotdeauna să ținem cont de aniversări, sărbători și momente importante; data devine însă confirmată numai după ce analizăm creația și programul actual de producție.",
    "Can my chosen piece be personalized?":"Pot personaliza produsul ales?",
    "Many creations can be made more personal. Depending on the item, you may be able to select fragrance, scent intensity, color or form, leave special instructions, and attach private reference photographs. The available choices are shown under Customize on each product.":"Multe creații pot deveni cu adevărat personale. În funcție de produs, poți alege aroma, intensitatea parfumului, culoarea sau forma, poți lăsa instrucțiuni speciale și atașa în privat fotografii de referință. Opțiunile disponibile apar la butonul „Personalizează” al fiecărui produs.",
    "Is the catalogue price the price I pay?":"Prețul din catalog este prețul pe care îl plătesc?",
    "Yes. The displayed catalogue price covers the selected product and its listed customization choices. Delivery is handled separately whenever a shipping charge applies, based on the destination and parcel details.":"Da. Prețul afișat acoperă produsul ales și opțiunile de personalizare listate. Atunci când se aplică, livrarea este calculată separat, în funcție de destinație și caracteristicile coletului.",
    "Do you deliver worldwide?":"Livrați internațional?",
    "Yes, Velvet Charms creations can be sent internationally. Because every parcel may differ in destination, size and weight, delivery is calculated according to the finished order rather than using one inflated worldwide fee. Smaller orders below the applicable complimentary-delivery threshold will include a shipping charge, and we will confirm the appropriate delivery option, cost and estimated transit time clearly with you.":"Da, creațiile Velvet Charms pot fi expediate internațional. Pentru că fiecare colet diferă ca destinație, dimensiune și greutate, livrarea se calculează după comanda finală, nu printr-o taxă globală artificial mărită. Îți vom confirma clar opțiunea potrivită, costul exact și timpul estimat de tranzit.",
    "When should I expect my order to arrive?":"Când ar trebui să ajungă comanda mea?",
    "Your complete timeframe has two parts: the confirmed production period and the delivery journey. Once your creation is finished, carefully packed and dispatched, transit time will depend on its destination and the selected carrier. We will provide the estimated dispatch date first and the relevant delivery estimate separately.":"Termenul complet are două componente: perioada de producție confirmată și transportul. După ce creația este finalizată, ambalată cu grijă și expediată, durata transportului depinde de destinație și de curierul ales. Îți comunicăm mai întâi data estimată a expedierii, apoi separat estimarea livrării.",
    "How can I pay for my order?":"Cum pot plăti comanda?",
    "Payments are securely processed through PayPal. You may check out with your PayPal account or, whenever PayPal makes the option available in your region, use an eligible debit or credit card without opening an account.":"Plățile sunt procesate în siguranță prin PayPal. Poți folosi contul PayPal sau, atunci când opțiunea este disponibilă în regiunea ta, un card de debit ori de credit eligibil, fără să deschizi un cont.",
    "How are my reference photographs treated?":"Cum sunt protejate fotografiile mele de referință?",
    "Reference photographs submitted through the customization form are stored privately and used only to understand and create your requested piece. They are not displayed publicly as part of the catalogue.":"Fotografiile trimise prin formularul de personalizare sunt păstrate în privat și folosite numai pentru înțelegerea și realizarea creației solicitate. Ele nu sunt afișate public în catalog.",
    "Can I request something that is not shown in the catalogue?":"Pot solicita ceva ce nu apare în catalog?",
    "Absolutely. If you have a different creation in mind, share your idea through our Contact page. When the request falls within the skills of our artist collective, we will review it and provide a separate quotation and realistic production timeframe before any work begins. Catalogue products themselves remain available at their displayed prices.":"Desigur. Dacă ai în minte o creație diferită, trimite-ne ideea prin pagina Contact. Dacă solicitarea se încadrează în abilitățile colectivului nostru, o analizăm și îți oferim separat un preț și un termen realist înainte de începerea lucrului. Produsele din catalog rămân disponibile la prețurile afișate.",
    "Can I speak with you before placing an order?":"Pot discuta cu voi înainte de a comanda?",
    "Of course. Visit our Contact page and tell us about your idea, the person you are shopping for or any detail you would like clarified. We usually respond within 1–2 business days and will be happy to guide you.":"Bineînțeles. Scrie-ne prin pagina Contact despre ideea ta, persoana pentru care alegi cadoul sau orice detaliu pe care dorești să îl clarifici. Răspundem, de regulă, în 1–2 zile lucrătoare și te ghidăm cu drag.",
    "We would love to hear from you":"Ne-ar face plăcere să te auzim","Let’s Create Something Meaningful":"Să creăm împreună ceva cu semnificație",
    "Tell us what you have in mind, whether you are asking about an existing piece, planning a personalized gift or beginning a completely bespoke creation.":"Povestește-ne ce ai în minte — fie că întrebi despre o piesă existentă, pregătești un cadou personalizat sau dorești o creație realizată integral la comandă.",
    "Your name":"Numele tău","Email":"E-mail","(optional)":"(opțional)","Your message":"Mesajul tău",
    "Reference file":"Fișier de referință","(optional — image or PDF)":"(opțional — imagine sau PDF)",
    "Send your message":"Trimite mesajul","We usually reply within 1–2 business days.":"Răspundem, de regulă, în 1–2 zile lucrătoare.",
    "Body Glow Collection":"Colecția Body Glow","Order as shown — or personalize your ritual.":"Comandă produsul așa cum este prezentat sau personalizează-ți ritualul.",
    "Made Especially for You":"Creat special pentru tine",
    "Every Velvet Charms creation is individually handmade after your order is placed. Your payment reserves a place in our production schedule, and within 1–2 business days, you will receive confirmation of your production window and estimated dispatch date.":"Fiecare creație Velvet Charms este realizată manual, individual, după plasarea comenzii. Plata îți rezervă locul în programul nostru de producție, iar în 1–2 zile lucrătoare vei primi confirmarea intervalului de realizare și a datei estimate pentru expediere.",
    "The approximate making time shown for each item begins from the confirmed production start date rather than the payment date. More intricate, fully personalized or photo-inspired creations will receive a carefully assessed individual timeframe before production begins.":"Timpul aproximativ afișat pentru fiecare produs începe din data de start a producției confirmată, nu din ziua plății. Pentru creațiile complexe, complet personalizate sau inspirate din fotografii, termenul va fi evaluat individual și comunicat înainte de începerea lucrului.",
    "Delivery time is calculated separately and begins once your finished creation is ready to be dispatched.":"Durata livrării se calculează separat și începe după ce creația finalizată este pregătită pentru expediere.",
    "Candles":"Lumânări","Spiritual Candle":"Lumânări spirituale","Divination Candles":"Lumânări pentru divinație",
    "Classic & Decorative Candles":"Lumânări clasice și decorative","Jelly Candles":"Lumânări gel","Sand Candles":"Lumânări cu textură de nisip",
    "Body Care":"Îngrijire corporală","Creams":"Creme","Body Butter":"Unt de corp","Hand & Foot Cream":"Cremă pentru mâini și picioare",
    "Soaps":"Săpunuri","Perfumes":"Parfumuri","Knitted & Braided Wool Creations":"Creații din lână tricotată și împletită",
    "Hand-Knitted Beanies":"Căciuli tricotate manual","Hand-Knitted Scarves":"Fulare tricotate manual","Hand-Knitted Mittens":"Mănuși tricotate manual",
    "Matching Winter Set":"Set de iarnă asortat","Braided Blankets":"Pături împletite","Felted Animals":"Animale împâslite","Pet Wear":"Hăinuțe pentru animale","Bundles":"Seturi cadou",
    "Approximate making time:":"Timp aproximativ de realizare:","3–5 business days":"3–5 zile lucrătoare","5–7 business days":"5–7 zile lucrătoare",
    "5–10 business days":"5–10 zile lucrătoare","7–14 business days":"7–14 zile lucrătoare","10–20 business days":"10–20 de zile lucrătoare",
    "Confirmed with your production slot":"Se confirmă odată cu programarea producției","Add to cart":"Adaugă în coș","Customize":"Personalizează",
    "Your cart":"Coșul tău","Subtotal":"Subtotal","Total":"Total","Shipping time is added separately after your creation is ready.":"Durata transportului se adaugă separat după finalizarea creației.",
    "Payment reserves your place in our production schedule. Your production window and estimated dispatch date will be confirmed within 1–2 business days.":"Plata îți rezervă locul în programul nostru de producție. Intervalul de realizare și data estimată a expedierii vor fi confirmate în 1–2 zile lucrătoare.",
    "Do you need it by a specific date?":"Ai nevoie de comandă până la o anumită dată?","Tell us your preferred date. It is only confirmed after we review the creation and our current production schedule.":"Spune-ne data preferată. Aceasta va fi confirmată numai după ce analizăm creația și programul actual de producție.",
    "Checkout securely with PayPal":"Plătește în siguranță prin PayPal","Your cart is empty.":"Coșul tău este gol.","Remove":"Elimină","Edit customization":"Modifică personalizarea",
    "Customize product":"Personalizează produsul","Choose your preferences, then add this personalized item to your cart.":"Alege preferințele, apoi adaugă produsul personalizat în coș.",
    "1. Options":"1. Opțiuni","2. Photos":"2. Fotografii","3. Review":"3. Verificare","Special instructions":"Instrucțiuni speciale",
    "Continue to photos":"Continuă la fotografii","Reference photos (up to 5)":"Fotografii de referință (maximum 5)",
    "Preview, remove or reorder photos before upload.":"Previzualizează, elimină sau reordonează fotografiile înainte de încărcare.",
    "Back":"Înapoi","Review customization":"Verifică personalizarea","Add customized item to cart":"Adaugă produsul personalizat în coș",
    "Scent intensity":"Intensitatea parfumului","scent":"aromă","aroma":"aromă","Choose an option":"Alege o opțiune",
    "Soft":"Delicat","Medium":"Mediu","Strong":"Intens","Unscented":"Fără parfum",
    "Orange":"Portocală","Lemon":"Lămâie","Lavender":"Lavandă","Vanilla":"Vanilie","Jasmine":"Iasomie","Lemongrass":"Lemongrass",
    "Coconut":"Cocos","Cinnamon":"Scorțișoară","Pine":"Pin","Sandalwood":"Lemn de santal","Coffee":"Cafea","Sweet Almond":"Migdale dulci",
    "Rose":"Trandafir","Citrus":"Citrice","Oatmeal":"Ovăz","Apple":"Măr","Peach":"Piersică","Sage":"Salvie","Myrrh":"Smirnă","Frankincense":"Tămâie",
    "Vanilla Orchid":"Orhidee și vanilie","Amber Wood":"Lemn ambrat","Sandalwood Rose":"Trandafir și lemn de santal","White Musk":"Mosc alb",
    "Citrus Bloom":"Flori de citrice","Lavender Mist":"Văl de lavandă","Cedar & Amber":"Cedru și ambră","Floral Spice":"Flori și condimente",
    "Custom Spiritual Candle — Full-body 3D Relief (200ml)":"Lumânare spirituală personalizată — relief 3D integral (200 ml)",
    "Custom Spiritual Candle — Half-relief Sculpted (200ml)":"Lumânare spirituală personalizată — semirelief sculptat (200 ml)",
    "Custom Spiritual Candle — Full-body 3D Sculpture (400ml)":"Lumânare spirituală personalizată — sculptură 3D integrală (400 ml)",
    "Custom Spiritual Candle — Half-relief Sculpted (400ml)":"Lumânare spirituală personalizată — semirelief sculptat (400 ml)",
    "Divination Candle — Painted Symbols (200ml)":"Lumânare pentru divinație — simboluri pictate (200 ml)",
    "Divination Candle — Painted Symbols (400ml)":"Lumânare pentru divinație — simboluri pictate (400 ml)",
    "Wax Candle — Small (150ml)":"Lumânare din ceară — mică (150 ml)","Wax Candle — Medium (250ml)":"Lumânare din ceară — medie (250 ml)","Wax Candle — Large (400ml)":"Lumânare din ceară — mare (400 ml)",
    "Jelly Candle — Medium (200ml)":"Lumânare gel — medie (200 ml)","Jelly Candle — Large (350ml)":"Lumânare gel — mare (350 ml)",
    "Sand Candle — Small (150ml)":"Lumânare cu textură de nisip — mică (150 ml)","Sand Candle — Medium (250ml)":"Lumânare cu textură de nisip — medie (250 ml)","Sand Candle — Large (400ml)":"Lumânare cu textură de nisip — mare (400 ml)",
    "Natural Face Cream (50ml)":"Cremă naturală pentru ten (50 ml)","Body Butter (100ml)":"Unt de corp (100 ml)","Hand & Foot Cream (50ml)":"Cremă pentru mâini și picioare (50 ml)",
    "Exfoliating Soap (100g)":"Săpun exfoliant (100 g)","Natural Herbal Soap (100g)":"Săpun natural cu plante (100 g)",
    "Flower-Shaped Scented Soap (100g)":"Săpun parfumat în formă de floare (100 g)","Fruit-Shaped Scented Soap (100g)":"Săpun parfumat în formă de fruct (100 g)",
    "Gift Herbal / Exfoliating Soap Set (3 pcs)":"Set cadou cu săpunuri naturale și exfoliante (3 buc.)","Gift Fruit / Flower Soap Set (3 pcs)":"Set cadou cu săpunuri în forme de fructe și flori (3 buc.)","Gift Soap Set (3 pcs)":"Set cadou cu săpunuri (3 buc.)",
    "Solid Perfume (50ml)":"Parfum solid (50 ml)","Perfume Roll-On (10ml)":"Parfum roll-on (10 ml)",
    "Hand-Knitted Beanie — Small":"Căciulă tricotată manual — mică","Hand-Knitted Beanie — Medium":"Căciulă tricotată manual — medie","Hand-Knitted Beanie — Large":"Căciulă tricotată manual — mare","Hand-Knitted Beanie — Extra Large":"Căciulă tricotată manual — foarte mare",
    "Hand-Knitted Scarf — One Size":"Fular tricotat manual — mărime universală","Hand-Knitted Mittens — Small":"Mănuși tricotate manual — mici","Hand-Knitted Mittens — Medium":"Mănuși tricotate manual — medii","Hand-Knitted Mittens — Large":"Mănuși tricotate manual — mari","Hand-Knitted Mittens — Extra Large":"Mănuși tricotate manual — foarte mari",
    "Matching Winter Set — Beanie + Scarf + Mittens":"Set de iarnă asortat — căciulă, fular și mănuși",
    "Braided Blanket — Small (80×100 cm)":"Pătură împletită — mică (80 × 100 cm)","Braided Blanket — Medium (120×150 cm)":"Pătură împletită — medie (120 × 150 cm)","Braided Blanket — Large (150×200 cm)":"Pătură împletită — mare (150 × 200 cm)",
    "Mini Felted Animal — Small (~5 cm)":"Miniatură de animal împâslit — mică (aprox. 5 cm)","Felted Animal — Medium (~10–12 cm)":"Animal împâslit — mediu (aprox. 10–12 cm)","Felted Animal Family Set (4 pcs)":"Familie de animale împâslite (4 buc.)",
    "Pet Beanie / Shirt / Scarf":"Căciulă, hăinuță sau fular pentru animale","Relax & Restore Set":"Set Relax & Restore","Cozy Winter Set":"Set Cozy Winter","Home Harmony Box":"Cutia Home Harmony",
    "Full-body sculpted spiritual candle with optional divine symbols.":"Lumânare spirituală sculptată integral, cu simboluri divine opționale.",
    "Half-relief sculpted candle featuring deities or sacred motifs.":"Lumânare sculptată în semirelief, cu zeități sau motive sacre.",
    "Large sculpted spiritual candle with detailed 3D figure.":"Lumânare spirituală de mari dimensiuni, cu figură 3D atent detaliată.",
    "Large half-relief candle with sacred sculpted designs.":"Lumânare mare în semirelief, cu motive sacre sculptate.",
    "Altar candle painted with sacred icons.":"Lumânare de altar pictată cu simboluri sacre.","Large altar candle painted with sacred symbols.":"Lumânare mare de altar, pictată cu simboluri sacre.",
    "Classic wax candle.":"Lumânare clasică din ceară.","Medium-size decorative wax candle.":"Lumânare decorativă din ceară, de dimensiune medie.","Large wax candle.":"Lumânare mare din ceară.",
    "Translucent decorative jelly candle.":"Lumânare decorativă translucidă din gel.","Large translucent jelly candle.":"Lumânare mare, translucidă, din gel.",
    "Rustic sand-texture candle.":"Lumânare rustică, cu textură de nisip.","Medium-size rustic sand candle.":"Lumânare rustică de dimensiune medie, cu textură de nisip.","Large rustic sand candle.":"Lumânare rustică mare, cu textură de nisip.",
    "Gentle moisturizing face cream.":"Cremă delicată și hidratantă pentru ten.","Deeply hydrating and rich body butter.":"Unt de corp bogat, cu hidratare intensă.","Non-greasy cream formulated for daily hydration.":"Cremă cu absorbție rapidă, formulată pentru hidratare zilnică.",
    "Exfoliating soap bar with coffee or oatmeal base.":"Săpun exfoliant cu bază de cafea sau ovăz.","Natural herbal soap with chamomile or calendula.":"Săpun natural cu plante, mușețel sau gălbenele.",
    "Hand-sculpted floral soap with essential oils.":"Săpun floral sculptat manual, cu uleiuri esențiale.","Handmade fruit-shaped soap.":"Săpun realizat manual în formă de fruct.",
    "A special selection of herbal & exfoliating soaps.":"O selecție specială de săpunuri naturale și exfoliante.","Three handcrafted scented soaps.":"Trei săpunuri parfumate, realizate manual.","A curated trio of handmade soaps.":"Un trio atent selecționat de săpunuri lucrate manual.",
    "Alcohol-free solid perfume.":"Parfum solid, fără alcool.","Essential oil roll-on perfume.":"Parfum roll-on pe bază de uleiuri esențiale.",
    "Hand-knitted warm beanie.":"Căciulă călduroasă, tricotată manual.","Most popular size.":"Cea mai apreciată mărime.","Large size for extra warmth.":"Mărime mare, pentru un plus de căldură.","Oversized cozy design.":"Design amplu și confortabil.",
    "Cozy knitted scarf.":"Fular confortabil, tricotat manual.","Classic warm mittens.":"Mănuși clasice și călduroase.","Medium-sized handcrafted mittens.":"Mănuși de mărime medie, lucrate manual.","Soft and warm.":"Moi și călduroase.","Extra-large cozy mittens.":"Mănuși foarte mari și confortabile.",
    "Warm handcrafted winter set.":"Set călduros de iarnă, lucrat manual.","Small braided throw.":"Pătură mică, împletită manual.","Medium-size braided blanket.":"Pătură împletită de dimensiune medie.","Large cozy chunky-knit blanket.":"Pătură mare și confortabilă, cu împletitură amplă.",
    "Small hand-felted wool figurine.":"Figurină mică din lână, împâslită manual.","Medium-sized felted animal.":"Animal împâslit de dimensiune medie.","Custom animal family felted set.":"Set personalizat cu o familie de animale împâslite.","Handmade warm accessories for pets.":"Accesorii călduroase pentru animale, realizate manual.",
    "Herbal soap + face cream + small wax candle.":"Săpun natural, cremă de față și lumânare mică din ceară.","Beanie + scarf + mittens + small candle bundle.":"Căciulă, fular, mănuși și o lumânare mică.","Epoxy decor + wax candle + seasonal soap.":"Decor din rășină epoxidică, lumânare din ceară și săpun de sezon.",
    "Sending…":"Se trimite…","Message sent. Thank you!":"Mesajul a fost trimis. Îți mulțumim!","Failed to send:":"Mesajul nu a putut fi trimis:","Error:":"Eroare:",
    "Open shopping cart":"Deschide coșul","Close shopping cart":"Închide coșul","Close customization":"Închide personalizarea",
    "Options":"Opțiuni","Photos":"Fotografii","Review":"Verificare","As displayed, with no extra options.":"Așa cum este prezentat, fără opțiuni suplimentare.",
    "Please confirm every detail before adding this item to your cart.":"Verifică toate detaliile înainte de a adăuga produsul în coș.",
    "Payment completed successfully. Your confirmation email is on its way!":"Plata a fost finalizată cu succes. E-mailul de confirmare este pe drum!",
    "Payment completed successfully. Thank you for your order!":"Plata a fost finalizată cu succes. Îți mulțumim pentru comandă!",
    "© Velvet Charms — Body Glow":"© Velvet Charms — Body Glow","© Velvet Charms — handmade with care":"© Velvet Charms — creat manual cu grijă","Currency rates":"Curs valutar"
  };

  const placeholders = {
    "How should we address you?":"Cum dorești să ne adresăm?",
    "you@example.com":"tu@exemplu.ro",
    "Share your idea, preferred details or any questions...":"Povestește-ne ideea, preferințele sau întrebările tale...",
    "Colors, shapes, personal message, or any other details...":"Culori, forme, mesaj personal sau orice alte detalii..."
  };

  function normalize(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function translated(value) {
    const clean = normalize(value);
    if (currentLanguage === "en") return clean;
    if (ro[clean]) return ro[clean];
    return clean
      .replace(/\s+each$/, " fiecare")
      .replace(/^Reference photo (\d+) attached$/, "Fotografia de referință $1 este atașată")
      .replace(/^(\d+) private reference photo\(s\)$/, "$1 fotografii de referință private")
      .replace(/^Edit (.+)$/, "Modifică $1")
      .replace(/^Customize (.+)$/, "Personalizează $1")
      .replace(/^Uploading photo (\d+) of (\d+):/, "Se încarcă fotografia $1 din $2:");
  }

  function translateTextNode(node) {
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const original = originalText.get(node);
    if (!normalize(original)) return;
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    node.nodeValue = leading + (currentLanguage === "ro" ? translated(original) : normalize(original)) + trailing;
  }

  function translateElementAttributes(element) {
    if (!(element instanceof Element)) return;
    if (!originalAttributes.has(element)) {
      originalAttributes.set(element, {
        placeholder: element.getAttribute("placeholder"),
        ariaLabel: element.getAttribute("aria-label"),
        title: element.getAttribute("title")
      });
    }
    const originals = originalAttributes.get(element);
    for (const [key, attribute] of [["placeholder","placeholder"],["ariaLabel","aria-label"],["title","title"]]) {
      const original = originals[key];
      if (original === null) continue;
      const value = currentLanguage === "ro"
        ? (placeholders[normalize(original)] || translated(original))
        : original;
      element.setAttribute(attribute, value);
    }
  }

  function translateTree(root) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (!(root instanceof Element) || ["SCRIPT","STYLE","NOSCRIPT"].includes(root.tagName)) return;
    translateElementAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (!["SCRIPT","STYLE","NOSCRIPT"].includes(node.parentElement?.tagName)) translateTextNode(node);
    }
    root.querySelectorAll("[placeholder],[aria-label],[title]").forEach(translateElementAttributes);
  }

  function createLanguageSelector() {
    if (document.querySelector("[data-language-switcher]")) return;
    const nav = document.querySelector(".site-header .nav");
    if (!nav) return;
    const wrapper = document.createElement("label");
    wrapper.className = "language-switcher";
    wrapper.setAttribute("data-language-switcher", "");
    wrapper.innerHTML = '<span class="sr-only">Language</span><select aria-label="Language"><option value="en">EN</option><option value="ro">RO</option></select>';
    nav.appendChild(wrapper);
    const select = wrapper.querySelector("select");
    select.value = currentLanguage;
    select.addEventListener("change", () => {
      localStorage.setItem(LANGUAGE_KEY, select.value);
      applyLanguage(select.value);
    });
  }

  function applyLanguage(language) {
    currentLanguage = language === "ro" ? "ro" : "en";
    document.documentElement.lang = currentLanguage;
    observer?.disconnect();
    translateTree(document.body);
    document.title = currentLanguage === "ro"
      ? (ro[normalize(document.title)] || document.title.replace("About", "Despre noi").replace("Contact", "Contact").replace("Catalogue", "Catalog").replace("Frequently Asked Questions", "Întrebări frecvente"))
      : originalTitle;
    const select = document.querySelector("[data-language-switcher] select");
    if (select) select.value = currentLanguage;
    observer?.observe(document.body, { childList: true, subtree: true });
    document.dispatchEvent(new CustomEvent("velvet:language-change", { detail: { language: currentLanguage } }));
  }

  async function initialize() {
    let detected = "en";
    try {
      const response = await fetch("/api/currency", { headers: { Accept: "application/json" } });
      const data = response.ok ? await response.json() : {};
      detected = data.country === "RO" ? "ro" : "en";
    } catch {}
    currentLanguage = localStorage.getItem(LANGUAGE_KEY) || detected;
    createLanguageSelector();
    observer = new MutationObserver(mutations => {
      observer.disconnect();
      for (const mutation of mutations) mutation.addedNodes.forEach(translateTree);
      observer.observe(document.body, { childList: true, subtree: true });
    });
    applyLanguage(currentLanguage);
  }

  window.VELVET_I18N = {
    t(value) { return currentLanguage === "ro" ? translated(value) : value; },
    get language() { return currentLanguage; }
  };

  document.addEventListener("DOMContentLoaded", initialize);
})();
