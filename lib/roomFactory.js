var promise = require( 'bluebird' ),
	room = require( './room' );

var rooms = {};

module.exports = {

	/**
	 * Create a new room object
	 * 
	 * @param  {Socket} socket The socket object used to create the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance
	 */
	reserve: function( socket, memory ) {

		return memory.createRoom()
			   .then( function( id ) {

			   		rooms[ id ] = room( socket, memory, id );

			   		return promise.resolve( rooms[ id ] );
			   }, function() {

			   		return promise.reject( 'could not get a roomID to create a room' );
			   });
	},

	/**
	 * Join a room
	 *
	 * @param {String} id id for the room you'd like to enter
	 * @param  {Socket} socket The socket object used to join the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enter: function( socket, memory, id ) {

		if( rooms[ id ] ) {

			return promise.resolve( rooms[ id ] );
		} else {

			return memory.getRoomData( id )
			.then( function( roomData ) {

				rooms[ id ] = room( socket, memory, id );

				return promise.resolve( rooms[ id ] );
			}, function() {

				return promise.reject( 'No room exists with that id: ' + id ); 
			});
		}
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
		.then( this.enter.bind( this, socket, memory ) );
	}
};