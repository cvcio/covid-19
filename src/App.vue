<template>
	<v-app id="app" toolbar footer>
		<v-alert v-if="byCountryCases" :value="alert" dense tile class="ma-0 caption" type="error" color="accent" id="alert" transition="slide-y-transition">
			<v-row align="center" no-gutters>
				<v-col class="grow">Στην {{ findIndex(byCountryCases, ['country', 'Ελλάδα']) + 1 }}η θέση η Ελλάδα παγκοσμίως σε αριθμό κρουσμάτων</v-col>
				<v-col class="shrink">
					<v-btn icon small @click.stop="alert = false">
						<v-icon small>mdi-close</v-icon>
					</v-btn>
				</v-col>
			</v-row>
		</v-alert>

		<v-app-bar app fixed dark color="transparent" flat
			class="main-bar"
			:class="[
				(alert && $vuetify.breakpoint.smAndDown ? 'alert-mobile-bar' : ''),
				(alert && $vuetify.breakpoint.mdAndUp ? 'alert-bar' : ''),
			]"
			>
			<v-row no-gutters :justify="$vuetify.breakpoint.mdAndDown ? 'end' : 'start'">
				<v-tooltip bottom small>
					<template v-slot:activator="{ on }">
						<v-btn fab small v-on="on" @click.stop="navStats = !navStats" class="primary mx-3" style="pointer-events: auto;">
							<v-icon small>mdi-chart-timeline-variant</v-icon>
						</v-btn>
					</template>
					<span>{{ !navStats ? 'Στατιστικά' : 'Απόκρυψη' }}</span>
				</v-tooltip>
				<v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
				<v-tooltip bottom small>
					<template v-slot:activator="{ on }">
						<v-btn fab small v-on="on" @click.stop="navNews = !navNews" class="primary mx-3"  style="pointer-events: auto;">
							<v-icon small>mdi-message-alert</v-icon>
						</v-btn>
					</template>
					<span>{{ !navNews ? 'Νέα' : 'Απόκρυψη' }}</span>
				</v-tooltip>
			</v-row>
		</v-app-bar>

		<v-navigation-drawer fixed app :width="$vuetify.breakpoint.xsOnly ? '100%' : '380'" class="main-nav" v-model="navStats"
			:class="[
				(alert && $vuetify.breakpoint.xsOnly ? 'alert-mobile-nav' : ''),
				(alert && $vuetify.breakpoint.smAndUp ? 'alert-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndDown ? 'mobile-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndUp ? 'normal-nav' : '')
			]"
			>
			<a href="https://imedd.org/" target="_blank" class="">
				<v-img src="/img/imedd.jpg" max-width="300" max-height="96" />
			</a>
			<v-divider dark class="mb-2"></v-divider>
			<vue-custom-scrollbar class="scroll-area">
			<v-list dense>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-title class="title mb-2">
							<span class="font-weight-black">
								<span class="">COVID</span>
								<span>&mdash;</span>
								<span class="">19</span>
							</span>
						</v-list-item-title>
						<p class="body-2 mb-0">Η εξάπλωση του ιού <br/>στην Ελλάδα και στον κόσμο</p>
					</v-list-item-content>
				</v-list-item>
			</v-list>

			<v-divider dark class=""></v-divider>
			<v-list>
				<v-subheader class="grey--text mb-2">
					<span class="caption">Τελευταία Ενημέρωση: <span class="info--text">{{ $moment(lastUpdatedAt).format('L') || '' }}</span></span>
				</v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-btn-toggle v-model="activeMap" small mandatory dark>
							<v-btn value="greece" :color="activeMap === 'greece' ? 'primary' : 'primary lighten-4'" small @click="triggerUpdate = new Date()">
								Ελλαδα
							</v-btn>
							<v-btn value="admin-0" :color="activeMap === 'admin-0' ? 'primary' : 'primary lighten-4'" small  @click="triggerUpdate = new Date()">
								ΚΟΣΜΟΣ
							</v-btn>
						</v-btn-toggle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>

			<v-list>
				<v-subheader class="grey--text">Καταγεγραμμένα Κρούσματα</v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-subtitle class="display-1 font-weight-black">{{ new Intl.NumberFormat('el-GR').format(activeMap === 'admin-0' ? countCases : countCasesGR) }}</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>
			<v-list class="">
				<v-subheader class="grey--text">Θάνατοι </v-subheader>
				<v-list-item>
					<v-list-item-content class="py-0">
						<v-list-item-subtitle class="display-1 red--text">{{ new Intl.NumberFormat('el-GR').format(activeMap === 'admin-0' ? countDeaths : countDeathsGR) }}</v-list-item-subtitle>
						<v-list-item-subtitle class="body-2">{{ ((100 * (activeMap === 'admin-0' ? countDeaths : countDeathsGR)) / (activeMap === 'admin-0' ? countCases : countCasesGR)).toFixed(2) }}% των κρουσμάτων</v-list-item-subtitle>
					</v-list-item-content>
				</v-list-item>
			</v-list>
			<v-divider dark class=""></v-divider>
			<v-list>
				<v-subheader class="grey--text">Κρούσματα &frasl; Ημέρα</v-subheader>
			</v-list>
			<chart-timeline :triggerUpdate="triggerUpdate" :level="activeMap" class="px-4 mb-12"></chart-timeline>
			<v-divider dark class="mb-2"></v-divider>

			<template v-if="activeMap === 'admin-0' && byCountry">
				<v-data-table v-if="byCountry" class="mt-4" :headers="[
					{ text: 'Χώρα', value: 'country', width: '30%' },
					{ text: 'Κρούσματα', value: 'cases', width: '35%' },
					{ text: 'Θάνατοι', value: 'deaths', width: '35%' },
				]" :items="byCountry">
					<template v-slot:header.country="{ header }">
						<span class="caption">{{ header.text }}</span>
					</template>
					<template v-slot:header.cases="{ header }">
						<span class="caption">{{ header.text }}</span>
					</template>
					<template v-slot:header.deaths="{ header }">
						<span class="caption">{{ header.text }}</span>
					</template>
					<template v-slot:item="props">
						<tr>
							<td>{{ props.item.country }}</td>
							<td>{{ new Intl.NumberFormat('el-GR').format(props.item.cases) }}</td>
							<td class="red--text">{{ new Intl.NumberFormat('el-GR').format(props.item.deaths) }}</td>
						</tr>
					</template>
				</v-data-table>
			</template>
			<template v-else-if="activeMap === 'greece' && greece">
				<v-data-table v-if="greece" class="mt-4" :headers="[
					{ text: 'Περιοχή', value: 'county', width: '30%' },
					{ text: 'Κρούσματα', value: 'cases', width: '35%' },
					{ text: 'Θάνατοι', value: 'dead', width: '35%' },
				]" :items="greece">
					<template v-slot:header.county="{ header }">
						<span class="caption text-truncate">{{ header.text }}</span>
					</template>
					<template v-slot:header.cases="{ header }">
						<span class="caption text-truncate">{{ header.text }}</span>
					</template>
					<template v-slot:header.dead="{ header }">
						<span class="caption text-truncate">{{ header.text }}</span>
					</template>
					<template v-slot:item="props">
						<tr>
							<td>{{ props.item.county }}</td>
							<td>{{ new Intl.NumberFormat('el-GR').format(props.item.cases) }}</td>
							<td class="red--text">{{ new Intl.NumberFormat('el-GR').format(props.item.dead) }}</td>
						</tr>
					</template>
				</v-data-table>
			</template>
			</vue-custom-scrollbar>
		</v-navigation-drawer>

		<v-navigation-drawer app fixed light right :width="$vuetify.breakpoint.xsOnly ? '100%' : '280'" class="news-nav" v-model="navNews"
			:class="[
				(alert && $vuetify.breakpoint.xsOnly ? 'alert-mobile-nav' : ''),
				(alert && $vuetify.breakpoint.smAndUp ? 'alert-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndDown ? 'mobile-nav' : ''),
				(!alert && $vuetify.breakpoint.mdAndUp ? 'normal-nav' : '')
			]"
			>
			<a class="twitter-timeline" href="https://twitter.com/iMEdDLab/lists/imedd-lab-covid-19?ref_src=twsrc%5Etfw">A Twitter List by iMEdDLab</a>
		</v-navigation-drawer>

		<div id="map" class="">
			<v-progress-circular v-if="loading" class="loader" :value="40" color="primary" indeterminate :size="24"/>
			<map-mapbox v-if="!loading" :level="activeMap"/>
		</div>

		<v-dialog v-model="dialogAbout" width="600px" transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
			<v-card tile>
				<v-card-title>
					<span class="title text-truncate">
						Η εφαρμογή και τα δεδομένα
					</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogAbout=false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<p class="body-1">
						H συγκεκριμένη διαδικτυακή εφαρμογή δημιουργήθηκε και συντηρείται από το <a href="https://www.imedd.org/el/imedd-lab/" target="_blank">iMEdD Lab</a>. Αρχικά, δημοσιεύθηκε στις 16 Μαρτίου 2020 και έκτοτε ανανεώνεται ημερησίως. Σκοπός είναι η ενημέρωση της ελληνικής δημοσιογραφικής κοινότητας και κάθε ενδιαφερόμενου για την εξάπλωση του ιού SARS-CoV-2 στην Ελλάδα και στον κόσμο, με τη χρήση ενός απλού, εύχρηστου εργαλείου.
					</p>
					<p class="body-1">
						Η εφαρμογή παρουσιάζει τη γεωγραφική κατανομή των καταγεγραμμένων επιβεβαιωμένων κρουσμάτων στη χώρα μας και παγκοσμίως, ενώ αποτυπώνει συγκεντρωτικά τα διαθέσιμα στατιστικά στοιχεία.
					</p>
					<p class="body-1">
						Τα δεδομένα που αφορούν τη γεωγραφική κατανομή των καταγεγραμμένων επιβεβαιωμένων κρουσμάτων στην Ελλάδα συλλέγονται και εμπλουτίζονται διαρκώς από την ομάδα του iMEdD Lab: αποτελούν σύνθεση στοιχείων τα οποία ανακοινώνονται από τον Εθνικό Οργανισμό Δημόσιας Υγείας (ΕΟΔΥ) σε ημερήσια βάση και διασταυρωμένων στοιχείων που προέρχονται από δημοσιεύματα στον ελληνικό Τύπο. Οι σχετικοί αριθμοί και η αποτύπωσή τους βασίζονται σε όσα στοιχεία μάς είναι γνωστά.
					</p>
					<p class="body-1">
						Η πηγή των δεδομένων που αφορούν τόσο τον αριθμό των καταγεγραμμένων επιβεβαιωμένων κρουσμάτων, σε ημερήσια βάση, ανά τον κόσμο όσο και τη γεωγραφική κατανομή τους σε παγκοσμιο επίπεδο είναι το αποθετήριο του <a href="https://github.com/CSSEGISandData/COVID-19" target="_blank">Johns Hopkins University στο GitHub</a>. Στο συγκεκριμένο αποθετήριο, το εν λόγω Πανεπιστήμιο διαθέτει ελεύθερα τα δεδομένα που έχουν συλλεχθεί από την ερευνητική ομάδα του και αποτυπώνονται σε <a href="https://coronavirus.jhu.edu/map.html" target="_blank">αντίστοιχη διαδικτυακή εφαρμογή του Johns Hopkins University</a>, η οποία αρχικά δημοσιεύθηκε στις 22 Ιανουαρίου 2020. Περισσότερα για την ανάπτυξη της εφαρμογής του Johns Hopkins University και για τα δεδομένα που εκείνη χρησιμοποιεί μπορείτε να διαβάσετε <a href="https://coronavirus.jhu.edu/map-faq.html" target="_blank">εδώ</a>.
					</p>
					<p class="body-1">
						Μπορείτε ελεύθερα να κοινοποιήσετε ή/και να ενσωματώσετε την παρούσα διαδικτυακή εφαρμογή του iMEdD Lab στη δική σας ιστοσελίδα, με την παράκληση αναφοράς στον δημιουργό. Ο κώδικας για την ενσωμάτωση της εφαρμογής είναι:
					</p>
					<v-col cols="12" xs="12" class="pa-0">
						<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
							<h4 class="accent--text">&lt;iframe</h4>
							<h4 class="accent--text pl-6">src=&quot;{{$APP_URL}}&quot;</h4>
							<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
							<h4 class="accent--text pl-6">name=&quot;imedd-covid&quot;</h4>
							<h4 class="accent--text pl-6">scrolling=&quot;no&quot;</h4>
							<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
							<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
							<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
							<h4 class="accent--text pl-6">height=&quot;480px&quot;</h4>
							<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
							<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
							<h4 class="accent--text">&lt;/iframe&gt;</h4>
							<v-btn small tile style="position: absolute; top: 0; right: 0;" @click="copy"><v-icon small>mdi-content-copy</v-icon></v-btn>
						</div>
					</v-col>
					<p class="body-1">
						Η εφαρμογή του iMEdD Lab δεν περιέχει δεδομένα σχετικά με την ηλικία, το φύλο, την εθνικότητα των ασθενών, ούτε κανενός είδους άλλο δημογραφικό ή προσωπικό δεδομένο.
					</p>
					<p class="body-1">
						H συγκεκριμένη ιστοσελίδα έχει δημιουργηθεί αποκλειστικά και μόνο για ενημερωτικούς σκοπούς. Οποιαδήποτε εμπορική χρήση απαγορεύεται αυστηρά. Επίσης, η ιστοσελίδα δεν παρέχει καμία ιατρική καθοδήγηση. Για επίσημες ανακοινώσεις και χρήσιμες πληροφορίες, μπορείτε να επισκέπτεστε την ιστοσελίδα του <a href="https://eody.gov.gr/" target="_blank">ΕΟΔΥ</a>.
					</p>
					<p class="body-1">
						Το iMEdD αποποιείται, με οποιονδήποτε τρόπο, κάθε εγγύησης όσον αφορά στον ιστότοπο, περιλαμβανομένης της ακρίβειας και της καταλληλότητας χρήσης των στοιχείων, για οποιονδήποτε σκοπό πέραν του ενημερωτικού.
					</p>
					<p class="body-1">
						Για οποιαδήποτε πληροφορία ή περαιτέρω διευκρίνιση, παρακαλούμε επικοινωνήστε στο <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> ή χρησιμοποιήστε τη <a href="https://www.imedd.org/el/contact/" target="_blank">φόρμα επικοινωνίας</a> με το iMEdD.
					</p>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogTerms" width="600px" transition="slide-y-reverse-transition" :fullscreen="$vuetify.breakpoint.mdAndDown">
			<v-card tile>
				<v-card-title>
					<span class="title text-truncate">
						Terms
					</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogTerms = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-subtitle>
					<span class="caption mr-2">Τελευταία Ενημέρωση: <span class="info--text">{{ $moment(lastUpdatedAt).format('L') || '' }}</span></span>
				</v-card-subtitle>
				<v-card-text>
					<p class="body-1">
						Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at neque sed sed ante imperdiet, dolor mauris cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo, augue in, duis erat proin condimentum in a eget, sed fermentum sed vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor.
					</p>
					<p class="body-1">
						Lorem ipsum dolor sit amet, semper quis, sapien id natoque elit. Nostra urna at, magna at neque sed sed ante imperdiet, dolor mauris cursus velit, velit non, sem nec. Volutpat sem ridiculus placerat leo, augue in, duis erat proin condimentum in a eget, sed fermentum sed vestibulum varius ac, vestibulum volutpat orci ut elit eget tortor. Ultrices nascetur nulla gravida ante arcu. Pharetra rhoncus morbi ipsum, nunc tempor debitis, ipsum pellentesque, vitae id quam ut mauris dui tempor, aptent non. Quisque turpis. Phasellus quis lectus luctus orci eget rhoncus. Amet donec vestibulum mattis commodo, nulla aliquet, nibh praesent, elementum nulla. Sit lacus pharetra tempus magna neque pellentesque, nulla vel erat.
					</p>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-dialog v-model="dialogEmbed" class="embed-dialog" max-width="360" transition="slide-y-reverse-transition" fullscreen>
			<v-card tile>
				<v-card-title>
					<span class="title text-truncate">
						Ενσωμάτωση Κώδικα
					</span>
					<v-spacer></v-spacer>
					<v-btn icon @click="dialogEmbed = false">
						<v-icon>mdi-close</v-icon>
					</v-btn>
				</v-card-title>
				<v-card-text>
					<v-container fill-height>
						<v-row align="center" justify="center">
							<v-col cols="12" xs="12" md="8">
								<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
									<h4 class="accent--text">&lt;iframe</h4>
									<h4 class="accent--text pl-6">src=&quot;{{$APP_URL}}&quot;</h4>
									<h4 class="accent--text pl-6">style=&quot;border:0px #ffffff none;&quot;</h4>
									<h4 class="accent--text pl-6">name=&quot;imedd-covid&quot;</h4>
									<h4 class="accent--text pl-6">scrolling=&quot;no&quot;</h4>
									<h4 class="accent--text pl-6">frameborder=&quot;1&quot;</h4>
									<h4 class="accent--text pl-6">marginheight=&quot;0px&quot;</h4>
									<h4 class="accent--text pl-6">marginwidth=&quot;0px&quot;</h4>
									<h4 class="accent--text pl-6">height=&quot;480px&quot;</h4>
									<h4 class="accent--text pl-6">width=&quot;640px&quot;</h4>
									<h4 class="accent--text pl-6">allowfullscreen&gt;</h4>
									<h4 class="accent--text">&lt;/iframe&gt;</h4>
									<v-btn small tile style="position: absolute; top: 0; right: 0;" @click="copy"><v-icon small>mdi-content-copy</v-icon></v-btn>
								</div>
								<p>Με τον παραπάνω κώδικα μπορείτε να ενσωματώσετε την εφαρμογή στην ιστοσελίδα σας. Εάν παρατηρήσετε προβλήματα στην ενσωμάτωση, επικοινωνήστε μαζί μας στο <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> ή χρησιμοποιήστε τη <a href="https://www.imedd.org/el/contact/" target="_blank">φόρμα επικοινωνίας</a> με το iMEdD.</p>
							</v-col>
						</v-row>
					</v-container>
				</v-card-text>
			</v-card>
		</v-dialog>

		<v-snackbar v-model="snackbar" color="info">
			Copied!
			<v-btn
				text
				@click="snackbar = false"
			>
				Close
			</v-btn>
		</v-snackbar>

		<div class="color-scale" :class="$vuetify.breakpoint.mdAndDown ? 'isMobile' : ''">
			<v-row no-gutters justify="space-between" align="center" class="mt-3">
				<v-col class="caption font-weight-bold">0</v-col>
				<v-col class="caption font-weight-bold text-center">1</v-col>
				<v-col class="caption font-weight-bold text-center">
					{{ new Intl.NumberFormat('el-GR').format(
						Math.floor(mean(byCountry.map(m => m.count)))
					) }}
				</v-col>
				<v-col class="caption font-weight-bold text-right">
					{{ new Intl.NumberFormat('el-GR').format(
						max(byCountry.map(m => m.count))
					) }}
				</v-col>
			</v-row>
		</div>

		<v-footer app inset dark class="primary lighten-1" :padless="$vuetify.breakpoint.smAndDown" :class="$vuetify.breakpoint.smAndUp ? '' : 'py-3'">
			<v-btn x-small text @click.stop="dialogAbout = true" class="text-inherit">
				Η Εφαρμογή & Τα Data
			</v-btn>
			<v-btn x-small text @click.stop="dialogTerms = true" class="text-inherit">
				<v-icon left small>mdi-creative-commons</v-icon>Όροι Χρήσης
			</v-btn>
			<v-btn x-small text href="https://mediawatch.io/" target="_blank" class="text-inherit">
				Visualization by CVCIO
			</v-btn>
			<v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer>
			<v-btn x-small text @click.stop="dialogEmbed = true">
				Embed <v-icon right small>mdi-code-tags</v-icon>
			</v-btn>
			<!-- <a @click.stop="dialogAbout = true" class="caption link link white--text">Η Εφαρμογή & Τα Data</a> -->
			<!-- <span class="mx-1 primary--text">|</span> -->

			<!-- <a class="caption link link white--text" target="_blank" href="https://www.imedd.org/el/contact/">
				<v-icon left small>mdi-creative-commons</v-icon>Όροι Χρήσης
			</a> -->
			<!-- <span class="mx-1 primary--text">|</span> -->
			<!-- <a href="https://mediawatch.io/" target="_blank" class="caption link link white--text">Visualization by CVCIO</a>
			<span class="mx-1 primary--text" v-if="$vuetify.breakpoint.smAndDown">|</span> -->
			<!-- <v-spacer v-if="$vuetify.breakpoint.smAndUp"></v-spacer> -->

			<!-- <a @click.stop="dialogEmbed = true" class="caption link link white--text">
				Embed <v-icon right small>mdi-code-tags</v-icon>
			</a> -->
		</v-footer>
	</v-app>
