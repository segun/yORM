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
	this.tableName = tableName;
	this.fields = fields;

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
}

BaseEntity.prototype.save = function() {
	var insertSQL = "INSERT INTO " + this.tableName + "(" + this.csv + ") VALUES ("
	for(field in this.fields) {
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
BaseEntity.prototype.removeAll = function() {
	var deleteAllSQL = "DELETE FROM " + this.tableName;
	print(deleteAllSQL);
	this.db.execute(deleteAllSQL);
};
BaseEntity.prototype.remove = function() {
	var deleteSQL = "DELETE FROM " + this.tableName + " WHERE id=" + this.id;
	print(deleteSQL);
	this.db.execute(deleteSQL);
	this.id = null;
	for(field in this.fields) {
		eval ( '(this.' + field + '= null)');
	}
};
BaseEntity.prototype.all = function(clauses) {
	var selectAllSQL = "SELECT * FROM " + this.tableName;
	if(clauses !== undefined) {
		selectAllSQL += " " + clauses;
	}
	print(selectAllSQL);

	var rsData = [];
	var rslist = this.db.execute(selectAllSQL);
	while(rslist.isValidRow()) {
		var entity = utils.getValuesFromResultSet(rslist, this.fields);
		rsData.push(entity);
		rslist.next();
	}
	rslist.close();
	return rsData;
};
BaseEntity.prototype.find = function(id, clauses) {
	var findSQL = "SELECT * FROM " + this.tableName + " WHERE id = '" + id + "'";
	if(clauses !== undefined) {
		findSQL += " " + clauses;
	}
	print(findSQL);

	var rs = this.db.execute(findSQL);
	var entity = utils.getValuesFromResultSet(rs, this.fields);
	return entity;
};

BaseEntity.prototype.findBy = function(fieldsAndValues) {
	var findBySQL = "SELECT * FROM " + this.tableName + " WHERE ";
	for(fv in fieldsAndValues) {
		findBySQL += fv + "='" + fieldsAndValues[fv] + "' and "; 
	}
	
	findBySQL = findBySQL.substr(0, findBySQL.length - 4);
	print(findBySQL);
	
	var rs = this.db.execute(findBySQL);
	var entity = utils.getValuesFromResultSet(rs);
	return entity;
};