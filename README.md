# [DnD tools app]
# Setup

Install docker and docker-compose - https://docs.docker.com/compose/

Now, build the container set with docker-compose
```
docker-compose build
```

add `127.0.0.1 nlogic.local` to your /ect/hosts file

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
Go to front end folder and type 
```
npm install 
```
To the entire project and copy everything to assets in Enonic.
```
gulp build
```