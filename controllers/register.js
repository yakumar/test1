

 const handleRegister = (req, res, bcrypt, conString, saltRounds) => {
    const name = "HiRA";
    const email = req.body.email;
    const entries = 0;
    const joined = new Date().toISOString().split("T")[0];
    const password = req.body.password;
    let hasedPass = "";
  
    conString.connect((err, client, done) => {
      const shouldAbort = err => {
        if (err) {
          console.error("Error in transaction", err.stack);
          res.status(404).json('Email already taken')
          client.query("ROLLBACK", err => {
            if (err) {
              console.error("Error rolling back client", err.stack);
            }
            // release the client back to the pool
            done();
          });
        }
        return !!err;
      };
      client.query("BEGIN", err => {
        if (shouldAbort(err)) return;
  
        bcrypt.hash(password, saltRounds).then(function(hash) {
          let newVal = {};
          let newP = {};
          const query2 = {
            text: "INSERT INTO login(email, hash) VALUES($1, $2) returning *",
            values: [`${req.body.email}`, hash]
          };
  
          client.query(query2, (err, query2Response) => {
            if (shouldAbort(err)) return;
            const query11 = {
              text:
                "INSERT INTO users(name, email, entries, joined, id) VALUES($1, $2, $3, $4, $5) returning *",
              values: [
                "Hira",
                `${req.body.email}`,
                0,
                `${joined}`,
                `${query2Response.rows[0].id}`
              ]
            };
            client.query(query11, (err, query11Response) => {
              if (shouldAbort(err)) return;
              res.json(query11Response.rows[0]);
              client.query("COMMIT", err => {
                if (err) {
                  console.error("Error committing transaction", err.stack);
                }
                done();
              });
            });
          });
        });
      });
    });
  }

  module.exports ={
      handleRegister : handleRegister
  }