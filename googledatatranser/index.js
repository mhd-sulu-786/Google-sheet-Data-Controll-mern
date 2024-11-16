const express = require('express');
const { google } = require('googleapis');
const bodyParser = require('body-parser');
const cors =require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors())
// Google Sheets credentials
const SERVICE_ACCOUNT_FILE = 'Path add'; // Replace with your JSON file
const SPREADSHEET_ID = 'Your ID add'; // Replace with your Google Sheet ID

// Authenticate with Google
const auth = new google.auth.GoogleAuth({
  keyFile: SERVICE_ACCOUNT_FILE,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });
app.get('/',(req,res)=>{
    res.send("Server is Runing...")
})

app.post('/new-order', async (req, res) => {
  try {
    const { orderId, customerName, product, amount } = req.body;

    if (!orderId || !customerName || !product || !amount) {
      return res.status(400).json({ error: 'All fields are required!' });
    }

    // Prepare data to append
    const values = [[orderId, customerName, product, amount, new Date().toISOString()]];
    
    // Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:E', // Replace 'Sheet1' with your sheet name
      valueInputOption: 'RAW',
      resource: { values },
    });

    res.status(200).json({ message: 'Order added to Google Sheet successfully!' });
  } catch (error) {
    console.error('Error adding order to Google Sheet:', error.message);
    res.status(500).json({ error: 'Failed to add order to Google Sheet.' });
  }
});

app.put('/update-order', async (req, res) => {
    try {
      const { row, values } = req.body;
  
      if (!row || !Array.isArray(values)) {
        return res.status(400).json({ error: 'Invalid input. Provide row number and values array.' });
      }
  
      // Range to update (assumes row starts at 1 and updates columns A-D)
      const range = `Sheet1!A${row}:D${row}`; // Adjust range as needed
  
      // Update values in the sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range,
        valueInputOption: 'RAW',
        resource: {
          values: [values], // Values should be a 1D array matching columns
        },
      });
  
      res.status(200).json({ message: `Row ${row} updated successfully!` });
    } catch (error) {
      console.error('Error updating Google Sheet:', error.message);
      res.status(500).json({ error: 'Failed to update Google Sheet.' });
    }
  });

  app.get('/get-orders', async (req, res) => {
    try {
      const range = 'Sheet1!A:E'; // Specify the range you want to retrieve (adjust columns as needed)
  
      // Fetch data from the Google Sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range,
      });
  
      const rows = response.data.values;
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'No data found in the sheet.' });
      }
  
      // Return the rows as a JSON response
      res.status(200).json({ data: rows });
    } catch (error) {
      console.error('Error fetching data from Google Sheet:', error.message);
      res.status(500).json({ error: 'Failed to retrieve data from Google Sheet.' });
    }
  });

  app.delete('/delete-order', async (req, res) => {
    try {
        const { row } = req.body; // Get the row from the request body

        if (!row) {
            return res.status(400).json({ error: 'Row number is required.' });
        }

        // Perform the deletion logic
        const range = `Sheet1!A${row}:E${row}`;
        await sheets.spreadsheets.values.clear({
            spreadsheetId: SPREADSHEET_ID,
            range,
        });

        res.status(200).json({ message: `Row ${row} deleted successfully!` });
    } catch (error) {
        console.error('Error deleting row from Google Sheet:', error.message);
        res.status(500).json({ error: 'Failed to delete row from Google Sheet.' });
    }
});



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
