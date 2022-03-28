/* global eiGtm */
// eslint-disable-next-line no-var
var Pantheon = window.Pantheon || {};

Pantheon.varyHeaders = eiGtm.headersEnabled;

Pantheon.GTM = {
	interest: Pantheon.varyHeaders.includes( 'Interest' ) ? eiGtm.interest : null,
	geo: Pantheon.varyHeaders.includes( 'Audience' ) || Pantheon.varyHeaders.includes( 'Audience-Set' ) ? eiGtm.geo : null,
};

/**
 * Push personalization data to GTM.
 */
Pantheon.GTM.dataPush = function () {
	window.dataLayer = window.dataLayer || [];
	window.dataLayer.push( {
		'event': 'pzn',
		'audience': {
			'geo': Pantheon.GTM.geo,
		},
		'interest': Pantheon.GTM.interest,
	} );
};

Pantheon.GTM.dataPush();
