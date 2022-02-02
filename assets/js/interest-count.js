/*global pantheon_ei*/
/**
 * @file
 * Count interests and set cookie for interest header.
 */

import cookies from 'js-cookie';

let runOnce;

/**
 * Update tagsCount with current post tags.
 *
 * @param postTags
 * @param postags
 * @param tagsCount
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
 * @param tagsCount
 * @param popularityCount
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
			this.key = 'pantheon_ei.interest';
		}

		/**
		 * Get value in localStorage.
		 */
		getStorage() {
			let item = localStorage.getItem( this.key );

			return item ? JSON.parse( item ) : {};
		}

		/**
		 * Set value in localStorage.
		 *
		 * @param value
		 */
		setStorage( value ) {
			localStorage.setItem( this.key, JSON.stringify( value ) );
		}
	}

	if ( ! runOnce ) {
		runOnce = true;

		const localizedObj = pantheon_ei;

		// How many times should a tag be visited before adding to interest header.
		const popularityCount = pantheon_ei.interest_threshold ? pantheon_ei.interest_threshold : 3;
		const interestCategory = pantheon_ei.interest_category;
		const postTags = pantheon_ei.post_terms;

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
				// Set interest cookie with popular tags, separated by |.
				cookies.set( 'interest', interestTags.join( '|' ) );
			}
		}
	}
}

if ( document.body.classList.contains( 'single' ) ) {
	getInterests();
}
