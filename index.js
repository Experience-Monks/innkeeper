module.exports = innkeeper;

var storeRedis = require( './lib/storeRedis' ),
	storeMemoery = require( './lib/storeMemory' ),
	room = require( './lib/room' );

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

		room.reserve( this.socket, this.memory );
	},

	/**
	 * Using enter you can enter into a room. This method will return a promise
	 * which on succeed will return a room object. If the room does not exist the promise
	 * will fail.
	 * 
	 * @param  {String} roomid the id of a room. Think of it as a room number.
	 * @return {Promise} a promise will be returned which on success will return a room object
	 */
	enter: function( id ) {

		room.enter( id, this.socket, this.memory );
	},

	/**
	 * Enter a room with a key instead of a roomid. Key's are shorter than roomid's
	 * so it is much nicer for a user on the frontend to enter with.
	 * 
	 * @param  {String} key a key which will be used to enter into a room.
	 * @return {Promise} a promise will be returned which on success will return a room object
	 */
	enterWithKey: function( key ) {


	}
};