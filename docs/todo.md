

- Because `page` component cannot be deleted from SB, when restoring components it doesn't get restored (or updated)
    - maybe detect that we got "already exists" error and do a PUT operation instead
- if there is an error in a story (a field that is required isnt filled) it wont get restored
- update jsdoc comments
- add prepush hook to check types and tests
- Write integration tests for all resources
- Make resource integration tests automatically reimport dynamic files

