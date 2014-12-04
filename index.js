module.exports = innkeeper;

var storeRedis = require( './lib/storeRedis' ),
	storeMemory = require( './lib/storeMemory' ),
	roomFactory = require( './lib/roomFactory' );

function innkeeper( settings ) {

	if( !( this instanceof innkeeper ) )
		return new innkeeper( settings );

	var s = settings;

	if( s.socket === undefined )
		throw new Error( 'A socket is required in settings when creating an innkeeper' );

	this.socket = s.socket;
	this.memory = s.redis ? storeRedis( s.redis ) : storeMemory();
}

innkeeper.prototype = {

	/**
	 * the reserve function will reserve a room. Reserve will return a promise which will
	 * return a room object on success.
	 * 
	 * @return {Promise} [description]
	 */
	reserve: function() {

		return roomFactory.reserve( this.socket, this.memory );
	},

	/**
	 * Using enter you can enter into a room. This method will return a promise
	 * which on succeed will return a room object. If the room does not exist the promise
	 * will fail.
	 * 
	 * @param  {String} id the id of a room you want to enter. Think of it as a room number.
	 * @return {Promise} a promise will be returned which on success will return a room object
	 */
	enter: function( id ) {

		return roomFactory.enter( this.socket, this.memory, id );
	},

	/**
	 * Enter a room with a key instead of a roomid. Key's are shorter than roomid's
	 * so it is much nicer for a user on the frontend to enter with.
	 * 
	 * @param  {String} key a key which will be used to enter into a room.
	 * @return {Promise} a promise will be returned which on success will return a room object
	 */
	enterWithKey: function( key ) {

		return roomFactory.enterWithKey( this.socket, this.memory, key );
	},

	/**
	 * Leave a room.
	 * 
	 * @param  {String} id the id of a room you want to leave. Think of it as a room number.
	 * @return {Promise} a promise will be returned which on success will return a room object if users are still in room null if not
	 */
	leave: function( id ) {

		return roomFactory.leave( this.socket, this.memory, id );
	}
};