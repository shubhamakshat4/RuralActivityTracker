import { useEffect, useState } from "react";

export default function MySubmissions() {

  const [submissions, setSubmissions] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {

    const SHEET_ID =
      "1DMljlhLSzr656-vQeUgBlRMeZLc3HejpHq0gWy7Mts8";

    fetch(
      `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=Sheet1`
    )
      .then(res => res.text())
      .then(text => {

        const json = JSON.parse(
          text.substring(47).slice(0, -2)
        );

        const rows = json.table.rows;

        const data = rows.map(r => ({

  name: r.c[0]?.v || "",
  mobile: r.c[1]?.v?.toString() || "",
  attendance: r.c[2]?.v || "",
  program: r.c[3]?.v || "",
  programDate: r.c[4]?.v || "",
  date: r.c[5]?.v || "",

  stateName: r.c[6]?.v || "",
  stateCode: r.c[7]?.v || "",

  districtName: r.c[8]?.v || "",
  districtCode: r.c[9]?.v || "",

  subdistrictName: r.c[10]?.v || "",
  subdistrictCode: r.c[11]?.v || "",

  villageName: r.c[12]?.v || "",
  villageCode: r.c[13]?.v || "",

  venue: r.c[14]?.v || "",
  description: r.c[15]?.v || "",

  photos: r.c[16]?.v || "",
  videos: r.c[17]?.v || "",

  createdAt: r.c[18]?.v || ""

}));

        // 🔥 FILTER BY LOGGED-IN USER
        const filtered = data.filter(
          item => item.mobile === user.mobile
        );

        setSubmissions(filtered);

      });

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
      <th>Date</th>
      <th>Program</th>
      <th>District</th>
      <th>Village</th>
      <th>Attendance</th>
      <th>Venue</th>
      <th>Description</th>
      <th>Photos</th>
      <th>Videos</th>
    </tr>

  </thead>

  <tbody>

    {submissions.map((item, index) => (

      <tr key={index}>

        <td>{item.date}</td>

        <td>{item.program}</td>

        <td>{item.districtName}</td>

        <td>{item.villageName}</td>

        <td>{item.attendance}</td>

        <td>{item.venue}</td>

        <td>{item.description}</td>

        {/* PHOTOS */}
        <td>

        {item.photos
  .split(",")
  .map((link, i) => {

    const cleanLink = link
      .replace(/Photo\s\d+:\s*/i, "")
      .trim();

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

        {/* VIDEOS */}
        <td>

         {item.videos
  .split(",")
  .map((link, i) => {

    const cleanLink = link
      .replace(/Video\s\d+:\s*/i, "")
      .trim();

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