const sql = require('mssql');

const config = {
  user: 'tech2highadmin2',
  password: 'SuperSecret!',
  server: 'tech2hightransaction.database.windows.net',
  database: 'StudentPortalDB',
  options: {
    encrypt: true,
    trustServerCertificate: false,
  },
};


module.exports = async function (context, req) {
  const { name, email, age, phone, enrollment_date } = req.body;

  try {
    await sql.connect(config);

    await sql.query`
      MERGE INTO students AS target
      USING (SELECT ${email} AS email) AS source
      ON (target.email = source.email)
      WHEN MATCHED THEN
        UPDATE SET 
          name = ${name}, 
          age = ${age}, 
          phone = ${phone},
          enrollment_date = ${enrollment_date}
      WHEN NOT MATCHED THEN
        INSERT (name, email, age, phone, enrollment_date)
        VALUES (${name}, ${email}, ${age}, ${phone}, ${enrollment_date});
    `;

    context.res = {
      status: 200,
      body: "Student info processed successfully.",
    };
  } catch (err) {
    context.res = {
      status: 500,
      body: "Error processing request: " + err.message,
    };
  }
};
