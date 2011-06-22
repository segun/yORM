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
		BaseEntitySuite.user.name = "Test Name";
		BaseEntitySuite.user.email = "Test Email";
		BaseEntitySuite.user.age = 19;				
	},
	tearDown: function() {
		BaseEntitySuite.user.removeAll();
	},
	testContruct: function() {
		assertEqual(BaseEntitySuite.user.address, undefined);
		assertEqual(BaseEntitySuite.user.id, null);
	},
	testSave: function() {
		BaseEntitySuite.user.save();
		assertNotNull(BaseEntitySuite.user.id);
	},
	testDelete: function() {
		BaseEntitySuite.user.save();
		BaseEntitySuite.user.remove();

		assertNull(BaseEntitySuite.user.id);
	},
	testRetrieveAll: function() {
		BaseEntitySuite.user.save();
		BaseEntitySuite.user.save();
		BaseEntitySuite.user.save();
		
		var users = BaseEntitySuite.user.all();
		assertEqual(users.length, 3);
	},
	testFind: function () {
		BaseEntitySuite.user.save();
		var user = BaseEntitySuite.user.find(BaseEntitySuite.user.id);
		assertEqual(user.name, BaseEntitySuite.user.name);
		assertEqual(user.email, BaseEntitySuite.user.email);
		assertEqual(user.id, BaseEntitySuite.user.id);
	}	
}