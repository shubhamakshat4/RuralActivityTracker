import { useEffect, useState } from "react";
import "./App.css";
import { uploadImage, uploadVideo } from "./cloudinary";
import { useContext } from "react";
import { LanguageContext } from "./context/LanguageContext";
import LanguageSelector from "./components/LanguageSelector";
import Header from "./components/Header";
import Select from "react-select";
import { useNavigate } from "react-router-dom";




export default function MainApp(){

/* LGD DATA */

const [lgd,setLgd]=useState({});
const [districts,setDistricts]=useState([]);
const [subdistricts,setSubdistricts]=useState([]);
const [villages,setVillages]=useState([]);
const [success,setSuccess]=useState(false);
const { t } = useContext(LanguageContext);


const navigate = useNavigate();
const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
  if (!user) {
    navigate("/");
  }
}, [user, navigate]);

/* SELECTED LOCATION */

const [districtName,setDistrictName]=useState("");
const [districtCode,setDistrictCode]=useState("");

const [subdistrictName,setSubdistrictName]=useState("");
const [subdistrictCode,setSubdistrictCode]=useState("");

const [villageName,setVillageName]=useState("");
const [villageCode,setVillageCode]=useState("");

const [manualVillage,setManualVillage]=useState(false);
const [manualVillageName,setManualVillageName]=useState("");

const programDefaults = {
  seminar: { days: 1, hours: 3 },
  rally: { days: 1, hours: 3 },
  nukkad: { days: 1, hours: 3 },
  satsang: { days: 1, hours: 2 },
  competition: { days: 1, hours: 3 },
  counselling: { days: 1, hours: 3 },

  navChetnaShivir: { days: 4, hours: 2 },
  balChetnaShivir: { days: 4, hours: 2 },

  "Utkarsh Yoga": { days: 5, hours: 2 },
  "Medha Yoga": { days: 5, hours: 2 },

  "Happiness Program": { days: 5, hours: 3 },
  "Wellness Program": { days: 5, hours: 3 },

  YLTP: { days: 6, hours: 3 },

  "One Day Program on De-Addiction": {
    days: 1,
    hours: 3
  }
};


/* FORM */

const [form,setForm]=useState({
  name: user?.name || "",
  mobile: user?.mobile || "",
  startDate:"",
  endDate:"",
  hoursPerDay:""
});
const [errors,setErrors]=useState({});


/* MEDIA */

const [photos,setPhotos]=useState([]);
const [videos,setVideos]=useState([]);

const [photoPreview,setPhotoPreview]=useState([]);
const [videoPreview,setVideoPreview]=useState([]);


/* UI */

const [loading,setLoading]=useState(false);
const [loadingText,setLoadingText]=useState("");

const districtOptions = districts.map(d => ({
  label: d,
  value: d
}));
const subdistrictOptions = subdistricts.map(s => ({
  label: s,
  value: s
}));
const villageOptions = villages.map(v => ({
  label: v,
  value: v
}));
const removePhoto = (index) => {
  const updatedPhotos = [...photos];
  const updatedPreview = [...photoPreview];

  updatedPhotos.splice(index, 1);
  updatedPreview.splice(index, 1);

  setPhotos(updatedPhotos);
  setPhotoPreview(updatedPreview);
};
const removeVideo = (index) => {
  const updatedVideos = [...videos];
  const updatedPreview = [...videoPreview];

  updatedVideos.splice(index, 1);
  updatedPreview.splice(index, 1);

  setVideos(updatedVideos);
  setVideoPreview(updatedPreview);
};


/* LOAD LGD */

useEffect(()=>{

fetch("/lgd.json")
.then(res=>res.json())
.then(data=>{

setLgd(data);
setDistricts(Object.keys(data));

});

},[]);



/* UPDATE FORM */

const update=(k,v)=>{

setForm(prev=>({...prev,[k]:v}));

};

const autoPopulateDates = (program, startDate) => {

  if (!program || !startDate) return;

  const config = programDefaults[program];

  if (!config) return;

  const start = new Date(startDate);

  const end = new Date(start);

  end.setDate(
    start.getDate() + config.days - 1
  );

  const formattedEnd =
    end.toISOString().split("T")[0];

  setForm(prev => ({
    ...prev,
    endDate: formattedEnd,
    hoursPerDay: config.hours
  }));

};

