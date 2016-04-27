Nous allons explorer quelques outils pour faire du web, et oui!

## Résumé expéditif
Parfois, on est super pressé et on veut plonger dans le code.

**Prérequis:** vous avez nodeJS et npm (2 ou 3)

```sh
$ mkdir essaie-lost/
$ npm init --yes
$ cd essaie-lost/
$ npm install boy-lost-webpack --save-dev
$ cd node_modules/boy-lost-webpack/
$ npm install
$ EDITOR css/style.css index.jade # lancer votre éditeur
$ npm start
```

Lisez la suite pour tous les détails croustillants.

## L'objectif: maitriser le concept de *responsive grid*
Les sites qui s'adaptent aux petits écrans (ont dit souvent mobiles) sont
en voie de devenir la norme. Ils reposent en partie sur les
*media queries* qui permettent de définir un style spécifique à telles
ou telles conditions comme la taille, la résolution, l'orientation, etc.

Le mieux pour comprendre comment ça fonctionne c'est de pouvoir éditer
les sources et voir nos changements dans le fureteur dès qu'on sauve.

Bref, en suivant ce petit tutoriel, vous serez en mesure de **faire un
*layout* à votre goût** avec Lost. Bonus: vous apprendrez un peu de Jade
(maintenant Pug, on arrête pas le progrès) pour faire vos templates HTML.

## Quelques prérequis (il était une fois)
Commençons par quelques prérequis:

