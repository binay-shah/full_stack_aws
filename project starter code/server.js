import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import fs from 'fs'



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  app.get( "/filteredImage", async (req, res) => {

    const pattern = /\.(jpg|jpeg|png|webp|avif|gif|svg)$/
    let { image_url } = req.query
    console.log(image_url)
    if(!pattern.test(image_url)){
      res.status(422).send("Invalid image")
    }

      filterImageFromURL(image_url).then((path) => {
      console.log(path)
      res.status(200).send(path)
    }).catch((err) => {
      console.log(err)
      res.status(422).send(err)
    }).finally(() => {
      let files = fs.readdirSync('/tmp/', {withFileTypes: true})
      .filter(item => !item.isDirectory())
      .map(item => item.name).filter((name) => name.startsWith('filtered'))
      .map((name) => "/tmp/"+name)
      deleteLocalFiles(files)
      
    })
    
  });
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
