const {Pool} = require('pg');



let conString = new Pool({
  user: "vlfveqiu",
  host: "john.db.elephantsql.com",
  database: "vlfveqiu",
  password: "4rLkQCWRl8WnkojfEX6PQm-dTT9yx69_",
  port: 5432
});


conString.query('SELECT * from patients', function(err, result) {
    if (err) {
      return console.error("error running query", err);
    }
    console.log('Direcct query', result.rows);
    // >> output: 2018-08-23T14:02:57.117Z
  });
// conString.connect((err, client, release) => {
//   if (err) {
//     return console.error("Error acquiring client", err.stack);
//   }
//   client.query('SELECT * from patients', function(err, result) {
//     if (err) {
//       return console.error("error running query", err);
//     }
//     console.log(result.rows);
//     // >> output: 2018-08-23T14:02:57.117Z
//   });
  
// });
