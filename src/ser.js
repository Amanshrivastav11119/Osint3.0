const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { getJson } = require('serpapi');
const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.get('/search.json', async (req, res) => {
  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: req.query,
    });
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      error: 'Internal Server Error',
    });
  }
});

app.get('/google-trends-search', async (req, res) => {
  try {
    const { q, data_types } = req.query;

    const dataTypesArray = Array.isArray(data_types) ? data_types : [data_types];

    const results = await Promise.all(
      dataTypesArray.map(async (dataType) => {
        try {
          const response = await getJson({
            engine: 'google_trends',
            q,
            data_type: dataType,
            api_key: '67244b6e8d7f337f304cf92165608f8ede8c69dcb5552a0908399ecce0c27f58',
          });
          return { dataType, data: response };
        } catch (error) {
          console.error(`Error fetching data for ${dataType}:`, error);
          return { dataType, error: 'Internal Server Error' };
        }
      })
    );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(error.response?.status || 500).json({
      error: 'Internal Server Error',
    });
  }
});
// Handle GET requests for /balance
app.get('/balance', async (req, res) => {
  try {
    const { active } = req.query;
    const response = await axios.get(`https://blockchain.info/balance?active=${active}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle GET requests for /multiaddr
app.get('/multiaddr', async (req, res) => {
  try {
    const { active } = req.query;
    const response = await axios.get(`https://blockchain.info/multiaddr?active=${active}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle GET requests for /rawaddr
app.get('/rawaddr', async (req, res) => {
  try {
    const { address } = req.query;
    const response = await axios.get(`https://blockchain.info/rawaddr/${address}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle GET requests for /rawtx
app.get('/rawtx', async (req, res) => {
  try {
    const { txid } = req.query;
    const response = await axios.get(`https://blockchain.info/rawtx/${txid}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Handle GET requests for /rawblock
app.get('/rawblock', async (req, res) => {
  try {
    const { blockhash } = req.query;
    const response = await axios.get(`https://blockchain.info/rawblock/${blockhash}`);
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
