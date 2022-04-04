# `/todo/create`
The endpoint `/todo/create` provides the possiblity to create a new TODO on the endpoint.

## `PUT`
The endpoint makes useage of the `PUT` method.

### Authorization
The endpoint requires a valid authentication bearer token, which is provided to client during the [login](../auth/login.md) process.

### Headers
The endpoint will accept any headers, but will not perform any task related to them.

### Request: body
The endpoint requires at least one request body argument `title` to create a new TODO. It takes also optional body arguments.
- `title`: `String` (required) the title of the todo.
- `description`: `String` (optional) a description of the todo (default: `empty string`).
- `priority`: `Number` (optional) the priority of the todo, the values are defined in the client application (default: `1`).
- `tag`: `String` a tag which is used as marker for the todo (default: `empty string`).
- `list`: `String` a list the todo is related to (default: `empty string`).
- `timestampDue`: `Number` a unix timestamp the todo should be done (default: `unset`).
- `timestampNotification`: `Number` a unix timestamp the client should push a notification to the user (default: `unset`).
- `assigned`: `String` a UUID this todo is assigned to (default: `current user`).


### Request: parameters
The endpoint did not accept any request parameters. Requests, containing parameters, will be denied.

### Response

### Invalid response
- Invalid `jsonwebtoken` provided, `401 - Unauthorized`.
- Request parameter contains any data, `400 - Bad Request`.
- Request body contains no title, `400 - Bad Request`.
- Request body contains other data, then defined above, `400 - Bad Request`.
- Any database related error, `500 - Internal Server Error`.

### Valid response
The endpoint response with http status code `201 - Created` on success.

## Changelog
### Version 1.0.0
Introduced the endpoint `/auth/login`. Written by syr0s <daniel.noetzel@gmail.com>.