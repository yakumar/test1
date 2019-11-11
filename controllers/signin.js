const handleSignin = (req, res, conString, bcrypt) => {
    //let retunVal = {}
    let newHash = {};
    let errorMessage = "No User with that email";
  
    conString.connect((err, client, done) => {
      const shouldAbort = err => {
        if (err) {
          console.error("Error in transaction", err.stack);
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
      try {
        client.query("BEGIN", err => {
          const query1 = {
            text: "SELECT * from login WHERE email=$1",
            values: [`${req.body.email}`]
          };
          if (shouldAbort(err)) return;
  
          client.query(query1, (err, queryResponse) => {
            if (shouldAbort(err)) return;
            console.log("RESPONSE {", queryResponse.rows);
  
            if (queryResponse.rows.length > 0) {
              //   res.status(404).json('No User Name here');
              //  // throw new Error("No UserName Found AND PASSWORD !!");
  
              newHash = queryResponse.rows[0];
              bcrypt.compare(req.body.password, newHash.hash, function(
                err,
                bcryptResponse
              ) {
                if (shouldAbort(err)) return;
                if (bcryptResponse === true) {
                  res.json(queryResponse.rows[0]);
                }
                client.query("COMMIT", err => {
                  if (err) {
                    console.error("Error committing transaction", err.stack);
                  }
                  done();
                });
              });
            } else {
              res.status(404).json("No User Name here");
            }
          });
        });
      } catch (e) {
        console.log(e);
      }
    });
  }

  module.exports = {
      handleSignin: handleSignin
  }