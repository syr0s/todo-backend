# `/auth/confirm`
The endpoint `/auth/confirm` is the second step of the user account registration. It takes `?id=<received-id>` as request parameter. Without the confirmation of the user account, the account is marked as `active: false` and can not be used.

## `GET`
The endpoint has only a `GET` method which provides all functionalities.

### Authorization
No authentication needed on the endpoint.

### Headers
The endpoint will accept any headers, but will not perform any task related to them.

### Request: body
The endpoint did not accept any request body arguments. Requests, containing body arguments, will be denied.

### Request: parameters
The endpoint requires exactly one request parameter `id`, which is the same value provided in the confirm registration e-mail send to the user. The value is generated randomly, consuming the [`/auth/reggister`](register.md) endpoint.

### Response

### Invalid response
- Request contains body arguments, `400 - Bad Request`.
- Request contains not the `id` parameter, `400 - Bad Request`.
- Request contains additional or no parameters, `400 - Bad Request`.
- `id` is not valid, `409 - Conflict`.

### Valid response
The endpoint response with http status code `200 - OK` on success. The confirmation link will be removed after.

## Changelog
### Version 1.0.0
Introduced the endpoint `/auth/login`. Written by syr0s <daniel.noetzel@gmail.com>.