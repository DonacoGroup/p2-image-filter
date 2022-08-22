import express, {NextFunction, Request, Response} from 'express';
import "dotenv/config"
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles, listLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get('/filteredimage', async (req: Request, res: Response) => {
    // Retrieve the image_url from query parameters
    const {image_url} = req.query;
    // Validate image_url
    if(!image_url){
      res.status(400).send('The image_url parameter is required!');
    }
    try{
      // Filter image from image_url
      const filteredImage:string = await filterImageFromURL(image_url);
      // Send the resulting file in the response
      res.status(200).sendFile(filteredImage);
      res.on('finish',async () => {
        // get all tmp files' paths
        const files:Array<string> = await listLocalFiles()
        // deletes any files on the server on finish of the response
        await deleteLocalFiles(files)
      })
    }
    catch (e) {
      res.status(422).send('Something went wrong when filtering the image')
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();