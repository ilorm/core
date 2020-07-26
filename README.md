# ilorm (I Love ORM)
New way to manipulate data with NodeJS.

![.github/workflows/test.yaml](https://github.com/ilorm/core/workflows/.github/workflows/test.yaml/badge.svg?branch=master)
[![.github/issues](https://img.shields.io/github/issues/ilorm/core.svg)]()
[![./LICENCE](https://img.shields.io/github/license/ilorm/core.svg)]()
[![](https://img.shields.io/librariesio/github/ilorm/core.svg)](https://libraries.io/github/ilorm/core)
[![Coverage Status](https://coveralls.io/repos/github/ilorm/core/badge.svg?branch=master)](https://coveralls.io/github/ilorm/core?branch=master)

You can found example and documentation on the 
[Official Ilorm website](https://ilorm.github.io)

## Why a new ORM ?
- Elegant way to separate database from business logic.
- Easy way to create powerful plugins using the "class" inheritance.
- Universal database / data source connector (MongoDB, SQL, Redis, REST, CSV...).
- Use newest feature of ECMAScript (modern javascript).

## Features
- Universal connector to bind every kind of database or data source.
- Powerful plugin ecosystem
- Query builder
- Data validation


# Contributing
Please, refer to our [code of conduct](./CODE_OF_CONDUCT.md) before starting and to our [contributing guide](./CONTRIBUTING.md).

## Initialize

## Schema
With a Schema you define the way your data are represented.
```javascript
const ilorm = require('ilorm');
const schema = ilorm.schema;

const userSchema = schema.new({
  firstName: schema.String().required(),
  lastName: schema.String().required(),
  children: schema.Array(schema.reference('User')),
  birthday: schema.Date(),
  weight: schema.Number().min(5).max(500)
});

```
### ilorm.schema
| Function | Description |
|:--------:|-------------|
| *static* new( schema ) | Create a new ilorm schema. |
| *static* string() | Instantiate a Field/String |
| *static* number() | Instantiate a Field/Number |
| *static* boolean() | Instantiate a Field/Boolean |
| *static* date() | Instantiate a Field/Date |
| *static* reference() | Instantiate a Field/Reference |

### All Fields
All Fields are children of the class BaseField. This class contains this method :

| Function | Description |
|:--------:|-------------|
| required() | The field is required for create an object (per default not required). |
| default(`value`) |  Set a precise value for default (if you do not set a value at creation). |

### Field/Number
Represent a javascript number.

### Field/String
Represent a javascript string.

### Field/Boolean
Represent a javascript boolean.

### Field/Date
Represent a javascript date.

### Field/Reference
Represent a javascript reference to another instance.


## Models
```javascript
const ilorm = require('ilorm');
const ilormMongo = require('ilorm-connector-mongo');

const userSchema = require('./schema');
const userModel = ilorm.newModel({
  name:'User',
  connector: ilormMongo({ db }),
  schema: userSchema,
});

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