</template>

<script>
import { scaleLinear } from 'd3';
import { max, find, findIndex, filter, map, mean } from 'lodash';
import chroma from 'chroma-js';
import { mapGetters } from 'vuex';

export default {
	name: 'covid-19',
	components: {
		'chart-timeline': require('@/components/chart-timeline').default,
		'map-mapbox': require('@/components/map-mapbox').default,
		'vue-custom-scrollbar': require('vue-custom-scrollbar')
	},
	computed: {
		...mapGetters([
			'worldGeoJson', 'greeceGeoJson', 'countries', 'countriesMapping',
			'cases', 'deaths', 'recovered', 'greece',
			'countCases', 'countDeaths', 'countRecovered', 'countCritical',
			'countCasesGR', 'countDeathsGR', 'countRecoveredGR', 'countCriticalGR',
			'byCountryCases', 'byCountryDeaths', 'byCountryRecovered', 'byCountryCritical',
			'lastUpdatedAt',
			'byCountry'
		])
	},
	data () {
		return {
			loading: true,
			dialogAbout: false,
			dialogTerms: false,
			navNews: false,
			navStats: this.$vuetify.breakpoint.xsOnly ? false : true,
			alert: true,

			dialogEmbed: false,
			snackbar: false,
			iframe: `<iframe src="${this.$APP_URL}" style="border:0px #ffffff none;" name="imedd-covid" scrolling="no" frameborder="1" marginheight="0px" marginwidth="0px" height="400px" width="600px" allowfullscreen></iframe>`,
			activeMap: 'greece',
			triggerUpdate: new Date()
		};
	},
	mounted () {
		let jsonFiles = [
			{ file: '/shared/countries.geojson', key: 'worldGeoJson' },
			{ file: '/shared/countries.json', key: 'countries' }
		];

		let csvFiles = [
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Confirmed.csv', key: 'cases' },
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Deaths.csv', key: 'deaths' },
			{ file: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-Recovered.csv', key: 'recovered' },
			{ file: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpR8AOJaRsB5by7H3R_GijtaY06J8srELipebO5B0jYEg9pKugT3C6Rk2RSQ5eyerQl7LolshamK27/pub?gid=527109001&single=true&output=csv', key: 'countriesMapping' },
			{ file: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpR8AOJaRsB5by7H3R_GijtaY06J8srELipebO5B0jYEg9pKugT3C6Rk2RSQ5eyerQl7LolshamK27/pub?gid=58500637&single=true&output=csv', key: 'greece' },
			{ file: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRpR8AOJaRsB5by7H3R_GijtaY06J8srELipebO5B0jYEg9pKugT3C6Rk2RSQ5eyerQl7LolshamK27/pub?gid=1835616698&single=true&output=csv', key: 'greeceTimeline' }
		];

		Promise.all([
			...jsonFiles.map(m => this.$store.dispatch('fetchStaticData', m)),
			...csvFiles.map(m => this.$store.dispatch('fetchDynamicData', m))
		]).then(() => {
			this.triggerUpdate = new Date();
			this.worldGeoJson.features.forEach(m => {
				let idx_m = findIndex(this.countriesMapping, ['country', m.properties.ADMIN]);
				if (idx_m > -1) {
					m.properties.ADMIN_GR = this.countriesMapping[idx_m].name_x;
					m.properties.ADMIN_H = this.countriesMapping[idx_m].country_h;
				}
				m.properties.count = 0;
			});
			this.cases.forEach((m, i) => {
				let idx_m = findIndex(this.worldGeoJson.features, c => {
					return c.properties.ADMIN === m['Country/Region'] || c.properties.ADMIN_H === m['Country/Region'];
				});

				if (idx_m > -1) {
					this.cases[i]['Country/Region'] = this.worldGeoJson.features[idx_m].properties.ADMIN_GR;
				}
			 });
			 this.deaths.forEach(m => {
				let idx_m = findIndex(this.worldGeoJson.features, c => {
					return c.properties.ADMIN === m['Country/Region'] || c.properties.ADMIN_H === m['Country/Region'];
				});

				if (idx_m > -1) {
					m['Country/Region'] = this.worldGeoJson.features[idx_m].properties.ADMIN_GR;
				}
			 });
			 this.recovered.forEach(m => {
				let idx_m = findIndex(this.worldGeoJson.features, c => {
					return c.properties.ADMIN === m['Country/Region'] || c.properties.ADMIN_H === m['Country/Region'];
				});

				if (idx_m > -1) {
					m['Country/Region'] = this.worldGeoJson.features[idx_m].properties.ADMIN_GR;
				}
			 });

			 this.loading = false;

		}).catch(() => console.error('Error while fetching data. Please try later.'));
	},
	methods: {
		copy () {
			const value = this.iframe;
			this.snackbar = true;
			if (window.clipboardData && window.clipboardData.setData) {
				// IE specific code path to prevent textarea being shown while dialog is visible.
				return window.clipboardData.setData('Text', value);
			} else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
				var textarea = document.createElement('textarea');
				textarea.textContent = value;
				textarea.style.position = 'fixed'; // Prevent scrolling to bottom of page in MS Edge.
				document.body.appendChild(textarea);
				textarea.select();
				try {
					return document.execCommand('copy'); // Security exception may be thrown by some browsers.
				} catch (ex) {
					return false;
				} finally {
					document.body.removeChild(textarea);
				}
			}
		},
		find,
		findIndex,
		max,
		mean
	}
};
</script>

<style lang="less">
html, body, #app {
	overflow: hidden;
}

.v-toolbar__content {
	margin: 0;
	padding: 0;
}
.mono {
    font-family: 'Roboto Mono' !important;
	font-weight: 400;
	strong {
		font-weight: 700;
	}
}

a {
	text-decoration: none;
	border: none;
	outline: none;
	&.link {
		transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		background-image: linear-gradient(currentColor, currentColor);
		background-position: 0% 100%;
		background-repeat: no-repeat;
		background-size: 0% 1px;
		font-weight: inherit;
		&:hover, a:focus{
			background-size: 100% 1px;
		}
	}
}

.extra-m-96 {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	margin-top: 8px !important;
}
.extra-p-96 {
	padding-top: 48px !important;
}
.extra-p-120 {
	padding-top: 72px !important;
}
.extra-p-192 {
	padding-top: 96px !important;
}

.metrics {
	// pointer-events: none;
	width: 100%;
	height: 388px;
	// position: fixed;
	// bottom: 32px;
	// z-index: 1;
	position: absolute;
	bottom: 0;
	&.isMobile {
		position: relative;
	}

	.block {
		position: absolute;
		top: 0;
	}
}
.scroll-area {
	margin: 0 0 48px 0;
	height: calc(~'100% - 180px');
	overflow: hidden !important;
}

.loader {
	position: fixed;
	z-index: 100;	padding: 0 !important;
	top: 50%;
	left: 50%;
	transform: translate(-24px -24px);
}
.v-list-item {
	min-height: 0;
}
.v-subheader {
	height: 24px;
}
.main-nav {
	.v-navigation-drawer__content {
		overflow-y: hidden !important;
	}
}

.code {
	font-family: 'Roboto Mono', monospace;
	text-indent: none !important;
}

.color-scale {
	position: absolute;
	width: 180px;
	height: 12px;
	display: block;
	content: ' ';
	bottom: 72px;
	left: 50%;
	transform: translate(-50%, 0);
	z-index: 0;
	background: red;
	background-image: linear-gradient(
	  to right,
	  #fff,
      #fafa6e,
      red,
      #8b0000
	);
	&.isMobile {
		bottom: 120px;
	}
}

#alert {
	width: 100%;
	position: relative;
	left: 0;
	top: 0;
	z-index: 100;
}

.main-bar {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	&.alert-mobile-bar {
		margin-top: 56px !important;
	}
	&.mobile-bar {
		margin-top: 38px !important;
	}
	&.alert-bar {
		margin-top: 38px !important;
	}
}
.main-nav, .news-nav {
	transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
	&.alert-mobile-nav {
		padding-top: 108px;
	}
	&.mobile-nav {
		padding-top: 40px;
	}
	&.alert-nav {
		margin-top: 38px !important;
	}
	&.normal-nav {}
}
.text-inherit {
	text-transform: none !important;
}
.v-data-footer {
	button {
		margin-left: 0 !important;
		margin-right: 0 !important;
	}
}
.v-data-footer__pagination {
	margin-left: 0 !important;
	margin-right: 0 !important;
}
.v-data-footer__select {
	margin-right: 8px !important;
	.v-input {
		margin-left: 8px !important;
	}
}
</style>
