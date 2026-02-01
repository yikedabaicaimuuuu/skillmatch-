import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Skill Match API',
      description: "API endpoints for a skillmatch services documented on swagger",
      contact: {
        name: "Hoang Nguyen",
        email: "hoang.nv.ral@gmail.com",
        url: ""
      },
      version: '1.0.0',
    },
    servers: [
      {
        url: "http://localhost:8000/",
        description: "Local server"
      },
      {
        url: "https://skillmatch-dara.onrender.com",
        description: "Live server"
      },
    ]
  },
  apis: ['./router/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
  app.get('/docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    res.send(swaggerSpec)
  })
}
export default swaggerDocs