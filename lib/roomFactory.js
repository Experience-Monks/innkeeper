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

		return memory.createRoom( socket.id )
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
	 * @param  {Socket} socket The socket object used to join the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @param {String} id id for the room you'd like to enter
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enter: function( socket, memory, id ) {

		return memory.joinRoom( socket.id, id )
		.then( function( id ) {

			if( rooms[ id ] === undefined ) {

				rooms[ id ] = room( socket, memory, id );	
			}
			
			return promise.resolve( rooms[ id ] );
		});
	},

	/**
	 * Join a room with a key
	 *
	 * @param  {Socket} socket The socket object used to join the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @param {String} key key used for a room
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enterWithKey: function( socket, memory, key ) {

		return memory.getRoomIdForKey( key )
		.then( this.enter.bind( this, socket, memory ) );
	},

	/**
	 * Leave a room.
	 * 
	 * @param  {Socket} socket Socket which will be leaving the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @param  {String} id id for the room you'd like to leave
	 * @return {Promise} When this promise resolves it will return a room object if the room still exists and null if not
	 */
	leave: function( socket, memory, id ) {

		return memory.leaveRoom( socket.id, id )
		.then( function( numUsers ) {

			if( numUsers == 0 ) {

				delete rooms[ id ];
				
				return promise.resolve( null );
			} else {

				return promise.resolve( rooms[ id ] );
			}
		})
	}
};