var promise = require( 'bluebird' );

module.exports = storeRedis;

function storeRedis( redis ) {

	if( !( this instanceof storeRedis ) )
		return new storeRedis( redis );

	this.redis = redis;
	this.generateKeys();
}

storeRedis.prototype = {

	/**
	 * get a key which can be used to enter a room vs entering room via
	 * roomID
	 * 
	 * @param  {String} roomID id of the room you'd like a key for
	 * @return {Promise} A promise will be returned which will return a roomKey on success
	 */
	getKey: function( roomID ) {

	},

	/**
	 * return a room key so someone else can use it.
	 * 
	 * @param  {String} roomID id of the room you'll be returning a key for
	 * @param  {String} key the key you'd like to return
	 * @return {Promise} This promise will succeed when the room key was returned
	 */
	returnKey: function( roomID, key ) {

	},

	/**
	 * return the room id for the given key
	 * 
	 * @param  {String} key key used to enter the room
	 * @return {Promise} This promise will succeed with the room id and fail if no room id exists for key
	 */
	getRoomIdForKey: function( key ) {

	},

	/**
	 * Receive the data stored for a room.
	 * 
	 * @param  {String} roomID id for the room you'd like data for
	 * @return {Promise} This promise will succeed when data is received for the room
	 */
	getRoomData: function( roomID ) {

	},

	/**
	 * Set data stored for a room.
	 * 
	 * @param  {String} roomID id for the room you'd like to set data for
	 * @return {Promise} This promise will succeed when data is set for the room
	 */
	setRoomData: function( roomID, data ) {

	},

	generateKeys: function() {

		
	}
};