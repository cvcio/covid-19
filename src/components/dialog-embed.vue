<template>
	<v-dialog :value="dialogEmbed" @click:outside="$store.commit('set_dialogEmbed', false)" width="600px" transition="slide-y-reverse-transition" fullscreen>
		<v-card tile>
			<v-card-title>
				<span class="title text-truncate">
					{{ $t('Ενσωμάτωση Κώδικα') }}
				</span>
				<v-spacer></v-spacer>
				<v-btn icon @click.stop="$store.commit('set_dialogEmbed', false)">
					<v-icon>mdi-close</v-icon>
				</v-btn>
			</v-card-title>
			<v-card-text>
				<v-container fill-height>
					<v-row align="center" justify="center">
						<v-col cols="12" xs="12" md="8">
							<div class="pa-6 mb-4 grey lighten-2 elevation-0 code" style="position: relative;">
								<h4 class="accent--text">&lt;iframe</h4>
								<h4 class="accent--text pl-6">src=&quot;{{'https://lab.imedd.org/covid19/' + ($i18n.locale === 'el' ? '' : '?lang=en')}}&quot;</h4>
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

							<p v-if="$i18n.locale === 'el'">Με τον παραπάνω κώδικα μπορείτε να ενσωματώσετε την εφαρμογή στην ιστοσελίδα σας. Εάν παρατηρήσετε προβλήματα στην ενσωμάτωση, επικοινωνήστε μαζί μας στο <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> ή χρησιμοποιήστε τη <a href="https://www.imedd.org/el/contact/" target="_blank">φόρμα επικοινωνίας</a> με το iMEdD.</p>
							<p v-else>With the code above you can integrate the application on your website. If you notice problems with integration, contact us at <a href="mailto:lab@imedd.org" target="_blank">lab@imedd.org</a> or use the <a href="https://www.imedd.org/el/contact/" target="_blank">contact form</a> at iMEdD.</p>
						</v-col>
					</v-row>
				</v-container>
			</v-card-text>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'dialog-embed',
	computed: {
		...mapGetters(['dialogEmbed'])
	}
};
</script>