const calculateTotalHours = () => {

  if(
    !form.startDate ||
    !form.endDate ||
    !form.hoursPerDay
  ) return 0;

  const start = new Date(form.startDate);
  const end = new Date(form.endDate);

  const days =
    Math.floor(
      (end - start) /
      (1000 * 60 * 60 * 24)
    ) + 1;

  return days * Number(form.hoursPerDay);

};

const totalHours = calculateTotalHours();



/* DISTRICT */

const handleDistrict=(district)=>{

setDistrictName(district);
setDistrictCode(lgd[district].code);

setSubdistricts(
Object.keys(lgd[district].subdistricts)
);

/* reset lower */

setSubdistrictName("");
setVillageName("");

setManualVillage(false);

};



/* SUBDISTRICT */

const handleSubdistrict=(subdistrict)=>{

setSubdistrictName(subdistrict);

setSubdistrictCode(
lgd[districtName]
.subdistricts[subdistrict].code
);

setVillages(

Object.keys(
lgd[districtName]
.subdistricts[subdistrict]
.villages
)

);

/* reset village */

setVillageName("");
setManualVillage(false);

};



/* VILLAGE */

const handleVillage=(village)=>{

setVillageName(village);

setVillageCode(

lgd[districtName]
.subdistricts[subdistrictName]
.villages[village].code

);

setManualVillage(false);

};



/* VALIDATION */

const validate=()=>{

let e={};

if(!form.name) e.name=true;

if(!form.mobile ||
!/^[6-9]\d{9}$/.test(form.mobile))
e.mobile=true;

if(!form.program) e.program=true;

if(!form.description) e.description=true;

if(!form.attendance) e.attendance=true;

if(!districtCode) e.district=true;
if(!form.startDate) e.startDate=true;
if(!form.endDate) e.endDate=true;
if(!form.hoursPerDay) e.hoursPerDay=true;

if(
  form.startDate &&
  form.endDate &&
  new Date(form.endDate) < new Date(form.startDate)
){
  e.endDate = true;
}

if(!subdistrictCode) e.subdistrict=true;

if(!villageCode && !manualVillageName)
e.village=true;

setErrors(e);

return Object.keys(e).length===0;

};



/* SUBMIT */

const submit=async()=>{

if(!validate()){

alert(t.fillAll);

return;

}

setLoading(true);

try{


/* PHOTO UPLOAD */

let photoUrls=[];

for(let file of photos){

setLoadingText("Uploading Photo");

const url=await uploadImage(
file,
(p)=>setLoadingText(`Photo ${p}%`)
);

photoUrls.push(url);

}

{photoPreview.length>0 &&

<div className="previewBox">

{photoPreview.map((file,index)=>

<div key={index} className="previewItem">

<img src={file.url}/>

<p>{file.name}</p>

</div>

)}

</div>

}



/* VIDEO UPLOAD */

let videoUrls=[];

for(let file of videos){

setLoadingText("Uploading Video");

const url=await uploadVideo(
file,
(p)=>setLoadingText(`Video ${p}%`)
);

videoUrls.push(url);

}

{videoPreview.length>0 &&

<div className="previewBox">

{videoPreview.map((file,index)=>

<div key={index} className="videoItem">

🎥 {file.name}

</div>

)}

</div>

}


/* SAVE */

setLoadingText("Saving Report");


const url = new URL("https://script.google.com/macros/s/AKfycbxE2AgfpYOSd57jE9EB6P892jsrs7vZrGnNPsiuX1xo24kONB4pFSuME0j6YqZlzBcT0Q/exec");

url.searchParams.append("name", form.name);
url.searchParams.append("mobile", form.mobile);
url.searchParams.append("attendance", form.attendance);
url.searchParams.append("program", form.program);
url.searchParams.append("programStartDate",form.startDate);
url.searchParams.append("programEndDate",form.endDate);
url.searchParams.append("hoursPerDay",form.hoursPerDay);
url.searchParams.append("totalHours",totalHours);
url.searchParams.append("stateName", "Odisha");
url.searchParams.append("stateCode", "21");
url.searchParams.append("districtName", districtName);
url.searchParams.append("districtCode", districtCode);
url.searchParams.append("subdistrictName", subdistrictName);
url.searchParams.append("subdistrictCode", subdistrictCode);
url.searchParams.append("villageName", manualVillageName ? manualVillageName : villageName);
url.searchParams.append("villageCode", manualVillageName ? "" : villageCode);
url.searchParams.append("description", form.description);
url.searchParams.append("photos", photoUrls.join(", "));
url.searchParams.append("videos", videoUrls.join(", "));
console.log(url.toString());

const res = await fetch(url);

if (!res.ok) {
  throw new Error("Failed to save to Google Sheet");
}

setSuccess(true);   // ✅ simple GET request


}catch(err){

alert(err.message);

}

setLoading(false);

};



