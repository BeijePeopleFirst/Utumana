# Configuration

To run the project is needed to:

1. Edit the properties in file 'secret.properties' (*)

(*) IMPORTANT: Add to your .gitignore the file secret.properties to keep secret your secret data)

# Docker instructions

For running Docker in local follow this steps:

1. Open the terminal in root (in this case 'utumana_backend' folder)
2. run the following commands:
    - mvn clean package
    - docker build -t <BUILD_NAME> .
    - docker run -d -p <ORIGIN_PORT>:<DESTINATION_PORT> <BUILD_NAME>

#### Exemple:

1. mvn clean package
2. docker build -t utumana .
3. docker run -d -p 8080:8080 utumana

### Alternative:

The previous third step could be done from Docker desktop. In this case follow this steps:

1. Open Docker desktop
2. verify if the build (step 2.) is present on the 'builds' page
3. Move on Images and click on the image name
4. On the new page press 'Run' in the top right corner
5. Press on 'Optional Settings'
6. In 'Ports' write the destination port of your localhost
7. Press run in bottom right corner

### Important:

Each time you make an update to your code you need to restart the whole process from step 2.
Remember also to stop your container when you don't need it anymore.

### Stop:

To stop your local container follow this steps:

1. docker ps (note: this command shows all the info about your containers)
2. docker stop <ID> (note: you can also use <NAME> instead of <ID>)

#### Exemple:

1. docker ps
2. docker stop utumana
3. (OR) docker stop a1b2c3d4e5f6

### Alternative:

You can also stop your running container following those steps:

1. Open Docker desktop
2. Move on 'Containers' page
3. Find your active container and then press the square on the right

# Swagger:

The swagger UI version of the application could be found at:

- <BASE_PATH>/swagger-ui/index.html

(Example: http://localhost:8080/swagger-ui/index.html)

The swagger JSON version of the application could be found at:

- <BASE_PATH>/v3/api-docs

(Example: http://localhost:8080/v3/api-docs)