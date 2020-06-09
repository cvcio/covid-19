<template>
	<v-card-text>
		<template v-if="$i18n.locale === 'el'">
		<p class="body-1">
			1. Το υλικό που δημοσιεύεται σε αυτή τη σελίδα υπόκειται σε άδεια χρήσης Creative Commons για Μη Εμπορική Χρήση (CC BY-NC). Εξαιρείται το υλικό που ανήκει στον δημόσιο τομέα (public domain) ή υπόκειται σε όρους χρήσης και περιορισμούς που προέρχονται από τρίτα μέρη και πηγές.
		</p>
		<p class="body-1">
			2. Για την παγκόσμια γεωγραφική κατανομή της διασποράς του ιού COVID – 19, χρησιμοποιούμε στοιχεία που έχει συγκεντρώσει από πολλές και διαφορετικές πηγές(<a class="c6" target="_blank" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">WHO</a>, <a class="c6" target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC</a>, <a class="c6" target="_blank" href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases">ECDC</a>, <a class="c6" target="_blank" href="http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml">NHC</a>, <a class="c6" target="_blank" href="https://3g.dxy.cn/newh5/view/pneumonia?scene%3D2%26clicktime%3D1579582238%26enterid%3D1579582238%26from%3Dsinglemessage%26isappinstalled%3D0">DXY</a> και άλλες) το πανεπιστήμιο John Hopkins (JHU). Μπορείτε να διαβάσετε περισσότερα για τον τρόπο συλλογής και ανάλυσης των στοιχείων εδώ και να δείτε τα δεδομένα εδώ. Το iMEdD δεν έχει οιαδήποτε σχέση με το JHU αναφορικά με αυτά τα δεδομένα και τη χρήση τους.
		</p>
		<p class="body-1">
			3. Το υλικό υπόκειται στους όρους χρήση του JHU (<a href="https://coronavirus.jhu.edu/map-faq.html" target="_blank">https://coronavirus.jhu.edu/map-faq.html</a>, <a href="https://coronavirus.jhu.edu/map.html" target="_blank">https://coronavirus.jhu.edu/map.html</a> και <a href="https://it.johnshopkins.edu/policies/privacystatement" target="_blank">https://it.johnshopkins.edu/policies/privacystatement</a>) και στους γενικούς όρους χρήσης της παρούσης ιστοσελίδας.
		</p>
		<p class="body-1">
			4. Κανένας νομικός όρος ή τεχνολογικά μέτρα, όπως ορίζονται στο άρθρο 11 της συνθήκης του Παγκόσμιου Οργανισμού Πνευματικής Ιδιοκτησίας, δεν έχουν εφαρμοστεί ή μπορούν να εφαρμοστούν στο υλικό που χρησιμοποιείται.
		</p>
		<p class="body-1">
			5. Ανατρέξτε σε αυτόν τον σύνδεσμο σε σχέση με το υλικό το οποίο δεν είναι διαθέσιμο δημοσίως: <a href="https://creativecommons.org/licenses/by-nc/4.0/legalcode" target="_blank">https://creativecommons.org/licenses/by-nc/4.0/legalcode</a>.
		</p>
		<p class="body-1">
			6. Ανατρέξτε στην αποποίηση εγγυήσεων του JHU και του <a href="https://creativecommons.org/licenses/by-nc/4.0/legalcode" target="_blank">https://creativecommons.org/licenses/by-nc/4.0/legalcode</a>.
		</p>
		<p class="body-1">
			7. Το υλικό που χρησιμοποιείται σε αυτή τη σελίδα δεν επιτρέπεται να τροποποιηθεί εκτός εάν τηρούνται οι όροι, οι περιορισμοί και οι όροι άδειας χρήσης της άδειας Creative Commons (CC BY-NC) και των τρίτων πηγών.
		</p>
		<p class="body-1">
			8. Απαγορεύεται αυστηρά η χρήση του περιεχομένου της ιστοσελίδας για οποιοδήποτε εμπορικό ή ιατρικό σκοπό.
		</p>
		<p class="body-1">
			9. Το περιεχόμενο της ιστοσελίδας φέρει αμιγώς ενημερωτικό χαρακτήρα και απαγορεύεται ρητά η χρήση του για οποιοδήποτε άλλο σκοπό.
		</p>
		<p class="body-1">
			10. Κανένα στοιχείο της ιστοσελίδας δεν υποκαθιστά τις επίσημες πηγές και ανακοινώσεις των αρμόδιων κρατικών αρχών.
		</p>
		<p class="body-1">
			Για οποιαδήποτε διευκρίνιση επί των ανωτέρω, παρακαλούμε επικονωνήστε με την ομάδα του iMEdD Lab στο <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a>.
		</p>
		</template>
		<template v-else>
			<p class="body-1">
				1. The material published on this page is subject to the NonCommercial Creative Commons licence (CC BY-NC). The material belonging to the public domain or subject to terms of use and restrictions arising from third parties and sources is excluded.
			</p>
			<p class="body-1">
				2. Regarding the global geographical distribution of COVID-19, we use data collected from many different sources (<a class="c6" target="_blank" href="https://www.who.int/emergencies/diseases/novel-coronavirus-2019/situation-reports">WHO</a>, <a class="c6" target="_blank" href="https://www.cdc.gov/coronavirus/2019-ncov/index.html">CDC</a>, <a class="c6" target="_blank" href="https://www.ecdc.europa.eu/en/geographical-distribution-2019-ncov-cases">ECDC</a>, <a class="c6" target="_blank" href="http://www.nhc.gov.cn/xcs/yqtb/list_gzbd.shtml">NHC</a>, <a class="c6" target="_blank" href="https://3g.dxy.cn/newh5/view/pneumonia?scene%3D2%26clicktime%3D1579582238%26enterid%3D1579582238%26from%3Dsinglemessage%26isappinstalled%3D0">DXY</a> and others) by John Hopkins University (JHU). You can read more about how data is collected and analysed here and see the data here. IMEdD has no relationship with JHU as regards this data and its use.
			</p>
			<p class="body-1">
				3. The material is subject to the terms of use of JHU (<a href="https://coronavirus.jhu.edu/map-faq.html" target="_blank">https://coronavirus.jhu.edu/map-faq.html</a>, <a href="https://coronavirus.jhu.edu/map.html" target="_blank">https://coronavirus.jhu.edu/map.html</a> and <a href="https://it.johnshopkins.edu/policies/privacystatement" target="_blank">https://it.johnshopkins.edu/policies/privacystatement</a>) and the general terms of use of this website.
			</p>
			<p class="body-1">
				4. No legal term or technological measures, as defined in Article 11 of the Treaty of the World Intellectual Property Organisation, have been or may be applied to the material used.
			</p>
			<p class="body-1">
				5. See this link regarding the material that is not available in public:  <a href="https://creativecommons.org/licenses/by-nc/4.0/legalcode" target="_blank">https://creativecommons.org/licenses/by-nc/4.0/legalcode</a>.
			</p>
			<p class="body-1">
				6. See disclaimer of warranty of JHU and  <a href="https://creativecommons.org/licenses/by-nc/4.0/legalcode" target="_blank">https://creativecommons.org/licenses/by-nc/4.0/legalcode</a>.
			</p>
			<p class="body-1">
				7. The material used on this page may not be modified unless the terms, restrictions and terms of use of the Creative Commons licence (CC BY-NC) and third-party sources are met.
			</p>
			<p class="body-1">
				8. The use of the website content for any commercial or medical purpose is strictly prohibited.
			</p>
			<p class="body-1">
				9. The content of the website is for information purposes only and its use for any other purpose is expressly prohibited.
			</p>
			<p class="body-1">
				10. No information of the website replaces the official sources and announcements of the competent state authorities.
			</p>
			<p class="body-1">
				For any clarification on the above, please contact the iMEdD Lab team at <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a>.
			</p>
		</template>
	</v-card-text>
</template>
<script>
export default {
	name: 'text-terms'
};
</script>
