var test = require( 'prova' ),
	app = require('http').createServer(function(){}),
	io = require('socket.io')(app),
	client = require( 'socket.io-client' ),
	innkeeper = require( './..' ),
	Room = require( '../lib/room' );

var socket, keeper, room, key;

app.listen( 3333 );


test( 'reserving room', function( t ) {

	t.plan( 2 );

	io.on( 'connection', function( socket ) {

		keeper = innkeeper( { socket: socket } );

		t.ok( keeper, 'keeper was created' );

		keeper.reserve()
		.then( function( createdRoom ) {

			room = createdRoom;

			t.ok( room instanceof Room, 'received a room' );
		}, function( message ) {

			t.fail( 'failed reserving room: ' + message );
			t.end();
		});
	});

	socket = client( 'http://localhost:3333' );
});

test( 'leaving room', function( t ) {

	t.plan( 1 );

	keeper.leave( room.id )
	.then( function( room ) {

		t.equal( room, null, 'User left room and no one is in room' );
	});
});

test( 'creating a key for a room', function( t ) {

	t.plan( 1 );

	room.getKey()
	.then( function( createdKey ) {

		key = createdKey;

		t.ok( key, 'received a key to enter the room' );
	}, function() {

		t.fail( 'didnt receive key to enter room' );
	});
});

test( 'entering room with an id', function( t ) {

	t.plan( 1 );
	keeper.enter( room.id )
	.then( function( joinedRoom ) {

		t.ok( room === joinedRoom, 'Joined the same room' );
	}, function() {

		t.fail( 'unable join existing room: ' + room.id );
	});
});

test( 'entering room with a key', function( t ) {

	t.plan( 1 );
	keeper.enterWithKey( key )
	.then( function( joinedRoom ) {

		t.ok( room === joinedRoom, 'Joined the same room' );
	}, function( message ) {

		t.fail( 'Failed entering with key: ' + key + ' ' + message );
	})
});