const Clarifai = require('clarifai')
const api_key = process.env.CLARIFAI_API
const app = new Clarifai.App({
    apiKey: api_key
  });
  

const handleImage = (req, res)=>{
    const input = req.body.input
    app.models
      .predict(Clarifai.CELEBRITY_MODEL, input)
      .then(dat=>res.json(`${dat.outputs[0].data.regions[0].data.face.identity.concepts[0].name}`))
      .catch(e=>res.status(404).json(e))
     // .then(response => {response.outputs[0].data.regions[0].data.face.identity.concepts[0].name})
    
}

module.exports={
    handleImage:handleImage
}