/* UI */

return(

<div className="bg modelVillageTheme">


{/* HEADER */}

<Header
  title={t.modelVillageProject}
  subtitle={t.portal}
/>


{/* SUCCESS POPUP */}

{success &&

<div className="successPopup">

<div className="successBox">

<h2>🎉 Congratulations!</h2>

<p>{t.success}</p>

<button onClick={()=>{

setSuccess(false);
window.location.reload();

}}>

OK

</button>

</div>

</div>

}



{/* LOADER */}

{loading &&

<div className="loader">

<div className="spinner"/>

<p>{loadingText}</p>

</div>

}



{/* USER DETAILS */}

<div className="card glass">

<h2>{t.userDetails}</h2>

<div className="field">

<input
placeholder=" "
value={form.name}
readOnly
/>

<label>{t.name} *</label>


</div>



<div className="field">

<input
placeholder=" "
value={form.mobile}
readOnly
/>

<label>{t.mobile} *</label>

</div>


</div>




{/* EVENT DETAILS */}

<div className="card glass">

<h2>{t.modelVillageProject}</h2>

<div className="field">

<select
value={form.program || ""}
onChange={e => {

  const selectedProgram = e.target.value;

  update("program", selectedProgram);

  autoPopulateDates(
    selectedProgram,
    form.startDate
  );

}}
className={form.program ? "hasValue" : ""}
>

<option value="" disabled hidden>
{t.selectProgram}
</option>

<option value="seminar">{t.seminar}</option>
<option value="rally">{t.rally}</option>
<option value="nukkad">{t.nukkad}</option>
<option value="satsang">{t.satsang}</option>
<option value="competition">{t.competition}</option>
<option value="counselling">{t.counselling}</option>
<option value="navChetnaShivir">{t.navChetnaShivir}</option>
<option value="balChetnaShivir">{t.balChetnaShivir}</option>
<option value="Utkarsh Yoga">{t.utkarshYoga}</option>
<option value="Medha Yoga">{t.medhaYoga}</option>
<option value="Happiness Program">{t.happinessProgram}</option>
<option value="Wellness Program">{t.wellnessProgram}</option>
<option value="YLTP">{t.yltp}</option>
<option value="One Day Program on De-Addiction">{t.oneDayProgramOnDeAddiction}</option>
<option value="others">{t.others}</option>

</select>

<label>{t.program} *</label>

</div>


<div className="field">

<textarea
placeholder=" "
onChange={e=>update("description",e.target.value)}
/>

<label>{t.description} *</label>

</div>

<div className="field">

<input
type="number"
placeholder=" "
onChange={e=>update("attendance",e.target.value)}
/>

<label>{t.attendance} *</label>

</div>
<div className="field">

<input
type="date"
placeholder=" "
required
onChange={e => {

  const selectedDate = e.target.value;

  update("startDate", selectedDate);

  autoPopulateDates(
    form.program,
    selectedDate
  );

}}
/>

<label>{t.startDate} *</label>

</div>

<div className="field">

<input
  type="date"
  value={form.endDate || ""}
  onChange={e=>update("endDate",e.target.value)}
/>

<label>{t.endDate} *</label>

</div>

<div className="field">

<input
  type="number"
  min="1"
  value={form.hoursPerDay || ""}
  onChange={e=>update("hoursPerDay",e.target.value)}
/>

<label>{t.hoursPerDay} *</label>

</div>

<h3 className="section">{t.location}</h3>

{/* DISTRICT */}

<div className="field">
    <label>{t.district} *</label>

<Select
  options={districtOptions}
  onChange={(selected) => handleDistrict(selected.value)}
  placeholder={t.district}
  isClearable
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px"
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000"
    }),
    input: (base) => ({
      ...base,
      color: "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    // 🔥 ADD THESE (IMPORTANT)
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
        ? "#e6f0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  }}
/>



</div>


{/* SUBDISTRICT */}

<div className="field">
    <label>{t.subdistrict} *</label>

<Select
  options={subdistrictOptions}
  onChange={(selected) => handleSubdistrict(selected.value)}
  placeholder={t.subdistrict}
  isClearable
  styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px"
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000"
    }),
    input: (base) => ({
      ...base,
      color: "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    // 🔥 ADD THESE (IMPORTANT)
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
        ? "#e6f0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  }}
/>



</div>


{/* VILLAGE */}

<div className="field">

<label>{t.village} *</label>

<Select
  options={villageOptions}
  onChange={(selected) => handleVillage(selected.value)}
  placeholder={t.village}
  isClearable
   styles={{
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px"
    }),
    singleValue: (base) => ({
      ...base,
      color: "#000"
    }),
    input: (base) => ({
      ...base,
      color: "#000"
    }),
    placeholder: (base) => ({
      ...base,
      color: "#888"
    }),

    // 🔥 ADD THESE (IMPORTANT)
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#2f80ed"
        : state.isFocused
        ? "#e6f0ff"
        : "#fff",
      color: state.isSelected ? "#fff" : "#000",
      cursor: "pointer"
    })
  }}
