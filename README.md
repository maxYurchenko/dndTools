# [DnD tools app]
# Setup

## Recommender way
Install Enonic XP by following the [official docummentation](http://xp.readthedocs.io/en/stable/getstarted/other.html).

## Using docker
*I am not using this method for some time, so, note, there might be some troubles with it.*

Install docker and docker-compose - https://docs.docker.com/compose/

Now, build the container set with docker-compose
```
docker-compose build
```

add `127.0.0.1 dndtools.local` to your /ect/hosts file

## Running the application
To run the application, simply run the following command after building the image as described above
```
$ docker-compose up -d
```
To stop the application
```
$ docker-compose down
```

To remove created volume ( remove all existing data for current installation ) :
```
$ docker-compose down -v
```

## Front End setup
You would need npm to setup the front end.
Go to front end folder and type:
```
npm install 
```
To build project and copy everything to assets in Enonic.
```
gulp build
```

You should be able to find the project by URL:
http://dndtools.local:81
Admin interface:
http://dndtools.local:81/admin
Default user and password is: su/password