module.exports = innkeeper;

var promise = require( 'bluebird' );
var storeMemory = require( 'innkeeper-storememory' );
var room = require( './lib/room' );

var rooms = {};

function innkeeper( settings ) {

	if( !( this instanceof innkeeper ) )
		return new innkeeper( settings );

	settings = settings || {};

	this.memory = settings.memory || storeMemory();
}

innkeeper.prototype = {

	/**
	 * Create a new room object
	 * 
	 * @param  {String} userId id of the user whose reserving a room
	 * @param  {Boolean} isPublic whether the room your are creating is publicly available
	 * @return {Promise} This promise will resolve by sending a room instance
	 */
	reserve: function( userId, isPublic ) {

		return this.memory.createRoom( userId )
			   .then( function( id ) {

			   		rooms[ id ] = room( this.memory, id );
			   		if ( isPublic ) {

			   			return rooms[ id ].makePublic().then(function() {
			   				return promise.resolve( rooms[ id ] );
			   			});
			   		} else {
							
							return promise.resolve( rooms[ id ] );
			   		}
			   }.bind( this ), function() {

			   		return promise.reject( 'could not get a roomID to create a room' );
			   });
	},

	/**
	 * Join a room
	 *
	 * @param  {String} userId id of the user whose entering a room
	 * @param {String} id id for the room you'd like to enter
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enter: function( userId, id ) {

		return this.memory.joinRoom( userId, id )
		.then( function( id ) {

			if( rooms[ id ] === undefined ) {

				rooms[ id ] = room( this.memory, id );	
			}
			
			return promise.resolve( rooms[ id ] );
		}.bind( this ));
	},

	/**
	 * Join a room with a key
	 *
	 * @param  {String} userId id of the user whose entering a room
	 * @param {String} key key used for a room
	 * @return {Promise} This promise will resolve by sending a room instance if the room does not exist it will fail
	 */
	enterWithKey: function( userId, key ) {

		return this.memory.getRoomIdForKey( key )
		.then( this.enter.bind( this, userId ) );
	},

	/**
	 * Join an available public room or create one
	 *
	 * @param  {String} userId id of the user whose entering a room
	 * @return {Promise} This promise will resolve by sending a room instance, or reject if no public rooms available
	 */
	enterPublic: function( userId ) {
		return this.memory.getPublicRoom()
		.then(function( roomId ) {
			if ( roomId ) {
				return this.enter( userId, roomId);
			} else {
				return promise.reject( 'Could not find a public room' );
			}
		}.bind(this));
	},

	/**
	 * Leave a room.
	 * 
	 * @param  {String} userId id of the user whose leaving a room
	 * @param  {String} id id for the room you'd like to leave
	 * @return {Promise} When this promise resolves it will return a room object if the room still exists and null if not
	 */
	leave: function( userId, id ) {

		return this.memory.leaveRoom( userId, id )
		.then( function( numUsers ) {

			if( numUsers == 0 ) {

				// remove all listeners from room since there should be one
				rooms[ id ].removeAllListeners();

				delete rooms[ id ];
				
				return promise.resolve( null );
			} else {

				return promise.resolve( rooms[ id ] );
			}
		});
	}
};