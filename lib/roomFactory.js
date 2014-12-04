var promise = require( 'bluebird' ),
	room = require( './room' );

module.exports = {

	/**
	 * Create a new room object
	 * 
	 * @param  {Socket} socket The socket object used to create the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance
	 */
	reserve: function( socket, memory ) {

		return promise.resolve( room( socket, memory ) );
	},

	/**
	 * Join a room
	 *
	 * @param {String} id id for the room you'd like to enter
	 * @param  {Socket} socket The socket object used to join the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enter: function( id, socket, memory ) {

		return memory.getRoomData( id )
		.then( function( roomData ) {

			return promise.resolve( room( socket, memory, roomData ) );
		});
	},

	/**
	 * Join a room with a key
	 *
	 * @param {String} key key used for a room
	 * @param  {Socket} socket The socket object used to join the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enterWithKey: function( key, socket, memory ) {

		return memory.getRoomIdForKey( key )
		.then( memory.getRoomData )
		.then( function( roomData ) {

			return promise.resolve( room( socket, memory, roomData ) );
		});
	}
};