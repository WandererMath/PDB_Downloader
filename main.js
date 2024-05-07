const fs = require('fs');
const readline = require('readline');
const cheerio = require('cheerio');
const http = require('http');
const https = require('https');
// Path to your file
const filePath = 'List.html';

// Create a readable stream
const stream = fs.createReadStream(filePath);

// Create a readline interface
const rl = readline.createInterface({
  input: stream,
  crlfDelay: Infinity // Specify Infinity to read lines without trimming newline characters
});

//Get and Save file from URL
function getSave(url){
  //const url = 'https://files.rcsb.org/pub/pdb/data/structures/all/pdb/pdb1j0m.ent.gz'; // Replace with your URL
  tmp=url.split("/");
  if(!tmp[tmp.length-1]){
    return 
  }
  const outputFile = "./data/"+tmp[tmp.length-1]

  // Determine which module to use based on URL protocol
  const httpClient = url.startsWith('https') ? https : http;

  // Make the HTTP GET request
  httpClient.get(url, (response) => {
    // Create a write stream to write binary data to a file
    const fileStream = fs.createWriteStream(outputFile);

    // When data is received, write it to the file
    response.on('data', (chunk) => {
      fileStream.write(chunk);
    });

    // When the response ends, close the file stream
    response.on('end', () => {
      fileStream.end();
      console.log(`File saved as ${outputFile}`);
    });
  }).on('error', (err) => {
    console.error('Error:', err.message);
  });
}




//Process Line
function processLine(text){
    html=cheerio.load(text)

    html('a').each((i,e)=>{
        var href=html(e).attr('href')
        if(href){
            getSave(href)
        }
    })
}


// Event listener for each line read
rl.on('line', (line) => {
  // Process the line here
  processLine(line);
});

// Event listener for end of file
rl.on('close', () => {
  console.log('End of file reached');
});
