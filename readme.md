# Explorons webpack et lost (grid) [![Dependency Status](https://gemnasium.com/badges/github.com/millette/rollodeqc-dev-profile.svg)](https://gemnasium.com/github.com/millette/rollodeqc-dev-profile)

```sh
$ git clone ...
$ npm install
$ # Les fichiers user.json et events.json peuvent être mis à jour:
$ node_modules/.bin/rollodeqc-gh-user GITHUB-USERNAME > user.json
$ node_modules/.bin/rollodeqc-gh-user-events GITHUB-USERNAME > events.json
$ www-browser http://localhost:1234/ # faire F5 après "npm start"
$ npm start
```

## Plus d'info
<https://gitlab.com/rollodeqc/redesign/issues/4>

## Aperçu
![smaller](https://gitlab.com/rollodeqc/redesign/uploads/8b3ec243b8980d04b7b184d85eeda3c6/2016-05-09-091128_1025x987_scrot.png)

## Notes
Avec une clé github, on est throttlé à 5000 requetes/heure - mais sans clé d'api, c'est 100 fois moins généreux.

Vu que tu as juste 30 requetes à faire il n'aurait pas besoin de se rate-limiter tellement.

Comment on fait pour avoir une clé ?
<https://github.com/settings/tokens>

Mettra la clé dans l'environnement: export GITHUB_TOKEN=LA-CLÉ-BLA_BLA_BLA

Faut tout cocher les choses? Non.

Si npm start roule ça update le browser tout seul (ça f5 - mais je vais arranger ça pour être plus smooth (hot reload, je crois)