/>



</div>

{/* MANUAL VILLAGE BUTTON */}

<button
type="button"
className="link"
onClick={()=>setManualVillage(true)}
>

{t.villageNotFound}

</button>


{/* MANUAL INPUT */}

{manualVillage &&

<div className="field">

<input
placeholder=" "
onChange={e=>setManualVillageName(e.target.value)}
/>

<label>{t.enterVillage}</label>


</div>

}


{/* PHOTO */}

<label className="upload">

📷 {t.uploadPhotos}

<input
type="file"
hidden
multiple

onChange={e=>{

const valid=[];
const preview=[];

for(let file of e.target.files){

valid.push(file);

preview.push({

name:file.name,
url:URL.createObjectURL(file),
size:(file.size/1024/1024).toFixed(1)+" MB"

});

}

setPhotos(valid);
setPhotoPreview(preview);

}}

/>

</label>

{photoPreview.length>0 && (

<div className="previewBox">

{photoPreview.map((file,index)=>(

<div key={index} className="previewItem">
    <button
          className="removeBtn"
          onClick={() => removePhoto(index)}
        >
          ✖
        </button>

<img src={file.url} />

<p>{file.name}</p>

<small>{file.size}</small>

</div>

))}

</div>

)}


{/* VIDEO */}

<label className="upload">

🎥 {t.uploadVideos}


<input
type="file"
hidden
multiple

onChange={e=>{

const valid=[];
const preview=[];

for(let file of e.target.files){

valid.push(file);

preview.push({

name:file.name,
size:(file.size/1024/1024).toFixed(1)+" MB"

});

}

setVideos(valid);
setVideoPreview(preview);

}}


/>

</label>

{videoPreview.length>0 && (

<div className="previewBox">

{videoPreview.map((file,index)=>(

<div key={index} className="videoItem">
    <button
          className="removeBtn"
          onClick={() => removeVideo(index)}
        >
          ✖
        </button>

🎥 {file.name}

<br/>

<small>{file.size}</small>

</div>

))}

</div>

)}



{/* SUBMIT */}

<button
className="submit"
onClick={submit}
disabled={loading}
>

{t.submit}

</button>



</div>


</div>

);
}
