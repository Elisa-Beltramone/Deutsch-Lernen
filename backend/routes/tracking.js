app.post("/api/track-time", express.json(), (req, res) => {
    const { page, duration } = req.body;
  
    console.log({
      page,
      duration,
      timestamp: new Date()
    });
  
    res.sendStatus(200);
  });