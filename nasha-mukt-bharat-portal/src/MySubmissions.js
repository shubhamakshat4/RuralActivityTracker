import { useEffect, useState } from "react";

export default function MySubmissions() {

  const [submissions, setSubmissions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSheetData = async (sheetId) => {

  const res = await fetch(
    `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?sheet=Sheet1`
  );

  const text = await res.text();

  const json = JSON.parse(
    text.substring(47).slice(0, -2)
  );

  return json.table.rows;
};

 useEffect(() => {

  const loadData = async () => {

    try {

      const nashaSheet =
        "1DMljlhLSzr656-vQeUgBlRMeZLc3HejpHq0gWy7Mts8";

      const modelVillageSheet =
        "1Ica9n20oQmcUHRaLDTbosQnfn3WQNZoqKt8D6hqR8Y0";

      const [nashaRows, modelVillageRows] =
        await Promise.all([
          fetchSheetData(nashaSheet),
          fetchSheetData(modelVillageSheet)
        ]);

      const parseRows = (rows, source) =>
        rows.map(r => ({

          source,

          name: r.c[0]?.v || "",
          mobile: r.c[1]?.v?.toString() || "",

          attendance: r.c[2]?.v || "",
          program: r.c[3]?.v || "",

          programStartDate: r.c[4]?.v || "",
          programEndDate: r.c[5]?.v || "",

          hoursPerDay: r.c[6]?.v || "",
          totalHours: r.c[7]?.v || "",

          districtName: r.c[10]?.v || "",
          villageName: r.c[14]?.v || "",

          description: r.c[16]?.v || "",
          photos: r.c[17]?.v || "",
          videos: r.c[18]?.v || "",

          createdAt: r.c[19]?.v || ""

        }));

      const allData = [

        ...parseRows(
          nashaRows,
          "Nasha Mukt Bharat"
        ),

        ...parseRows(
          modelVillageRows,
          "Model Village Project"
        )

      ];

      console.log("USER MOBILE:", user.mobile);

console.log("ALL DATA:", allData);

      const filtered = allData.filter(
        item => item.mobile === user.mobile
      );

      filtered.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );

      setSubmissions(filtered);

    } catch (err) {

      console.error(err);

    }

  };

  loadData();

}, [user.mobile]);

  return (

    <div className="submissionsPage">

      <h2>My Submissions</h2>

      {submissions.length === 0 ? (

        <p>No submissions found</p>

      ) : (

       <table className="submissionTable">

  <thead>
<tr>

<th>Project</th>
<th>Program</th>

<th>Start Date</th>
<th>End Date</th>

<th>Hours/Day</th>
<th>Total Hours</th>

<th>District</th>
<th>Village</th>

<th>Attendance</th>

<th>Description</th>

<th>Photos</th>
<th>Videos</th>

</tr>
</thead>

  <tbody>

    {submissions.map((item, index) => (

      <tr key={index}>

<td>{item.source}</td>

<td>{item.program}</td>

<td>{item.programStartDate}</td>

<td>{item.programEndDate}</td>

<td>{item.hoursPerDay}</td>

<td>{item.totalHours}</td>

<td>{item.districtName}</td>

<td>{item.villageName}</td>

<td>{item.attendance}</td>

<td>{item.description}</td>

<td>

{item.photos &&
 item.photos.split(",").map((link, i) => {

  const cleanLink = link.trim();

  if (!cleanLink) return null;

  return (
    <div key={i}>
      <a
        href={cleanLink}
        target="_blank"
        rel="noreferrer"
      >
        Photo {i + 1}
      </a>
    </div>
  );
 })}

</td>

<td>

{item.videos &&
 item.videos.split(",").map((link, i) => {

  const cleanLink = link.trim();

  if (!cleanLink) return null;

  return (
    <div key={i}>
      <a
        href={cleanLink}
        target="_blank"
        rel="noreferrer"
      >
        Video {i + 1}
      </a>
    </div>
  );
 })}

</td>

</tr>

    ))}

  </tbody>

</table>

      )}

    </div>
  );
}