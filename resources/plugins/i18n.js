import Vue from 'vue';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

export default ({ app, store }) => {
	app.i18n = new VueI18n({
		locale: store.state.lang.language,
		fallbackLocale: 'COMMON',
		silentTranslationWarn: true,
		messages: {
			//'en': require('~/lang/en.json'),
			//'vi': require('~/lang/vi.json')
		}
	});
}
