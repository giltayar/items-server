# items server

Supports a CRUD server using a REST API. Is hosted in now under `https://create-softdev-items-server.now.sh/`

Note that because it is hosted under now, and now sometimes kills the server, then the data sometimes just dissappears.

items are JSON objects that can have an `id` field, but it's not required.

## Using the Server

All REST operations are under `https://create-softdev-items-server.now.sh/<type>` where type is the type
of data, and can be any string up to 100 characters, comprising of letters, digits, the dash and underscore.

Example: `https://create-softdev-items-server.now.sh/people`

## Adding an item

To add an item, POST to `https://create-softdev-items-server.now.sh/<type>` with the JSON of the object that you want to add. It will add it to the end of the list. You need to send a `Content-Type` of `application/json`.

Example:

```http
POST https://create-softdev-items-server.now.sh/people
Content-Type: application/json

{"id": "a", "name": "Gil Tayar"}
```

## Listing all items

To list all items, GET to `https://create-softdev-items-server.now.sh/<type>`.

Returns an array of all items of that type.

Example:

```http
GET https://create-softdev-items-server.now.sh/people
```

## Retrieving a specific item by index

To get an item of an index, GET `https://create-softdev-items-server.now.sh/<type>/<index>`

Returns the item, if there is such an index, otherwise 404

Example:

```http
GET https://create-softdev-items-server.now.sh/people/0
```

## Retrieving a specific item by id

To get an item of an index, GET `https://create-softdev-items-server.now.sh/<type>/<id>`

Returns the item, if there is such an index, otherwise 404

Example:

```http
GET https://create-softdev-items-server.now.sh/people/a
```

## Updating an item

To update an item, PUT `https://create-softdev-items-server.now.sh/<type>/<id|index>` with the JSON of the object that you want to make it. It will add it to the end of the list. You need to send a `Content-Type` of `application/json`.

Updates the item. If the object sent has an id, it will replace the id in the object, otherwise the id will be kept

Example:

```http
PUT https://create-softdev-items-server.now.sh/people/0
Content-Type: application/json

{"name": "Hillary Clinton"}
```

## Deleting an item

To delete an item, DELETE `https://create-softdev-items-server.now.sh/<type>/<id|index>`.

Example:

```http
DELETE https://create-softdev-items-server.now.sh/people/a
```
