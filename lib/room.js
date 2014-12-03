var promise = require( 'bluebird' );

module.exports = {

	/**
	 * Create a new room object
	 * 
	 * @param  {Socket} socket The socket object used to create the room
	 * @param  {storeMemory} memory Memory store used to save data for a room
	 * @return {Promise} This promise will resolve by sending a room instance
	 */
	reserve: function( socket, memory ) {

		return promise.resolve( function() {

			room( socket, memory );
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

function room( socket, memory, roomData ) {

	if( !( this instanceof room ) )
		return new room( socket, memory );

	this.socket = socket;
	this.memory = memory;
	this.roomData = roomData || {};

	/**
	 * The room id. Users can use the room's id to enter this room.
	 * 
	 * @type {String}
	 */
	this.id = null;

	/**
	 * The current key for the room. If this value is null no key is set for the room.
	 * 
	 * The room key can be used to enter the room. It is equivalent to using a room id 
	 * but generally the key is shorter and the key should be returned at some point
	 * 
	 * @type {String}
	 */
	this.key = null;
}

room.prototype = {

	/**
	 * getKey will reserve a key for this room. This key can be shared
	 * to allow other users to enter into this room.
	 * 
	 * @return {Promise} this promise will return the key for this room
	 */
	getKey: function() {

		if( this.key === null )
			return this.memory.getKey( this.id )
				   .then( function( key ) { 

				   		this.key = key; 

				   		return key;
				   }.bind( this ) );
		else
			return promise.resolve( this.key );
	},

	/**
	 * Return the key that this room was using. This will ensure there will be enough keys in the inn.
	 * There can be way more roomid's there than can be keys. Therefore it's always good practice to
	 * return a key for a room when we're finished with it.
	 *
	 * For example your room can have 3 guests max. Once we've reached the max room size we may want to
	 * return the key back to the pool of keys.
	 * 
	 * @return {Promise} this promise will always succeed even if no key was made for the room
	 */
	returnKey: function() {

		if( this.key !== null )
			return this.memory.returnKey( this.id, this.key )
				   .then( function() { this.key = null; }.bind( this ) );
		else
			promise.resolve();
	},

	/**
	 * Sets a variable on the room. All users in the room will receive an event that a variable
	 * change happened.
	 * 
	 * @param {String} key The name of the variable you want to set
	 * @param {*} value A value which will be stored for this key
	 */
	setVar: function( key, value ) {

		this.roomData[ key ] = value;

		this.memory.setRoomData( this.id, this.roomData );
	},

	/**
	 * Gets a variable set in the room. If this variable does not exist undefined will be returned.
	 * 
	 * @param  {String} key [description]
	 * @return {*} 
	 */
	getVar: function( key ) {

		return this.roomData[ key ];
	},

	/**
	 * Set the data stored in the room. All users in the room will receive an event that room data
	 * was changed.
	 *
	 * @param {Object} data The data used by this room.
	 */
	setRoomData: function( data ) {

		this.roomData = data;

		this.memory.setRoomData( this.id, this.roomData );
	},

	/**
	 *	Get the data stored for this room as an Object.
	 * 
	 * @return {Object} Room data stored for this room.
	 */
	getRoomData: function() {

		return this.roomData;
	}
};