/*global eiInterest*/
/**
 * @file
 * Count interests and set cookie for interest header.
 */

import cookies from 'js-cookie';

let runOnce;

/**
 * Update tagsCount with current post tags.
 *
 * @param {Array} postTags Array of post tags.
 * @param {object} tagsCount Object of tags and counts.
 *
 * @returns {object} Object of tags and counts.
 */
function updateTagsCount( postTags, tagsCount ) {
	// Loop through current post tags.
	postTags.forEach( tag => {
		// If tag already exists in tagsCount, increment.
		if ( tag in tagsCount ) {
			tagsCount[tag]++;
		} else {
			tagsCount[tag] = 1;
		}
	} );

	return tagsCount;
}

/**
 * Filter out the most popular tags.
 *
 * @param {object} tagsCount Object of tags and counts.
 * @param {number} popularityCount How many times should a tag be visited before adding to interest header.
 *
 * @returns {object} Object of tags and counts.
 */
function getInterestTags( tagsCount, popularityCount ) {
	// Find the highest count among the tags.
	let maxCount = 0;
	Object.keys( tagsCount ).forEach( tag => {
		// If tag's count is above popularityCount and other tag counts.
		if ( tagsCount[tag] >= popularityCount && tagsCount[tag] > maxCount ) {
			maxCount = tagsCount[tag];
		}
	} );

	// If there are valid tags with a maxCount.
	if ( maxCount > 0 ) {
		// Convert tagsCount to array.
		let tagsCountArray = Object.entries( tagsCount );
		// Retrieve all tags with count equal to maxCount.
		tagsCountArray = tagsCountArray.filter( ( [ key, value ] ) => value === maxCount );

		// Convert array back to object.
		return Object.fromEntries( tagsCountArray );
	}

	// If no tag has a sufficient maxCount, return an empty object.
	return {};
}

/**
 *
 */
function getInterests() {
	/**
	 * Class to handle localStorage.
	 */
	class LocalStorage {
		/**
		 * Implements constructor().
		 */
		constructor() {
			// localStorage key.
			this.key = 'eiInterest.interest';
		}

		/**
		 * Get value in localStorage.
		 *
		 * @returns {string} Value in localStorage.
		 */
		getStorage() {
			let item = localStorage.getItem( this.key );

			return item ? JSON.parse( item ) : {};
		}

		/**
		 * Set value in localStorage.
		 *
		 * @param {string} value Value to set.
		 */
		setStorage( value ) {
			localStorage.setItem( this.key, JSON.stringify( value ) );
		}
	}

	if ( ! runOnce ) {
		runOnce = true;

		const localizedObj = eiInterest;

		// How many times should a tag be visited before adding to interest header.
		const popularityCount = localizedObj.interest_threshold ? localizedObj.interest_threshold : 3;
		const postTags = localizedObj.post_terms;
		const cookieExpiration = localizedObj.cookie_expiration ? localizedObj.cookie_expiration : 14;

		if ( postTags ) {
			// Create LocalStorage instance.
			let storage = new LocalStorage();

			// Get tagsCount from localStorage if it exists.
			let tagsCount = storage.getStorage();

			// Update tagsCount with current post tags.
			tagsCount = updateTagsCount( postTags, tagsCount );

			// Save updated counts to localStorage.
			storage.setStorage( tagsCount );

			// Filter most popular tags.
			let interestTagsCount = getInterestTags( tagsCount, popularityCount );

			// Get array of popular tag tids.
			let interestTags = Object.keys( interestTagsCount );

			if ( interestTags.length > 0 ) {
				const CookieAttributes = { expires: parseInt( cookieExpiration ) };
				// Set interest cookie with popular tags, separated by |, and any attributes.
				cookies.set( 'interest', interestTags.join( '|' ), CookieAttributes );
			}
		}
	}
}

getInterests();
