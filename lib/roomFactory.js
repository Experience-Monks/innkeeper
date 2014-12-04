var promise = require( 'bluebird' ),
	room = require( './room' );

var rooms = {};

module.exports = {

	/**
	 * Create a new room object
	 * 
	 * @param  {String} userId id of the user whose reserving a room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance
	 */
	reserve: function( userId, memory ) {

		return memory.createRoom( userId )
			   .then( function( id ) {

			   		rooms[ id ] = room( memory, id );

			   		return promise.resolve( rooms[ id ] );
			   }, function() {

			   		return promise.reject( 'could not get a roomID to create a room' );
			   });
	},

	/**
	 * Join a room
	 *
	 * @param  {String} userId id of the user whose entering a room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @param {String} id id for the room you'd like to enter
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enter: function( userId, memory, id ) {

		return memory.joinRoom( userId, id )
		.then( function( id ) {

			if( rooms[ id ] === undefined ) {

				rooms[ id ] = room( memory, id );	
			}
			
			return promise.resolve( rooms[ id ] );
		});
	},

	/**
	 * Join a room with a key
	 *
	 * @param  {String} userId id of the user whose entering a room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @param {String} key key used for a room
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enterWithKey: function( userId, memory, key ) {

		return memory.getRoomIdForKey( key )
		.then( this.enter.bind( this, userId, memory ) );
	},

	/**
	 * Leave a room.
	 * 
	 * @param  {String} userId id of the user whose leaving a room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @param  {String} id id for the room you'd like to leave
	 * @return {Promise} When this promise resolves it will return a room object if the room still exists and null if not
	 */
	leave: function( userId, memory, id ) {

		return memory.leaveRoom( userId, id )
		.then( function( numUsers ) {

			if( numUsers == 0 ) {

				delete rooms[ id ];
				
				return promise.resolve( null );
			} else {

				return promise.resolve( rooms[ id ] );
			}
		});
	}
};