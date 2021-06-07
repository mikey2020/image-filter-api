import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async (req: express.Request, res: express.Response) => {
    let { image_url }: {image_url: string} = req.query;
    if(image_url){
      const filteredPath: string = await filterImageFromURL(image_url)
      res.status(200).sendFile(filteredPath, () => {
        deleteLocalFiles([filteredPath])
      })
    } else {
      return res.status(400).send(`image_url is required`);
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  });
  

  // Start the Server
  app.listen(port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();