* NodeJS, n'importe quelle version à partir de 4.x
* npm (package manager de NodeJS, j'utilise 3.x mais 2.x devrait aussi marcher)
* Un [bon playlist][], par exemple:
  * Jean-Pierre Ferland
  * Morphine
  * Terence Trent D'arby
  * Misteur Valaire

J'utilise Debian GNU/Linux (Jessie, la version stable) mais ça devrait marcher
avec d'autres distros, OS X et même Windows. Vous m'en donnerez des nouvelles.

Ah oui, ça se passe à la console. Vous pourrez utiliser l'éditeur texte
et le fureteur de votre choix aussi.

[bon playlist]: https://libre.fm/user/RobinMillette/recent-tracks

## Piles non comprises
Le web, c'est géant et c'est ouvert. Pas surprenant qu'il y ait autant
de façons de réaliser nos projets. Parmi les trucs populaires
qui ne sont pas couverts ici, on peut penser à:

* Twitter Bootstrap, Foundation (css)
* SASS, Less
* Yeoman, gulp, grunt, bower
* Rollup, browserify
* Browsersync
* Flash (euh, ok!)

## De webpack à Lost Grid en passant par postcss
Voici les dépendances selon notre fichier **package.json** (un extrait):

```json
"devDependencies": {
  "autoprefixer": "^6.3.6",
  "css-loader": "^0.23.1",
  "file-loader": "^0.8.5",
  "jade": "^1.11.0",
  "jade-html-loader": "0.0.3",
  "lost": "^6.7.2",
  "postcss": "^5.0.19",
  "postcss-browser-reporter": "^0.4.0",
  "postcss-cssnext": "^2.5.2",
  "postcss-import": "^8.1.0",
  "postcss-loader": "^0.8.2",
  "postcss-reporter": "^1.3.3",
  "postcss-responsive-type": "^0.3.3",
  "postcss-url": "^5.1.1",
  "standard": "^6.0.8",
  "style-loader": "^0.13.1",
  "webpack": "^1.13.0",
  "webpack-dev-server": "^1.14.1"
}
```

C'est du pain sur la planche! Mais n'ayez crainte, les [sources][] sont disponibles
comme point de départ. Tel un éléphant, prenons ça une bouchée à la fois.

[sources]: https://github.com/millette/boy-lost-webpack

## Lost Grid et vieux fureteurs
J'ai fait plusieurs projets avec Twitter Bootstrap, mais ici je voulais
m'en tenir strictement au *grid*. J'avais déjà utilisé [Lost][] et comme
l'expérience m'avait bien plu, j'ai voulu recommencer.

La dernière fois, j'ai utilisé le préprocesseur CSS Stylus, parce j'étais
curieux et aussi parce que [typographic][] en dépendait. Ce coup-ci, j'ai
remplacé Stylus par PostCSS et typographic par postcss-responsive-type.

> « Utiliser de petites librairies permet plus facilement d'en incorporer
de nouvelles et d'expérimenter. »

[Lost]: https://github.com/peterramsing/lost
[typographic]: https://github.com/corysimmons/typographic

Je me permets de reproduire cet extrait du readme de Lost:

### Browser Support

- [`calc()` grids][] work perfect on IE9+ with poor support on old Android browsers ([`calc()` browser support][]).
- With some polyfills (like the ones included in [Boy][]) Lost works perfect in IE8 as well.
- The Flexbox version of Lost only works with browsers that support Flexbox (IE10+). Unfortunately, there isn't currently a good Flexbox polyfill. [Flexbox browser support][]

[`calc()` grids]: https://webdesign.tutsplus.com/tutorials/calc-grids-are-the-best-grids--cms-22902
[`calc()` browser support]: <http://caniuse.com/#feat=calc>
[Boy]: https://github.com/corysimmons/boy
[Flexbox browser support]: http://caniuse.com/#feat=flexbox

## Oh Boy!
[Boy][] est un outil à la ligne de commande pour démarrer
un petit projet web rapidement. Ça génère les fichiers de base et
vous vous occupez du reste.

C'est à peu près la première chose que j'ai fait:

```sh
$ npm install --global boy # de n'importe où
$ cd # aller dans son home directory
$ boy essaie-boy # créer un projet dans ce répertoire
$ cd essaie-boy
```

**NOTE:** Vous n'avez pas besoin de rouler ces commandes si vous utilisez les [sources][].

Le strict minimum était maintenant en place pour utiliser Lost et
supporter le bon vieux MSIE 8. Le HTML généré s'occupe aussi d'offrir
jQuery 1.x ou 2.x selon le support détecté.

## Répétez après moi
> « Automatisez autant que possible! »

La flexibilité de Lost vient à un prix et ce prix à un nom:
M. Préprocesseur CSS. Nous utiliserons [PostCSS][] pour transformer
nos styles. On pourrait éditer un fichier css, lancer une commande pour
le transformer, recharger notre fureteur et recommencer, mais on a mieux:
[webpack][].

Avant d'entreprendre ce petit projet, j'avais entendu parler de webpack
mais je ne l'avais jamais utilisé. Il existe tellement d'options,
heuresement hors sujet pour ce petit tutoriel.

Mais avant d'aller plus loin avec webpack, un petit mot sur PostCSS.

### PostCSS
SASS, Less? Pourquoi pas le CSS de demain? Un peu comme babel qui permet
aux développeurs JavaScript d'utiliser des fonctionnalités modernes
de leur langage (au lieu de transpiler d'un autre langage comme Typescript),
[cssnext][] s'utilise avec [PostCSS][] pour offrir les futurs fonctionnalités
de CSS dès aujourd'hui.

[PostCSS]: http://postcss.org/
[cssnext]: http://cssnext.io/

### webpack
À ce que j'ai compris, si ça sert dans une page web, ça peut rentrer
dans un *bundle* webpack. CSS, JavaScript, images, tout y passe.

Le plus simple est d'utiliser un fichier de configuration.
Voici à peu près ce que j'avais au début dans **webpack.config.js**:

```javascript
'use strict'

module.exports = {
  entry: [
    './entry.js'
  ],
  output: {
    path: __dirname,
    filename: 'bundle.js'
  },
  devServer: {
    inline: true,
    host: '0.0.0.0',
    port: 1234
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  postcss: (webpack) => [
    require('postcss-import')({ addDependencyTo: webpack }),
    require('postcss-url')(),
    require('postcss-cssnext')(),
    require('lost'),
    require('postcss-browser-reporter')(),
    require('postcss-reporter')()
  ]
}
```

On fait référence à deux fichiers ci-haut, soit entry.js et bundle.js.
bundle.js sera généré par webpack, tandis qu'on doit spécifier entry.js
nous même. J'avais donc dans **entry.js**:

```javascript
require('./css/style.css')
```

**Note:** Ces deux fichiers sont légèrement incomplets comparé à ce que
vous obtiendrez via npm ou git. Ils leurs manquent trois lignes (en tout),
nous y reviendrons.

Vous remarquerez que les modules référés par les `require()` dans
**webpack.config.js** sont tous énumérés sous les devDependencies de **package.json**.

[webpack]: https://webpack.github.io/

### npm vs git
#### git
Tel que mentionné plus tôt, les [sources][] de ce tutoriel se trouvent sur github.
On peut donc obtenir le projet via git avec:

```sh
$ git clone https://github.com/millette/boy-lost-webpack.git
```

Ceci va télécharger tout le projet et son historique dans
le répertoire `./boy-lost-webpack/`. C'est utile pour
contribuer au tutoriel.

#### npm
Si on veut utiliser le projet comme point de départ,
ou si on n'a pas `git`, on va préférer `npm` pour installer le projet:

```sh
$ cd # aller dans son home directory
$ mkdir essaie-lost/
$ npm init --yes #1
$ cd essaie-lost/
$ npm install boy-lost-webpack --save-dev #2
$ cd node_modules/boy-lost-webpack/
$ npm install #3
```

En gros:

1. initialiser un projet npm dans le répertoire `./essaie-lost/`
2. installer le module du tutoriel
3. installer les dépendances du tutoriel (lost, webpack, postcss, etc.)

### Le siège du conducteur
À ce point-ci, vous aurez les fichiers webpack.config.js et entry.js
complets et tout le nécessaire pour expérimenter avec Lost.

## Coup d'oeil sur package.json
On a vu le champ `devDependencies` qui énumère les modules nécessaires.
Deux autres champs méritent notre attention, soit `scripts` et `standard`:

```javascript
"scripts": {
  "lint": "standard",
  "make": "standard && webpack && mkdir -p dist/js/polyfill/ ; cp crossdomain.xml logo.png favicon.ico index.html bundle.js dist/ && cp js/polyfill/* dist/js/polyfill/",
  "start": "standard && webpack-dev-server"
},
  "standard": {
    "ignore": [
      "js/polyfill/"
    ]
}
```

### Problème d'encodage
**ATTENTION:** *Il faut remplacer les **&amp;** par **&** dans
le bout de script ci-haut à cause d'un problème d'encodage dans l'outil
derrière ce site. Les sources n'ont pas ce problème.*

`standard` configure [standardjs][] pour ignorer les fichiers *third party*
quand vient le temps de *linter* les sources. C'est à dire que
les fichiers JavaScript (js/main.js, webpack.config.js, etc.)
seront vérifiés pour répondre au *JS Standard code style*:

* 2 espaces pour indenter
* pas de «;» à la fin des lignes
* etc.

C'est une préférence personnelle. Dans tous les cas, c'est une excellente
idée d'adopter un *code style* et de s'y tenir. Les outils automatisés
sont essentiels.

[standardjs]: http://standardjs.com/

### npm global?
Un petit mot à propos de npm. C'est un gestionnaire de paquets très versatile.
Il permet d'installer des paquets globalement ou encore localement, pour
un seul projet. Je vais préférer les installer localement. Ça veut dire
que j'ai autant d'installations de [standardjs][] que j'ai de projets.
Bon, c'est un peu d'espace disque, mais au moins les versions des paquets
ne changent pas sous mes pieds comme ça arrive avec les installations globales.

Dans le cas des installations locales, les binaires se trouvent dans
./node_modules/.bin/ et non dans le `PATH` régulier.

## Les scripts npm
Donc, l'autre champ du fichier package.json c'est `scripts`:

```javascript
"scripts": {
  "lint": "standard",
  "make": "standard && webpack && mkdir -p dist/js/polyfill/ ; cp crossdomain.xml logo.png favicon.ico index.html bundle.js dist/ && cp js/polyfill/* dist/js/polyfill/",
  "start": "standard && webpack-dev-server"
}
```

### Problème d'encodage
**ATTENTION:** *Il faut remplacer les **&amp;** par **&** dans
le bout de script ci-haut à cause d'un problème d'encodage dans l'outil
derrière ce site. Les sources n'ont pas ce problème.*

Les commandes ```standard```, ```webpack``` et ```webpack-dev-server```
se trouvent toutes dans ./node_modules/.bin/ et npm saura où les trouver
sans autres cérémonies.

Les scripts se lancent tous avec ```npm run <SCRIPT>```, même si pour
certains noms prédéterminés, le `run` est facultatif.

Voyons chacun des scripts définis:

### start
```sh
$ npm start
```

```start``` est une de ces exceptions qui ne nécéssitent pas `run`.

C'est le script qu'on lance pour démarrer un cycle d'édition.

### lint
```sh
$ npm run lint
```

Utilisé pour valider le *code style* des sources JavaScript.

### make
```sh
$ npm run make
```

Construit une version de production du projet dans le répertoire ./dist/
qu'on pourra copier sur un serveur web pour le rendre public.

## Lost commence après cette section, c'est promis!

### Lancer webpack
La commande webpack va générer le fichier bundle.js
(et index.html à partir du fichier jade - nous y reviendrons). Comme
notre objectif est de lancer une commande, d'éditer nos fichiers et
de voir nos changements dans le fureteur sans autre intervention,
nous allons regarder un peu plus loin.

### webpack-dev-server
Le projet [webpack-dev-server][] est un serveur web de développement.
**Ne l'utiliser jamais en production!**

C'est parfait dans notre cas, puisque ce serveur,
une fois bien configuré (c'est déjà fait pour vous dans webpack.config.js),
fait exactement ce que l'on cherche. On modifie des fichiers dans
notre éditeur préféré, au sauve et hop, le fureteur se met à jour automatiquement.

C'est la commande qui est lancée quand on tape ```npm start```
pour lancer le cycle d'édition.

[webpack-dev-server]: https://github.com/webpack/webpack-dev-server

### webpack.config.js et entry.js
Je disais précédemment que les fichiers `webpack.config.js` et `entry.js`
cité plus haut manquaient quelques lignes. La première concerne
[postcss-responsive-type][] démontré par ce gif animé: ![Responsive Type Demo][demo-responsive-type]

On a donc besoin de cette ligne (avec ses cousins) dans webpack.config.js:

```javascript
    require('postcss-responsive-type')(),
```

Une chose étrange que j'ai remarqué c'est que la ligne qui déclarait
le style dans le HTML n'était plus nécessaires en chargeant bundle.js.
Je dis étrange, parce que c'était mes premiers pas avec webpack, mais
ça n'a rien de surprenant quand on comprend l'outil un peu mieux.

Il en est de même pour le fichier js/main.js - si on le déclare
dans entry.js, plus besoin de l'inclure dans le HTML.

Il faut ajouter cette ligne dans entry.js:

```javascript
require('./js/main.js')
```

Le dernier changement concerne Jade. Pour la petite histoire,
je ne comptais pas du tout utiliser de template. Je préfère EJS et
les templates lodash/underscore à Jade de toutes façons.

Mon problème, c'est que même avec webpack-dev-server, les éditions au
fichier HTML ne déclenchaient pas de rafraichissement du côté du fureteur.
J'ai un peu cherché une solution mais c'est là que je suis tombé sur la
recette avec Jade.

Cette ligne va dans webpack.config.js dans le tableau entry:

```javascript
    'file?name=index.html!jade-html!./index.jade'
```

Autrement dit:

```javascript
  entry: [
    './entry.js',
    'file?name=index.html!jade-html!./index.jade'
  ],
```

Maintenant quand on démarre webpack-dev-server et qu'on édite et sauve
index.jade, style.css ou main.js, le fureteur va se rafraichir automatiquement.

[postcss-responsive-type]: https://github.com/seaneking/postcss-responsive-type
[demo-responsive-type]: https://raw.githubusercontent.com/seaneking/postcss-responsive-type/master/demo.gif

### À propos de Jade
Jade est un engin de template HTML sans les < et > et qui repose sur
l'indentation pour représenter l'arbre du document.

Je ne pensais pas en avoir besoin, mais il s'avère que pouvoir faire
des boucles paramétrables sur du HTML c'est très pratique. C'est utilisé
sur [le point RoLLodeQc][] en bas de page pour énumérer les modules
sans toujours recopier le même HTML, par exemple.

[le point RoLLodeQc]: http://lepoint.rollodeqc.com/#modules

## Lost, prêt à s'y retrouver
Tel que promis il y a 1500 mots, c'est le temps de regarder [Lost][] de
plus près pour maitriser les grilles *responsive*.

### Parenthèse Twitter Bootstrap
Avant Twitter Bootstrap, je n'avais jamais touché aux grilles
et les sites responsives étaient de la magie noire pour moi. Je faisais
du Drupal et les breakpoints, pictures et autres modules attiraient mon
attention. C'est à ce moment là que j'ai sorti la tête de Drupal pour
regarder autour tout ce qui se faisait. Je me suis lancé dans CouchDB,
NodeJS, etc. mais c'est une autre histoire.

Avec Bootstrap, on va souvent utiliser les classes `col-sm-2`, `col-lg-5`,
et ainsi de suite dans notre HTML pour disposer des éléments sur un
nombre de colonnes (2 et 5 ici) et selon la largeur de la fenêtre:
small, large, etc.

Ça donne à peu près:

```html
<div class="row">
  <div class="col-sm-2 col-lg-5">
    <p>Cette colonne est très étroite sur un petit écran, moyenne sur un écran large.</p>
  </div>
  <div class="col-sm-10 col-lg-7">
    <p>Cette colonne est très large sur un petit écran, moyenne (légèrement plus large) sur un écran large.</p>
  </div>
</div>
```

Bien qu'il n'y ait pas de `style=""` dans le HTML, c'est quand même là
que se joue notre *layout*. Ça serait mieux dans un fichier CSS. C'est
d'ailleurs possible avec Bootstrap (en passant par Less ou SASS) et
en faisant usage des mixins, mais on ne voit rarement ces exemples.

### Séparation entre le contenu et sa présentation
Comme Lost n'a pas de version css qu'on peut utiliser directement,
on doit absolument travailler à partir d'un fichier CSS, le HTML
ne suffit pas. Ça force une séparation des responsabilités entre
le contenu et sa présentation.

Par exemple:

```html
<section>
  <div class="sidebar">
    <p>Cette colonne est très étroite sur un petit écran, moyenne sur un écran large.</p>
  </div>
  <div class="content">
    <p>Cette colonne est très large sur un petit écran, moyenne (légèrement plus large) sur un écran large.</p>
  </div>
<section>
```

Sans style, les deux paragraphes apparaissent l'un sous l'autre.
Ajoutons donc style.css:

```css
@custom-media --only-large-screen (width >= 75em);

section {
  lost-utility: clearfix;
}

.sidebar {
  lost-column: 2/12;
}

.content {
  lost-column: 10/12;
}

@media (--only-large-screen) {
  .sidebar {
    lost-column: 5/12;
  }

  .content {
    lost-column: 7/12;
  }
}
```

On devrait obtenir quelque chose de similaire au résultat obtenu
avec Bootstrap.

La première ligne:

```css
@custom-media --only-large-screen (width >= 75em);
```

On utilise un [custom  media query de cssnext][] pour définir un
écran large qui sert quelques lignes plus loin:

```css
@media (--only-large-screen) {
```

Pour s'assurer que les sections s'affichent les unes sur les autres,
on fait appel à ```lost-utility: clearfix```.

Enfin, on défini la taille des colonnes par des fractions qu'on assigne
avec ```lost-column```.

[custom  media query de cssnext]: http://cssnext.io/features/#custom-media-queries
