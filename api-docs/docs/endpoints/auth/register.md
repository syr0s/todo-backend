# `/auth/register`
The endpoint `/auth/register` is used to register a new user account on the backend. The registration is a two-step process. This means, in the first step the client will provide the user data to the server. The backend will create a new `locked` user account and sends an e-mail with a [confirmation link](confirm.md) to the users given e-mail address. The confirmation link is valid for **one** day after issuing a new user account.

## `PUT`
The usage of the `PUT` method on the endpoint `/auth/register` is used to generate a new user account.

### Authorization
No authentication needed on the endpoint.

### Headers
The endpoint will accept any headers, but will not perform any task related to them.

### Request: body
The endpoint requires the following request body arguments. The request body **must** be send in `x-www-form-urlencoded` do not use `form-data` or something else, as the RESTful API will not accept it!

- `email`: `String`- the email address, in plaintext, of the user to register. The server accepts every e-mail address once. So you can be sure, that the credential negotiation will be performed on the related user account.
- `passwordHash`: `String` - the password as `sha-256` hash value. The API will never ask the client for the plaintext password. The hashing of the password is in response of the client application consuming the RESTful API. T

### Request: parameters
The endpoint did not accept any request parameters. Requests, containing parameters, will be denied.

### Response

### Invalid response
- Request contains parameters, for example `?id=1`: `400 - Bad Request`.
- Request body send as something else then `x-www-form-urlencoded`: `400 - Bad Request`.
- No `email` and / or `passwordHash` provided in the request body: `400 - Bad Request`.
- E-Mail address is already in use: `409 - Conflic`.
- On any MongoDB errors: `500 - Internal Server Error`.

### Valid response
The endpoint response with http status code `201 - Created` on success.

## Changelog
### Version 1.0.0
Introduced the endpoint `/auth/login`. Written by syr0s <daniel.noetzel@gmail.com>.