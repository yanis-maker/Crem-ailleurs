# Crem'ailleurs API
Interface entre la base de données et les applications.

## Prérequis
```
pip install -r requirements.txt
```

## Documentation

### Requête search
>```
>http://127.0.0.1:8000/search?[paramètre=<value>& . . .]
>```
>#### Exemple
>```
>http://127.0.0.1:8000/search?city=Montpellier&minprice=400
>```
>
>#### Paramètres
>+ **leasing**: boolean, 1 location, 0 vente
>+ **type**: boolean, 1 appartement, 0 maison
>+ **city**: nom de la ville
>+ **postal**: code postal
>+ **minprice**: prix minimum
>+ **maxprice**: prix maximum
>+ **minsurface**: surface minimum
>+ **maxsurface**: surface maximum
>+ **rooms**: nombre de pièces
>
>#### Retour
>+ Table JSON : Liste d'annonce sous la forme de dictionnaires.

### Requête id
>```
>http://127.0.0.1:8000/id?origin=<value>&id=<value>
>```
>#### Exemple
>```
>http://127.0.0.1:8000/id?origin=paru_vendu_index&id=5
>```
>
>#### Paramètres
>+ **origin**: nom de l'index de l'annonce (paru_vendu_index)
>+ **id**: id de l'annonce dans l'index
>
>#### Retour
>+ Dictionnaire JSON : Annonce.

### Requête cities
>```
>http://127.0.0.1:8000/cities
>```
>#### Exemple
>```
>http://127.0.0.1:8000/cities
>```
>
>#### Paramètres
>*Aucun paramètre pour cette requête.*
>
>#### Retour
>+ Table JSON : Liste des villes dans lesquelles sont présentes des annonces.

### Requête geturl
>```
>http://127.0.0.1:8000/geturl?origin=<value>&id=<value>
>```
>#### Exemple
>```
>http://127.0.0.1:8000/id?origin=paru_vendu_index&id=5
>```
>
>#### Paramètres
>+ **origin**: nom de l'index de l'annonce (paru_vendu_index)
>+ **id**: id de l'annonce dans l'index
>
>#### Retour
>+ Dictionnaire JSON : Dictionnaire comportant uniquement l'URL.

### Requête redirect
>```
>http://127.0.0.1:8000/redirect?origin=<value>&id=<value>
>```
>#### Exemple
>```
>http://127.0.0.1:8000/redirect?origin=paru_vendu_index&id=5
>```
>
>#### Paramètres
>+ **origin**: nom de l'index de l'annonce (paru_vendu_index)
>+ **id**: id de l'annonce dans l'index
>
>#### Retour
>+ Redirection automatique vers l'URL.
