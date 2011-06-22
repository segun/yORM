yORM
=====

Basics
-------
yORM is an ORM built specifically for Titanium Appcelerator.

Usage
------
The entry point is BaseEntity. Write a javascript class that extends BaseEntity using prototypes. 
This class serves as your Entity class (or a table in database).

###Sample Code

**Include the single entity.js file**
> `Ti.include('yORM/entity.js');`

**Declare a function like this**
> `function UserEntity() {`
> 
> `};`

**Then extend BaseEntity like this**
> `var dbName = "Your Database Name";`
> 
> `var tableName = "Your Table Name (used in the database)";`
> 
> `var fields = {`
> 
> `		'field1': 'SQLLite_DataType',`
> 
> `		'field2: 'SQLLite_DataType',`
> 
> `		'field3: 'SQLLite_DataType'`
> 
> `};`
> 
> `UserEntity.prototype = new BaseEntity(dbName, tableName, fields);`
> 
> `var user = new UserEntity();`

**The rest is easy**
> `var user = new UserEntity();`
> 
> `user.field1 = 'field1_value';`
> 
> `user.field2 = 'field2_value';`
> 
> `user.field2 = 'field3_value';`
> 
> `user.save();`
> 
> `Ti.API.info(user.id);`


Entity Methods.
> `save()` - _Insert into the table that this entity represents. Call this method after setting the values of the Entity. If you down't set any value, the default is null. The entity's id field is automatically updated with the id of inserted item._

> `removeAll()` - _Deletes from the table **WITHOUT** a where clause_

> `remove()` - _Deletes from the table where id is the id of this entity_ 

> `all()` - _Retrieves all records in the table_

> `find(id, clauses)` - _Find a single record by id. Optionally you can specify clauses. clauses can be `where`, `order`, `limit`, etc clauses supported by SQLLite. Method always return a valid Entity. If there are no records found for the id, the Entity fields will be null._

> `findBy(fieldsAndValuesObject)` - _Find a single record. The where clause is generated from the object fieldsAndValuesObject. The return value is the first record found. If there are no records found, a valid entity will still be returned but the fields will be null. fieldsAndValuesObject is a javascript object. For example to find where name is 'Don' and age is 19 we will write_ 
>> `new User().findBy({'name':'Don', 'age':19})`

> `findAllBy(fieldsAndValuesObject)` - _Find all records. The where clause is as in findBy(fieldsAndValuesObject) method. The method returns a list. If there are no records found, an empty list is returned._
