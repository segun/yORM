var BaseEntity = function(dbName, tableName, fields, otherDefinitions) {
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
		this[field] = null;
		this.csv += field + ",";
	}
	this.id = null;

	this.csv = this.csv.substr(0, this.csv.length - 1);
	this.createSQL = this.createSQL.substr(0, this.createSQL.length - 1);

	if(otherDefinitions !== undefined) {
		if(otherDefinitions !== null) {
			this.createSQL += ", " + otherDefinitions
		}
	}

	this.createSQL += ")";
	print(this.createSQL);

	this.db.execute(this.createSQL);
}
BaseEntity.prototype.save = function() {
	var insertSQL = "INSERT INTO " + this.tableName + "(" + this.csv + ") VALUES ("
	for(field in this.fields) {
		var a = this[field];
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
		this[field] = null;		
	}
};
BaseEntity.prototype.all = function(clauses) {
	var selectAllSQL = "SELECT * FROM " + this.tableName;
	if(clauses !== undefined) {
		selectAllSQL += " " + clauses;
	} else {
		selectAllSQL += " ORDER BY id DESC";
	}
	print(selectAllSQL);

	var rsData = [];
	var rslist = this.db.execute(selectAllSQL);
	while(rslist.isValidRow()) {
		var entity = yORMUtils.getValuesFromResultSet(rslist, this.fields, this);
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
	var entity = yORMUtils.getValuesFromResultSet(rs, this.fields);
	rs.close();
	return entity;
};
BaseEntity.prototype.findBy = function(fieldsAndValues) {
	var rs = yORMUtils.find(this.tableName, this.db, fieldsAndValues);
	var entity = yORMUtils.getValuesFromResultSet(rs, this.fields);
	rs.close()
	return entity;
};
BaseEntity.prototype.findAllBy = function(fieldsAndValues) {
	var rslist = yORMUtils.find(this.tableName, this.db, fieldsAndValues);
	var rsData = [];
	while(rslist.isValidRow()) {
		var entity = yORMUtils.getValuesFromResultSet(rslist, this.fields);
		rsData.push(entity);
		rslist.next();
	}
	rslist.close();
	return rsData;
};
BaseEntity.prototype.raw = function(rawSQL) {
	print(rawSQL);
	var rs = this.db.execute(rawSQL);
	return rs;
}
BaseEntity.prototype.update = function() {
	var fields = this.fields;
	var updateSQL = "UPDATE " + this.tableName + " SET "
	for(field in this.fields) {
		updateSQL += field + " = '" + this[field] + "', "
	}

	updateSQL = updateSQL.substr(0, updateSQL.length - 2);
	updateSQL += " WHERE id = " + this.id;
	print(updateSQL);
	this.db.execute(updateSQL);
};
var print = function(obj) {
	Ti.API.info(obj);
};
var yORMUtils = ( function() {
	var api = {};
	api.getValuesFromResultSet = function(rs, fields) {
		var newEntity = {};
		newEntity.id = rs.fieldByName("id");
		for(field in fields) {
			newEntity[field] = rs.getFieldByName(field);
		}
		return newEntity;
	};
	api.find = function(tableName, db, fieldsAndValues) {
		var findBySQL = "SELECT * FROM " + tableName + " WHERE ";
		for(fv in fieldsAndValues) {
			findBySQL += fv + "='" + fieldsAndValues[fv] + "' and ";
		}

		findBySQL = findBySQL.substr(0, findBySQL.length - 4);
		print(findBySQL);

		var rs = db.execute(findBySQL);
		return rs;
	}
	return api;
} ());