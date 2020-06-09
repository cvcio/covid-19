<template>
	<v-card-text>
		<template v-if="$i18n.locale === 'el'">
			<p class="body-1">
				H συγκεκριμένη διαδικτυακή εφαρμογή δημιουργήθηκε και συντηρείται από το <a href="https://www.imedd.org/el/imedd-lab/" target="_blank">iMEdD Lab</a>. Αρχικά, δημοσιεύθηκε στις 16 Μαρτίου 2020 και έκτοτε ανανεώνεται ημερησίως. Σκοπός είναι η ενημέρωση της ελληνικής δημοσιογραφικής κοινότητας και κάθε ενδιαφερόμενου για την εξάπλωση του ιού SARS-CoV-2 στην Ελλάδα και στον κόσμο, με τη χρήση ενός απλού, εύχρηστου εργαλείου.
			</p>
			<p class="body-1">
				Η εφαρμογή παρουσιάζει τη γεωγραφική κατανομή των καταγεγραμμένων επιβεβαιωμένων κρουσμάτων στη χώρα μας και παγκοσμίως, ενώ αποτυπώνει συγκεντρωτικά τα διαθέσιμα στοιχεία. Επίσης, στη σελίδα «ΣΤΑΤΙΣΤΙΚΑ», παρουσιάζει σειρά αναλύσεων υπό τη μορφή διαδραστικών γραφημάτων και χαρτών.
			</p>
			<p class="body-1">
				Τα στοιχεία για τα καταγεγραμμένα επιβεβαιωμένα κρούσματα στην Ελλάδα και τα δεδομένα που αφορούν τη γεωγραφική κατανομή των κρουσμάτων στη χώρα βασίζονται σε επίσημα στοιχεία τα οποία ανακοινώνονται ημερησίως από τον <a href="https://eody.gov.gr/" target="_blank">Εθνικό Οργανισμό Δημόσιας Υγείας (ΕΟΔΥ)</a> και από το Υπουργείο Υγείας, ενώ συμπληρώνονται με διασταυρωμένα στοιχεία που δημοσιεύονται στον ελληνικό Τύπο. Η ομάδα του iMEdD Lab συγκεντρώνει τα στοιχεία αυτά και τα διατηρεί σε σύνολα δεδομένων (datasets), τα οποία είναι διαθέσιμα στο <a href="https://github.com/iMEdD-Lab" target="_blank">σχετικό αποθετήριο</a>, στον λογαριασμό του <a href="https://github.com/iMEdD-Lab/open-data/tree/master/COVID-19" target="_blank">iMEdD Lab στο GitHub</a>.
			</p>

			<p class="body-1">
				Η πηγή των παγκόσμιων δεδομένων τα οποία αφορούν την καταγραφή της κατάστασης την ημέρα προβολής τους είναι το <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometer</a>, το περιεχόμενο του οποίου υπόκειται σε <a href="https://www.worldometers.info/disclaimer/" target="_blank">όρους χρήσης</a>. Αυτά απεικονίζονται στον παγκόσμιο χάρτη, στον πίνακα με την κατάταξη των χωρών (ανά αριθμό κρουσμάτων, αριθμό όσων έχουν αναρρώσει ή αριθμό θανάτων), στους επιμέρους χάρτες που παρουσιάζονται στη σελίδα «ΣΤΑΤΙΣΤΙΚΑ», όπως και στο γράφημα υπό τον τίτλο «Κρούσματα, Τεστ και Θάνατοι ανά χώρα». Στην εφαρμογή του iMEdD Lab, τα στοιχεία αυτά και οι ανάλογες οπτικοποιήσεις ενημερώνονται ανά τακτά χρονικά διαστήματα μέσα στην ημέρα.
			</p>
			<p class="body-1">
				Η πηγή των ιστορικών παγκόσμιων δεδομένων που αναπαρίστανται στο γράφημα υπό τον τίτλο «Η Εξέλιξη των Κρουσμάτων στον Χρόνο», στο χρονολόγιο των χαρτών (timeline) και στις υπόλοιπες οπτικοποιήσεις της σελίδας «ΣΤΑΤΙΣΤΙΚΑ» είναι το αποθετήριο του <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Johns Hopkins University στο GitHub</a>. Στο συγκεκριμένο αποθετήριο, το εν λόγω Πανεπιστήμιο διαθέτει για εκπαιδευτικούς και ερευνητικούς σκοπούς τα δεδομένα που έχουν συλλεχθεί από την ερευνητική ομάδα του. Η συγκεκριμένη βάση δεδομένων ενημερώνεται μία φορά την ημέρα. Περισσότερες πληροφορίες για την <a href="https://coronavirus.jhu.edu/map.html" target="_blank">αντίστοιχη διαδικτυακή εφαρμογή του Johns Hopkins University</a>, η οποία αρχικά δημοσιεύθηκε στις 22 Ιανουαρίου 2020, για την ανάπτυξή της και για τα δεδομένα που εκείνη χρησιμοποιεί μπορείτε να διαβάσετε <a href="https://coronavirus.jhu.edu/map-faq.html" target="_blank">εδώ</a>.
			</p>
			<p class="body-1">
				Το γράφημα υπό τον τίτλο «Μέσος Όρος Κρουσμάτων 7 Ημερών» βασίζεται σε δευτερογενείς υπολογισμούς, με βάση τα διαθέσιμα στοιχεία, και αναπαριστά τον κυλιόμενο μέσο όρο επτά ημερών, με στόχο την «εξομάλυνση» του ημερήσιου αριθμού νέων κρουσμάτων, όπως αυτός καταγράφεται και ανακοινώνεται από τις Αρχές. Συγκεκριμένα, ο κυλιόμενος μέσος όρος των κρουσμάτων υπολογίζεται και αναπαρίσταται για κάθε μέρα, λαμβάνοντας υπόψη τα δεδομένα των τελευταίων επτά ημερών κάθε φορά.
			</p>
			<p class="body-1">
				Στον παγκόσμιο χάρτη, αποτυπώνεται, για κάθε χώρα, ο συνολικός αριθμός καταγεγραμμένων κρουσμάτων και θανάτων ανά 1.000.000 πληθυσμού. Στον χάρτη της Ελλάδας, απεικονίζεται, για κάθε Νομό, ο συνολικός αριθμός καταγεγραμμένων κρουσμάτων και θανάτων ανά 100.000 πληθυσμού: αυτός ο υπολογισμός γίνεται δευτερογενώς από το iMEdD Lab, λαμβάνοντας υπόψη τους απόλυτους αριθμούς καταγεγραμμένων κρουσμάτων και θανάτων, που γίνονται γνωστοί ανά Νομό, και τα δεδομένα για τον μόνιμο πληθυσμό <a href="https://www.statistics.gr/documents/20181/1210503/Kallikratis_me_plithismous_1991_2011.xls/4b9f7484-fae7-44e2-852c-ec650dc0a5c8?version=1.0" target="_blank">βάσει της απογραφής του 2011, όπως παρέχονται από την ΕΛΣΤΑΤ</a>.
			</p>
			<p class="body-1">
				Η λεγόμενη «κανονικοποίηση των αριθμών» (δηλαδή, για παράδειγμα, η αποτύπωση του αριθμού των καταγεγραμμένων κρουσμάτων ανά 1.000.000 και ανά 100.000 πληθυσμού, στις χώρες του κόσμου και στους Νομούς της Ελλάδας αντίστοιχα) έχει επιλεγεί για δύο λόγους: αφενός, συνίσταται στην οπτικοποίηση δεδομένων σε χωροπληθή χάρτη (choropleth map), όπως είναι αυτός που χρησιμοποιεί το iMEdD Lab. Αφετέρου, με αυτόν τον τρόπο, εξετάζεται ορθότερα το ζήτημα της εξάπλωσης του ιού ανά χώρα ή ανά Νομό, επιτρέποντας τη συγκριτική έκταση του προβλήματος βάσει των κατά τόπους πληθυσμών.
			</p>
			<p class="body-1">
				Ωστόσο, όσον αφορά στη γεωγραφική κατανομή των καταγεγραμμένων κρουσμάτων, κατά την «ανάγνωση» κάθε ανάλογου χάρτη, κανείς χρειάζεται να έχει υπόψη του ότι, για παράδειγμα, όλες οι χώρες δεν είναι το ίδιο ενεργές όσον αφορά στους εργαστηριακούς ελέγχους που διεξάγουν: Υπάρχουν χώρες που επιλέγουν να κάνουν τεστ μαζικά στον πληθυσμό και, επομένως, ανακοινώνουν περισσότερα επιβεβαιωμένα κρούσματα. Άλλες χώρες κάνουν στοχευμένα τεστ σε μικρότερα μερίδια του πληθυσμού, οπότε ενδεχομένως καταγράφουν αριθμό κρουσμάτων μικρότερο του πραγματικού. Άρα, μπορεί να υπάρχουν σημαντικές διαφορές στην αποτύπωση της πραγματικής εξάπλωσης του ιού στην επικράτεια κάθε χώρας, ακόμη και μεταξύ κρατών με τον ίδιο πληθυσμό. Για τον λόγο αυτό, η κανονικοποίηση των καταγεγραμμένων κρουσμάτων με βάση τους εργαστηριακούς ελέγχους που κάθε χώρα έχει διεξαγάγει θα ήταν ακόμη πιο ενδεδειγμένη. Ωστόσο, ως στιγμής, τα σχετικά επίσημα δεδομένα δεν διατίθενται δημοσιευμένα για όλες τις χώρες.
			</p>
			<p class="body-1">
				Το ζήτημα της συσχέτισης του αριθμού των καταγεγραμμένων κρουσμάτων με τον αριθμό των τεστ, τα οποία κάθε χώρα φέρεται να έχει κάνει, προσεγγίζεται στο γράφημα υπό τον τίτλο «Κρούσματα, Τεστ και Θάνατοι ανά χώρα» και στον χάρτη με τίτλο «Κρούσματα αναλογικά με τα τεστ ανά χώρα», που παρουσιάζονται στη σελίδα «ΣΤΑΤΙΣΤΙΚΑ», με πηγή των δεδομένων το <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometer</a>. Σε κάθε περίπτωση, οι διαφορετικές πολιτικές των χωρών ως προς τα τεστ και ως προς τον τρόπο καταγραφής του αριθμού των ελέγχων μπορεί να οδηγούν σε υποεκτιμήσεις ή υπερεκτιμήσεις, κατά περίπτωση. Περισσότερα σχετικά με το ζήτημα των τεστ, μπορείτε να διαβάσετε στο <a href="https://ourworldindata.org/covid-testing" target="_blank">Our world in data</a>.
			</p>
			<p class="body-1">
				Στην ίδια σελίδα («ΣΤΑΤΙΣΤΙΚΑ»), τα γραφήματα «Εξέλιξη θανάτων μετά τους πρώτους 10» και «Εξέλιξη κρουσμάτων μετά τα πρώτα 100» ενημερώνονται μία φορά την ημέρα, διότι αντλούν στοιχεία από το <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">αποθετήριο του Johns Hopkins University στο Github</a>, το οποίο ενημερώνεται ημερησίως. Οπότε, ενδέχεται να βλέπετε αριθμό κρουσμάτων και θανάτων της προηγούμενης ημέρας.
			</p>
			<p class="body-1">
				Τα γραφήματα «Θάνατοι ανά 100 χιλιάδες πληθυσμό σε χώρες με παρόμοιο πληθυσμό με την Ελλάδα» και «Κρούσματα ανά 100 χιλιάδες πληθυσμό σε χώρες με παρόμοιο πληθυσμό με την Ελλάδα» περιλαμβάνουν χώρες με 9 ως 12 εκατομμύρια κατοίκους (<a href="https://www.worldometers.info/world-population/population-by-country/" target="_blank">Worldometer / United Nations Population Division</a>).
			</p>
			<p class="body-1">
				Μπορείτε να κοινοποιήσετε ή/και να ενσωματώσετε την παρούσα διαδικτυακή εφαρμογή του iMEdD Lab στη δική σας ιστοσελίδα, σύμφωνα με τους όρους του παρόντος, με την παράκληση αναφοράς στον δημιουργό και κατ’ εφαρμογή των όρων και περιορισμών που αναφέρονται <a href="https://creativecommons.org/licenses/by-nc/4.0/legalcode" target="_blank">εδώ</a>.
			</p>
			<p class="body-1">
				Ο κώδικας για την ενσωμάτωση του χάρτη στην ιστοσελίδα σας είναι:
			</p>
			<v-col cols="12" xs="12" class="pa-0">
				<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
					<h4 class="accent--text">&lt;iframe</h4>
					<h4 class="accent--text pl-6">src=&quot;{{'https://lab.imedd.org/covid19/'}}&quot;</h4>
					<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
					<h4 class="accent--text pl-6">name=&quot;imedd-covid&quot;</h4>
					<h4 class="accent--text pl-6">scrolling=&quot;no&quot;</h4>
					<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
					<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">height=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
					<h4 class="accent--text">&lt;/iframe&gt;</h4>
				</div>
			</v-col>
			<p class="body-1">
				Ο κώδικας για την ενσωμάτωση της σελίδας «ΣΤΑΤΙΣΤΙΚΑ» στην ιστοσελίδα σας είναι:
			</p>
			<v-col cols="12" xs="12" class="pa-0">
				<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
					<h4 class="accent--text">&lt;iframe</h4>
					<h4 class="accent--text pl-6">src=&quot;{{'https://lab.imedd.org/covid19/stats/'}}&quot;</h4>
					<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
					<h4 class="accent--text pl-6">name=&quot;imedd-covid-stats&quot;</h4>
					<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
					<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">height=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
					<h4 class="accent--text">&lt;/iframe&gt;</h4>
				</div>
			</v-col>
			<p class="body-1">
				Η εφαρμογή του iMEdD Lab δεν περιέχει δεδομένα σχετικά με την ηλικία, το φύλο, την εθνικότητα των ασθενών, ούτε κανενός είδους άλλο δημογραφικό ή προσωπικό δεδομένο.
			</p>
			<p class="body-1">
				Στη λίστα των χωρών, η καταχώρηση «Diamond Princess» αφορά στα κρούσματα του κρουαζιερόπλοιου Diamond Princess, το οποίο έχει αγκυροβολήσει στις ακτές της Ιαπωνίας. Περισσότερες πληροφορίες μπορούν να λαμβάνονται και <a href="https://www.princess.com/news/notices_and_advisories/notices/diamond-princess-update.html" target="_blank">εδώ</a>. Οι χώρες που καταγράφονται στη λίστα δεν αποτυπώνονται πάντα με ακρίβεια στον χάρτη. Για παράδειγμα, η Μαρτινίκα, που βρίσκεται στην Καραϊβική, επειδή αποτελεί υπερπόντια περιοχή της Γαλλίας, στον χάρτη εμφανίζεται ως Γαλλία. Σε άλλες περιπτώσεις, επειδή η ονομασία της χώρας στο Worldometer δεν είναι ακριβώς ίδια με την ονομασία της χώρας στον χάρτη, ενδεχομένως δεν εμφανίζεται στον χάρτη ως χώρα με ενεργά κρούσματα. Προσπαθούμε να διορθώσουμε τυχόν τέτοια λάθη κάθε φορά που υποπίπτουν στην αντίληψή μας.
			</p>
			<p class="body-1">
				Ένα από τα εργαλεία που έχουν χρησιμοποιηθεί για συλλογή και επεξεργασία των δεδομένων από το Worldometer είναι το  <a href="https://workbenchdata.com/gr/" target="_blank">Workbench</a>, μία εφαρμογή που διευκολύνει δημοσιογράφους να κάνουν συλλογή και ανάλυση δεδομένων, χωρίς να χρειάζεται να γνωρίζουν κάποια γλώσσα προγραμματισμού. Η ανάπτυξη του Workbench στα ελληνικά, έγινε στo πλαίσιο του <a href="https://www.imedd.org/el/inhouse/workbench/" target="_blank">πρώτου κύκλου Ιncubator του iMEdD</a>.
			</p>
			<p class="body-1">
				O χάρτης με την εξάπλωση της νόσου COVID-19 στην Ελλάδα και στον κόσμο είναι ευγενική χορηγία του <a href="https://www.mapbox.com/community/" target="_blank">Mapbox Community team</a>.
			</p>
			<p class="body-1">
				Επίσης, για τους χάρτες με τίτλο «Κρούσματα αναλογικά με τα τεστ ανά χώρα» και «Όσοι ανάρρωσαν ανά χώρα» έχει χρησιμοποιηθεί το αρχείο <a href="https://github.com/python-visualization/folium/blob/master/examples/data/world-countries.json" target="_blank">json</a>, που διατίθεται από το <a href="https://github.com/python-visualization/folium/blob/master/examples/data/world-countries.json" target="_blank">python-visualtization/folium</a> στο GitHub, με <a href="https://github.com/python-visualization/folium/blob/master/LICENSE.txt" target="_blank">Copyright © 2013, Rob Story και άδεια χρήσης MIT License</a>.
			</p>
			<p class="body-1">
				H παρούσα ιστοσελίδα έχει δημιουργηθεί αποκλειστικά για ενημερωτικούς σκοπούς και απαγορεύεται ρητά η χρήση της για οποιονδήποτε άλλο σκοπό. Οποιαδήποτε εμπορική ή ιατρική χρήση απαγορεύεται αυστηρά. Επίσης, η ιστοσελίδα δεν παρέχει καμία ιατρική καθοδήγηση. Κανένα στοιχείο της ιστοσελίδας δεν υποκαθιστά τις επίσημες πηγές και ανακοινώσεις των αρμόδιων κρατικών αρχών. Για επίσημες ανακοινώσεις και χρήσιμες πληροφορίες, μπορείτε να επισκέπτεστε την ιστοσελίδα του <a href="https://eody.gov.gr/" target="_blank">ΕΟΔΥ</a>.
			</p>
			<p class="body-1">
				Το iMEdD ουδεμία ευθύνη φέρει για την ακρίβεια των περιεχομένων της ιστοσελίδας καθώς και για οποιαδήποτε παραβίαση των όρων της.
			</p>
			<p class="body-1">
				Για οποιαδήποτε πληροφορία ή περαιτέρω διευκρίνιση, παρακαλούμε επικοινωνήστε στο <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> ή χρησιμοποιήστε τη <a href="https://www.imedd.org/el/contact/" target="_blank">φόρμα επικοινωνίας</a> με το iMEdD.
			</p>
		</template>
		<template v-else>
			<p class="body-1">
				This online application was created and is managed by <a href="https://www.imedd.org/el/imedd-lab/" target="_blank">iMEdD Lab</a>. It was launched online on 16 March 2020 and is updated daily since then. Its purpose is to inform the Greek journalistic community and anyone else interested in the spread of the SARS-CoV-2 virus in Greece and around the world, using a simple, easy-to-use tool.
			</p>
			<p class="body-1">
				The application shows the geographical distribution of confirmed recorded cases in our country and globally, while it also comprehensively presents the available statistics. A couple of different analyses are also presented in the “STATISTICS” page via interactive charts and maps.
			</p>
			<p class="body-1">
				The data on confirmed recorded cases in Greece and the data on the geographical distribution of cases in the country are based on official data, announced daily by the <a href="https://eody.gov.gr/" target="_blank">Hellenic National Public Health Organisation (EODY)</a> and the Ministry of Health, along with cross-checked information published in the Greek Press. The iMEdD Lab team collects this data and stores it in datasets, which are available in the relevant <a href="https://github.com/iMEdD-Lab" target="_blank">repository</a>, in <a href="https://github.com/iMEdD-Lab/open-data/tree/master/COVID-19" target="_blank">iMEdD Lab’s account on GitHub</a>.
			</p>
			<p class="body-1">
				The source of the global current data is the <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometer</a>, the content of which is subject to <a href="https://www.worldometers.info/disclaimer/" target="_blank">terms of use</a>. That data is shown on the main world map, in the table of countries, by number of cases, number of recoveries or number of deaths, and on additional world maps found in the “STATISTICS” page. In the iMEdD Lab application, this information and the corresponding visualisations are updated regularly throughout the day.
			</p>
			<p class="body-1">
				The global historical data shown in the chart “Evolution of Cases through Time”, in the timeline of the world map and in the rest of visualizations available at the “STATISTICS” page comes from the repository of <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Johns Hopkins University on GitHub</a>. In this repository, the University makes the data collected by its research team available for educational and research purposes. This database is updated once a day. More information about the <a href="https://coronavirus.jhu.edu/map.html" target="_blank">corresponding online application</a> of Johns Hopkins University, which was launched on 22 January 2020, its development and the data it uses can be found <a href="https://coronavirus.jhu.edu/map-faq.html" target="_blank">here</a>.
			</p>
			<p class="body-1">
				The chart “7-day Moving Average of Cases” is based on secondary calculations, using available data, and represents the seven-day rolling average, with the aim of “normalising” the daily number of new cases, as recorded and announced by the Authorities. In specific, the rolling average of cases is calculated and represented for each day, taking into account the data of the last seven days before it.
			</p>
			<p class="body-1">
				The world map shows the total number of recorded cases and deaths per 1,000,000 population for each country. The map of Greece shows the total number of recorded cases and deaths per 100,000 population for each Prefecture: this calculation is done secondarily by iMEdD Lab, taking into account the absolute number of recorded cases and deaths, which are known per Prefecture, and the data on the resident population <a href="https://www.statistics.gr/documents/20181/1210503/Kallikratis_me_plithismous_1991_2011.xls/4b9f7484-fae7-44e2-852c-ec650dc0a5c8?version=1.0" target="_blank">based on the 2011 census, as provided by ELSTAT</a>.
			</p>
			<p class="body-1">
				This “normalisation of numbers” (in this case, the recording of the number of recorded cases per 1,000,000 and per 100,000 population, around the world and in the Prefectures of Greece respectively) has been selected for two reasons: on the one hand, it allows the visualisation of data on a choropleth map, such as that used by iMEdD Lab. On the other hand, it allows a more correct understanding of the issue of the spread of the virus per country or per Prefecture, allowing a comparison of the extent of the problem based on population size.
			</p>
			<p class="body-1">
				However, in reading any such map of cases, attention is brought to the fact that, for example, there are differences in terms of the laboratory tests various countries perform: Some countries opt for mass testing of the population and therefore announce more confirmed cases. Other countries conduct targeted testing on smaller populations, so they may record fewer cases than is the case. Thus, there can be significant differences in the mapping of the actual spread of the virus in each country, even between states with equal populations. For this reason, the normalisation of recorded cases based on the laboratory tests that each country has conducted would be even more appropriate. However, so far, the relevant official data is not publicly available for all countries.
			</p>
			<p class="body-1">
				In the “STATISTICS” page, the chart “Cases, Tests and Deaths per Country” and the map “Cases/Tests Ratio per country” touch the matter of the correlation between the number of recorded cases and the number of reported tests performed by each country based on data published by the <a href="https://www.worldometers.info/coronavirus/" target="_blank">Worldometer</a>. In any case, different policies of various countries regarding both testing and the way laboratory tests are reported might drive to underestimations or overestimations. You could visit <a href="https://ourworldindata.org/covid-testing" target="_blank">Our world in data</a>, if you wish to read more about testing data.
			</p>
			<p class="body-1">
				In the “STATISTICS” page again, the charts “Evolution of deaths from the 10th death onwards” and “Evolution of cases after first 100” are updated once a day, because they are based on data published on the <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Github repository</a> of Johns Hopkins University, which is updated daily. Thus, you probably see the number of cases and the number of deaths recorded yesterday.
			</p>
			<p class="body-1">
				The charts “Deaths per 100K residents in countries with population similar to that of Greece” and “Cases per 100K residents in countries with population similar to that of Greece” include countries with a population of 9-12 million residents (<a href="https://www.worldometers.info/world-population/population-by-country/" target="_blank">Worldometer / United Nations Population Division</a>).
			</p>
			<p class="body-1">
				You can share or/and embed this iMEdD Lab online application in your website, in accordance with the terms hereof. Please kindly cite the creator and comply with the terms and restrictions stated <a href="https://creativecommons.org/licenses/by-nc/4.0/legalcode" target="_blank">here</a>.
			</p>
			<p class="body-1">
				The code for embedding the map is:
			</p>
			<v-col cols="12" xs="12" class="pa-0">
				<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
					<h4 class="accent--text">&lt;iframe</h4>
					<h4 class="accent--text pl-6">src=&quot;{{'https://lab.imedd.org/covid19/?lang=en'}}&quot;</h4>
					<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
					<h4 class="accent--text pl-6">name=&quot;imedd-covid&quot;</h4>
					<h4 class="accent--text pl-6">scrolling=&quot;no&quot;</h4>
					<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
					<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">height=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
					<h4 class="accent--text">&lt;/iframe&gt;</h4>
				</div>
			</v-col>
			<p class="body-1">
				The code for embedding the “STATISTICS” page is:
			</p>
			<v-col cols="12" xs="12" class="pa-0">
				<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
					<h4 class="accent--text">&lt;iframe</h4>
					<h4 class="accent--text pl-6">src=&quot;{{'https://lab.imedd.org/covid19/stats/?lang=en'}}&quot;</h4>
					<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
					<h4 class="accent--text pl-6">name=&quot;imedd-covid-stats&quot;</h4>
					<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
					<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
					<h4 class="accent--text pl-6">height=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
					<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
					<h4 class="accent--text">&lt;/iframe&gt;</h4>
				</div>
			</v-col>
			<p class="body-1">
				The iMEdD Lab app does not contain data regarding the age, gender, nationality of patients nor any other type of demographic or personal data.
			</p>
			<p class="body-1">
				In the list of countries, the entry “Diamond Princess” refers to the cases on board the cruise ship Diamond Princess, which is anchored off the coast of Japan. More information can be found <a href="https://www.princess.com/news/notices_and_advisories/notices/diamond-princess-update.html" target="_blank">here</a>. The countries listed are not always shown accurately on the map. For example, because it is a overseas region of France, Martinique, located in the Caribbean, appears on the map under France. In other cases, because the name of the country in the Worldometer is not exactly the same as the name of the country on the map, it may not appear on the map as a country with active cases. We try to correct any such mistakes every time they come to our notice.
			</p>
			<p class="body-1">
				One of the tools that have been used to collect global data from Worldometer is <a href="https://workbenchdata.com/gr/" target="_blank">Workbench</a>, an application that makes it easier for journalists to collect and analyse data without requiring programming language skills. Workbench was developed in Greek in the framework of the <a href="https://www.imedd.org/el/inhouse/workbench/" target="_blank">first cycle of the iMEdD Incubator</a>.
			</p>
			<p class="body-1">
				The map showing the spread of COVID-19 in Greece and around the world was sponsored by the <a href="https://www.mapbox.com/community/" target="_blank">Mapbox Community team</a>.
			</p>
			<p class="body-1">
				This json file, which has been made available by <a href="https://github.com/python-visualization/folium" target="_blank">python-visualtization/folium</a> on GitHub, under MIT License of use (Copyright © 2013, Rob Story), is used for the purposes of mapping the “Cases/Tests Ratio per Country” and the “Recovered Ratio per Country”.
			</p>
			<p class="body-1">
				This website has been created solely for informational purposes and its use for any other purpose is expressly prohibited. Any commercial or medical use is strictly prohibited. This website does not provide any medical guidance. No information of the website replaces the official sources and announcements of the competent state authorities. For official announcements and useful information, you can visit the website of the <a href="https://eody.gov.gr/" target="_blank">EODY</a>.
			</p>
			<p class="body-1">
				IMEdD bears no responsibility for the accuracy of the content of this website or for any violation of its terms.
			</p>
			<p class="body-1">
				For any additional information or clarification, please contact <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> or use the iMEdD <a href="https://www.imedd.org/el/contact/" target="_blank">contact form</a>.
			</p>
		</template>
	</v-card-text>
</template>
<script>
export default {
	name: 'text-about'
};
</script>
