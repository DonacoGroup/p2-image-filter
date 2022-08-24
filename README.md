# Udagram Image Filtering Microservice

Udagram is a simple cloud application developed alongside the Udacity Cloud Engineering Nanodegree. It allows users to register and log into a web client, post photos to the feed, and process photos using an image filtering microservice.

The project is split into three parts:
1. [The Simple Frontend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-frontend)
A basic Ionic client web application which consumes the RestAPI Backend. [Covered in the course]
2. [The RestAPI Backend](https://github.com/udacity/cloud-developer/tree/master/course-02/exercises/udacity-c2-restapi), a Node-Express server which can be deployed to a cloud service. [Covered in the course]
3. [The Image Filtering Microservice](https://github.com/udacity/cloud-developer/tree/master/course-02/project/image-filter-starter-code), the final project for the course. It is a Node-Express application which runs a simple script to process images. [Your assignment]

## Tasks

### Setup Node Environment

You'll need to create a new node server. Open a new terminal within the project directory and run:

1. Initialize a new project: `npm i`
2. run the development server with `npm run dev`

### Create a new endpoint in the server.ts file

The starter code has a task for you to complete an endpoint in `./src/server.ts` which uses query parameter to download an image from a public URL, filter the image, and return the result.

We've included a few helper functions to handle some of these concepts and we're importing it for you at the top of the `./src/server.ts`  file.

```typescript
import {filterImageFromURL, deleteLocalFiles} from './util/util';
```

### Deploying your system

Follow the process described in the course to `eb init` a new application and `eb create` a new environment to deploy your image-filter service! Don't forget you can use `eb deploy` to push changes.

## Stand Out (Optional)

### Refactor the course RESTapi

If you're feeling up to it, refactor the course RESTapi to make a request to your newly provisioned image server.

Answer: This was achieved through the following process:
1. I've added IMAGE_FILTER_ENDPOINT to environment variable so that it be easily manage without accessing the code
   and I've used "encodeURIComponent()" in order to avoid the url being cut short when supplied as a parameter to the IMAGE_FILTER_ENDPOINT.
2. I've created an event bus named "broker" to listen to 'image_upload' event and make a request to your newly provisioned image server.
```javascript
    src/controllers/v0/broker.ts

    import {EventEmitter} from 'events';
    import axios from "axios";
    import "dotenv/config"
    
    const broker:EventEmitter = new EventEmitter();
    
    broker.on('image_upload', async (url:string)=>{
        //make a call to p2-image-filter service
        try{
            const res = await axios.get(process.env.IMAGE_FILTER_ENDPOINT+encodeURIComponent(url))
        }
        catch (e){
        }
    
    })
    
    export default broker;
    
```
3. Inside of the api that "Post meta data and the filename after a file is uploaded", I've published the 'image_upload' event to the previous "broker" after the response finishes

```javascript
    src/controllers/v0/feed/routes/feed.router.ts

    ...
    res.status(201).send(saved_item);
    
    // File upload was successful here since before this is run, the image has already been uploaded
    // Emit on finish
    res.on('finish', ()=>{
        broker.emit('image_upload', saved_item.url)
    })
    
```

> !!NOTE Important: The image upon upload is sent the image processing 
service which deletes it after the processing is completed.
### Authentication

Prevent requests without valid authentication headers.
> !!NOTE if you choose to submit this, make sure to add the token to the postman collection and export the postman collection file to your submission so we can review!

### Custom Domain Name

Add your own domain name and have it point to the running services (try adding a subdomain name to point to the processing server)
> !NOTE: Domain names are not included in AWS’ free tier and will incur a cost.

Answer: This was achieved through the following process:

1. I've created a subdomain imagefilter.donacosarl.com
2. I've update the DNS records so that its CNAME would point to the image-filter endpoint: 
http://p2-image-filter-dev.us-east-1.elasticbeanstalk.com
3. I've check this with Google Dig tool: https://toolbox.googleapps.com/apps/dig/#CNAME with "imagefilter.donacosarl.com" as the value for the name field


> !!NOTE Important: This was done with a domain that i own which is hosted on namecheap.