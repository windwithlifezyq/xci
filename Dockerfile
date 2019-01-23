
FROM java-server:v1.0

RUN mkdir -p /runDIR/
ADD app.jar /runDIR/

EXPOSE 8080
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/runDIR/app.jar","--spring.profiles.active=docker"]

