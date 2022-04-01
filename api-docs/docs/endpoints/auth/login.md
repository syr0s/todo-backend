# `/auth/login`
The endpoint `/auth/login` is typically used to create a new `json web token` to authenticate a requesting user on the RESTful API, without the need of providing the users credentials on every request.

## `GET`
The `GET` method of the endpoint `/auth/login` can be used in two different ways. It can be used to generate a new `jwt` by passing in the users credentials or to re-new a already issued `jwt`.

### Authorization
`Optional`. The endpoint accepts an optional bearer token as authentication header. This is typically used, if you want to re-new an already issued `jwt` on the RESTful API. You should always re-new the `jwt` during the startup of your client application, as the issued `jwt` has an expiry time of `30` days after issuing. The endpoint will ignore invalid or expired `jwt` and proceed to authenticate the requesting client, using the provided credentials.

In cases you want to use the re-new feature of the endpoint, you don´t have to provide any request body arguments. Please note, in cases the re-new fails and no credentials are provided, the endpoint will respond with http status code `400 - Bad Request`.

### Headers
The endpoint will accept any headers, but will not perform any task related to them.

### Request: body
The endpoint requires the following request body arguments, in any cases no or an invalid bearer token is provided to the RESTful API. Best practise to consum this endpoint is to provide always the required body arguments, to avoid `400 - Bad Request` respond of the API. The request body **must** be send in `x-www-form-urlencoded` do not use `form-data` or something else, as the RESTful API will not accept it!

- `email`: `String`- the email address, in plaintext, of the user to login. The server accepts every e-mail address once. So you can be sure, that the credential negotiation will be performed on the related user account.
- `passwordHash`: `String` - the password as `sha-256` hash value. The API will never ask the client for the plaintext password. The hashing of the password is in response of the client application consuming the RESTful API. The passwordHash must matched the stored passwordHash of the related email address.

### Request: parameters
The endpoint did not accept any request parameters. Requests, containing parameters, will be denied.

### Response

### Invalid response
- Request contains parameters, for example `?id=1`: `400 - Bad Request`.
- Invalid optional bearer token AND no user credentials provided: `400 - Bad Request`.
- Request body send as something else then `x-www-form-urlencoded`: `400 - Bad Request`.
- User credentials provided, but no matching user account found: `401 - Unauthorized`.
- User credentials provided, but `passwordHash` is invalid: `403 - Forbidden`.
- User credentials provided, but user is marked as `active: false` in the database: `423 - Locked`.

### Valid response
The RESTful API will respond with http status code `200 - OK` on any valid request on the resource. The response contains a message `content-type: application/json` with the following, example content:

```json
{
    "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNjI0NTZhOGUxYTg0YjczMWZkZWIyOGY3IiwidGltZXN0YW1wIjoxNjQ4Nzk2MzM3ODcxLCJpYXQiOjE2NDg3OTYzMzd9.NMhqdvHqyfWrUA6t_1Ud33qxhohjizhu1PA4YOFnHS1_8P_e2CjEpLfHnfJv4LqGCRlyZlLA-z4wURMma-wKIVYDwIy1Tc8OfKSc7O_L7ojaJPOMFyz2k53boR0AdZtZe9w0pFhJ_jehYpZVyof8E5JQqs3QJIjcE0nLeLmnhALEp_u9lfpR-PGI0rDPm4GClEvV0UMeVy487Vu16WjUZittgeCgdcNSJzxaXbqqrVw8C6hrVZ6gn-UUsjCnooL2Ha_tsmUTURWcSK7WVZA0iI2wZRUzaAlj0EaCfIo8siKph40y9KTtdPNeyb1foz9jafZf4GUStWyc6EAv8iUKHVdpbxFBGgdTmCprhkY9_xMX4SLJS8ftixXdmRDxFWveFXKXy91Unb9Tqku9vlIqqxQ4Fae-wEVuEKQ7V0kN-bhOpEBr85YIAVHDv15diWgjaDmSe0Soz2zHtuFeFLYKcnShEjcJHcIJL9FtX5uLsOiiP0gweVNYwJEGny1Z1RTm2RkqUNJw074Jim75xnmKaP-6ZAp-O8GHJHbRaRCO7Ik98ldzWJJ1P_torA1r2nMAO2yqf9rxbpoT6jKP1C4oLXHf8s8kw-tsKF5IwqEVGakHsOt6VYIRtwN5mgY7M9pIFzKl-W9lcnqR7XMCdd7bcwGrhxLu6FM2PUJ3rnqqwNE",
    "uuid": "62456a8e1a84b731fdeb28f7"
}
```

- `token`: `String` - the issued `json web token` for further requests on the RESTful API. You may want to use this token as a bearer token in all other requests on the API.
- `uuid`: `String` - the unique user id of the user challenged this request. The `uuid` can be used on specific endpoints of the RESTful API.

## Changelog
### Version 1.0.0
Introduced the endpoint `/auth/login`. Written by syr0s <daniel.noetzel@gmail.com>.