# setup

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

# TODO:

update/create compose file for staging/prod

## FRONT-END:
**[Nodejs >=5](https://nodejs.org/en/download/package-manager/) is required.**
Build script should be included in composer.json and added to git hooks.
### Install dependencies:
``` bash
$ npm install --prefix frontend
$ npm install -g bower
$ bower install
```
### Build files:
To build files go to the frontend directory and launch grunt build.
``` bash
$ cd frontend
```
``` bash
$ grunt build
```
### Development (/frontend/src):
``` html
|-- html
|   |-- index.html
|-- js
|   `-- libs
|   `-- main.js
`-- scss
    |-- components
    `-- main.scss
```