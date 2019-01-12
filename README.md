# ilorm (I Love ORM)
New kind of NodeJS ORM.

[![Circle status](https://img.shields.io/circleci/project/github/nodegang/ilorm.svg)]()
[![Circle status](https://img.shields.io/github/issues/nodegang/ilorm.svg)]()
[![Circle status](https://img.shields.io/github/license/nodegang/ilorm.svg)]()
[![Circle status](https://img.shields.io/codeclimate/maintainability/nodegang/ilorm.svg)]()
[![Circle status](https://img.shields.io/codeclimate/c/nodegang/ilorm.svg)]()

You can found example and documentation on the 
[Official Ilorm website](https://nodegang.github.io/ilorm-site/)

## Why a new ORM ?
- Use newest feature of ECMAScript (modern javascript).
- Universal database connector (MongoDB, SQL, Redis, REST, CSV...).
- Could create powerful plugin using the "class" inheritance.

## Features
- Universal connector to bind every kind of database
- Powerful plugin ecosystem
- Query builder
- Data validation

## Initialize

## Schema
```javascript
const ilorm = require('ilorm');
const schema = ilorm.schema;

const schema = schema.new({
  firstName: schema.String().required(),
  lastName: schema.String().required(),
  children: schema.Array(schema.reference('User'))
  birthday: schema.Date(),
  weight: schema.Number().min(5).max(500)
});

```
### ilorm.schema
| Function | Description |
|:--------:|-------------|
| *static* new( schema ) | Create a new ilorm schema. |
| *static* string() | Instantiate a SchemaField/String |
| *static* number() | Instantiate a SchemaField/Number |
| *static* boolean() | Instantiate a SchemaField/Boolean |
| *static* date() | Instantiate a SchemaField/Date |
| *static* reference() | Instantiate a SchemaField/Reference |

### All SchemaField
All SchemaField are children of the class SchemaField. This class contains this method :

| Function | Description |
|:--------:|-------------|
| required() | The field is required for create an object (per default not required). |
| default(`value`) |  Set a precise value for default (if you do not set a value at creation). |

### SchemaField/Number
Represent a javascript number.

### SchemaField/String
Represent a javascript string.

### SchemaField/Boolean
Represent a javascript boolean.

### SchemaField/Date
Represent a javascript date.

### SchemaField/Reference
Represent a javascript reference to another instance.


## Models
```javascript
const ilorm = require('ilorm');
const ilormMongo = require('ilorm-connector-mongo');
const model = require('ilorm').model;

const userSchema = require('./schema');
const userModel = model('User', userModel, ilormMongo({ db }));

userModel.query()
  .firstName.is('Smith')
  .findOne()
  .then(user => {
    user.weight = 30;
    return user.save();
  });
```

### ilorm.model ###
| Function | Description |
|:--------:|-------------|
| query()  | Instantiate a Query targeting the current Model |

## Query ##
### Fields ###
In a query, every field present in the schema could be use to build the query.
The **[field]** part in further documentation are every field declared in your specific schema.

#### Exemple of query ####
```javascript
// if your schema is something like this ;
const schema = ilorm.schema({
  firstName: ilorm.String().required(),
});

// You could write query like this :
const user = await User.query()
    .firstName.is('Smith')
    .findOne();
```

### Filters ###

| Function | Description |
|:--------:|-------------|
| **[field]**.is(value) | Check if the field is equal value |
| **[field]**.isNot(value) | Check if the field is not equal with value |
| **[field]**.isIn(arrayOfValue) | Check if the field value is one of the array value |
| **[field]**.isNotIn(arrayOfValue) | Check if the field value is none of array value |
| **[field]**.between(min, max) | Check if the value is between min and max (include)|
| **[field]**.min(value) | Check if the value is equal or superior than the value |
| **[field]**.max(value) | Check if the value is equal or inferior than the value |
| **[field]**.linkedWith(value) | Check if the field (reference) is linked with another model, id, ... |

### Update ###
Used for update or updateOne query only :

| Function | Description |
|:--------:|-------------|
| **[field]**.set(`value`) | Set the value of the field |
| **[field]**.inc(`value`) | Incremente the value of the field by the given value |


### Operations ###
| Function | Description |
|:--------:|-------------|
| find() | Run the query and return a promise with the result (array of instance). |
| findOne() | Run the query and return a promise the result (instance). |
| count() | Count the number of instance and return it. |
| stream() | Run the query with a stream context could be the best solution for big query. |
| remove() | Remove the instance which match the query. |
| removeOne() | Remove only one instance which math the query. |
| update() | Used to update many instance. |
| updateOne() | Used to update one instance. |


#### Query.update ####

```javascript
userModel.query()
  .firstName.is('Smith')
  .weight.set(30)
  .update();

```

#### Query.stream ####
```javascript
userModel.query()
  .stream() //Return a standard stream
  .pipe(otherStream);

```


## Instances
Instances are returned after a loading (find, or stream). It's a specific item loaded from the database. You can create a new instance from the model :
```javascript
const instance = new userModel();
instance.firstName = 'Thibauld';
instance.lastName = 'Smith';
instance.save();
```


| Function | Description |
|:--------:|-------------|
| save() | Save the instance in the database (auto insert or update) |
| remove() | Delete the instance from the database |
