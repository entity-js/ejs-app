# EntityJS - Components

## ACL

Provides the User and Role entities and ACL component.

### Usage

```javascript
var acl = require('ejs-acl');

acl.access('username', ['permissions']);

acl.user('username', function (err, user) {
  //
});

acl.role('role-name', function (err, role) {
  //
});
```
