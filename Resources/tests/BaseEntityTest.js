Ti.include('TitaniumUnity.js');
Ti.include('../yORM/Entity.js');

jsUnity.attachAssertions();

function UserEntity() {

};

UserEntity.prototype = new BaseEntity("BE.db", "user", {
	'name': 'TEXT',
	'email': 'TEXT',
	'age': 'INTEGER'
});

var BaseEntitySuite = {
	suiteName: "Base Entity Tests Suite",

	user: new UserEntity(),

	setUp: function() {
	},
	tearDown: function() {
		BaseEntitySuite.user.removeAll();
	},
	testContruct: function() {
		assertNull(BaseEntitySuite.user.name);
		assertEqual(BaseEntitySuite.user.address, undefined);
	},
	testSave: function() {
		BaseEntitySuite.user.name = "Test Name";
		BaseEntitySuite.user.email = "Test Email";
		BaseEntitySuite.user.age = 19;
		BaseEntitySuite.user.save();
		assertNotNull(BaseEntitySuite.user.id);
	},
	testDelete: function() {
		BaseEntitySuite.user.name = "Test Name";
		BaseEntitySuite.user.email = "Test Email";
		BaseEntitySuite.user.age = 19;
		BaseEntitySuite.user.save();
		BaseEntitySuite.user.remove();

		assertNull(BaseEntitySuite.user.id);
	},
	testRetrieveAll: function() {
		BaseEntitySuite.user.name = "Test Name";
		BaseEntitySuite.user.email = "Test Email";
		BaseEntitySuite.user.age = 19;		
		BaseEntitySuite.user.save();
		BaseEntitySuite.user.save();
		BaseEntitySuite.user.save();
		
		var users = BaseEntitySuite.user.all();
		assertEqual(users.length, 3);
	},
}