var print = function(obj) {
	Ti.API.info(obj);
};

var utils = ( function() {
	var api = {};
	api.getValuesFromResultSet = function(rs, fields) {
		var entity = this;
		entity.id = rs.fieldByName("id");
		for(field in fields) {
			var s = '(this.' + field + '="' + rs.fieldByName(field) + '")';
			eval (s);
		}
		return entity;
	};
	return api;
} ());

var BaseEntity = function(dbName, tableName, fields) {
	this.db = Titanium.Database.open(dbName);

	this.csv = "";
	this.createSQL = "CREATE TABLE IF NOT EXISTS " + tableName + "(id INTEGER PRIMARY KEY AUTOINCREMENT DEFAULT NULL, ";
	for(field in fields) {		
		if(field.indexOf(' ') > 0) {
			throw "field names can not contain spaces in " + field;
			break;
		}
		this.createSQL += field + " " + fields[field] + ","
		eval ( '(this.' + field + '= null)' );
		this.csv += field + ",";
	}
	this.id = null;

	this.csv = this.csv.substr(0, this.csv.length - 1);
	this.createSQL = this.createSQL.substr(0, this.createSQL.length - 1);

	this.createSQL += ")";
	print(this.createSQL);

	this.db.execute(this.createSQL);

	this.save = function() {
		var insertSQL = "INSERT INTO " + tableName + "(" + this.csv + ") VALUES ("
		for(field in fields) {
			var s = '(a = this.' + field + ')';
			eval(s);
			insertSQL += "'" + a + "',";
		}

		insertSQL = insertSQL.substr(0, insertSQL.length - 1);
		insertSQL += ")";
		print(insertSQL);
		this.db.execute(insertSQL);
		this.id = this.db.lastInsertRowId;
	};
	this.removeAll = function() {
		var deleteAllSQL = "DELETE FROM " + tableName;
		print(deleteAllSQL);
		this.db.execute(deleteAllSQL);
	};
	this.remove = function() {
		var deleteSQL = "DELETE FROM " + tableName + " WHERE id=" + this.id;
		print(deleteSQL);
		this.db.execute(deleteSQL);
		this.id = null;
		for(field in fields) {
			eval ( '(this.' + field + '= null)');
		}
	};
	this.all = function(clauses) {
		var selectAllSQL = "SELECT * FROM " + tableName;
		if(clauses !== undefined) {
			selectAllSQL += clauses;
		}
		print(selectAllSQL);

		var rsData = [];
		var rslist = this.db.execute(selectAllSQL);
		while(rslist.isValidRow()) {
			var entity = utils.getValuesFromResultSet(rslist, fields);
			rsData.push(entity);
			rslist.next();
		}
		rslist.close();
		return rsData;
	};	
	return this;
}
/**
 var Asset = function() {

 var db = app.myDB;
 var logging = true;

 this.id = "";
 this.assetName = "";
 this.assetPrice = "";
 this.assetLocation = "";
 this.dateCreated = "";
 this.tableName = "";

 var createSQL = "CREATE TABLE IF NOT EXISTS assets (" +
 "id INTEGER PRIMARY KEY AUTOINCREMENT DEFAULT NULL, " +
 "dateCreated INTEGER, " +
 "assetPrice REAL, " +
 "assetName TEXT, " +
 "assetLocation TEXT" +
 ")";

 var selectAllSQL = "SELECT * FROM assets";

 var getValuesFromResultSet = function(rs) {
 var asset = new Asset();
 asset.id = rs.fieldByName("id");
 asset.assetName = rs.fieldByName("assetName");
 asset.assetPrice = rs.fieldByName("assetPrice");
 asset.assetLocation = rs.fieldByName("assetLocation");
 return asset;
 };
 this.createTable = function() {
 if(logging) {
 Ti.API.info(createSQL);
 }
 db.execute(createSQL);
 };
 this.save = function() {
 var insertSQL = "INSERT INTO assets (assetName, assetPrice, assetLocation, dateCreated) VALUES ('" +
 this.assetName + "', '" +
 this.assetPrice + "', '" +
 this.assetLocation + "', '" +
 this.dateCreated +
 "')";
 if(logging) {
 Ti.API.info(insertSQL);
 }
 db.execute(insertSQL);
 this.id = db.lastInsertRowId;
 };

 this.all = function(clauses) {
 selectAllSQL += clauses;
 if(logging) {
 Ti.API.info(selectAllSQL)
 }
 var rsData = [];
 var rslist = db.execute(selectAllSQL);
 while(rslist.isValidRow()) {
 var asset = getValuesFromResultSet(rslist);
 rsData.push(asset);
 rslist.next();
 }
 rslist.close();
 return rsData;
 };

 this.destroy = function() {
 var deleteSQL = "DELETE FROM assets where id = '" + this.id + "'";
 if(logging) {
 Ti.API.info(deleteSQL);
 }
 db.execute(deleteSQL);
 };
 this.find = function(id) {
 var findSQL = "SELECT * FROM assets where id = '" + id + "'";
 if(logging) {
 Ti.API.info(findSQL);
 }
 var rs = db.execute(findSQL);
 var asset = getValuesFromResultSet(rs);
 rs.close();
 return asset;
 }
 return this;
 }
 **/