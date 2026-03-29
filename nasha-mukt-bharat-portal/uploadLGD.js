const fs = require("fs");

const INPUT_FILE = "lgd.csv";
const OUTPUT_FILE = "lgd.json";

console.log("Reading CSV...");

const csv = fs.readFileSync(INPUT_FILE, "utf8");

const lines = csv.split("\n");

const result = {};

let total = 0;

for (let i = 1; i < lines.length; i++) {

  const row = lines[i].trim();

  if (!row) continue;

  const cols = row.split(",");

  const districtCode = cols[1]?.trim();
  const districtName = cols[2]?.trim();

  const subdistrictCode = cols[3]?.trim();
  const subdistrictName = cols[4]?.trim();

  const villageCode = cols[5]?.trim();
  const villageName = cols[6]?.trim();

  if (
    !districtCode ||
    !districtName ||
    !subdistrictCode ||
    !subdistrictName ||
    !villageCode ||
    !villageName
  ) continue;



  // DISTRICT

  if (!result[districtName]) {

    result[districtName] = {

      code: districtCode,

      subdistricts: {}

    };

  }



  // SUBDISTRICT

  if (!result[districtName].subdistricts[subdistrictName]) {

    result[districtName].subdistricts[subdistrictName] = {

      code: subdistrictCode,

      villages: {}

    };

  }



  // VILLAGE

  result[districtName]

    .subdistricts[subdistrictName]

    .villages[villageName] = {

      code: villageCode

    };



  total++;

  if (total % 5000 === 0) {

    console.log("Processed:", total);

  }

}



fs.writeFileSync(

  OUTPUT_FILE,

  JSON.stringify(result, null, 2),

  "utf8"

);

console.log("------------");

console.log("JSON Created Successfully");

console.log("Total villages:", total);

console.log("Saved as:", OUTPUT_FILE);
